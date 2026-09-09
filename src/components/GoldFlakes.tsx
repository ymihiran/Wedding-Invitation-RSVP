"use client";

import { useEffect, useRef } from "react";

type Flake = {
  x: number;
  y: number;
  size: number;
  speed: number;
  sway: number;
  swayAmp: number;
  rotation: number;
  spin: number;
  color: string;
  alpha: number;
};

const COLORS = ["#bf953f", "#d4af37", "#b38728", "#aa771c", "#c9a84c"];

export function GoldFlakes() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let flakes: Flake[] = [];

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      const count = Math.min(48, Math.floor(window.innerWidth / 18));
      flakes = Array.from({ length: count }, () => spawn(true));
    };

    const spawn = (anywhere: boolean): Flake => ({
      x: Math.random() * window.innerWidth,
      y: anywhere ? Math.random() * window.innerHeight : -12,
      size: 3 + Math.random() * 7,
      speed: 0.35 + Math.random() * 1.1,
      sway: Math.random() * Math.PI * 2,
      swayAmp: 0.4 + Math.random() * 1.2,
      rotation: Math.random() * Math.PI,
      spin: (Math.random() - 0.5) * 0.04,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      alpha: 0.28 + Math.random() * 0.4,
    });

    const draw = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      for (const flake of flakes) {
        flake.y += flake.speed;
        flake.sway += 0.02;
        flake.x += Math.sin(flake.sway) * flake.swayAmp;
        flake.rotation += flake.spin;
        if (flake.y > window.innerHeight + 16) {
          Object.assign(flake, spawn(false));
        }

        ctx.save();
        ctx.translate(flake.x, flake.y);
        ctx.rotate(flake.rotation);
        ctx.globalAlpha = flake.alpha;
        ctx.fillStyle = flake.color;
        ctx.beginPath();
        ctx.moveTo(0, -flake.size);
        ctx.lineTo(flake.size * 0.55, 0);
        ctx.lineTo(0, flake.size);
        ctx.lineTo(-flake.size * 0.55, 0);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    raf = requestAnimationFrame(draw);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden
      className="pointer-events-none fixed inset-0 z-40 h-full w-full"
    />
  );
}
