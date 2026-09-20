import { GlassPanel } from "@/components/ui/glass-panel";
import { db } from "@/lib/db";

// Supplier Dashboard (spec section 16): connections, mappings, sync status.
export default async function AdminSuppliersPage() {
  const suppliers = await db.supplier
    .findMany({ include: { products: { include: { product: { select: { title: true } } } } } })
    .catch(() => []);

  const cards = [
    { name: "CJ Dropshipping", env: "CJ_DROPSHIPPING_API_KEY" },
    { name: "AliExpress", env: "ALIEXPRESS_APP_KEY" },
    { name: "Amazon (sourcing TBD)", env: "AMAZON_SP_API_CLIENT_ID" }
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Suppliers</h1>
      <div className="grid md:grid-cols-3 gap-4">
        {cards.map((c) => {
          const configured = Boolean(process.env[c.env]);
          return (
            <GlassPanel key={c.name}>
              <p className="font-medium">{c.name}</p>
              <p className={`text-sm mt-2 ${configured ? "text-emerald-400" : "text-white/50"}`}>
                {configured ? "Credentials configured" : "Not connected - add keys in environment"}
              </p>
            </GlassPanel>
          );
        })}
      </div>

      <GlassPanel className="mt-8">
        <h2 className="text-sm font-medium mb-4">Product Mappings & Sync Status</h2>
        {suppliers.length === 0 ? (
          <p className="text-white/50 text-sm">No suppliers or mappings yet. Import a product to create one.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="text-white/50 text-xs">
              <tr><th className="text-left py-2">Supplier</th><th className="text-left">Product</th><th className="text-left">Sync</th><th className="text-left">Last Synced</th></tr>
            </thead>
            <tbody>
              {suppliers.flatMap((s) =>
                s.products.map((m) => (
                  <tr key={m.id} className="border-t border-white/10">
                    <td className="py-2">{s.displayName}</td>
                    <td>{m.product?.title ?? "deleted"}</td>
                    <td><span className={m.syncStatus === "ok" ? "text-emerald-400" : "text-amber-400"}>{m.syncStatus}</span></td>
                    <td className="text-white/50">{m.lastSyncedAt?.toISOString() ?? "never"}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </GlassPanel>
      <p className="text-xs text-white/40 mt-4">
        Credentials live only in environment/secret management - never in repo files.
      </p>
    </section>
  );
}
