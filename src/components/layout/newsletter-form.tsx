"use client";

import { useState } from "react";

export function NewsletterForm() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMsg(null);
    const res = await fetch("/api/newsletter", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email })
    });
    const data = await res.json();
    setBusy(false);
    setMsg(data.message ?? data.error ?? "Done");
    if (res.ok) setEmail("");
  }

  return (
    <form onSubmit={submit} className="w-full max-w-sm">
      <p className="text-sm font-medium mb-2">Get deals in your inbox</p>
      <div className="flex gap-2">
        <input value={email} onChange={(e) => setEmail(e.target.value)} type="email" placeholder="you@example.com" required className="flex-1 glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none" />
        <button disabled={busy} className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10">{busy ? "..." : "Join"}</button>
      </div>
      {msg && <p className="text-xs text-white/60 mt-2">{msg}</p>}
    </form>
  );
}
