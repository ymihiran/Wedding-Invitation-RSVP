export type ARStatus =
  | "idle"
  | "initializing"
  | "scanning"
  | "detected"
  | "lost"
  | "error";

export type ARErrorKind =
  | "permission"
  | "camera"
  | "unsupported"
  | "https"
  | "webgl"
  | "missing-target"
  | "init";

export type ARErrorState = {
  kind: ARErrorKind;
  message: string;
  detail?: string;
};

export const AR_TARGET_URL = "/ar/targets.mind";
export const AR_VIDEO_URL = "/ar/videos/story.mp4";
export const AR_TARGET_INDEX = 0;

export function getArPageUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_AR_URL?.replace(/\/$/, "");
  if (explicit) return explicit;

  const site = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (site) return `${site}/ar`;

  if (typeof window !== "undefined") {
    return `${window.location.origin}/ar`;
  }

  return "/ar";
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function isSecureForCamera(): boolean {
  if (typeof window === "undefined") return false;
  if (window.isSecureContext) return true;
  const { hostname } = window.location;
  return hostname === "localhost" || hostname === "127.0.0.1";
}

export function isLikelyDesktop(): boolean {
  if (typeof window === "undefined") return false;
  const finePointer = window.matchMedia("(pointer: fine)").matches;
  return finePointer && window.innerWidth >= 1024;
}

export function hasWebGL(): boolean {
  if (typeof document === "undefined") return false;
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      canvas.getContext("webgl") || canvas.getContext("experimental-webgl"),
    );
  } catch {
    return false;
  }
}

export function hasGetUserMedia(): boolean {
  return Boolean(navigator.mediaDevices?.getUserMedia);
}

export async function resourceExists(url: string): Promise<boolean> {
  try {
    const head = await fetch(url, { method: "HEAD", cache: "no-store" });
    if (head.ok) return true;
    if (head.status === 405 || head.status === 501) {
      const get = await fetch(url, {
        method: "GET",
        cache: "no-store",
        headers: { Range: "bytes=0-0" },
      });
      return get.ok;
    }
    return false;
  } catch {
    return false;
  }
}

export function classifyCameraError(error: unknown): ARErrorKind {
  if (error == null) return "camera";
  const name =
    error && typeof error === "object" && "name" in error
      ? String(error.name)
      : "";
  const message =
    error && typeof error === "object" && "message" in error
      ? String(error.message).toLowerCase()
      : String(error).toLowerCase();

  if (
    name === "NotAllowedError" ||
    name === "PermissionDeniedError" ||
    message.includes("permission")
  ) {
    return "permission";
  }
  if (
    name === "NotFoundError" ||
    name === "OverconstrainedError" ||
    name === "NotReadableError" ||
    name === "AbortError" ||
    message.includes("camera") ||
    message.includes("device")
  ) {
    return "camera";
  }
  if (name === "NotSupportedError" || name === "TypeError") {
    return "unsupported";
  }
  if (message.includes("targets.mind") || message.includes("image target")) {
    return "missing-target";
  }
  return "init";
}

export function errorCopy(kind: ARErrorKind): { title: string; body: string } {
  switch (kind) {
    case "permission":
      return {
        title: "Camera access is required to experience the AR invitation.",
        body: "Please allow camera access and try again.",
      };
    case "camera":
      return {
        title: "We couldn't access your camera.",
        body: "Please allow camera access and try again.",
      };
    case "unsupported":
      return {
        title: "This browser does not support the AR experience.",
        body: "Please try the latest Safari or Chrome on your phone.",
      };
    case "https":
      return {
        title: "This browser does not support the AR experience.",
        body: "Please try the latest Safari or Chrome on your phone.",
      };
    case "webgl":
      return {
        title: "This browser does not support the AR experience.",
        body: "Please try the latest Safari or Chrome on your phone.",
      };
    case "missing-target":
      return {
        title: "AR isn't available just yet.",
        body: "The invitation target is still being prepared. You can still explore our wedding story.",
      };
    case "init":
    default:
      return {
        title: "We couldn't start the AR experience.",
        body: "Please try again in a moment.",
      };
  }
}
