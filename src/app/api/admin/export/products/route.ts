import { NextRequest } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { toCsv, csvResponse } from "@/lib/export/csv";

// Product catalog CSV export (spec section 14).
export async function GET(req: NextRequest) {
  const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
  if (!guard.ok) return new Response("Forbidden", { status: guard.status });

  const products = await db.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { variants: true, category: { select: { name: true } } }
  });

  const csv = toCsv(products, [
    { header: "title", value: (p: typeof products[number]) => p.title },
    { header: "slug", value: (p: typeof products[number]) => p.slug },
    { header: "category", value: (p: typeof products[number]) => p.category?.name ?? "" },
    { header: "status", value: (p: typeof products[number]) => p.status },
    { header: "base_price", value: (p: typeof products[number]) => Number(p.basePrice) },
    { header: "sale_price", value: (p: typeof products[number]) => (p.salePrice ? Number(p.salePrice) : "") },
    { header: "currency", value: (p: typeof products[number]) => p.currency },
    { header: "variants", value: (p: typeof products[number]) => p.variants.length },
    { header: "total_stock", value: (p: typeof products[number]) => p.variants.reduce((s, v) => s + v.stock, 0) }
  ]);

  return csvResponse(`products-${new Date().toISOString().slice(0, 10)}.csv`, csv);
}
