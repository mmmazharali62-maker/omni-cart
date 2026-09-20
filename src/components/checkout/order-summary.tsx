import { formatMoney } from "@/lib/utils";

// Read-only order summary for the checkout sidebar (spec section 5).
export function OrderSummary({
  items,
  subtotal,
  discount,
  shipping,
  tax,
  total,
  currency = "USD"
}: {
  items: Array<{ title: string; quantity: number; price: number }>;
  subtotal: number; discount: number; shipping: number; tax: number; total: number;
  currency?: "USD" | "GBP";
}) {
  return (
    <div className="glass p-5 h-fit sticky top-24">
      <h2 className="font-medium mb-4">Order summary</h2>
      <ul className="text-sm space-y-2 max-h-48 overflow-auto">
        {items.map((i, idx) => (
          <li key={idx} className="flex justify-between gap-2">
            <span className="text-white/70 truncate">{i.quantity}x {i.title}</span>
            <span>{formatMoney(i.price * i.quantity, currency)}</span>
          </li>
        ))}
      </ul>
      <dl className="space-y-2 text-sm mt-4 pt-4 border-t border-white/10">
        <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>{formatMoney(subtotal, currency)}</dd></div>
        {discount > 0 && <div className="flex justify-between text-emerald-400"><dt>Discount</dt><dd>-{formatMoney(discount, currency)}</dd></div>}
        <div className="flex justify-between"><dt className="text-white/60">Shipping</dt><dd>{shipping === 0 ? "Free" : formatMoney(shipping, currency)}</dd></div>
        <div className="flex justify-between"><dt className="text-white/60">Tax</dt><dd>{formatMoney(tax, currency)}</dd></div>
        <div className="flex justify-between border-t border-white/10 pt-2 font-medium">
          <dt>Total</dt><dd>{formatMoney(total, currency)}</dd>
        </div>
      </dl>
    </div>
  );
}
