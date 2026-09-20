"use client";

import { useState } from "react";

// Customer review submission (spec section 3/20) - goes to moderation queue.
export function ReviewForm({ productId }: { productId: string }) {
  const [open, setOpen] = useState(false);
  const [rating, setRating] = useState(5);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ productId, rating, title: title || undefined, body: body || undefined })
    });
    const data = await res.json();
    setBusy(false);
    if (res.ok) {
      setMsg("Thanks! Your review is pending moderation and will appear shortly.");
      setOpen(false);
    } else setMsg(data.error ?? "Could not submit review - sign in first");
  }

  if (!open) {
    return (
      <button onClick={() => setOpen(true)} className="text-sm text-brand-400 hover:text-brand-300">
        Write a review
      </button>
    );
  }

  return (
    <form onSubmit={submit} className="glass p-5 rounded-2xl space-y-3 max-w-lg">
      <div className="flex gap-1 text-2xl" role="radiogroup" aria-label="Rating">
        {[1, 2, 3, 4, 5].map((n) => (
          <button key={n} type="button" onClick={() => setRating(n)} aria-label={`${n} star${n > 1 ? "s" : ""}`} className="hover:scale-110 transition-transform">
            {n <= rating ? "★" : "☆"}
          </button>
        ))}
      </div>
      <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Title (optional)" maxLength={120} className="w-full glass bg-white/5 px-4 py-2.5 rounded-lg text-sm outline-none" />
      <textarea value={body} onChange={(e) => setBody(e.target.value)} placeholder="Share your experience (optional)" rows={4} maxLength={2000} className="w-full glass bg-white/5 px-4 py-2.5 rounded-lg text-sm outline-none" />
      <div className="flex gap-2">
        <button disabled={busy} className="px-4 py-2 rounded-lg bg-brand-600 text-white text-sm disabled:opacity-50">{busy ? "Submitting..." : "Submit Review"}</button>
        <button type="button" onClick={() => setOpen(false)} className="text-xs text-white/50 self-center">Cancel</button>
      </div>
      {msg && <p className="text-xs text-white/60">{msg}</p>}
    </form>
  );
}
