import Link from "next/link";
import { GlassPanel } from "@/components/ui/glass-panel";

export type PostCardData = { slug: string; title: string; summary: string; date: string; tags?: string[] };

// Blog cards for the index + related rails (spec section 2).
export function PostCard({ post }: { post: PostCardData }) {
  return (
    <Link href={`/blog/${post.slug}`} className="block">
      <GlassPanel className="p-5 h-full hover:bg-white/5 transition">
        <p className="text-xs text-white/40">{new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</p>
        <h3 className="font-medium mt-1">{post.title}</h3>
        <p className="text-sm text-white/60 mt-2 line-clamp-3">{post.summary}</p>
        {post.tags && post.tags.length > 0 && (
          <p className="text-xs text-brand-400 mt-3">#{post.tags.join(" #")}</p>
        )}
      </GlassPanel>
    </Link>
  );
}
