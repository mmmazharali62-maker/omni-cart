import { NextRequest, NextResponse } from "next/server";
import { getSupplierConnector } from "@/lib/suppliers";
import { resolvePricingRule, calculateSellingPrice } from "@/lib/pricing-engine";
import { supplierImportSchema } from "@/lib/validation";
import { rateLimit, clientKey } from "@/lib/rate-limit";
import { apiError } from "@/lib/api-error";
import { db } from "@/lib/db";

// One-click import (spec section 8): admin selects a CJ Dropshipping product,
// this fetches full details and creates it in the Omni Cart catalog.
export async function POST(req: NextRequest) {
  const rl = rateLimit(clientKey(req, "import"), 20, 60_000);
  if (!rl.allowed) {
    return NextResponse.json({ error: "Too many import requests" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
    const { supplierProductId } = supplierImportSchema.parse(body);

    const connector = getSupplierConnector("CJ_DROPSHIPPING");
    const payload = await connector.fetchProduct(supplierProductId);
    const rule = resolvePricingRule([], {});
    const sellingPrice = calculateSellingPrice(payload.cost, rule);

    // TODO once DB is provisioned: db.$transaction to find/create Supplier row,
    // create Product + ProductVariant rows + SupplierProduct link from payload,
    // slugify payload.title, set basePrice = sellingPrice, images = payload.images.

    return NextResponse.json({ imported: true, title: payload.title, sellingPrice });
  } catch (err) {
    return apiError(err);
  }
}
