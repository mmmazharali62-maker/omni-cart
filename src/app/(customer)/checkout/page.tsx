import { CheckoutForm } from "@/components/checkout/checkout-form";

// Checkout page (spec section 5): 3-step flow -> Stripe.
export default function CheckoutPage() {
  return (
    <section className="mx-4 mt-12 max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Checkout</h1>
      <CheckoutForm />
    </section>
  );
}
