// Frontmatter parser for content/blog/*.md (spec section 2).
export type Frontmatter = { title: string; summary?: string; date?: string; tags?: string[] };

export function parseFrontmatter(raw: string): { data: Frontmatter; body: string } {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n?([\s\S]*)$/);
  if (!match) return { data: { title: "Untitled" }, body: raw };

  const [, block, body] = match;
  const data: Record<string, string> = {};
  for (const line of block.split(/\r?\n/)) {
    const m = line.match(/^([a-zA-Z]+):\s*(.*)$/);
    if (m) data[m[1].toLowerCase()] = m[2].trim();
  }
  return {
    data: {
      title: data.title || "Untitled",
      summary: data.summary,
      date: data.date,
      tags: data.tags ? data.tags.split(",").map((t) => t.trim()).filter(Boolean) : undefined
    },
    body
  };
}

export function slugifyTitle(title: string): string {
  return title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 80);
}
