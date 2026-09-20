// AI Product Assistant / natural-language search (spec section 2/13).
// e.g. "Mujhe $50 ke andar kitchen ke liye useful product chahiye."
// TODO: parse natural-language query into structured filters (price range, category, etc.)
// then run it through the normal product search/filter pipeline.

export type ParsedSearchIntent = {
  keywords: string[];
  maxPrice?: number;
  minPrice?: number;
  categorySlug?: string;
};

export async function parseNaturalLanguageQuery(query: string): Promise<ParsedSearchIntent> {
  return { keywords: query.split(" ").filter(Boolean) };
}
