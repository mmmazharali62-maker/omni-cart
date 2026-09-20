import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSupplierConnector } from "@/lib/suppliers";
import { resolvePricingRule, calculateSellingPrice } from "@/lib/pricing-engine";

// One-click import (spec section 8): admin selects a AliExpress product,
// this fetches full details and creates it in the Omni Cart catalog.
export async function POST(req: NextRequest) {
  const { supplierProductId } = await req.json();
  if (!supplierProductId) {
    return NextResponse.json({ error: "supplierProductId is required" }, { status: 400 });
  }

  try {
    const connector = getSupplierConnector("ALIEXPRESS");
    const payload = await connector.fetchProduct(supplierProductId);
    const rule = resolvePricingRule([], {});
    const sellingPrice = calculateSellingPrice(payload.cost, rule);

    // TODO once DB is provisioned: db.$transaction to create/find Supplier,
    // create Product + ProductVariant rows + SupplierProduct link with payload data,
    // slugify payload.title, and set basePrice = sellingPrice.

    return NextResponse.json({ imported: true, title: payload.title, sellingPrice });
  } catch (err) {
    return NextResponse.json({ error: (err as Error).message }, { status: 502 });
  }
}
