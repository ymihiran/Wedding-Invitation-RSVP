"use client";

import { useSyncExternalStore } from "react";
import { wedding } from "@/lib/wedding-config";

type Remaining = { days: number; hours: number; minutes: number; seconds: number };

const empty: Remaining = { days: 0, hours: 0, minutes: 0, seconds: 0 };
let cached: Remaining = empty;
let cachedKey = "";

function getSnapshot(): Remaining {
  const diff = Math.max(0, new Date(wedding.dateIso).getTime() - Date.now());
  const days = Math.floor(diff / 86_400_000);
  const hours = Math.floor((diff % 86_400_000) / 3_600_000);
  const minutes = Math.floor((diff % 3_600_000) / 60_000);
  const seconds = Math.floor((diff % 60_000) / 1000);
  const key = `${days}:${hours}:${minutes}:${seconds}`;
  if (key !== cachedKey) {
    cached = { days, hours, minutes, seconds };
    cachedKey = key;
  }
  return cached;
}

function subscribe(onStoreChange: () => void) {
  const id = window.setInterval(onStoreChange, 1000);
  return () => window.clearInterval(id);
}

function pad(n: number) {
  return n.toString().padStart(2, "0");
}

export function Countdown() {
  const shown = useSyncExternalStore(subscribe, getSnapshot, () => empty);
  const units = [
    { label: "Days", value: pad(shown.days) },
    { label: "Hrs", value: pad(shown.hours) },
    { label: "Min", value: pad(shown.minutes) },
    { label: "Sec", value: pad(shown.seconds) },
  ];

  return (
    <div className="flex justify-center gap-6">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <span className="block font-display text-[1.55rem] font-semibold text-gold tabular-nums">
            {unit.value}
          </span>
          <span className="mt-1 block font-cinzel text-[0.58rem] tracking-[0.18em] text-[#888] uppercase">
            {unit.label}
          </span>
        </div>
      ))}
    </div>
  );
}
