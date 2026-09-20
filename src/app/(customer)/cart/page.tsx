import { GlassPanel } from "@/components/ui/glass-panel";
import { Button } from "@/components/ui/button";
import { FreeShippingProgress } from "@/components/cart/free-shipping-progress";
import Link from "next/link";

// Cart page (spec section 4). Static empty-state scaffold; once the cart API
// stores guest carts this hydrates lines and totals server-side.
export default function CartPage() {
  const empty = true; // TODO: hydrate from cart storage once populated.
  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-6">Your Cart</h1>
      {empty ? (
        <GlassPanel className="text-center py-16">
          <p className="text-white/60">Your cart is empty.</p>
          <Link href="/shop"><Button variant="primary" className="mt-6">Start Shopping</Button></Link>
        </GlassPanel>
      ) : (
        <div className="grid md:grid-cols-3 gap-6">
          <div className="md:col-span-2 space-y-4">{/* CartLineRow list */}</div>
          <div className="space-y-4">
            <FreeShippingProgress remaining={50} />
            <GlassPanel>
              <h2 className="font-medium mb-4">Order Summary</h2>
              {/* subtotal, discount, shipping, tax, grand total + coupon input */}
            </GlassPanel>
            <Button variant="primary" className="w-full">Proceed to Checkout</Button>
          </div>
        </div>
      )}
    </section>
  );
}
