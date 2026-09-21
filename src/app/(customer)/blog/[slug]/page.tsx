import { notFound } from "next/navigation";
import { readdir, readFile } from "node:fs/promises";
import path from "node:path";
import { PostCard } from "@/components/blog/post-card";
import { Prose } from "@/components/blog/prose";
import { parseFrontmatter, slugifyTitle } from "@/lib/blog/frontmatter";
import { excerpt, renderMarkdown } from "@/lib/blog/markdown";
import { pageMeta } from "@/lib/seo-meta";

// Blog article (spec section 2): sanitized markdown, structured-data-ready.
export default async function BlogPostPage({ params }: { params: { slug: string } }) {
  const dir = path.join(process.cwd(), "content", "blog");
  const files = await readdir(dir).then((f) => f.filter((f) => f.endsWith(".md"))).catch(() => []);

  const posts = await Promise.all(
    files.map(async (file) => {
      const raw = await readFile(path.join(dir, file), "utf-8");
      const { data, body } = parseFrontmatter(raw);
      return { slug: slugifyTitle(data.title), title: data.title, summary: data.summary ?? "", date: data.date ?? "2026-09-01", tags: data.tags, body };
    })
  );

  const post = posts.find((p) => p.slug === params.slug);
  if (!post) notFound();

  const related = posts.filter((p) => p.slug !== post.slug).slice(0, 2);
  const html = renderMarkdown(post.body);

  return (
    <article className="mx-4 mt-12 max-w-2xl">
      <p className="text-xs text-white/40">{new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</p>
      <h1 className="text-3xl font-semibold mt-1">{post.title}</h1>
      <div className="mt-6">
        <Prose html={html} />
      </div>
      {related.length > 0 && (
        <div className="mt-12">
          <h2 className="text-lg font-medium mb-4">Keep reading</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {related.map((p) => (
              <PostCard key={p.slug} post={{ slug: p.slug, title: p.title, summary: excerpt(p.body), date: p.date, tags: p.tags }} />
            ))}
          </div>
        </div>
      )}
    </article>
  );
}
