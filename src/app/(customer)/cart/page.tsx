import { CartView } from "@/components/cart/cart-view";

// Cart page (spec section 4) - fully functional client view.
export default function CartPage() {
  return (
    <section className="mx-4 mt-12 max-w-5xl">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      <CartView />
    </section>
  );
}
