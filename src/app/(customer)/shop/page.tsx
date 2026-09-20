import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/product/product-card";
import { GlassPanel } from "@/components/ui/glass-panel";

type Sort = "newest" | "price_asc" | "price_desc";

// Shop page with price/category/sort filters (spec section 2).
export default async function ShopPage({ searchParams }: { searchParams: Record<string, string | undefined> }) {
  const category = searchParams.category;
  const maxPrice = searchParams.maxPrice ? Number(searchParams.maxPrice) : undefined;
  const sort = (searchParams.sort as Sort) ?? "newest";

  const products = await db.product
    .findMany({
      where: {
        status: "active",
        category: category ? { slug: category } : undefined,
        basePrice: { lte: maxPrice }
      },
      orderBy:
        sort === "price_asc" ? { basePrice: "asc" } :
        sort === "price_desc" ? { basePrice: "desc" } :
        { createdAt: "desc" },
      take: 60
    })
    .catch(() => []);

  const categories = await db.category.findMany().catch(() => []);

  return (
    <section className="mx-4 mt-12">
      <h1 className="text-2xl font-semibold mb-6">Shop</h1>
      <GlassPanel className="mb-8 flex flex-wrap gap-3 items-center text-sm">
        <form className="flex flex-wrap gap-3 items-center" method="get">
          <select name="category" defaultValue={category ?? ""} className="glass bg-white/5 px-3 py-2 rounded-lg">
            <option value="">All categories</option>
            {categories.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
          </select>
          <input name="maxPrice" type="number" placeholder="Max price" defaultValue={searchParams.maxPrice ?? ""} className="glass bg-white/5 px-3 py-2 rounded-lg w-28" />
          <select name="sort" defaultValue={sort} className="glass bg-white/5 px-3 py-2 rounded-lg">
            <option value="newest">Newest</option>
            <option value="price_asc">Price: low to high</option>
            <option value="price_desc">Price: high to low</option>
          </select>
          <button className="glass px-4 py-2 rounded-lg hover:bg-white/10">Apply</button>
        </form>
      </GlassPanel>

      {products.length === 0 ? (
        <p className="text-white/50 text-sm">No products match yet - import products from the admin dashboard.</p>
      ) : (
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
      )}
    </section>
  );
}
