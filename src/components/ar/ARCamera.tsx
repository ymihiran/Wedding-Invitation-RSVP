"use client";

import { useEffect, useRef } from "react";
import {
  AR_TARGET_INDEX,
  AR_TARGET_URL,
  AR_VIDEO_URL,
  classifyCameraError,
  prefersReducedMotion,
  resourceExists,
  type ARErrorState,
  type ARStatus,
} from "@/lib/ar";
import { createARScene, type ARSceneHandle } from "@/components/ar/ARScene";

type ARCameraProps = {
  muted: boolean;
  onStatus: (status: Extract<ARStatus, "initializing" | "scanning" | "detected" | "lost">) => void;
  onError: (error: ARErrorState) => void;
  onVideoAvailability: (available: boolean) => void;
};

export function ARCamera({
  muted,
  onStatus,
  onError,
  onVideoAvailability,
}: ARCameraProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const onStatusRef = useRef(onStatus);
  const onErrorRef = useRef(onError);
  const onVideoRef = useRef(onVideoAvailability);
  const sceneRef = useRef<ARSceneHandle | null>(null);
  const mutedRef = useRef(muted);

  useEffect(() => {
    onStatusRef.current = onStatus;
    onErrorRef.current = onError;
    onVideoRef.current = onVideoAvailability;
  }, [onStatus, onError, onVideoAvailability]);

  useEffect(() => {
    mutedRef.current = muted;
    sceneRef.current?.setMuted(muted);
  }, [muted]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let cancelled = false;
    let mindar: InstanceType<
      typeof import("mind-ar/dist/mindar-image-three.prod.js").MindARThree
    > | null = null;

    const cleanup = () => {
      sceneRef.current?.dispose();
      sceneRef.current = null;
      if (mindar) {
        try {
          mindar.renderer.setAnimationLoop(null);
        } catch {
          /* already stopped */
        }
        try {
          mindar.resize = () => undefined;
          mindar.stop();
        } catch {
          /* start may have failed before video existed */
        }
        try {
          mindar.renderer.dispose();
        } catch {
          /* renderer may already be gone */
        }
      }
      container.replaceChildren();
    };

    async function start() {
      onStatusRef.current("initializing");
      const THREE = await import("three");
      const { MindARThree } = await import(
        "mind-ar/dist/mindar-image-three.prod.js"
      );
      if (cancelled || !containerRef.current) return;

      const videoExists = await resourceExists(AR_VIDEO_URL);
      if (cancelled) return;
      onVideoRef.current(videoExists);

      mindar = new MindARThree({
        container: containerRef.current,
        imageTargetSrc: AR_TARGET_URL,
        maxTrack: 1,
        uiLoading: "no",
        uiScanning: "no",
        uiError: "no",
        filterMinCF: 0.00008,
        filterBeta: 0.0008,
        missTolerance: 18,
        warmupTolerance: 8,
      });

      if ("outputColorSpace" in mindar.renderer) {
        mindar.renderer.outputColorSpace = THREE.SRGBColorSpace;
      }
      mindar.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
      if (mindar.cssRenderer?.domElement) {
        mindar.cssRenderer.domElement.style.pointerEvents = "none";
      }

      const handle = createARScene(THREE, mindar.scene, {
        videoUrl: videoExists ? AR_VIDEO_URL : null,
        muted: mutedRef.current,
        reducedMotion: prefersReducedMotion(),
      });
      sceneRef.current = handle;

      const anchor = mindar.addAnchor(AR_TARGET_INDEX);
      anchor.onTargetFound = () => {
        handle.onFound();
        onStatusRef.current("detected");
      };
      anchor.onTargetLost = () => {
        handle.onLost();
        onStatusRef.current("lost");
      };

      await mindar.start();
      if (cancelled) {
        cleanup();
        return;
      }

      onStatusRef.current("scanning");
      mindar.renderer.setAnimationLoop(() => {
        if (!mindar) return;
        handle.follow(anchor.group);
        handle.update(performance.now());
        mindar.renderer.render(mindar.scene, mindar.camera);
        if (mindar.cssRenderer && mindar.cssScene) {
          mindar.cssRenderer.render(mindar.cssScene, mindar.camera);
        }
      });
    }

    start().catch((error: unknown) => {
      if (cancelled) return;
      const kind = classifyCameraError(error);
      onErrorRef.current({
        kind,
        message: errorCopySafe(error),
        detail: errorCopySafe(error),
      });
    });

    return () => {
      cancelled = true;
      cleanup();
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="ar-camera-root"
      aria-label="Live camera for the AR invitation"
    />
  );
}

function errorCopySafe(error: unknown): string {
  if (error && typeof error === "object" && "message" in error) {
    return String(error.message);
  }
  return String(error ?? "Unknown AR error");
}
