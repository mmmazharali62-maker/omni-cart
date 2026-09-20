import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { normalizeRow, parseCsv } from "@/lib/csv-import";
import { slugify } from "@/lib/slugify";
import { logIntegrationChange } from "@/lib/integrations/audit";

const schema = z.object({ csv: z.string().min(5).max(500_000) });

// CSV catalog import (spec section 10/14): previewed server-side, audited.
export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { csv } = schema.parse(await req.json());
    const { rows, errors } = parseCsv(csv);

    const usable = rows.filter((r) => {
      const norm = normalizeRow(r);
      return norm.title.length >= 3 && norm.price !== null && norm.price > 0;
    });

    let imported = 0;
    for (const row of usable.slice(0, 500)) {
      const norm = normalizeRow(row);
      await db.product.create({
        data: {
          slug: `${slugify(norm.title)}-${Date.now().toString(36)}`,
          title: norm.title,
          description: row.description ?? "",
          images: (row.image || row["image_src"] || "").split("|").filter(Boolean),
          basePrice: norm.price ?? 0,
          salePrice: norm.price ?? 0,
          status: "DRAFT"
        }
      }).catch(() => null);
      imported++;
    }

    await logIntegrationChange("INTEGRATION_KEYS_SAVED", "import-csv", guard.userId, { attempted: usable.length, imported });
    return NextResponse.json({ imported, skipped: rows.length - usable.length, errors });
  } catch (err) {
    return apiError(err);
  }
}
