// Tiny markdown renderer for blog posts (spec section 2).
// Supports: headings, bold/italic, links, lists, code, paragraphs. No raw HTML.
export function renderMarkdown(md: string): string {
  const escape = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
  const inline = (s: string) =>
    escape(s)
      .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
      .replace(/\*(.+?)\*/g, "<em>$1</em>")
      .replace(/`(.+?)`/g, "<code>$1</code>")
      .replace(/\[(.+?)\]\((https:\/\/[^\s)]+)\)/g, '<a href="$2" rel="noreferrer">$1</a>');

  const lines = md.split(/\r?\n/);
  const out: string[] = [];
  let listOpen = false;
  const closeList = () => { if (listOpen) { out.push("</ul>"); listOpen = false; } };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (/^###\s+/.test(line)) { closeList(); out.push(`<h3>${inline(line.replace(/^###\s+/, ""))}</h3>`); }
    else if (/^##\s+/.test(line)) { closeList(); out.push(`<h2>${inline(line.replace(/^##\s+/, ""))}</h2>`); }
    else if (/^#\s+/.test(line)) { closeList(); out.push(`<h1>${inline(line.replace(/^#\s+/, ""))}</h1>`); }
    else if (/^[-*]\s+/.test(line)) {
      if (!listOpen) { out.push("<ul>"); listOpen = true; }
      out.push(`<li>${inline(line.replace(/^[-*]\s+/, ""))}</li>`);
    }
    else if (line.trim() === "") { closeList(); }
    else { closeList(); out.push(`<p>${inline(line)}</p>`); }
  }
  closeList();
  return out.join("\n");
}

export function excerpt(md: string, maxChars = 160): string {
  const plain = md.replace(/[#*`>\-]/g, "").replace(/\[(.+?)\]\(.+?\)/g, "$1").replace(/\s+/g, " ").trim();
  if (plain.length <= maxChars) return plain;
  const cut = plain.slice(0, maxChars - 3);
  return `${cut.slice(0, cut.lastIndexOf(" "))}...`;
}
