// AI Product Content (spec section 13): cleans up raw supplier product data
// into store-ready title, description, bullet points and SEO content.
// TODO: wire to the chosen AI provider via AI_PROVIDER_API_KEY.

export type RawSupplierContent = { title: string; description: string };
export type CleanedProductContent = {
  title: string;
  description: string;
  bulletPoints: string[];
  seoTitle: string;
  seoDescription: string;
};

export async function cleanProductContent(raw: RawSupplierContent): Promise<CleanedProductContent> {
  // TODO: call AI provider with a prompt that rewrites raw.title/description into
  // store-voice copy, extracts bullet points, and produces SEO-safe title/description.
  return {
    title: raw.title,
    description: raw.description,
    bulletPoints: [],
    seoTitle: raw.title,
    seoDescription: raw.description.slice(0, 155)
  };
}
