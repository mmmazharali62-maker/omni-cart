"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

export default function SignInPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const res = await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password.");
    else window.location.href = "/account";
  }

  return (
    <section className="mx-4 mt-16 max-w-md">
      <GlassPanel>
        <h1 className="text-2xl font-semibold">Welcome back</h1>
        <p className="text-white/60 text-sm mt-1 mb-6">Sign in to your Omni Cart account.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email"
            required className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-400"
          />
          <input
            type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password"
            required minLength={8} className="w-full glass bg-white/5 px-4 py-2.5 text-sm outline-none focus:ring-1 focus:ring-brand-400"
          />
          {error && <p className="text-red-400 text-xs">{error}</p>}
          <Button variant="primary" className="w-full" disabled={loading}>
            {loading ? "Signing in..." : "Sign In"}
          </Button>
        </form>
        <p className="text-white/50 text-xs mt-6">
          New here? <Link href="/account/signup" className="text-brand-400">Create an account</Link>
        </p>
      </GlassPanel>
    </section>
  );
}
