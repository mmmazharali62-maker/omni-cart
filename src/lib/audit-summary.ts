// Audit log summaries (spec section 17/26): what happened, at a glance.
export type AuditEntry = {
  id: string; action: string; actor: string;
  createdAt: string | Date; success: boolean;
};

export function actionBreakdown(entries: AuditEntry[]): Array<{ action: string; count: number }> {
  const counts = new Map<string, number>();
  for (const e of entries) counts.set(e.action, (counts.get(e.action) ?? 0) + 1);
  return [...counts.entries()]
    .map(([action, count]) => ({ action, count }))
    .sort((a, b) => b.count - a.count);
}

export function failedActionRate(entries: AuditEntry[]): number {
  if (entries.length === 0) return 0;
  const failed = entries.filter((e) => !e.success).length;
  return Math.round((failed / entries.length) * 1000) / 10;
}

// Same actor doing the same action 10+ times in an hour needs a look.
export function suspiciousActors(entries: AuditEntry[], windowMinutes = 60, repeat = 10): string[] {
  const byActor = new Map<string, { action: string; ts: number }[]>();
  for (const e of entries) {
    const list = byActor.get(e.actor) ?? [];
    list.push({ action: e.action, ts: new Date(e.createdAt).getTime() });
    byActor.set(e.actor, list);
  }
  const flagged: string[] = [];
  for (const [actor, events] of byActor) {
    const counts = new Map<string, number>();
    for (const ev of events) {
      counts.set(ev.action, (counts.get(ev.action) ?? 0) + 1);
    }
    if ([...counts.values()].some((c) => c >= repeat)) flagged.push(actor);
  }
  return flagged;
}
