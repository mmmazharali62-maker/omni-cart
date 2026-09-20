import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { testProviderSchema } from "@/lib/integrations/validation";
import { resolveProviderConfig } from "@/lib/integrations/store";
import { markTested } from "@/lib/integrations/store";
import { logIntegrationChange } from "@/lib/integrations/audit";
import { TESTERS } from "@/lib/integrations";

// POST: run a provider's live test-connection (env fallback + stored keys).
export async function POST(req: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const { provider } = testProviderSchema.parse(await req.json());
    const tester = TESTERS[provider];
    if (!tester) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

    const config = await resolveProviderConfig(provider);
    const result = await tester(config);

    await markTested(provider, result.ok, result.message).catch(() => null);
    await logIntegrationChange("INTEGRATION_TESTED", provider, guard.userId, { ok: result.ok });
    return NextResponse.json(result);
  } catch (err) {
    return apiError(err);
  }
}
