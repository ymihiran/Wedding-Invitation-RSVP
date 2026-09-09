"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { partyWording } from "@/lib/wedding-config";
import type { Guest } from "@/lib/types";

function inviteUrl(token: string) {
  const base = (process.env.NEXT_PUBLIC_SITE_URL || "").replace(/\/$/, "");
  const origin = base || (typeof window !== "undefined" ? window.location.origin : "");
  return `${origin}/invite/${token}`;
}

function rsvpLabel(guest: Guest) {
  if (!guest.rsvp) return "Pending";
  if (!guest.rsvp.attending) return "Declined";
  return `Attending (${guest.rsvp.count})`;
}

export function AdminDashboard() {
  const router = useRouter();
  const [guests, setGuests] = useState<Guest[]>([]);
  const [name, setName] = useState("");
  const [partySize, setPartySize] = useState(1);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState<string | null>(null);
  const [editing, setEditing] = useState<Guest | null>(null);

  const stats = useMemo(() => {
    const attending = guests.filter((g) => g.rsvp?.attending);
    const declined = guests.filter((g) => g.rsvp && !g.rsvp.attending);
    const heads = attending.reduce((sum, g) => sum + (g.rsvp?.count ?? 0), 0);
    return {
      total: guests.length,
      attending: attending.length,
      declined: declined.length,
      pending: guests.length - attending.length - declined.length,
      heads,
    };
  }, [guests]);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/guests")
      .then(async (res) => {
        if (res.status === 401) {
          router.replace("/admin/login");
          return;
        }
        if (!res.ok) throw new Error("Could not load guests.");
        const data = (await res.json()) as { guests: Guest[] };
        if (!cancelled) setGuests(data.guests);
      })
      .catch(() => {
        if (!cancelled) setError("Could not load guests.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [router]);

  async function onAdd(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/guests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, partySize }),
      });
      const data = (await res.json()) as { guest?: Guest; error?: string };
      if (!res.ok || !data.guest) throw new Error(data.error || "Could not add guest.");
      setGuests((prev) => [data.guest!, ...prev]);
      setName("");
      setPartySize(1);
      await copyLink(data.guest.token);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not add guest.");
    } finally {
      setSaving(false);
    }
  }

  async function copyLink(token: string) {
    const url = inviteUrl(token);
    try {
      await navigator.clipboard.writeText(url);
      setCopied(token);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      window.prompt("Copy invite link", url);
    }
  }

  async function onSaveEdit(e: React.FormEvent) {
    e.preventDefault();
    if (!editing) return;
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/guests/${editing.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: editing.name, partySize: editing.partySize }),
      });
      const data = (await res.json()) as { guest?: Guest; error?: string };
      if (!res.ok || !data.guest) throw new Error(data.error || "Could not update guest.");
      setGuests((prev) => prev.map((g) => (g.id === data.guest!.id ? data.guest! : g)));
      setEditing(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not update guest.");
    } finally {
      setSaving(false);
    }
  }

  async function onDelete(id: string) {
    if (!window.confirm("Remove this guest and their invite link?")) return;
    const res = await fetch(`/api/admin/guests/${id}`, { method: "DELETE" });
    if (!res.ok) {
      setError("Could not delete guest.");
      return;
    }
    setGuests((prev) => prev.filter((g) => g.id !== id));
  }

  async function logout() {
    await fetch("/api/admin/logout", { method: "POST" });
    router.replace("/admin/login");
    router.refresh();
  }

  return (
    <div className="mx-auto min-h-screen max-w-3xl px-5 py-10 text-ink">
      <header className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="font-cinzel text-[10px] tracking-[0.4em] text-gold uppercase">
            Wedding admin
          </p>
          <h1 className="mt-2 font-display text-3xl text-ink">Guest invitations</h1>
        </div>
        <button type="button" onClick={() => void logout()} className="gold-choice text-xs">
          Log out
        </button>
      </header>

      <dl className="mt-8 grid grid-cols-2 gap-2 sm:grid-cols-5">
        {[
          ["Invites", stats.total],
          ["Pending", stats.pending],
          ["Attending", stats.attending],
          ["Declined", stats.declined],
          ["Heads", stats.heads],
        ].map(([label, value]) => (
          <div key={label} className="border border-[#e8dfd0] bg-white px-3 py-3 text-center shadow-sm">
            <dt className="font-cinzel text-[9px] tracking-[0.2em] text-gold uppercase">{label}</dt>
            <dd className="mt-1 font-display text-2xl text-ink">{value}</dd>
          </div>
        ))}
      </dl>

      <form onSubmit={onAdd} className="mt-10 space-y-3 border border-[#e8dfd0] bg-white p-5 shadow-sm">
        <h2 className="font-cinzel text-[11px] tracking-[0.3em] text-gold uppercase">Add guest</h2>
        <label className="block space-y-2 font-serif text-sm">
          Display name
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="gold-input"
            placeholder="Mr. & Mrs. Perera"
          />
        </label>
        <label className="block space-y-2 font-serif text-sm">
          How many are invited
          <select
            value={partySize}
            onChange={(e) => setPartySize(Number(e.target.value))}
            className="gold-input"
          >
            {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
              <option key={n} value={n}>
                {n} — {partyWording(n)}
              </option>
            ))}
          </select>
        </label>
        <button type="submit" disabled={saving} className="gold-button w-full">
          {saving ? "Saving..." : "Create invite link"}
        </button>
      </form>

      {error && <p className="mt-4 font-serif text-sm text-red-700">{error}</p>}

      <section className="mt-10">
        <h2 className="font-cinzel text-[11px] tracking-[0.3em] text-gold uppercase">
          All guests
        </h2>
        {loading ? (
          <p className="mt-4 font-serif text-sm">Loading...</p>
        ) : guests.length === 0 ? (
          <p className="mt-4 font-serif text-sm">No guests yet. Add the first invite above.</p>
        ) : (
          <ul className="mt-4 space-y-3">
            {guests.map((guest) => (
              <li key={guest.id} className="border border-[#e8dfd0] bg-white p-4 shadow-sm">
                {editing?.id === guest.id ? (
                  <form onSubmit={onSaveEdit} className="space-y-3">
                    <input
                      value={editing.name}
                      onChange={(e) => setEditing({ ...editing, name: e.target.value })}
                      className="gold-input"
                    />
                    <select
                      value={editing.partySize}
                      onChange={(e) =>
                        setEditing({ ...editing, partySize: Number(e.target.value) })
                      }
                      className="gold-input"
                    >
                      {Array.from({ length: 12 }, (_, i) => i + 1).map((n) => (
                        <option key={n} value={n}>
                          {n} — {partyWording(n)}
                        </option>
                      ))}
                    </select>
                    <div className="flex gap-2">
                      <button type="submit" className="gold-button flex-1" disabled={saving}>
                        Save
                      </button>
                      <button
                        type="button"
                        className="gold-choice flex-1"
                        onClick={() => setEditing(null)}
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                ) : (
                  <>
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <p className="font-display text-xl text-ink">{guest.name}</p>
                        <p className="mt-1 font-serif text-sm">
                          {partyWording(guest.partySize)} · {guest.partySize} invited ·{" "}
                          {rsvpLabel(guest)}
                        </p>
                        {guest.rsvp?.note && (
                          <p className="mt-2 font-serif text-sm italic text-gold">
                            “{guest.rsvp.note}”
                          </p>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      <button
                        type="button"
                        className="gold-button text-xs"
                        onClick={() => void copyLink(guest.token)}
                      >
                        {copied === guest.token ? "Copied" : "Copy invite link"}
                      </button>
                      <a
                        href={`/invite/${guest.token}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="gold-choice text-xs"
                      >
                        Open
                      </a>
                      <button
                        type="button"
                        className="gold-choice text-xs"
                        onClick={() => setEditing(guest)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="gold-choice text-xs"
                        onClick={() => void onDelete(guest.id)}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
