import Link from "next/link";
import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";

export default async function CategoriesPage() {
  const categories = await db.category.findMany({ include: { _count: { select: { products: true } } } }).catch(() => []);
  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Categories</h1>
      {categories.length === 0 ? (
        <p className="text-white/50 text-sm">No categories yet.</p>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {categories.map((c) => (
            <Link key={c.id} href={`/categories/${c.slug}`}>
              <GlassPanel className="p-6">
                <p className="font-medium">{c.name}</p>
                <p className="text-xs text-white/50 mt-1">{c._count.products} products</p>
              </GlassPanel>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
