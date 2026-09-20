import type { TestResult } from "../types";

// CJ Dropshipping: authenticate against the CJ API to confirm the key pair works.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  const apiKey = keys.apiKey ?? process.env.CJ_API_KEY;
  const email = keys.email ?? process.env.CJ_EMAIL;
  if (!apiKey || !email) return { ok: false, message: "API key and account email are both required." };

  try {
    const res = await fetch("https://developers.cjdropshipping.com/api2.0/v1/authentication/getAccessToken", {
      method: "POST",
      headers: { "Content-Type": "application/json", "CJ-Api-Key": apiKey },
      body: JSON.stringify({ email }),
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) return { ok: true, message: "CJ credentials accepted." };
    return { ok: false, message: `CJ rejected the credentials (HTTP ${res.status}). Double-check the API key in your CJ dashboard.` };
  } catch {
    return { ok: false, message: "Could not reach the CJ API." };
  }
}
