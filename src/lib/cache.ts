// Tiny in-memory TTL cache with tag invalidation (spec section 13).
// Single-process only - fine for admin dashboards and rate-limited supplier APIs.
type Entry = { value: unknown; expiresAt: number; tags: string[] };

export class MemoryCache {
  private store = new Map<string, Entry>();

  get<T>(key: string): T | null {
    const e = this.store.get(key);
    if (!e) return null;
    if (Date.now() > e.expiresAt) {
      this.store.delete(key);
      return null;
    }
    return e.value as T;
  }

  set(key: string, value: unknown, ttlMs = 60_000, tags: string[] = []): void {
    this.store.set(key, { value, expiresAt: Date.now() + ttlMs, tags });
  }

  invalidateTag(tag: string): number {
    let n = 0;
    for (const [k, e] of this.store) {
      if (e.tags.includes(tag)) { this.store.delete(k); n++; }
    }
    return n;
  }

  clear(): void {
    this.store.clear();
  }

  get size(): number {
    return this.store.size;
  }
}

export const cache = new MemoryCache();
