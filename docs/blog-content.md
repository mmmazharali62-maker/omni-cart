# Blog & Content Guide

The blog is filesystem-backed: Markdown files in `content/blog/`, zero CMS to maintain.

## Writing a post

```markdown
---
title: Your Title Here
summary: One-sentence description for cards and meta tags.
date: 2026-09-20
tags: shipping, guides
---

## Body content here
```

- **Filename**: anything; the URL comes from the title slug (`How We Vet` -> `/blog/how-we-vet-every-supplier...`).
- **Frontmatter**: `title` (required), `summary`, `date` (YYYY-MM-DD), `tags` (comma list).
- **Supported markdown**: headings, bold/italic, links (https only), lists, `code`.
- **No raw HTML**: the renderer escapes it - XSS-safe by construction.

## Pipeline

1. `src/lib/blog/frontmatter.ts` - parses the header block.
2. `src/lib/blog/markdown.ts` - renders body to sanitized HTML.
3. `src/components/blog/prose.tsx` - article styling.
4. Pages: `/blog` (index, newest first) and `/blog/[slug]` (post + related).

## Content principles

- **Answers support questions**: every post should reduce tickets.
- **UK + US native**: no "color/colour" mishaps - pick per audience.
- **Honest pricing talk**: we publish our price-history philosophy; match it.
- 600-1,200 words: long enough to rank, short enough to finish.
