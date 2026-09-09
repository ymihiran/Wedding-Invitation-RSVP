"use client";

import { partyWording } from "@/lib/wedding-config";

type RevealCoverProps = {
  opened: boolean;
  guestName: string;
  partySize?: number;
  onReveal: () => void;
};

export function RevealCover({
  opened,
  guestName,
  partySize,
  onReveal,
}: RevealCoverProps) {
  return (
    <div id="paper-overlay" className={opened ? "opened" : undefined}>
      <div className="paper-half paper-left paper-texture" />
      <div className="paper-half paper-right paper-texture" />

      <button type="button" className="seal-container" onClick={onReveal}>
        <span className="gold-seal">
          <span className="gold-seal-initials">C & N</span>
        </span>
        <p className="mt-5 font-cinzel text-[0.7rem] font-semibold tracking-[0.35em] text-ink uppercase">
          Tap to reveal
        </p>
      </button>

      <div className="front-guest-wrapper">
        <p className="mb-1.5 font-cinzel text-[0.65rem] font-semibold tracking-[0.4em] text-gold uppercase">
          Kindly Invited:
        </p>
        <h2 className="font-dancing text-[clamp(1.7rem,6vw,2.8rem)] leading-tight text-ink">
          {guestName}
        </h2>
        {partySize ? (
          <p className="mt-2 font-serif text-sm italic text-gold-soft">
            {partyWording(partySize)}
          </p>
        ) : null}
      </div>
    </div>
  );
}
