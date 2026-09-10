"use client";

import Link from "next/link";
import { errorCopy, type ARErrorKind } from "@/lib/ar";

type ARErrorProps = {
  kind: ARErrorKind;
  detail?: string;
  onRetry?: () => void;
};

export function ARError({ kind, detail, onRetry }: ARErrorProps) {
  const copy = errorCopy(kind);
  const showDevDetail =
    process.env.NODE_ENV === "development" && Boolean(detail);

  return (
    <section className="ar-intro">
      <p className="font-cinzel text-[0.65rem] font-semibold tracking-[0.45em] text-gold uppercase">
        Our Story
      </p>
      <h1 className="mt-6 max-w-md font-display text-3xl leading-snug text-ink">
        {copy.title}
      </h1>
      <p className="mt-5 max-w-sm font-serif text-lg italic leading-8 text-gold-soft">
        {copy.body}
      </p>
      {kind === "missing-target" ||
      kind === "unsupported" ||
      kind === "webgl" ||
      kind === "https" ? (
        <p className="mt-6 max-w-sm font-serif text-base leading-7 text-ink">
          AR isn&apos;t available on this device. But you can still explore our
          wedding story here.
        </p>
      ) : null}
      {showDevDetail ? (
        <p className="mt-6 max-w-md font-mono text-xs leading-5 text-gold-soft">
          {kind === "missing-target"
            ? "AR target is not configured yet. Please add public/ar/targets.mind"
            : detail}
        </p>
      ) : null}
      <div className="btn-stack mt-10">
        {onRetry ? (
          <button type="button" className="gold-button" onClick={onRetry}>
            Try again
          </button>
        ) : null}
        <Link href="/" className="gold-choice">
          View Wedding Invitation
        </Link>
      </div>
    </section>
  );
}
