"use client";

import { Ornament } from "@/components/Ornament";
import { ARQrCard } from "@/components/ar/ARQrCard";
import { wedding } from "@/lib/wedding-config";

type ARIntroProps = {
  onStart: () => void;
  showDesktopHint?: boolean;
  showQr?: boolean;
  busy?: boolean;
};

export function ARIntro({
  onStart,
  showDesktopHint = false,
  showQr = false,
  busy = false,
}: ARIntroProps) {
  return (
    <section className="ar-intro">
      <p className="font-cinzel text-[0.65rem] font-semibold tracking-[0.45em] text-gold uppercase">
        Our Story
      </p>
      <h1 className="hero-title mt-4 font-script text-[clamp(3rem,12vw,5.2rem)] gold-foil">
        {wedding.groom.first}
        <span className="mx-2 font-serif text-[0.45em] text-gold"> & </span>
        {wedding.bride.first}
      </h1>
      <Ornament className="mx-auto mt-4 h-6 w-52 text-gold" />
      <p className="mt-6 max-w-sm font-serif text-lg italic leading-8 text-gold-soft">
        An AR experience
        <br />
        made especially for you
      </p>
      {showDesktopHint ? (
        <p className="mt-6 max-w-xs font-serif text-base leading-7 text-ink">
          The AR experience works best on a mobile phone. Open this page on your
          phone to experience the invitation in AR.
        </p>
      ) : null}
      <button
        type="button"
        className="gold-button mt-10 min-h-12 min-w-[280px]"
        onClick={onStart}
        disabled={busy}
        aria-label="Experience AR"
      >
        {busy ? "Preparing…" : "Experience AR"}
      </button>
      {showQr ? <ARQrCard /> : null}
    </section>
  );
}
