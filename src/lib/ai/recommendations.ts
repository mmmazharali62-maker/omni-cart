// AI Recommendations (spec section 13): relevant products from browsing/cart behaviour.
// TODO: replace with a real model/embedding-based similarity search.

export async function getRecommendedProducts(input: {
  userId?: string;
  recentlyViewedProductIds: string[];
  cartProductIds: string[];
}): Promise<string[]> {
  return [];
}
