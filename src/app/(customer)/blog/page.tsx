import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { pageMeta } from "@/lib/seo-meta";
import { PostCard } from "@/components/blog/post-card";
import { parseFrontmatter, slugifyTitle } from "@/lib/blog/frontmatter";
import { excerpt, renderMarkdown } from "@/lib/blog/markdown";

export const metadata = pageMeta("Blog", "Guides, shipping explainers, and behind-the-scenes at Omni Cart.");

// Blog index (spec section 2): filesystem-backed, zero CMS.
export default async function BlogPage() {
  const dir = path.join(process.cwd(), "content", "blog");
  const files = await readdir(dir).then((f) => f.filter((f) => f.endsWith(".md"))).catch(() => []);

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(dir, file), "utf-8");
      const { data, body } = parseFrontmatter(raw);
      return {
        slug: slugifyTitle(data.title),
        title: data.title,
        summary: excerpt(renderMarkdown(body)),
        date: data.date ?? "2026-09-01",
        tags: data.tags
      };
    })
  );
  posts.sort((a, b) => (a.date < b.date ? 1 : -1));

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-3xl font-semibold">The Omni Cart blog</h1>
      <p className="text-white/50 text-sm mt-1 mb-8">Guides, shipping explainers, and how we vet products.</p>
      <div className="grid md:grid-cols-2 gap-4">
        {posts.map((p) => (
          <PostCard key={p.slug} post={p} />
        ))}
      </div>
    </section>
  );
}
