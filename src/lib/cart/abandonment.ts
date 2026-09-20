// Abandoned-cart snapshots (spec section 15/21): pure scoring + email payloads.
export type CartSnapshot = {
  email?: string | null;
  items: Array<{ title: string; slug: string; quantity: number; price: number }>;
  total: number;
  currency: string;
  updatedAt: string;
};

// A cart counts as abandoned when it has items, an email, and sat untouched for the window.
export function isAbandoned(cart: CartSnapshot, now = new Date(), hoursWindow = 24): boolean {
  if (cart.items.length === 0 || !cart.email) return false;
  const age = (now.getTime() - new Date(cart.updatedAt).getTime()) / 3_600_000;
  return age >= hoursWindow;
}

// Most-recovery-potential first: value desc, then recency.
export function rankAbandoned(carts: CartSnapshot[], now = new Date()): CartSnapshot[] {
  return [...carts]
    .filter((c) => isAbandoned(c, now))
    .sort((a, b) => b.total - a.total);
}

export function abandonmentEmailPayload(cart: CartSnapshot): { subject: string; body: string } | null {
  if (cart.items.length === 0) return null;
  const first = cart.items[0];
  const subject = cart.items.length > 1
    ? `You left ${cart.items.length} items in your cart`
    : `Still thinking about "${first.title}"?`;
  return {
    subject,
    body: `Your cart still has: ${cart.items.map((i) => `${i.quantity}x ${i.title}`).join(", ")}. Total ${cart.currency} ${cart.total}. Complete checkout before items sell out.`
  };
}
