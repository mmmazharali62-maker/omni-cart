import type { TestResult } from "../types";

// Twilio: verify credentials with a lightweight GET on the account resource.
export async function testConnection(keys: Record<string, string>): Promise<TestResult> {
  const accountSid = keys.accountSid ?? process.env.SMS_PROVIDER_ACCOUNT_SID;
  const authToken = keys.authToken ?? process.env.SMS_PROVIDER_AUTH_TOKEN;
  if (!accountSid || !authToken) return { ok: false, message: "Account SID and auth token are both required." };
  if (!accountSid.startsWith("AC")) return { ok: false, message: "Twilio Account SIDs start with AC." };

  try {
    const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}.json`, {
      headers: { Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}` },
      signal: AbortSignal.timeout(8000)
    });
    if (res.ok) return { ok: true, message: "Twilio credentials accepted." };
    return { ok: false, message: `Twilio rejected the credentials (HTTP ${res.status}).` };
  } catch {
    return { ok: false, message: "Could not reach api.twilio.com." };
  }
}
