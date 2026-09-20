import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { PROVIDERS } from "@/lib/integrations/catalog";
import { computeAllStatuses, overallReadiness } from "@/lib/integrations/status";
import { saveKeysSchema, validFieldNames } from "@/lib/integrations/validation";
import { logIntegrationChange } from "@/lib/integrations/audit";
import { saveProviderKeys } from "@/lib/integrations/store";

// GET: full status board (no secrets, only masked shapes).
export async function GET() {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const rows = await db.integrationSetting.findMany().catch(() => []);
  const settings: Record<string, { savedFields: string[]; isActive: boolean; lastTestedAt: string | null; lastTestStatus: string | null; lastTestMessage: string | null }> = {};
  for (const row of rows) {
    settings[row.provider] = {
      savedFields: row.keys && typeof row.keys === "object" ? Object.keys(row.keys as object) : [],
      isActive: row.isActive,
      lastTestedAt: row.lastTestedAt?.toISOString() ?? null,
      lastTestStatus: row.lastTestStatus as string | null,
      lastTestMessage: row.lastTestMessage
    };
  }
  const statuses = computeAllStatuses(PROVIDERS, settings);
  return NextResponse.json({ providers: statuses, overall: overallReadiness(statuses) });
}

// POST: save (encrypt) a provider's credentials.
export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin(["ADMIN"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { provider, keys } = saveKeysSchema.parse(await req.json());
    if (!validFieldNames(provider, Object.keys(keys))) {
      return NextResponse.json({ error: "Unknown field name for this provider" }, { status: 400 });
    }

    await saveProviderKeys(provider, keys, guard.userId);
    await logIntegrationChange("INTEGRATION_KEYS_SAVED", provider, guard.userId, { fields: Object.keys(keys) });
    return NextResponse.json({ ok: true, message: "Credentials encrypted and saved." });
  } catch (err) {
    return apiError(err);
  }
}
