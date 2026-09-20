"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

// Footer/home newsletter signup (spec section 15).
export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email })
      });
      if (res.ok) setDone(true);
      else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not subscribe");
      }
    } catch {
      setError("Network error - try again");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p className="text-sm text-emerald-300">You're in! Check your inbox for a welcome email.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="w-full max-w-sm" aria-label="Newsletter signup">
      <div className="flex glass rounded-lg overflow-hidden">
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@email.com"
          aria-label="Email address"
          className="flex-1 bg-transparent px-3 py-2 text-sm outline-none"
        />
        <button type="submit" disabled={busy} className="bg-brand-600 px-4 text-sm font-medium disabled:opacity-50 flex items-center">
          {busy ? <Spinner size={14} /> : "Subscribe"}
        </button>
      </div>
      {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
    </form>
  );
}
