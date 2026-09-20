// Cart totals panel (spec section 4): totals, shipping notice, CTA.
export function CartSummary({
  subtotal,
  discount,
  shipping,
  tax,
  total,
  currency,
  currencySymbol = "$"
}: {
  subtotal: number; discount: number; shipping: number; tax: number; total: number;
  currency: string; currencySymbol?: string;
}) {
  const money = (n: number) => `${currencySymbol}${n.toFixed(2)}`;
  return (
    <div className="glass p-5 h-fit sticky top-24">
      <h2 className="font-medium mb-4">Order summary</h2>
      <dl className="space-y-2 text-sm">
        <div className="flex justify-between"><dt className="text-white/60">Subtotal</dt><dd>{money(subtotal)}</dd></div>
        {discount > 0 && (
          <div className="flex justify-between text-emerald-400"><dt>Discount</dt><dd>-{money(discount)}</dd></div>
        )}
        <div className="flex justify-between"><dt className="text-white/60">Shipping</dt><dd>{shipping === 0 ? "Free" : money(shipping)}</dd></div>
        <div className="flex justify-between"><dt className="text-white/60">Tax</dt><dd>{money(tax)}</dd></div>
        <div className="flex justify-between border-t border-white/10 pt-2 font-medium text-base">
          <dt>Total</dt><dd>{money(total)} <span className="text-xs text-white/50">{currency}</span></dd>
        </div>
      </dl>
    </div>
  );
}
