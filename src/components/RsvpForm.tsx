"use client";

import { useState } from "react";
import { partyWording } from "@/lib/wedding-config";
import type { Guest } from "@/lib/types";

type RsvpFormProps = {
  guest: Guest;
};

export function RsvpForm({ guest }: RsvpFormProps) {
  const existing = guest.rsvp;
  const [attending, setAttending] = useState<boolean | null>(
    existing ? existing.attending : null,
  );
  const [count, setCount] = useState(existing?.count || guest.partySize);
  const [note, setNote] = useState(existing?.note ?? "");
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">(
    existing ? "saved" : "idle",
  );
  const [error, setError] = useState("");

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (attending === null) {
      setError("Please choose whether you will attend.");
      return;
    }
    setStatus("saving");
    setError("");
    try {
      const res = await fetch(`/api/rsvp/${guest.token}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          attending,
          count: attending ? count : 0,
          note,
        }),
      });
      if (!res.ok) {
        const data = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(data?.error || "Could not save your RSVP.");
      }
      setStatus("saved");
    } catch (err) {
      setStatus("error");
      setError(err instanceof Error ? err.message : "Could not save your RSVP.");
    }
  }

  return (
    <section id="rsvp" className="invitation-card !mt-0 mb-10">
      <p className="font-cinzel text-[0.7rem] font-semibold tracking-[0.35em] text-gold uppercase">
        RSVP
      </p>
      <h2 className="mt-3 font-display text-2xl text-ink">Kindly respond</h2>
      <p className="mt-2 font-serif text-sm italic text-gold-soft">
        {partyWording(guest.partySize)} are kindly invited
        {guest.partySize > 1 ? ` · ${guest.partySize} seats` : ""}
      </p>

      <form onSubmit={onSubmit} className="mx-auto mt-7 max-w-sm space-y-4">
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setAttending(true)}
            className={`gold-choice !min-w-0 !w-full ${attending === true ? "gold-choice-active" : ""}`}
          >
            Attend
          </button>
          <button
            type="button"
            onClick={() => setAttending(false)}
            className={`gold-choice !min-w-0 !w-full ${attending === false ? "gold-choice-active" : ""}`}
          >
            Decline
          </button>
        </div>

        {attending && guest.partySize > 1 && (
          <label className="block space-y-2 text-left font-serif text-sm text-gold-soft">
            Number attending
            <select
              value={count}
              onChange={(e) => setCount(Number(e.target.value))}
              className="gold-input"
            >
              {Array.from({ length: guest.partySize }, (_, i) => i + 1).map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>
        )}

        <label className="block space-y-2 text-left font-serif text-sm text-gold-soft">
          A note for the couple (optional)
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            maxLength={400}
            className="gold-input resize-none"
            placeholder="Your wishes..."
          />
        </label>

        {error && <p className="font-serif text-sm text-red-700">{error}</p>}
        {status === "saved" && (
          <p className="font-serif text-sm text-gold">Thank you — your reply has been received.</p>
        )}

        <button type="submit" disabled={status === "saving"} className="gold-button !w-full">
          {status === "saving" ? "Sending..." : existing ? "Update RSVP" : "Send RSVP"}
        </button>
      </form>
    </section>
  );
}
