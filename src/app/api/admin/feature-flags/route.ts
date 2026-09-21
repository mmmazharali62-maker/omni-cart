import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { DEFAULT_FLAGS } from "@/lib/feature-flags";
import { logIntegrationChange } from "@/lib/integrations/audit";

const patchSchema = z.object({ key: z.string().max(60), enabled: z.boolean() });

// Feature flag management (spec section 26): admin-only kill switches.
export async function GET() {
  const guard = await requireAdmin(["ADMIN"]);
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const row = await db.integrationSetting.findUnique({ where: { provider: "feature-flags" } }).catch(() => null);
  const storedFlags = (row?.keys as Record<string, boolean> | null) ?? {};
  const flags = DEFAULT_FLAGS.map((f) => ({
    ...f,
    enabled: storedFlags[f.key] !== undefined ? storedFlags[f.key] : f.enabled
  }));
  return NextResponse.json({ flags });
}

export async function PATCH(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { key, enabled } = patchSchema.parse(await req.json());
    if (!DEFAULT_FLAGS.some((f) => f.key === key)) {
      return NextResponse.json({ error: "Unknown flag" }, { status: 400 });
    }

    const row = await db.integrationSetting.findUnique({ where: { provider: "feature-flags" } }).catch(() => null);
    const keys = { ...((row?.keys as Record<string, boolean> | null) ?? {}), [key]: enabled };
    await db.integrationSetting.upsert({
      where: { provider: "feature-flags" },
      create: { provider: "feature-flags", keys },
      update: { keys }
    }).catch(() => null);

    await logIntegrationChange("INTEGRATION_KEYS_SAVED", `flag:${key}`, guard.userId, { enabled });
    return NextResponse.json({ ok: true, key, enabled });
  } catch (err) {
    return apiError(err);
  }
}
