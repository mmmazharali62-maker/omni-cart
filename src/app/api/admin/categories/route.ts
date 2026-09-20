import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(2).max(80),
  parentId: z.string().optional()
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    const categories = await db.category.findMany({ orderBy: { name: "asc" } });
    return NextResponse.json({ categories });
  } catch (err) {
    return apiError(err);
  }
}

export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN", "STORE_MANAGER"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });
    const { name, parentId } = categorySchema.parse(await req.json());
    const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const category = await db.category.create({ data: { name, slug, parentId } }).catch(() => null);
    if (!category) return NextResponse.json({ error: "Category already exists" }, { status: 409 });
    await db.auditLog.create({ data: { userId: guard.userId, action: "admin.category.created", meta: { slug } } });
    return NextResponse.json({ category });
  } catch (err) {
    return apiError(err);
  }
}
