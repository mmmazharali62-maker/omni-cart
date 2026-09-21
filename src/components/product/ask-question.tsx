"use client";

import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";

// Product Q&A form (spec section 7).
export function AskQuestion({ productId }: { productId: string }) {
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setBusy(true);
    setError(null);
    const form = new FormData(e.currentTarget);
    try {
      const res = await fetch("/api/qa", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, email: form.get("email"), question: form.get("question") })
      });
      if (res.ok) setDone(true);
      else {
        const data = await res.json().catch(() => ({}));
        setError(data.error ?? "Could not submit your question");
      }
    } catch {
      setError("Network error - try again");
    } finally {
      setBusy(false);
    }
  }

  if (done) {
    return <p className="text-sm text-emerald-300">Thanks! We'll email you when it's answered.</p>;
  }

  return (
    <form onSubmit={onSubmit} className="glass p-4 space-y-3">
      <label className="block">
        <span className="text-sm text-white/70">Your question</span>
        <textarea
          name="question" required rows={3} maxLength={500}
          placeholder="e.g. Does this ship to the UK?"
          className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none"
        />
      </label>
      <label className="block">
        <span className="text-sm text-white/70">Email (for the answer)</span>
        <input name="email" type="email" required className="mt-1 w-full glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none" />
      </label>
      {error && <p className="text-xs text-red-400">{error}</p>}
      <button type="submit" disabled={busy} className="bg-brand-600 text-white px-4 py-2 rounded-lg text-sm font-medium disabled:opacity-50 flex items-center gap-2">
        {busy && <Spinner size={14} />} Ask
      </button>
    </form>
  );
}
