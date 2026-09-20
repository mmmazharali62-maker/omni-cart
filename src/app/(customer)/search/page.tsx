import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { GlassPanel } from "@/components/ui/glass-panel";
import { parseNaturalLanguageQuery } from "@/lib/ai/search-assistant";

// Search page (spec section 2): keyword + (future) natural-language search.
export default async function SearchPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const q = searchParams.q ?? "";
  const intent = q ? await parseNaturalLanguageQuery(q) : { keywords: [] };
  const products = q
    ? await db.product
        .findMany({
          where: {
            status: "active",
            OR: intent.keywords.flatMap((kw) => [
              { title: { contains: kw, mode: "insensitive" as const } },
              { description: { contains: kw, mode: "insensitive" as const } }
            ]),
            basePrice: { lte: intent.maxPrice, gte: intent.minPrice }
          },
          take: 40
        })
        .catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Search</h1>
      <form method="get" className="mb-8">
        <GlassPanel className="flex gap-3 p-3">
          <input
            name="q"
            defaultValue={q}
            placeholder='Try "kitchen" or "phone mount under $20" (AI search coming soon)'
            className="flex-1 bg-transparent outline-none text-sm px-2"
          />
          <button className="glass px-5 py-2 rounded-lg text-sm hover:bg-white/10">Search</button>
        </GlassPanel>
      </form>

      {q && products.length === 0 && (
        <p className="text-white/50 text-sm">No results for “{q}”. Try a different term.</p>
      )}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={{
              slug: p.slug,
              title: p.title,
              image: p.images[0] ?? "",
              price: Number(p.basePrice),
              salePrice: p.salePrice ? Number(p.salePrice) : undefined
            }}
          />
        ))}
      </div>
    </section>
  );
}
