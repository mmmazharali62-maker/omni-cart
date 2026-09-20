// Checkout upsell selection (spec section 15): cheap, relevant, high-margin first.
export type UpsellCandidate = {
  productId: string; title: string; price: number; cost: number;
  categorySlug: string; stock: number; rating: number;
};

export function selectUpsells(
  cartCategorySlugs: string[],
  cartProductIds: string[],
  candidates: UpsellCandidate[],
  limit = 3
): UpsellCandidate[] {
  const inCart = new Set(cartProductIds);
  const cartCats = new Set(cartCategorySlugs);
  const scored = candidates
    .filter((c) => !inCart.has(c.productId) && c.stock > 0 && c.price <= 40)
    .map((c) => {
      let score = c.rating * 2;
      if (cartCats.has(c.categorySlug)) score += 5; // complements the cart
      const margin = c.price > 0 ? (c.price - c.cost) / c.price : 0;
      if (margin >= 0.4) score += 2; // sustainable upsells only
      if (c.price <= 15) score += 1; // impulse-friendly price point
      return { c, score };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ c }) => c);
  return scored;
}
