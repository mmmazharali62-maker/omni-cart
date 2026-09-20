"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { FreeShippingProgress } from "@/components/cart/free-shipping-progress";
import { formatMoney } from "@/lib/utils";

type CartItem = {
  variantId: string; productId: string; title: string; slug: string;
  sku: string; unitPrice: number; quantity: number;
};
type CartState = {
  items: CartItem[]; subtotal: number; discountTotal: number; shippingTotal: number;
  taxTotal: number; grandTotal: number; freeShippingRemaining: number;
};

export function CartView() {
  const [cart, setCart] = useState<CartState | null>(null);
  const [coupon, setCoupon] = useState("");
  const [couponMsg, setCouponMsg] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setCart(data);
  }, []);

  useEffect(() => { load(); }, [load]);

  async function updateQty(variantId: string, qty: number) {
    if (qty < 1) return removeLine(variantId);
    setBusy(true);
    await fetch("/api/cart", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId, quantity: qty, replace: true })
    });
    setBusy(false);
    load();
  }

  async function removeLine(variantId: string) {
    setBusy(true);
    await fetch("/api/cart", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ variantId })
    });
    setBusy(false);
    load();
  }

  async function applyCoupon(e: React.FormEvent) {
    e.preventDefault();
    setCouponMsg("Coupons apply at checkout - enter the code there.");
  }

  if (!cart) {
    return <div className="h-40 rounded-2xl bg-white/10 animate-pulse" />;
  }

  if (cart.items.length === 0) {
    return (
      <div className="glass p-16 text-center">
        <p className="text-white/60">Your cart is empty.</p>
        <Link href="/shop" className="inline-block mt-6 px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm">Start Shopping</Link>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-6">
      <div className="md:col-span-2 space-y-4">
        {cart.items.map((item) => (
          <div key={item.variantId} className="glass p-4 flex items-center gap-4">
            <Link href={`/product/${item.slug}`} className="w-20 h-20 rounded-xl bg-white/10 shrink-0" />
            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.slug}`} className="text-sm hover:text-brand-400">{item.title}</Link>
              <p className="text-xs text-white/50 mt-1">SKU {item.sku}</p>
              <div className="flex gap-3 mt-2 text-xs items-center">
                <button disabled={busy} onClick={() => updateQty(item.variantId, item.quantity - 1)} className="glass w-6 h-6 rounded-md hover:bg-white/10">-</button>
                <span>{item.quantity}</span>
                <button disabled={busy} onClick={() => updateQty(item.variantId, item.quantity + 1)} className="glass w-6 h-6 rounded-md hover:bg-white/10">+</button>
                <button disabled={busy} onClick={() => removeLine(item.variantId)} className="text-white/50 hover:text-white ml-2">Remove</button>
              </div>
            </div>
            <p className="font-semibold">{formatMoney(item.unitPrice * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <FreeShippingProgress remaining={cart.freeShippingRemaining} />
        <div className="glass p-5">
          <h2 className="font-medium mb-4">Order Summary</h2>
          <div className="text-sm space-y-2">
            <p className="flex justify-between text-white/70"><span>Subtotal</span><span>{formatMoney(cart.subtotal)}</span></p>
            {cart.discountTotal > 0 && (
              <p className="flex justify-between text-emerald-400"><span>Discount</span><span>-{formatMoney(cart.discountTotal)}</span></p>
            )}
            <p className="flex justify-between text-white/70"><span>Shipping</span><span>{cart.shippingTotal === 0 ? "FREE" : formatMoney(cart.shippingTotal)}</span></p>
            <p className="flex justify-between text-white/70"><span>Tax</span><span>{formatMoney(cart.taxTotal)}</span></p>
            <p className="flex justify-between font-semibold text-base pt-2 border-t border-white/10"><span>Total</span><span>{formatMoney(cart.grandTotal)}</span></p>
          </div>
          <form onSubmit={applyCoupon} className="flex gap-2 mt-4">
            <input value={coupon} onChange={(e) => setCoupon(e.target.value.toUpperCase())} placeholder="Coupon code" className="flex-1 glass bg-white/5 px-3 py-2 rounded-lg text-sm outline-none" />
            <button className="glass px-3 py-2 rounded-lg text-sm hover:bg-white/10">Apply</button>
          </form>
          {couponMsg && <p className="text-xs text-white/50 mt-2">{couponMsg}</p>}
          <Link href="/checkout" className="block mt-6 w-full text-center px-5 py-3 rounded-lg bg-brand-600 text-white text-sm hover:bg-brand-500 transition-colors">
            Proceed to Checkout
          </Link>
        </div>
      </div>
    </div>
  );
}
