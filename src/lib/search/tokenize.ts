// Search tokenization (spec section 9): shared by the search API + suggestions.
export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .split(/[^a-z0-9']+/)
    .filter((t) => t.length > 0);
}

// Simple relevance: matches in title score highest.
export function scoreMatch(title: string, description: string, tokens: string[]): number {
  if (tokens.length === 0) return 0;
  const t = title.toLowerCase();
  const d = description.toLowerCase();
  let score = 0;
  for (const token of tokens) {
    if (t.startsWith(token)) score += 3;
    else if (t.includes(token)) score += 2;
    if (d.includes(token)) score += 1;
  }
  return score;
}

export function suggestions(query: string, catalog: Array<{ title: string }>, limit = 6): string[] {
  const tokens = tokenize(query);
  return catalog
    .map((p) => ({ title: p.title, score: scoreMatch(p.title, "", tokens) }))
    .filter((p) => p.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((p) => p.title);
}
