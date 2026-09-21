import { db } from "@/lib/db";
import { CompareTable } from "@/components/compare/compare-table";
import { EmptyState } from "@/components/ui/empty-state";
import { pageMeta } from "@/lib/seo-meta";

export const metadata = pageMeta("Compare Products", "Side-by-side product comparison at Omni Cart.");

// Comparison page (spec section 3): reads ?ids=a,b,c (max 4).
export default async function ComparePage({ searchParams }: { searchParams: { ids?: string } }) {
  const ids = (searchParams.ids ?? "").split(",").map((s) => s.trim()).filter(Boolean).slice(0, 4);

  const products = ids.length >= 2
    ? await db.product.findMany({
        where: { id: { in: ids }, status: "active" },
        select: { id: true, slug: true, title: true, images: true, basePrice: true, salePrice: true, categoryId: true }
      }).catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12 max-w-5xl">
      <h1 className="text-3xl font-semibold">Compare</h1>
      <p className="text-white/50 text-sm mt-1 mb-6">Up to 4 products, side by side.</p>
      {products.length >= 2 ? (
        <CompareTable products={products.map((p) => ({
          id: p.id, slug: p.slug, title: p.title,
          image: (p.images ?? [])[0] ?? null,
          price: Number(p.basePrice), salePrice: p.salePrice ? Number(p.salePrice) : null,
          stock: 1
        }))} />
      ) : (
        <EmptyState title="Pick products to compare" message="Add items from the shop using the compare button, then come back here." />
      )}
    </section>
  );
}
