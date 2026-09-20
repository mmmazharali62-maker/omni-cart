// Order confirmation email (spec section 8/15).
export function renderOrderConfirmed(data: {
  orderNumber: string;
  items: Array<{ title: string; quantity: number; price: string }>;
  total: string;
  etaWindow?: string;
}) {
  const list = data.items.map((i) => `${i.quantity}x ${i.title} - ${i.price}`).join("\n");
  return {
    subject: `Order confirmed - ${data.orderNumber}`,
    body: `Thanks for your order!\n\n${list}\n\nTotal: ${data.total}\nOrder number: ${data.orderNumber}${data.etaWindow ? `\nEstimated delivery: ${data.etaWindow}` : ""}`
  };
}
