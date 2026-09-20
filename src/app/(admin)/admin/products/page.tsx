import Link from "next/link";
import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { formatMoney } from "@/lib/utils";

// Admin Product Management (spec section 15).
export default async function AdminProductsPage() {
  const products = await db.product
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 50,
      include: { variants: true, category: true, supplierLinks: { include: { supplier: true } } }
    })
    .catch(() => []);

  return (
    <section>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Products</h1>
        <div className="flex gap-3">
          <Link href="/admin/products/import"><Button variant="glass">Import</Button></Link>
          <Link href="/admin/products/new"><Button variant="primary">New Product</Button></Link>
        </div>
      </div>
      <GlassPanel>
        {products.length === 0 ? (
          <p className="text-white/50 text-sm py-4">
            No products yet. Use “Import Product” to pull your first CJ Dropshipping or AliExpress item.
          </p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr>
                <th className="text-left py-2">Title</th>
                <th className="text-left">Category</th>
                <th className="text-left">Supplier</th>
                <th className="text-left">Price</th>
                <th className="text-left">Stock</th>
                <th className="text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => {
                const stock = p.variants.reduce((s, v) => s + v.stock, 0);
                return (
                  <tr key={p.id} className="border-t border-white/10">
                    <td className="py-3 max-w-[240px] truncate"><Link href={`/admin/products/${p.id}`} className="hover:text-brand-400">{p.title}</Link></td>
                    <td className="text-white/70">{p.category?.name ?? "—"}</td>
                    <td className="text-white/70">{p.supplierLinks[0]?.supplier.displayName ?? "manual"}</td>
                    <td>{formatMoney(Number(p.salePrice ?? p.basePrice), p.currency)}</td>
                    <td className={stock <= 5 ? "text-amber-400" : ""}>{stock}</td>
                    <td><span className="px-2 py-1 rounded-full text-xs bg-white/10 text-white/70">{p.status}</span></td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </GlassPanel>
      {/* TODO: create/edit/delete/archive + bulk import UI */}
    </section>
  );
}
