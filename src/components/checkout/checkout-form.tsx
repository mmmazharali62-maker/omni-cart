"use client";

import { useState } from "react";
import { formatMoney } from "@/lib/utils";

type Totals = { subtotal: number; shippingTotal: number; taxTotal: number; grandTotal: number };
const COUNTRIES = [
  ["US", "United States"],
  ["GB", "United Kingdom"]
] as const;

export function CheckoutForm() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "", fullName: "", line1: "", line2: "", city: "", state: "",
    postalCode: "", country: "US", shippingMethod: "standard", couponCode: ""
  });
  const [totals, setTotals] = useState<Totals | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm({ ...form, [k]: e.target.value });

  function validateStep(s: number): string | null {
    if (s === 1 && !/^\S+@\S+\.\S+$/.test(form.email)) return "Enter a valid email";
    if (s === 2) {
      if (form.fullName.length < 2) return "Enter full name";
      if (form.line1.length < 3) return "Enter street address";
      if (!form.city) return "Enter city";
      if (form.postalCode.length < 2) return "Enter postal code";
    }
    return null;
  }

  function next() {
    const err = validateStep(step);
    if (err) { setError(err); return; }
    setError(null);
    setStep(step + 1);
  }

  async function loadTotals() {
    const res = await fetch("/api/cart");
    const data = await res.json();
    setTotals(data);
    return data;
  }

  async function pay() {
    setBusy(true);
    setError(null);
    const cart = await loadTotals();
    if (!cart.items?.length) {
      setError("Your cart is empty");
      setBusy(false);
      return;
    }
    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        items: cart.items.map((i: any) => ({ variantId: i.variantId, quantity: i.quantity })),
        email: form.email,
        shippingAddress: {
          fullName: form.fullName, line1: form.line1, line2: form.line2 || undefined,
          city: form.city, state: form.state || undefined,
          postalCode: form.postalCode, country: form.country
        },
        shippingMethod: form.shippingMethod,
        couponCode: form.couponCode || undefined
      })
    });
    const data = await res.json();
    setBusy(false);
    if (!res.ok) { setError(data.error ?? "Checkout failed"); return; }
    if (data.checkoutUrl) window.location.href = data.checkoutUrl;
    else setError("Payments not configured yet (Stripe keys needed) - order saved as " + data.orderId?.slice(0, 8));
  }

  const steps = ["Contact", "Shipping", "Payment"];

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 glass p-6">
        <div className="flex gap-2 mb-8 text-xs">
          {steps.map((s, i) => (
            <span key={s} className={`px-3 py-1.5 rounded-full ${step === i + 1 ? "bg-brand-600 text-white" : step > i + 1 ? "bg-emerald-600/30 text-emerald-300" : "bg-white/10 text-white/50"}`}>
              {i + 1}. {s}
            </span>
          ))}
        </div>

        {step === 1 && (
          <div className="space-y-4">
            <h2 className="font-medium">Email for order updates</h2>
            <input value={form.email} onChange={set("email")} type="email" placeholder="you@example.com" className="w-full glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <h2 className="font-medium">Shipping address</h2>
            <input value={form.fullName} onChange={set("fullName")} placeholder="Full name" className="w-full glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
            <input value={form.line1} onChange={set("line1")} placeholder="Street address" className="w-full glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
            <input value={form.line2} onChange={set("line2")} placeholder="Apartment, suite, etc. (optional)" className="w-full glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
            <div className="grid grid-cols-3 gap-3">
              <input value={form.city} onChange={set("city")} placeholder="City" className="glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
              <input value={form.state} onChange={set("state")} placeholder="State/County" className="glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
              <input value={form.postalCode} onChange={set("postalCode")} placeholder="Postcode" className="glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none" />
            </div>
            <select value={form.country} onChange={set("country")} className="w-full glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none">
              {COUNTRIES.map(([code, name]) => <option key={code} value={code}>{name}</option>)}
            </select>
            <div>
              <h3 className="font-medium mb-3 mt-4">Shipping method</h3>
              {[
                ["standard", "Standard (7-14 days) - $5.99, free over $50"],
                ["express", "Express (3-7 days) - $14.99"]
              ].map(([value, label]) => (
                <label key={value} className="flex gap-3 items-center glass bg-white/5 px-4 py-3 rounded-lg mb-2 cursor-pointer text-sm">
                  <input type="radio" name="shipping" value={value} checked={form.shippingMethod === value} onChange={set("shippingMethod")} />
                  {label}
                </label>
              ))}
            </div>
            <input value={form.couponCode} onChange={(e) => setForm({ ...form, couponCode: e.target.value.toUpperCase() })} placeholder="Coupon code (optional)" className="w-full glass bg-white/5 px-4 py-3 rounded-lg text-sm outline-none font-mono" />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-4">
            <h2 className="font-medium">Review & Pay</h2>
            <div className="glass bg-white/5 p-4 rounded-xl text-sm space-y-1 text-white/70">
              <p>{form.email}</p>
              <p>{form.fullName}, {form.line1}{form.line2 ? `, ${form.line2}` : ""}</p>
              <p>{form.city} {form.postalCode}, {form.country}</p>
              <p>{form.shippingMethod === "express" ? "Express shipping" : "Standard shipping"}</p>
            </div>
            <p className="text-xs text-white/50">
              You'll be redirected to Stripe's secure checkout. Card details never touch our servers.
            </p>
          </div>
        )}

        {error && <p className="text-red-400 text-xs mt-4">{error}</p>}

        <div className="flex gap-3 mt-8">
          {step > 1 && <button onClick={() => setStep(step - 1)} className="glass px-5 py-2.5 rounded-lg text-sm hover:bg-white/10">Back</button>}
          {step < 3 && <button onClick={next} className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm flex-1">Continue</button>}
          {step === 3 && (
            <button onClick={pay} disabled={busy} className="px-5 py-2.5 rounded-lg bg-brand-600 text-white text-sm flex-1 disabled:opacity-50">
              {busy ? "Processing..." : `Pay ${totals ? formatMoney(totals.grandTotal) : ""}`}
            </button>
          )}
        </div>
      </div>

      <div className="glass p-5 h-fit">
        <h2 className="font-medium mb-4">Order Summary</h2>
        {totals ? (
          <div className="text-sm space-y-2">
            <p className="flex justify-between text-white/70"><span>Subtotal</span><span>{formatMoney(totals.subtotal)}</span></p>
            <p className="flex justify-between text-white/70"><span>Shipping</span><span>{totals.shippingTotal === 0 ? "FREE" : formatMoney(totals.shippingTotal)}</span></p>
            <p className="flex justify-between text-white/70"><span>Tax</span><span>{formatMoney(totals.taxTotal)}</span></p>
            <p className="flex justify-between font-semibold text-base pt-2 border-t border-white/10"><span>Total</span><span>{formatMoney(totals.grandTotal)}</span></p>
          </div>
        ) : (
          <button onClick={loadTotals} className="text-xs text-white/50 hover:text-white">Load totals</button>
        )}
      </div>
    </div>
  );
}
