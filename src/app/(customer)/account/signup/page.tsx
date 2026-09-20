"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

export default function SignUpPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password })
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Could not create your account.");
        return;
      }
      const login = await signIn("credentials", { email, password, redirect: false });
      if (login?.error) setError("Account created - please sign in.");
      else window.location.href = "/account";
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="mx-4 mt-16 max-w-md">
      <GlassPanel>
        <h1 className="text-2xl font-semibold">Create account</h1>
        <p className="text-white/60 text-sm mt-1 mb-6">Fast checkout, order tracking, wishlists.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" required
            className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-400" />
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" required
            className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-400" />
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" required minLength={8}
            className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-400" />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button variant="primary" className="w-full" disabled={loading}>
            {loading ? "Creating..." : "Sign Up"}
          </Button>
        </form>
        <p className="text-white/50 text-xs mt-6">
          Already registered? <Link href="/account/signin" className="text-brand-400">Sign in</Link>
        </p>
      </GlassPanel>
    </section>
  );
}
