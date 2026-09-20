// Background job (spec section 9/28): periodically pulls supplier data and
// updates price/stock/variants/availability, then applies the pricing engine.
import { db } from "@/lib/db";
import { getSupplierConnector } from "@/lib/suppliers";

export async function runSupplierSyncJob() {
  const links = await db.supplierProduct.findMany({ include: { supplier: true, product: true } });
  for (const link of links) {
    try {
      const connector = getSupplierConnector(link.supplier.name);
      const [fresh] = await connector.syncProducts([link.supplierProductId]);
      if (!fresh) continue;
      // TODO: diff fresh.cost/variants against stored data, apply pricing-engine,
      // update Product/ProductVariant/Inventory, and flip status to out_of_stock when needed.
    } catch (err) {
      // TODO: record syncStatus = "failed" and surface in Supplier Dashboard (section 16).
      console.error(`supplier sync failed for ${link.id}`, err);
    }
  }
}
