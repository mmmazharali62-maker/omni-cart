// Scheduled export windows (spec section 14/26): accounting-friendly timing.
export type ExportWindow = "daily" | "weekly" | "monthly";

// Daily exports land at 06:00 UTC - after the day closes everywhere we sell.
export const DAILY_EXPORT_UTC_HOUR = 6;

export function nextRun(window: ExportWindow, from = new Date()): Date {
  const d = new Date(from);
  d.setUTCMinutes(0, 0, 0);
  if (window === "daily") {
    d.setUTCHours(DAILY_EXPORT_UTC_HOUR);
    if (d <= from) d.setUTCDate(d.getUTCDate() + 1);
    return d;
  }
  if (window === "weekly") {
    // Mondays 06:00 UTC.
    while (d.getUTCDay() !== 1) d.setUTCDate(d.getUTCDate() + 1);
    d.setUTCHours(DAILY_EXPORT_UTC_HOUR);
    if (d <= from) d.setUTCDate(d.getUTCDate() + 7);
    return d;
  }
  // Monthly: 1st of next month.
  d.setUTCDate(1);
  d.setUTCHours(DAILY_EXPORT_UTC_HOUR);
  d.setUTCMonth(d.getUTCMonth() + 1);
  return d;
}

// Export filename: omnicart-invoices-2026-09.csv
export function exportFilename(kind: string, at = new Date()): string {
  return `omnicart-${kind}-${at.toISOString().slice(0, 10)}.csv`;
}

// Retention: keep 24 monthly snapshots, then archive.
export function shouldPrune(exportDate: Date, months = 24): boolean {
  const age = (Date.now() - exportDate.getTime()) / (30.4 * 86_400_000);
  return age > months;
}
