declare module "mind-ar/dist/mindar-image-three.prod.js" {
  import type {
    Camera,
    Group,
    Scene,
    WebGLRenderer,
  } from "three";

  export type MindARAnchor = {
    group: Group;
    onTargetFound?: () => void;
    onTargetLost?: () => void;
  };

  export type MindARThreeOptions = {
    container: HTMLElement;
    imageTargetSrc: string;
    maxTrack?: number;
    uiLoading?: string;
    uiScanning?: string;
    uiError?: string;
    filterMinCF?: number | null;
    filterBeta?: number | null;
    warmupTolerance?: number | null;
    missTolerance?: number | null;
  };

  export class MindARThree {
    renderer: WebGLRenderer;
    scene: Scene;
    camera: Camera;
    constructor(options: MindARThreeOptions);
    cssRenderer?: {
      render(scene: Scene, camera: Camera): void;
      domElement: HTMLElement;
      setSize(width: number, height: number): void;
    };
    cssScene?: Scene;
    video?: HTMLVideoElement;
    addAnchor(index: number): MindARAnchor;
    start(): Promise<void>;
    stop(): void;
    resize(): void;
  }
}
