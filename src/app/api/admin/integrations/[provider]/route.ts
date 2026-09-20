import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/guard";
import { apiError } from "@/lib/api-error";
import { getProviderDef } from "@/lib/integrations/catalog";
import { clearProvider, getStoredProvider } from "@/lib/integrations/store";
import { maskSecret } from "@/lib/integrations/status";
import { logIntegrationChange } from "@/lib/integrations/audit";

// GET: one provider's settings (masked, never raw secrets over the wire).
export async function GET(_req: NextRequest, { params }: { params: { provider: string } }) {
  const guard = await requireAdmin();
  if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

  const def = getProviderDef(params.provider);
  if (!def) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

  const stored = await getStoredProvider(params.provider);
  if (!stored) return NextResponse.json({ provider: params.provider, saved: {}, active: false });

  const masked: Record<string, string> = {};
  for (const [k, v] of Object.entries(stored.keys)) {
    if (v) masked[k] = maskSecret(v);
  }
  return NextResponse.json({
    provider: params.provider,
    saved: masked,
    active: stored.isActive,
    lastTestedAt: stored.lastTestedAt?.toISOString() ?? null,
    lastTestStatus: stored.lastTestStatus,
    lastTestMessage: stored.lastTestMessage
  });
}

// DELETE: wipe a provider's stored credentials.
export async function DELETE(_req: NextRequest, { params }: { params: { provider: string } }) {
  try {
    const guard = await requireAdmin(["ADMIN"]);
    if (!guard.ok) return NextResponse.json({ error: "Forbidden" }, { status: guard.status });

    const def = getProviderDef(params.provider);
    if (!def) return NextResponse.json({ error: "Unknown provider" }, { status: 404 });

    await clearProvider(params.provider);
    await logIntegrationChange("INTEGRATION_KEYS_CLEARED", params.provider, guard.userId);
    return NextResponse.json({ ok: true, message: "Saved keys cleared." });
  } catch (err) {
    return apiError(err);
  }
}
