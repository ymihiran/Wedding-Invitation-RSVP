"use client";

import { useCallback, useMemo, useState } from "react";
import { ARCamera } from "@/components/ar/ARCamera";
import { ARControls } from "@/components/ar/ARControls";
import { ARError } from "@/components/ar/ARError";
import { ARInstructions } from "@/components/ar/ARInstructions";
import { ARIntro } from "@/components/ar/ARIntro";
import {
  AR_TARGET_URL,
  errorCopy,
  hasGetUserMedia,
  hasWebGL,
  isLikelyDesktop,
  isSecureForCamera,
  resourceExists,
  type ARErrorState,
  type ARStatus,
} from "@/lib/ar";
import "./ar.css";

export function WeddingAR() {
  const [status, setStatus] = useState<ARStatus>("idle");
  const [error, setError] = useState<ARErrorState | null>(null);
  const [muted, setMuted] = useState(true);
  const [hasVideo, setHasVideo] = useState(false);
  const desktop = useMemo(
    () => (typeof window === "undefined" ? false : isLikelyDesktop()),
    [],
  );

  const [preparing, setPreparing] = useState(false);

  const fail = useCallback((next: ARErrorState) => {
    setPreparing(false);
    setError(next);
    setStatus("error");
  }, []);

  const reset = useCallback(() => {
    setError(null);
    setHasVideo(false);
    setMuted(true);
    setPreparing(false);
    setStatus("idle");
  }, []);

  const start = useCallback(async () => {
    setError(null);
    setPreparing(true);

    if (!isSecureForCamera()) {
      fail({ kind: "https", message: errorCopy("https").title });
      return;
    }
    if (!hasWebGL()) {
      fail({ kind: "webgl", message: errorCopy("webgl").title });
      return;
    }
    if (!hasGetUserMedia()) {
      fail({ kind: "unsupported", message: errorCopy("unsupported").title });
      return;
    }

    const targetReady = await resourceExists(AR_TARGET_URL);
    if (!targetReady) {
      fail({
        kind: "missing-target",
        message: errorCopy("missing-target").title,
        detail: "AR target is not configured yet. Please add public/ar/targets.mind",
      });
      return;
    }

    setPreparing(false);
    setStatus("initializing");
  }, [fail]);

  const cameraActive =
    status === "initializing" ||
    status === "scanning" ||
    status === "detected" ||
    status === "lost";

  if (status === "error" && error) {
    return (
      <main className="ar-page">
        <ARError kind={error.kind} detail={error.detail} onRetry={reset} />
      </main>
    );
  }

  if (status === "idle") {
    return (
      <main className="ar-page">
        <ARIntro
          onStart={() => void start()}
          showDesktopHint={desktop}
          showQr
          busy={preparing}
        />
      </main>
    );
  }

  return (
    <main className="ar-page">
      {cameraActive ? (
        <ARCamera
          muted={muted}
          onStatus={setStatus}
          onError={fail}
          onVideoAvailability={setHasVideo}
        />
      ) : null}
      {status === "initializing" || status === "scanning" || status === "lost" ? (
        <ARInstructions
          status={status === "initializing" ? "initializing" : status}
        />
      ) : null}
      {cameraActive ? (
        <ARControls
          onClose={reset}
          showMute={hasVideo}
          muted={muted}
          onToggleMute={() => setMuted((value) => !value)}
        />
      ) : null}
    </main>
  );
}
