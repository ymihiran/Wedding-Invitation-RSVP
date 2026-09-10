"use client";

type ARInstructionsProps = {
  status: "initializing" | "scanning" | "lost";
};

export function ARInstructions({ status }: ARInstructionsProps) {
  const initializing = status === "initializing";
  const lost = status === "lost";

  return (
    <div className="ar-overlay" aria-live="polite">
      <div className="ar-scan-frame" aria-hidden>
        <span className="ar-scan-label">{initializing ? "Opening" : "Scanning"}</span>
      </div>
      <div className="ar-overlay-copy">
        <p className="font-cinzel text-[0.72rem] font-semibold tracking-[0.28em] uppercase">
          {initializing
            ? "Opening your camera"
            : lost
              ? "Invitation lost"
              : "Point your camera at the wedding invitation"}
        </p>
        <p className="mt-3 font-serif text-base italic leading-7">
          {initializing
            ? "Please allow camera access when asked."
            : "Move your phone slowly until the invitation is detected."}
        </p>
      </div>
    </div>
  );
}
