// Anonymous visitor ids (spec section 6/9): cart merge + analytics without cookies.
const KEY = "omni-visitor-id";

export function generateVisitorId(rand = Math.random): string {
  const part = () => Math.floor(rand() * 0x10000).toString(16).padStart(4, "0");
  return `v-${part()}-${part()}-${Date.now().toString(36)}`;
}

export function isValidVisitorId(id: string): boolean {
  return /^v-[a-f0-9]{4}-[a-f0-9]{4}-[a-z0-9]+$/.test(id);
}

// Browser-side: persist in localStorage (first-party, no cookie banner needed).
export function readVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  const existing = window.localStorage.getItem(KEY);
  return existing && isValidVisitorId(existing) ? existing : null;
}

export function ensureVisitorId(): string | null {
  if (typeof window === "undefined") return null;
  const existing = readVisitorId();
  if (existing) return existing;
  const fresh = generateVisitorId();
  window.localStorage.setItem(KEY, fresh);
  return fresh;
}
