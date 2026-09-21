// Back-in-stock alerts (spec section 15): dedupe + notify-once logic.
export type AlertRow = { variantId: string; email: string; notifiedAt: Date | null };

// Eligible = not notified yet and stock actually came back.
export function shouldNotify(alert: AlertRow, currentStock: number): boolean {
  return currentStock > 0 && alert.notifiedAt === null;
}

// Group alerts per variant so one restock = one batched notification pass.
export function pendingAlerts(alerts: AlertRow[]): Map<string, AlertRow[]> {
  const grouped = new Map<string, AlertRow[]>();
  for (const a of alerts.filter((x) => x.notifiedAt === null)) {
    const list = grouped.get(a.variantId) ?? [];
    list.push(a);
    grouped.set(a.variantId, list);
  }
  return grouped;
}

export function normalizeAlertEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Cap list size per restock batch (avoid provider burst limits).
export function batchCap(alerts: AlertRow[], max = 500): AlertRow[] {
  return alerts.slice(0, max);
}
