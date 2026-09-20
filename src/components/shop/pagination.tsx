import Link from "next/link";

// Simple prev/next + page numbers pagination (spec section 2).
export function Pagination({ page, totalPages, basePath }: { page: number; totalPages: number; basePath: string }) {
  if (totalPages <= 1) return null;
  const href = (p: number) => (p === 1 ? basePath : `${basePath}?page=${p}`);

  return (
    <nav className="flex items-center justify-center gap-2 mt-10" aria-label="Pagination">
      {page > 1 && <Link href={href(page - 1)} className="glass px-3 py-2 rounded-lg text-sm hover:bg-white/10">Previous</Link>}
      {Array.from({ length: totalPages }, (_, i) => i + 1)
        .filter((p) => Math.abs(p - page) < 3 || p === 1 || p === totalPages)
        .map((p) => (
          <Link key={p} href={href(p)} className={`px-3 py-2 rounded-lg text-sm ${p === page ? "bg-brand-600 text-white" : "glass hover:bg-white/10"}`}>
            {p}
          </Link>
        ))}
      {page < totalPages && <Link href={href(page + 1)} className="glass px-3 py-2 rounded-lg text-sm hover:bg-white/10">Next</Link>}
    </nav>
  );
}
