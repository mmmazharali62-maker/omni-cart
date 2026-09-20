// Daily admin digest (spec section 14): one-look morning report.
export type DigestInput = {
  date: string;
  ordersCount: number;
  revenueCents: number;
  newCustomers: number;
  pendingReturns: number;
  lowStockCount: number;
  failedSyncs: number;
  topProduct?: string;
};

export function renderDigest(d: DigestInput): { subject: string; body: string } {
  const money = (cents: number) => `$${(cents / 100).toFixed(2)}`;
  const warnings: string[] = [];
  if (d.failedSyncs > 0) warnings.push(`${d.failedSyncs} supplier sync failure(s) - check the suppliers page`);
  if (d.lowStockCount > 0) warnings.push(`${d.lowStockCount} product(s) below the low-stock threshold`);
  if (d.pendingReturns >= 5) warnings.push(`${d.pendingReturns} return request(s) awaiting review`);

  return {
    subject: `Omni Cart daily - ${d.ordersCount} orders, ${money(d.revenueCents)}`,
    body: [
      `Daily summary for ${d.date}:`,
      `- Orders: ${d.ordersCount} (${money(d.revenueCents)})`,
      `- New customers: ${d.newCustomers}`,
      `- Pending returns: ${d.pendingReturns}`,
      `- Low stock: ${d.lowStockCount}`,
      `- Supplier sync failures: ${d.failedSyncs}`,
      d.topProduct ? `- Top seller: ${d.topProduct}` : null,
      warnings.length ? `\nNeeds attention:\n${warnings.map((w) => `! ${w}`).join("\n")}` : "\nAll clear today."
    ].filter(Boolean).join("\n")
  };
}

export function digestSeverity(d: DigestInput): "ok" | "warning" | "critical" {
  if (d.failedSyncs >= 5 || d.lowStockCount >= 20) return "critical";
  if (d.failedSyncs > 0 || d.lowStockCount > 0 || d.pendingReturns >= 5) return "warning";
  return "ok";
}
