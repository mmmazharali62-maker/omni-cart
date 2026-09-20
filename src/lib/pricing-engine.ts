/**
 * Automatic Pricing Engine (spec section 10).
 * Turns a supplier cost into a retail price using admin-configured rules.
 */

export type PricingRule = {
  type: "fixed_markup" | "percentage_markup";
  value: number; // dollars for fixed, percent (e.g. 50) for percentage
  minProfit?: number;
  maxPrice?: number;
  roundTo?: 0.99 | 0.95 | 1; // psychological rounding target
  categoryId?: string;
  supplierId?: string;
};

export function calculateSellingPrice(supplierCost: number, rule: PricingRule): number {
  let price =
    rule.type === "fixed_markup" ? supplierCost + rule.value : supplierCost * (1 + rule.value / 100);

  if (rule.minProfit && price - supplierCost < rule.minProfit) {
    price = supplierCost + rule.minProfit;
  }
  if (rule.maxPrice && price > rule.maxPrice) {
    price = rule.maxPrice;
  }
  if (rule.roundTo && rule.roundTo !== 1) {
    price = Math.floor(price) + rule.roundTo;
  }
  return Math.round(price * 100) / 100;
}

/**
 * Resolves the most specific applicable rule: supplier-specific > category-specific > default.
 */
export function resolvePricingRule(
  rules: PricingRule[],
  ctx: { categoryId?: string; supplierId?: string }
): PricingRule {
  const supplierMatch = rules.find((r) => r.supplierId && r.supplierId === ctx.supplierId);
  if (supplierMatch) return supplierMatch;
  const categoryMatch = rules.find((r) => r.categoryId && r.categoryId === ctx.categoryId);
  if (categoryMatch) return categoryMatch;
  return rules.find((r) => !r.categoryId && !r.supplierId) ?? { type: "percentage_markup", value: 50 };
}
