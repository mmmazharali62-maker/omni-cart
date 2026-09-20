import Link from "next/link";

// Category tiles on the home page (spec section 1).
export function CategoryGrid({ categories }: { categories: Array<{ slug: string; name: string; image?: string | null }> }) {
  if (categories.length === 0) return null;
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {categories.map((c) => (
        <Link key={c.slug} href={`/categories/${c.slug}`} className="glass overflow-hidden rounded-2xl group">
          <div className="aspect-square overflow-hidden bg-white/5">
            {c.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={c.image} alt="" className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            ) : (
              <div className="w-full h-full grid place-items-center text-2xl text-white/30">{c.name.slice(0, 1)}</div>
            )}
          </div>
          <p className="p-3 text-sm font-medium text-center">{c.name}</p>
        </Link>
      ))}
    </div>
  );
}
