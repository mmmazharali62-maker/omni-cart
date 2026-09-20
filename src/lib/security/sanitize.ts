// HTML sanitizer for user-submitted content (reviews, support notes).
// Allowlist-based: anything outside the allowlist is stripped, never echoed.
const ALLOWED_TAGS = new Set(["b", "strong", "i", "em", "u", "p", "br"]);

export function sanitizeHtml(input: string): string {
  // First drop script/style blocks including their content.
  let out = input.replace(/<\s*(script|style)[^>]*>[\s\S]*?<\s*\/\s*\1\s*>/gi, "");
  out = out.replace(/<\s*(\/?\s*[a-zA-Z0-9-]+)[^>]*>/g, (_match, tag: string) => {
    const closing = tag.trim().startsWith("/");
    const name = tag.replace(/[^a-zA-Z0-9-]/g, "").toLowerCase();
    if (ALLOWED_TAGS.has(name)) {
      if (name === "br") return "<br/>";
      return closing ? `</${name}>` : `<${name}>`;
    }
    return ""; // strip tag entirely
  });
  return out
    .replace(/javascript:/gi, "")
    .replace(/on[a-z]+\s*=/gi, "data-removed=")
    .slice(0, 5000);
}

// Plain-text fallback: strips every tag (for subjects, titles, meta).
export function stripTags(input: string): string {
  return input.replace(/<[^>]*>/g, "").slice(0, 5000);
}
