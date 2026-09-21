// Email unsubscribe tokens (spec section 17/15): one-click, no login needed.
import type { Locale } from "@/lib/i18n";

export type UnsubscribePayload = { email: string; scope: "all" | "marketing"; issuedAt: number };

import { createHmac } from "node:crypto";

// HMAC-SHA256: wrong secret can never produce a valid signature.
function sign(data: string, secret: string): string {
  return createHmac("sha256", secret).update(data).digest("base64url").slice(0, 32);
}

// Tokens expire after 30 days; the email link always works via the page.
export function createUnsubscribeToken(email: string, scope: "all" | "marketing", secret: string, now = Date.now()): string {
  const payload: UnsubscribePayload = { email: email.toLowerCase(), scope, issuedAt: now };
  const body = Buffer.from(JSON.stringify(payload)).toString("base64url");
  return `${body}.${sign(body, secret)}`;
}

export function verifyUnsubscribeToken(token: string, secret: string, maxAgeMs = 30 * 86_400_000): UnsubscribePayload | null {
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  if (sign(body, secret) !== sig) return null;
  try {
    const payload = JSON.parse(Buffer.from(body, "base64url").toString()) as UnsubscribePayload;
    if (Date.now() - payload.issuedAt > maxAgeMs) return null;
    if (!payload.email || !["all", "marketing"].includes(payload.scope)) return null;
    return payload;
  } catch {
    return null;
  }
}

export function unsubscribeCopy(locale: Locale = "en-US"): { title: string; confirm: string } {
  return locale === "en-GB"
    ? { title: "Email preferences updated", confirm: "You're unsubscribed. Transactional emails (order updates) still arrive." }
    : { title: "Email preferences updated", confirm: "You're unsubscribed. Transactional emails (order updates) still arrive." };
}
