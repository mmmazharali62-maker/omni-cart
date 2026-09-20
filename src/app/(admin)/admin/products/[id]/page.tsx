import { db } from "@/lib/db";
import { notFound } from "next/navigation";
import { GlassPanel } from "@/components/ui/glass-panel";
import { VariantManager, ProductStatusControls } from "@/components/admin/variant-manager";

// Product edit: status controls + full variant management (spec section 15).
export default async function AdminProductEditPage({ params }: { params: { id: string } }) {
  const product = await db.product
    .findUnique({
      where: { id: params.id },
      include: { variants: true, category: true, supplierLinks: { include: { supplier: true } } }
    })
    .catch(() => null);
  if (!product) notFound();

  return (
    <section className="max-w-3xl">
      <h1 className="text-2xl font-semibold mb-2">{product.title}</h1>
      <p className="text-white/50 text-sm mb-6">
        /product/{product.slug} · {product.category?.name ?? "no category"} · {product.supplierLinks[0]?.supplier.displayName ?? "manual"}
      </p>

      <div className="grid lg:grid-cols-2 gap-6">
        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Status</h2>
          <ProductStatusControls productId={product.id} currentStatus={product.status} />
        </GlassPanel>

        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Variants ({product.variants.length})</h2>
          <VariantManager
            productId={product.id}
            initialVariants={product.variants.map((v) => ({
              id: v.id, sku: v.sku, options: (v.options ?? {}) as Record<string, string>,
              price: Number(v.price), stock: v.stock
            }))}
          />
        </GlassPanel>
      </div>
    </section>
  );
}
