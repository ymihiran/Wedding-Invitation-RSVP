"use client";

import { useEffect, useRef, useState } from "react";
import { wedding } from "@/lib/wedding-config";

export function AgendaTimeline() {
  const rootRef = useRef<HTMLOListElement>(null);
  const [visible, setVisible] = useState<boolean[]>(() =>
    wedding.agenda.map(() => false),
  );

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const items = Array.from(root.querySelectorAll("[data-agenda-item]"));
    const observer = new IntersectionObserver(
      (entries) => {
        const seen = entries
          .filter((entry) => entry.isIntersecting)
          .map((entry) => Number((entry.target as HTMLElement).dataset.agendaItem));
        if (seen.length === 0) return;
        setVisible((prev) => {
          let changed = false;
          const next = [...prev];
          for (const index of seen) {
            if (!next[index]) {
              next[index] = true;
              changed = true;
            }
          }
          return changed ? next : prev;
        });
      },
      { threshold: 0.15 },
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="agenda" className="bg-white px-4 py-16">
      <h2 className="text-center font-display text-[1.85rem] text-ink">Wedding Agenda</h2>
      <ol ref={rootRef} className="timeline-wrapper">
        {wedding.agenda.map((item, index) => (
          <li
            key={item.title}
            data-agenda-item={index}
            className={`timeline-item ${index % 2 === 0 ? "left" : "right"} ${
              visible[index] ? "visible" : ""
            }`}
          >
            <span className="timeline-dot" />
            <p className="font-cinzel text-xs font-semibold tracking-[0.18em] text-gold">
              {item.time}
            </p>
            <h3 className="mt-1 font-display text-lg text-ink">{item.title}</h3>
          </li>
        ))}
      </ol>
    </section>
  );
}
