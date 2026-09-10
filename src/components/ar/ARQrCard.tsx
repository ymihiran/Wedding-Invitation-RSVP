"use client";

import { QRCodeSVG } from "qrcode.react";
import { Ornament } from "@/components/Ornament";
import { getArPageUrl } from "@/lib/ar";

export function ARQrCard() {
  const url = getArPageUrl();

  return (
    <figure className="ar-qr invitation-card !mt-10 !mb-0 !w-auto !max-w-[280px] !p-7">
      <p className="font-cinzel text-[0.62rem] font-semibold tracking-[0.38em] text-gold uppercase">
        Experience
      </p>
      <p className="mt-2 font-script text-3xl leading-[1.35] text-ink">Our Story</p>
      <Ornament className="mx-auto mt-3 h-5 w-40 text-gold" />
      <div className="ar-qr-code">
        <QRCodeSVG
          value={url}
          size={168}
          bgColor="#ffffff"
          fgColor="#5d473a"
          level="M"
          marginSize={4}
          title="QR code for the wedding AR experience"
        />
      </div>
      <figcaption className="mt-4 font-serif text-sm italic leading-6 text-gold-soft">
        Scan to reveal
        <br />
        something special
      </figcaption>
    </figure>
  );
}
