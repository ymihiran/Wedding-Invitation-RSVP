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
  follow: (source: THREE.Object3D) => void;
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

function goldGradient(
  ctx: CanvasRenderingContext2D,
  x0: number,
  y0: number,
  x1: number,
  y1: number,
) {
  const gradient = ctx.createLinearGradient(x0, y0, x1, y1);
  gradient.addColorStop(0, "#bf953f");
  gradient.addColorStop(0.28, "#fcf6ba");
  gradient.addColorStop(0.5, "#b38728");
  gradient.addColorStop(0.78, "#fbf5b7");
  gradient.addColorStop(1, "#aa771c");
  return gradient;
}

function drawStackedNames(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  const x = width / 2;
  const foil = goldGradient(ctx, width * 0.12, height * 0.06, width * 0.88, height * 0.94);
  ctx.lineJoin = "round";
  ctx.miterLimit = 2;
  ctx.shadowColor = "rgba(40, 28, 14, 0.45)";
  ctx.shadowBlur = 18;

  ctx.font = "132px 'Great Vibes', 'Playfair Display', serif";
  ctx.strokeStyle = "rgba(58, 40, 22, 0.78)";
  ctx.lineWidth = 10;
  ctx.strokeText(wedding.groom.first, x, height * 0.24);
  ctx.fillStyle = foil;
  ctx.fillText(wedding.groom.first, x, height * 0.24);

  ctx.shadowBlur = 8;
  ctx.font = "64px 'Cormorant Garamond', serif";
  ctx.strokeText("&", x, height * 0.5);
  ctx.fillStyle = foil;
  ctx.fillText("&", x, height * 0.5);

  ctx.shadowBlur = 18;
  ctx.font = "132px 'Great Vibes', 'Playfair Display', serif";
  ctx.strokeText(wedding.bride.first, x, height * 0.76);
  ctx.fillStyle = foil;
  ctx.fillText(wedding.bride.first, x, height * 0.76);
}

function drawDate(ctx: CanvasRenderingContext2D) {
  const { width, height } = ctx.canvas;
  ctx.clearRect(0, 0, width, height);
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = "52px Cinzel, 'Cormorant Garamond', serif";
  ctx.lineJoin = "round";
  ctx.shadowColor = "rgba(40, 28, 14, 0.4)";
  ctx.shadowBlur = 10;
  ctx.strokeStyle = "rgba(58, 40, 22, 0.72)";
  ctx.lineWidth = 6;
  ctx.strokeText(wedding.dateDisplay, width / 2, height / 2);
  ctx.fillStyle = goldGradient(ctx, width * 0.1, 0, width * 0.9, height);
  ctx.fillText(wedding.dateDisplay, width / 2, height / 2);
}

function createGoldEnv(THREE: ThreeNS): THREE.CubeTexture {
  const size = 48;
  const face = (top: string, bottom: string, gleam = false) => {
    const canvas = document.createElement("canvas");
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext("2d");
    if (!ctx) return canvas;
    const gradient = ctx.createLinearGradient(0, 0, 0, size);
    gradient.addColorStop(0, top);
    gradient.addColorStop(1, bottom);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, size, size);
    if (gleam) {
      ctx.fillStyle = "rgba(255, 252, 235, 0.92)";
      ctx.fillRect(size * 0.12, size * 0.08, size * 0.3, size * 0.2);
      ctx.fillStyle = "rgba(255, 244, 210, 0.55)";
      ctx.fillRect(size * 0.58, size * 0.42, size * 0.22, size * 0.16);
    }
    return canvas;
  };

  const texture = new THREE.CubeTexture([
    face("#f3e0a8", "#8d6a28", true),
    face("#c9a45c", "#5a4018"),
    face("#fff8de", "#e8c56a"),
    face("#6b4e20", "#2f210e"),
    face("#f0d78c", "#7a5620", true),
    face("#b8944a", "#463214"),
  ]);
  texture.needsUpdate = true;
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createGoldMaterial(THREE: ThreeNS, envMap: THREE.CubeTexture) {
  return new THREE.MeshPhysicalMaterial({
    color: 0xd4af37,
    metalness: 1,
    roughness: 0.14,
    envMap,
    envMapIntensity: 1.65,
    clearcoat: 0.55,
    clearcoatRoughness: 0.12,
    transparent: true,
    opacity: 0,
  });
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

function flakeTexture(THREE: ThreeNS): THREE.CanvasTexture {
  return makeCanvasTexture(THREE, 64, 64, (ctx) => {
    const gradient = ctx.createLinearGradient(16, 8, 48, 56);
    gradient.addColorStop(0, "#fcf6ba");
    gradient.addColorStop(0.45, "#d4af37");
    gradient.addColorStop(1, "#aa771c");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.moveTo(32, 6);
    ctx.lineTo(52, 32);
    ctx.lineTo(32, 58);
    ctx.lineTo(12, 32);
    ctx.closePath();
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

  scene.add(root);

  const envMap = createGoldEnv(THREE);
  const hemi = new THREE.HemisphereLight(0xfff4d4, 0x3d2a16, 0.65);
  const key = new THREE.DirectionalLight(0xfff1c8, 1.05);
  key.position.set(0.45, 0.7, 1);
  const fill = new THREE.DirectionalLight(0xffe6b0, 0.28);
  fill.position.set(-0.55, 0.15, 0.5);
  scene.add(hemi, key, fill);

  const gold = createGoldMaterial(THREE, envMap);
  const goldB = createGoldMaterial(THREE, envMap);
  const ringGeo = new THREE.TorusGeometry(0.11, 0.014, 32, 96);
  const ringA = new THREE.Mesh(ringGeo, gold);
  const ringB = new THREE.Mesh(ringGeo, goldB);
  ringA.rotation.set(Math.PI / 2.05, 0.16, 0.1);
  ringB.rotation.set(Math.PI / 2.35, Math.PI / 2.05, -0.14);
  ringB.position.set(0.08, 0.008, 0.008);
  ringB.scale.setScalar(0.94);
  const rings = new THREE.Group();
  rings.position.set(0, -0.06, 0.13);
  rings.renderOrder = 6;
  const shine = new THREE.PointLight(0xfff6d8, 1.15, 1.5);
  shine.position.set(0.2, 0.16, 0.28);
  rings.add(ringA, ringB, shine);
  root.add(rings);

  const upright = Math.PI / 2 - 0.2;
  const nameTexture = makeCanvasTexture(THREE, 768, 1280, drawStackedNames);
  const dateTexture = makeCanvasTexture(THREE, 1024, 160, drawDate);
  const nameMat = new THREE.MeshBasicMaterial({
    map: nameTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const dateMat = new THREE.MeshBasicMaterial({
    map: dateTexture,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const namePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.72, 0.42), nameMat);
  const datePlane = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.09), dateMat);
  namePlane.rotation.x = upright;
  datePlane.rotation.x = 0.18;
  namePlane.position.set(0, 0.06, 0.7);
  datePlane.position.set(0, -0.38, 0.03);
  namePlane.renderOrder = 5;
  datePlane.renderOrder = 5;
  root.add(namePlane, datePlane);

  void document.fonts.ready.then(() => {
    const named = nameTexture.image as HTMLCanvasElement;
    const dated = dateTexture.image as HTMLCanvasElement;
    const nameCtx = named.getContext("2d");
    const dateCtx = dated.getContext("2d");
    if (nameCtx) {
      drawStackedNames(nameCtx);
      nameTexture.needsUpdate = true;
    }
    if (dateCtx) {
      drawDate(dateCtx);
      dateTexture.needsUpdate = true;
    }
  });

  const sparkCount = options.reducedMotion ? 8 : 22;
  const sparkPositions = new Float32Array(sparkCount * 3);
  for (let i = 0; i < sparkCount; i += 1) {
    sparkPositions[i * 3] = (Math.random() - 0.5) * 0.55;
    sparkPositions[i * 3 + 1] = (Math.random() - 0.5) * 0.4;
    sparkPositions[i * 3 + 2] = 0.06 + Math.random() * 0.22;
  }
  const sparkGeo = new THREE.BufferGeometry();
  sparkGeo.setAttribute("position", new THREE.BufferAttribute(sparkPositions, 3));
  const sparkMat = new THREE.PointsMaterial({
    map: sparkTexture(THREE),
    color: 0xf0d78c,
    size: 0.032,
    transparent: true,
    opacity: 0,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
  });
  const sparks = new THREE.Points(sparkGeo, sparkMat);
  root.add(sparks);

  const petalCount = options.reducedMotion ? 0 : 5;
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
      (Math.random() - 0.5) * 0.5,
      (Math.random() - 0.5) * 0.45,
      0.08 + Math.random() * 0.18,
    );
    petal.userData.speed = 0.02 + Math.random() * 0.03;
    petal.userData.spin = 0.08 + Math.random() * 0.14;
    petals.push(petal);
    root.add(petal);
  }

  const flakeCount = options.reducedMotion ? 0 : 20;
  const flakes: THREE.Mesh[] = [];
  const flakeMat = new THREE.MeshBasicMaterial({
    map: flakeTexture(THREE),
    transparent: true,
    opacity: 0,
    depthWrite: false,
    side: THREE.DoubleSide,
  });
  const flakeGeo = new THREE.PlaneGeometry(0.028, 0.04);
  for (let i = 0; i < flakeCount; i += 1) {
    const flake = new THREE.Mesh(flakeGeo, flakeMat.clone());
    flake.position.set(
      (Math.random() - 0.5) * 0.7,
      (Math.random() - 0.5) * 0.55,
      0.08 + Math.random() * 0.48,
    );
    flake.userData.speed = 0.012 + Math.random() * 0.02;
    flake.userData.sway = Math.random() * Math.PI * 2;
    flake.userData.swayAmp = 0.004 + Math.random() * 0.008;
    flake.userData.spin = (Math.random() - 0.5) * 0.04;
    flake.renderOrder = 6;
    flakes.push(flake);
    root.add(flake);
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
      depthWrite: true,
      side: THREE.DoubleSide,
    });
    videoMesh = new THREE.Mesh(new THREE.PlaneGeometry(0.34, 0.604), videoMat);
    videoMesh.rotation.x = upright;
    videoMesh.position.set(0, 0.04, 0.32);
    videoMesh.renderOrder = 1;
    root.add(videoMesh);
  }

  const fadeMaterials: THREE.Material[] = [
    gold,
    goldB,
    nameMat,
    dateMat,
    sparkMat,
    petalMat,
    ...petals.map((petal) => petal.material as THREE.Material),
    flakeMat,
    ...flakes.map((flake) => flake.material as THREE.Material),
  ];
  if (videoMesh) fadeMaterials.push(videoMesh.material as THREE.Material);

  let detected = false;
  let opacity = 0;
  let hasSmooth = false;
  const smoothPos = new THREE.Vector3();
  const smoothQuat = new THREE.Quaternion();
  const smoothScale = new THREE.Vector3(1, 1, 1);
  const rawPos = new THREE.Vector3();
  const rawQuat = new THREE.Quaternion();
  const rawScale = new THREE.Vector3();
  const STABILIZE = 0.12;

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
    follow(source) {
      if (!source.visible) return;
      source.updateMatrixWorld(true);
      source.matrixWorld.decompose(rawPos, rawQuat, rawScale);
      if (!hasSmooth) {
        smoothPos.copy(rawPos);
        smoothQuat.copy(rawQuat);
        smoothScale.copy(rawScale);
        hasSmooth = true;
      } else {
        smoothPos.lerp(rawPos, STABILIZE);
        smoothQuat.slerp(rawQuat, STABILIZE);
        smoothScale.lerp(rawScale, STABILIZE);
      }
      root.position.copy(smoothPos);
      root.quaternion.copy(smoothQuat);
      root.scale.copy(smoothScale);
    },
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
      rings.rotation.y = Math.sin(t * 0.22) * 0.08;
      rings.position.z = 0.13 + Math.sin(t * 0.7) * 0.006;
      ringA.rotation.z = t * 0.08;
      ringB.rotation.z = -t * 0.06;

      const positions = sparkGeo.getAttribute("position");
      for (let i = 0; i < sparkCount; i += 1) {
        const y = positions.getY(i) + 0.0012;
        positions.setY(i, y > 0.28 ? -0.28 : y);
      }
      positions.needsUpdate = true;

      for (const petal of petals) {
        petal.position.y -= petal.userData.speed * 0.01;
        petal.rotation.z += petal.userData.spin * 0.01;
        if (petal.position.y < -0.32) petal.position.y = 0.32;
      }

      for (const flake of flakes) {
        flake.userData.sway += 0.018;
        flake.position.z -= flake.userData.speed;
        flake.position.x += Math.sin(flake.userData.sway) * flake.userData.swayAmp;
        flake.rotation.z += flake.userData.spin;
        flake.rotation.x += flake.userData.spin * 0.35;
        if (flake.position.z < 0.03) {
          flake.position.z = 0.55;
          flake.position.x = (Math.random() - 0.5) * 0.7;
          flake.position.y = (Math.random() - 0.5) * 0.55;
        }
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
      flakeMat.map?.dispose();
      flakeGeo.dispose();
      for (const material of fadeMaterials) material.dispose();
      envMap.dispose();
      scene.remove(root, hemi, key, fill);
      hemi.dispose();
      key.dispose();
      fill.dispose();
      shine.dispose();
    },
  };
}
