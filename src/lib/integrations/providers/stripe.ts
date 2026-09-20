import type { TestResult } from "../types";

// Stripe: verify the secret key with a real Balance query.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  const secret = keys.secretKey ?? process.env.STRIPE_SECRET_KEY;
  if (!secret) return { ok: false, message: "Secret key missing." };
  if (!/^sk_(test|live)_/.test(secret)) return { ok: false, message: "That doesn't look like a Stripe secret key (sk_test_... or sk_live_...)." };

  try {
    const res = await fetch("https://api.stripe.com/v1/balance", {
      headers: { Authorization: `Bearer ${secret}` },
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) return { ok: true, message: res.url.includes("/test") ? "Stripe reachable (test mode)." : "Stripe reachable." };
    const body = (await res.json().catch(() => ({}))) as { error?: { message?: string } };
    return { ok: false, message: body.error?.message ?? `Stripe rejected the key (HTTP ${res.status}).` };
  } catch {
    return { ok: false, message: "Could not reach api.stripe.com." };
  }
}
