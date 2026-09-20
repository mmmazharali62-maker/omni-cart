// Loads active PricingRule rows from DB and resolves the most specific match
// (supplier > category > default) for a given product context (spec section 10).
import { db } from "@/lib/db";
import type { PricingRule } from "@/lib/pricing-engine";

type DbRule = {
  id: string; name: string; type: string; value: any; minProfit: any; maxPrice: any;
  roundTo: string | null; categoryId: string | null; supplierId: string | null; priority: number;
};

function toEngineRule(r: DbRule): PricingRule {
  return {
    type: r.type as PricingRule["type"],
    value: Number(r.value),
    minProfit: r.minProfit != null ? Number(r.minProfit) : undefined,
    maxPrice: r.maxPrice != null ? Number(r.maxPrice) : undefined,
    roundTo: r.roundTo === "0.99" ? 0.99 : r.roundTo === "0.95" ? 0.95 : undefined,
    categoryId: r.categoryId ?? undefined,
    supplierId: r.supplierId ?? undefined
  };
}

export async function resolveRuleForProduct(ctx: { categoryId?: string; supplierId?: string }) {
  const rows = (await db.pricingRule.findMany({ where: { isActive: true } })) as unknown as DbRule[];
  if (rows.length === 0) {
    return { type: "percentage_markup", value: 50 } as PricingRule; // default
  }
  const engineRules = rows.map(toEngineRule);
  const supplierMatch = engineRules.find((r) => r.supplierId && r.supplierId === ctx.supplierId);
  if (supplierMatch) return supplierMatch;
  const categoryMatch = engineRules.find((r) => r.categoryId && r.categoryId === ctx.categoryId);
  if (categoryMatch) return categoryMatch;
  return engineRules.find((r) => !r.categoryId && !r.supplierId) ?? engineRules[0];
}
