// Deep health probes (spec section 17/26): behind /api/health.
export type ProbeResult = { name: string; ok: boolean; detail: string };

export async function probe(name: string, fn: () => Promise<boolean>, detailOk = "ok", detailFail = "unreachable"): Promise<ProbeResult> {
  try {
    const ok = await fn();
    return { name, ok, detail: ok ? detailOk : detailFail };
  } catch (err) {
    return { name, ok: false, detail: err instanceof Error ? err.message.slice(0, 120) : detailFail };
  }
}

export function overallStatus(results: ProbeResult[]): "ok" | "degraded" | "down" {
  if (results.length === 0) return "down";
  const failures = results.filter((r) => !r.ok).length;
  if (failures === 0) return "ok";
  if (failures >= results.length) return "down";
  return "degraded";
}
