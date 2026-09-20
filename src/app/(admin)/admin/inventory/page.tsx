import { db } from "@/lib/db";
import { GlassPanel } from "@/components/ui/glass-panel";
import Link from "next/link";

// Inventory: stock levels + low-stock alerts, supplier-sourced (spec section 16).
export default async function AdminInventoryPage() {
  const variants = await db.productVariant
    .findMany({
      include: { product: { select: { title: true, slug: true, supplierLinks: { include: { supplier: true } } } } },
      orderBy: { stock: "asc" },
      take: 100
    })
    .catch(() => []);

  const lowStock = variants.filter((v) => v.stock <= 5);
  const outOfStock = variants.filter((v) => v.stock === 0);

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Inventory</h1>
      <div className="grid grid-cols-3 gap-4 mb-8">
        {[
          { label: "Variants tracked", value: variants.length },
          { label: "Low stock (≤5)", value: lowStock.length },
          { label: "Out of stock", value: outOfStock.length }
        ].map((t) => (
          <GlassPanel key={t.label} className="p-5">
            <p className="text-xs text-white/50">{t.label}</p>
            <p className="text-2xl font-semibold mt-2">{t.value}</p>
          </GlassPanel>
        ))}
      </div>

      <GlassPanel>
        {variants.length === 0 ? (
          <p className="text-white/50 text-sm py-4">No variants yet - import or create products first.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr><th className="text-left py-2">Product</th><th className="text-left">SKU</th><th className="text-left">Supplier</th><th className="text-left">Stock</th></tr>
            </thead>
            <tbody>
              {variants.map((v) => (
                <tr key={v.id} className="border-t border-white/10">
                  <td className="py-2">
                    <Link href={`/product/${v.product.slug}`} className="hover:text-brand-400">{v.product.title}</Link>
                  </td>
                  <td className="text-white/60 font-mono text-xs">{v.sku}</td>
                  <td className="text-white/70">{v.product.supplierLinks[0]?.supplier.displayName ?? "manual"}</td>
                  <td className={v.stock === 0 ? "text-red-400" : v.stock <= 5 ? "text-amber-400" : "text-emerald-400"}>{v.stock}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
        <p className="text-xs text-white/40 mt-4">
          Stock auto-updates on supplier sync; overrides + restock actions are next.
        </p>
      </GlassPanel>
    </section>
  );
}
