import type * as THREE from "three";
import { wedding } from "@/lib/wedding-config";

type ThreeNS = typeof import("three");

export type ARSceneOptions = {
  videoUrl?: string | null;
  muted: boolean;
  reducedMotion: boolean;
};

export type ARSceneHandle = {
  root: THREE.Group;
  setMuted: (muted: boolean) => void;
  onFound: () => void;
  onLost: () => void;
  update: (timeMs: number) => void;
  dispose: () => void;
  hasVideo: boolean;
};

function makeCanvasTexture(
  THREE: ThreeNS,
  width: number,
  height: number,
  paint: (ctx: CanvasRenderingContext2D) => void,
): THREE.CanvasTexture {
  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (ctx) paint(ctx);
  const texture = new THREE.CanvasTexture(canvas);
  texture.needsUpdate = true;
  return texture;
}

function drawLabel(
  ctx: CanvasRenderingContext2D,
  text: string,
  font: string,
  color: string,
) {
  ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
  ctx.fillStyle = color;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = font;
  ctx.fillText(text, ctx.canvas.width / 2, ctx.canvas.height / 2);
}

function petalTexture(THREE: ThreeNS): THREE.CanvasTexture {
  return makeCanvasTexture(THREE, 64, 96, (ctx) => {
    ctx.fillStyle = "rgba(232, 196, 196, 0.85)";
    ctx.beginPath();
    ctx.moveTo(32, 8);
    ctx.bezierCurveTo(56, 24, 56, 70, 32, 90);
    ctx.bezierCurveTo(8, 70, 8, 24, 32, 8);
    ctx.fill();
  });
}

function sparkTexture(THREE: ThreeNS): THREE.CanvasTexture {
  return makeCanvasTexture(THREE, 32, 32, (ctx) => {
    const gradient = ctx.createRadialGradient(16, 16, 1, 16, 16, 15);
    gradient.addColorStop(0, "rgba(252, 246, 186, 0.95)");
    gradient.addColorStop(0.4, "rgba(197, 160, 89, 0.55)");
    gradient.addColorStop(1, "rgba(197, 160, 89, 0)");
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, 32, 32);
  });
}

export function createARScene(
  THREE: ThreeNS,
  scene: THREE.Scene,
  options: ARSceneOptions,
): ARSceneHandle {
  const root = new THREE.Group();
  root.visible = false;
  (root as THREE.Group & { userData: { opacity: number } }).userData = {
    opacity: 0,
  };

  const hemi = new THREE.HemisphereLight(0xfff6e0, 0x4a372b, 0.95);
  const key = new THREE.DirectionalLight(0xffe6b0, 0.85);
  key.position.set(0.4, 0.8, 1.2);
  scene.add(hemi, key);

  const gold = new THREE.MeshStandardMaterial({
    color: 0xc5a059,
    metalness: 0.82,
    roughness: 0.28,
    transparent: true,
    opacity: 0,
  });
  const ringGeo = new THREE.TorusGeometry(0.13, 0.028, 14, 40);
  const ringA = new THREE.Mesh(ringGeo, gold);
  const ringB = new THREE.Mesh(ringGeo, gold.clone());
  ringA.rotation.x = Math.PI / 2.15;
  ringB.rotation.y = Math.PI / 2.1;
  ringB.position.set(0.09, 0, 0);
  const rings = new THREE.Group();
  rings.position.set(0, 0.02, 0.22);
  rings.add(ringA, ringB);
  root.add(rings);

  const nameTexture = makeCanvasTexture(THREE, 1024, 256, (ctx) => {
    drawLabel(
      ctx,
      wedding.coupleShort,
      "72px 'Great Vibes', 'Playfair Display', serif",
      "#f7f3eb",
    );
  });
  const dateTexture = makeCanvasTexture(THREE, 1024, 160, (ctx) => {
    drawLabel(
      ctx,
      wedding.dateDisplay,
      "32px Cinzel, 'Cormorant Garamond', serif",
      "#c5a059",
    );
  });
  const nameMat = new THREE.MeshBasicMaterial({
    map: nameTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const dateMat = new THREE.MeshBasicMaterial({
    map: dateTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
  });
  const namePlane = new THREE.Mesh(new THREE.PlaneGeometry(1, 0.25), nameMat);
  const datePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.82, 0.13), dateMat);
  namePlane.position.set(0, 0.38, 0.08);
  datePlane.position.set(0, -0.34, 0.08);
  root.add(namePlane, datePlane);

  void document.fonts.ready.then(() => {
    const named = nameTexture.image as HTMLCanvasElement;
    const dated = dateTexture.image as HTMLCanvasElement;
    const nameCtx = named.getContext("2d");
    const dateCtx = dated.getContext("2d");
    if (nameCtx) {
      drawLabel(
        nameCtx,
        wedding.coupleShort,
        "72px 'Great Vibes', 'Playfair Display', serif",
        "#f7f3eb",
      );
      nameTexture.needsUpdate = true;
    }
    if (dateCtx) {
      drawLabel(
        dateCtx,
        wedding.dateDisplay,
        "32px Cinzel, 'Cormorant Garamond', serif",
        "#c5a059",
      );
      dateTexture.needsUpdate = true;
    }
  });

  const sparkCount = options.reducedMotion ? 12 : 48;
  const sparkPositions = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i += 1) {
    sparkPositions[i * 3] = (Math.random() - 0.5) * 1.1;
    sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 1.3;
    sparkPositions[i * 3 + 2] = 0.05 + Math.random() * 0.35;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMat = new THREE.PointsMaterial({
    map: sparkTexture(THREE),
    color: 0xf0d78c,
    size: 0.045,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  root.add(sparks);

  const petalCount = options.reducedMotion ? 0 : 8;
  const petals: THREE.Mesh[] = [];
  const petalMat = new THREE.MeshBasicMaterial({
    map: petalTexture(THREE),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  for (let i = 0; i < petalCount; i += 1) {
    const petal = new THREE.Mesh(new THREE.PlaneGeometry(0.08, 0.12), petalMat.clone());
    petal.position.set(
      (Math.random() - 0.5) * 0.9,
      (Math.random() - 0.5) * 1,
      0.1 + Math.random() * 0.25,
    );
    petal.userData.speed = 0.04 + Math.random() * 0.06;
    petal.userData.spin = 0.2 + Math.random() * 0.4;
    petals.push(petal);
    root.add(petal);
  }

  let video: HTMLVideoElement | null = null;
  let videoMesh: THREE.Mesh | null = null;
  let videoTexture: THREE.VideoTexture | null = null;
  if (options.videoUrl) {
    video = document.createElement("video");
    video.src = options.videoUrl;
    video.crossOrigin = "anonymous";
    video.loop = true;
    video.muted = options.muted;
    video.playsInline = true;
    video.setAttribute("playsinline", "true");
    video.setAttribute("webkit-playsinline", "true");
    video.preload = "metadata";
    videoTexture = new THREE.VideoTexture(video);
    const videoMat = new THREE.MeshBasicMaterial({
      map: videoTexture,
      transparent: true,
      opacity: 0,
    });
    videoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), videoMat);
    videoMesh.position.set(0, -0.02, 0.04);
    root.add(videoMesh);
  }

  const fadeMaterials: THREE.Material[] = [
    gold,
    ringB.material as THREE.Material,
    nameMat,
    dateMat,
    sparkMat,
    petalMat,
    ...petals.map((petal) => petal.material as THREE.Material),
  ];
  if (videoMesh) fadeMaterials.push(videoMesh.material as THREE.Material);

  let detected = false;
  let opacity = 0;

  const setOpacity = (value: number) => {
    opacity = value;
    root.visible = value > 0.01;
    for (const material of fadeMaterials) {
      material.opacity = value;
    }
  };

  const playVideo = () => {
    if (!video) return;
    const play = video.play();
    if (play) void play.catch(() => undefined);
  };

  return {
    root,
    hasVideo: Boolean(video),
    setMuted(muted: boolean) {
      if (video) video.muted = muted;
    },
    onFound() {
      detected = true;
      playVideo();
    },
    onLost() {
      detected = false;
      video?.pause();
    },
    update(timeMs: number) {
      const target = detected ? 1 : 0;
      const next = opacity + (target - opacity) * (options.reducedMotion ? 1 : 0.08);
      setOpacity(next);

      if (!detected || options.reducedMotion) return;

      const t = timeMs * 0.001;
      rings.rotation.z = t * 0.25;
      rings.position.z = 0.22 + Math.sin(t * 1.2) * 0.02;
      namePlane.position.y = 0.38 + Math.sin(t) * 0.01;
      datePlane.position.y = -0.34 + Math.cos(t) * 0.008;

      const positions = sparkGeo.getAttribute("position");
      for (let i = 0; i < sparkCount; i += 1) {
        const y = positions.getY(i) + 0.0025;
        positions.setY(i, y > 0.7 ? -0.7 : y);
      }
      positions.needsUpdate = true;

      for (const petal of petals) {
        petal.position.y -= petal.userData.speed * 0.016;
        petal.rotation.z += petal.userData.spin * 0.016;
        if (petal.position.y < -0.7) petal.position.y = 0.7;
      }
    },
    dispose() {
      video?.pause();
      if (video) {
        video.src = "";
        video.load();
      }
      videoTexture?.dispose();
      sparkGeo.dispose();
      ringGeo.dispose();
      nameTexture.dispose();
      dateTexture.dispose();
      sparkMat.map?.dispose();
      petalMat.map?.dispose();
      for (const material of fadeMaterials) material.dispose();
      scene.remove(hemi, key);
      hemi.dispose();
      key.dispose();
    },
  };
}
