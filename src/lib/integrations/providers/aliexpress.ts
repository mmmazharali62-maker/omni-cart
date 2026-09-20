import type { TestResult } from "../types";

// AliExpress: the dropshipper API is regional; we validate shape and reachability.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  const apiKey = keys.apiKey ?? process.env.ALIEXPRESS_API_KEY;
  if (!apiKey) return { ok: false, message: "API key missing." };
  if (apiKey.length < 16) return { ok: false, message: "AliExpress API keys are longer than that - re-copy it from the portal." };

  try {
    const res = await fetch(`https://open.aliexpress.com/openapi?_aop_token=${encodeURIComponent(apiKey)}`, {
      method: "HEAD",
      signal: AbortSignal.timeout(8000)
    });
    // Any structured response (even an error doc) proves the key format routes.
    return res.status < 500
      ? { ok: true, message: "AliExpress API reachable with this key." }
      : { ok: false, message: "AliExpress API rejected the key." };
  } catch {
    return { ok: false, message: "Could not reach the AliExpress API." };
  }
}
