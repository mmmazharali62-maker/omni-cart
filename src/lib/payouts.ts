// Supplier payout math (spec section 11): COGS owed per shipment.
export type PayoutLine = { supplierId: string; shipmentId: string; costCents: number };

export function payoutTotals(lines: PayoutLine[]): Array<{ supplierId: string; dueCents: number; shipments: number }> {
  const bySupplier = new Map<string, { dueCents: number; shipments: number }>();
  for (const l of lines) {
    const agg = bySupplier.get(l.supplierId) ?? { dueCents: 0, shipments: 0 };
    agg.dueCents += Math.max(0, l.costCents);
    agg.shipments++;
    bySupplier.set(l.supplierId, agg);
  }
  return [...bySupplier.entries()].map(([supplierId, v]) => ({ supplierId, ...v }));
}

// Pay after delivery + return window (day 32), not before.
export function payableOn(fulfilledAt: Date, returnWindowDays = 30): Date {
  const d = new Date(fulfilledAt);
  d.setDate(d.getDate() + returnWindowDays + 2);
  return d;
}

export function isPayable(now: Date, fulfilledAt: Date): boolean {
  return now >= payableOn(fulfilledAt);
}

// Disputed payouts freeze that supplier's whole batch.
export function excludeDisputed(lines: PayoutLine[], disputedSupplierIds: string[]): PayoutLine[] {
  const blocked = new Set(disputedSupplierIds);
  return lines.filter((l) => !blocked.has(l.supplierId));
}
