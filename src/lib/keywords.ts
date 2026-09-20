// SEO keyword extraction (spec section 2): for meta tags + search boosting.
const STOP = new Set([
  "the", "a", "an", "and", "or", "for", "with", "your", "you", "our", "is", "are",
  "this", "that", "to", "of", "in", "on", "it", "its", "by", "from", "at", "be", "can"
]);

export function extractKeywords(text: string, limit = 8): string[] {
  const counts = new Map<string, number>();
  const words = text.toLowerCase().split(/[^a-z0-9']+/).filter((w) => w.length > 2 && !STOP.has(w));
  for (const w of words) counts.set(w, (counts.get(w) ?? 0) + 1);
  return [...counts.entries()]
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, limit)
    .map(([w]) => w);
}

// Meta description: 150-160 chars is the Google sweet spot.
export function metaDescription(text: string): string {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= 160) return clean;
  const cut = clean.slice(0, 157);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}

export function metaKeywords(text: string): string {
  return extractKeywords(text, 6).join(", ");
}
