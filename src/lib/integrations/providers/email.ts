import type { TestResult } from "../types";

// Resend: verify the API key against the domains endpoint.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  const apiKey = keys.apiKey ?? process.env.EMAIL_PROVIDER_API_KEY;
  if (!apiKey) return { ok: false, message: "Resend API key missing." };
  if (!apiKey.startsWith("re_")) return { ok: false, message: "Resend keys start with re_ - re-copy it from the dashboard." };

  try {
    const res = await fetch("https://api.resend.com/domains", {
      headers: { Authorization: `Bearer ${apiKey}` },
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) return { ok: true, message: "Resend accepted the key." };
    return { ok: false, message: `Resend rejected the key (HTTP ${res.status}).` };
  } catch {
    return { ok: false, message: "Could not reach api.resend.com." };
  }
}
