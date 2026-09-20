// Simple in-memory sliding-window rate limiter, fine for a single serverless
// region at launch. TODO: move to Upstash Redis or similar when multi-region.
const buckets = new Map<string, number[]>();

export function rateLimit(key: string, limit: number, windowMs: number) {
  const now = Date.now();
  const hits = (buckets.get(key) ?? []).filter((t) => now - t < windowMs);
  if (hits.length >= limit) return { allowed: false as const, retryInMs: windowMs - (now - hits[0]) };
  hits.push(now);
  buckets.set(key, hits);
  return { allowed: true as const, retryInMs: 0 };
}

export function clientKey(req: Request, scope: string) {
  const ip = req.headers.get("x-forwarded-for") ?? "unknown";
  return `${scope}:${ip}`;
}
