"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError("");
    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });
      const data = (await res.json().catch(() => null)) as { error?: string } | null;
      if (!res.ok) throw new Error(data?.error || "Could not sign in.");
      router.replace("/admin");
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not sign in.");
      setSaving(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-5">
      <form onSubmit={onSubmit} className="invitation-card !my-0 w-full max-w-sm space-y-5">
        <p className="text-center font-cinzel text-[10px] tracking-[0.4em] text-gold uppercase">
          Private
        </p>
        <h1 className="text-center font-display text-3xl text-ink">Admin</h1>
        <label className="block space-y-2 text-left font-serif text-sm text-gold-soft">
          Password
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoFocus
            className="gold-input"
          />
        </label>
        {error && <p className="font-serif text-sm text-red-700">{error}</p>}
        <button type="submit" disabled={saving} className="gold-button !w-full">
          {saving ? "Signing in..." : "Enter"}
        </button>
      </form>
    </div>
  );
}
