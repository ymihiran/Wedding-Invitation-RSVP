"use client";

import dynamic from "next/dynamic";

const WeddingAR = dynamic(
  () => import("@/components/ar/WeddingAR").then((mod) => mod.WeddingAR),
  {
    ssr: false,
    loading: () => (
      <main className="flex min-h-[100dvh] items-center justify-center bg-cream px-6 text-center text-ink">
        <p className="font-cinzel text-sm tracking-[0.28em] text-gold uppercase">
          Our Story
        </p>
      </main>
    ),
  },
);

export function WeddingARLoader() {
  return <WeddingAR />;
}
