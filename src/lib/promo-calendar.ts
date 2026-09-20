// Seasonal promo calendar (spec section 15): planned campaigns for US/UK.
export type Promo = {
  id: string; name: string;
  startMonthDay: string; // MM-DD
  endMonthDay: string;
  discountPct: number;
  markets: Array<"US" | "GB">;
};

export const PROMO_CALENDAR: Promo[] = [
  { id: "new-year", name: "New Year Sale", startMonthDay: "12-26", endMonthDay: "01-05", discountPct: 15, markets: ["US", "GB"] },
  { id: "valentines", name: "Valentine's Deals", startMonthDay: "02-01", endMonthDay: "02-14", discountPct: 10, markets: ["US", "GB"] },
  { id: "spring", name: "Spring Refresh", startMonthDay: "03-20", endMonthDay: "03-27", discountPct: 12, markets: ["US", "GB"] },
  { id: "memorial", name: "Memorial Day", startMonthDay: "05-23", endMonthDay: "05-26", discountPct: 20, markets: ["US"] },
  { id: "jubilee", name: "Spring Bank Sale", startMonthDay: "05-23", endMonthDay: "05-26", discountPct: 15, markets: ["GB"] },
  { id: "prime-rival", name: "Summer Mega Sale", startMonthDay: "07-07", endMonthDay: "07-13", discountPct: 20, markets: ["US", "GB"] },
  { id: "black-friday", name: "Black Friday", startMonthDay: "11-24", endMonthDay: "11-30", discountPct: 30, markets: ["US", "GB"] },
  { id: "boxing-day", name: "Boxing Day", startMonthDay: "12-26", endMonthDay: "12-31", discountPct: 25, markets: ["GB"] }
];

export function activePromos(now = new Date(), market: "US" | "GB"): Promo[] {
  const mmdd = `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
  return PROMO_CALENDAR.filter((p) => p.markets.includes(market))
    .filter((p) => {
      // Wrap-safe windows (e.g. New Year Sale crosses 12-31 -> 01-05).
      if (p.startMonthDay <= p.endMonthDay) return p.startMonthDay <= mmdd && mmdd <= p.endMonthDay;
      return mmdd >= p.startMonthDay || mmdd <= p.endMonthDay;
    });
}

export function nextPromo(now = new Date(), market: "US" | "GB"): Promo | null {
  const active = activePromos(now, market);
  if (active.length > 0) return active[0];
  const upcoming = PROMO_CALENDAR
    .filter((p) => p.markets.includes(market) && p.startMonthDay > `${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`)
    .sort((a, b) => a.startMonthDay.localeCompare(b.startMonthDay));
  return upcoming[0] ?? null;
}
