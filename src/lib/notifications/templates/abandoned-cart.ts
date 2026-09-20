// Abandoned-cart recovery email (spec section 15/21).
export function renderAbandonedCart(data: {
  firstName?: string;
  items: Array<{ title: string; quantity: number; price: string }>;
  cartUrl: string;
  discountPct?: number;
}) {
  const list = data.items.map((i) => `${i.quantity}x ${i.title} - ${i.price}`).join(", ");
  const nudge = data.discountPct
    ? ` Here's ${data.discountPct}% off if you finish today: code COMEBACK${data.discountPct}.`
    : " Your items may sell out, so don't wait too long!";
  const subject = data.firstName
    ? `${data.firstName}, your cart misses you`
    : data.items.length > 1
      ? `You left ${data.items.length} items in your cart`
      : `Still thinking about "${data.items[0].title}"?`;
  return {
    subject,
    body: `You left ${data.items.length} item${data.items.length > 1 ? "s" : ""} behind: ${list}.${nudge} Finish here: ${data.cartUrl}`
  };
}
