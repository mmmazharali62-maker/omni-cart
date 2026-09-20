import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";

// Checkout page (spec section 5): guest/account, addresses, shipping method,
// order summary, payment - all in Liquid Glass steps.
const steps = [
  "Contact & Account (guest or sign-in)",
  "Shipping Address",
  "Billing Address",
  "Shipping Method",
  "Order Summary",
  "Payment (Stripe, server-side)"
];

export default function CheckoutPage() {
  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <GlassPanel>
        <ol className="space-y-4">
          {steps.map((s, i) => (
            <li key={s} className="flex gap-3 text-white/70 text-sm">
              <span className="w-6 h-6 rounded-full glass flex items-center justify-center text-xs shrink-0">{i + 1}</span>
              {s}
              <span className="ml-auto text-white/40 text-xs">TODO</span>
            </li>
          ))}
        </ol>
        <Button variant="primary" className="mt-8 w-full">Pay securely via Stripe</Button>
        <p className="text-xs text-white/40 mt-3 text-center">
          Payment processed server-side; card details never touch our servers.
        </p>
      </GlassPanel>
    </section>
  );
}
