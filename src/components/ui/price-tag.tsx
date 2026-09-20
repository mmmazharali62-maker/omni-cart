import { formatMoney } from "@/lib/utils";

// Consistent price display: current price + struck-through original when on sale.
export function PriceTag({
  price,
  compareAt,
  currency = "USD"
}: {
  price: number;
  compareAt?: number | null;
  currency?: string;
}) {
  const onSale = compareAt != null && compareAt > price;
  const off = onSale ? Math.round(((compareAt! - price) / compareAt!) * 100) : 0;

  return (
    <span className="flex items-baseline gap-2">
      <span className={onSale ? "text-red-300" : undefined}>{formatMoney(price, currency)}</span>
      {onSale && (
        <>
          <span className="text-white/40 line-through text-sm">{formatMoney(compareAt!, currency)}</span>
          <span className="text-xs text-emerald-400">-{off}%</span>
        </>
      )}
    </span>
  );
}
