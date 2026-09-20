// Pure metric helpers (spec section 13/14) - unit-testable, no DB dependency.
export function conversionRate(paidOrders: number, sessions: number): number {
  if (sessions <= 0) return 0;
  return Math.round((paidOrders / sessions) * 10000) / 100; // %
}

export function averageOrderValue(totalRevenue: number, orderCount: number): number {
  if (orderCount <= 0) return 0;
  return Math.round((totalRevenue / orderCount) * 100) / 100;
}

export function percentChange(current: number, previous: number): number {
  if (previous === 0) return current > 0 ? 100 : 0;
  return Math.round(((current - previous) / previous) * 1000) / 10;
}

export function revenueSeriesByDay(
  rows: Array<{ date: Date; amount: number }>,
  days: number
): Array<{ day: string; total: number }> {
  const byDay = new Map<string, number>();
  const out: Array<{ day: string; total: number }> = [];
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    d.setDate(d.getDate() - i);
    byDay.set(d.toISOString().slice(0, 10), 0);
  }
  for (const r of rows) {
    const key = r.date.toISOString().slice(0, 10);
    if (byDay.has(key)) byDay.set(key, (byDay.get(key) ?? 0) + r.amount);
  }
  for (const [day, total] of byDay) out.push({ day, total: Math.round(total * 100) / 100 });
  return out;
}
