// Order receipts (spec section 8): plain-text + structured for email/PDF.
export type ReceiptOrder = {
  orderNumber: string; date: string;
  items: Array<{ title: string; quantity: number; unitPrice: number }>;
  subtotal: number; discount: number; shipping: number; tax: number; total: number;
  currency: string;
  paymentLast4?: string;
};

export function renderReceipt(order: ReceiptOrder): string {
  const money = (n: number) => `${order.currency === "GBP" ? "\u00A3" : "$"}${n.toFixed(2)}`;
  const itemLines = order.items
    .map((i) => `  ${i.quantity}x ${i.title} - ${money(i.unitPrice * i.quantity)}`)
    .join("\n");
  return [
    `Omni Cart receipt - order ${order.orderNumber} (${order.date})`,
    "",
    "Items:",
    itemLines,
    "",
    `Subtotal: ${money(order.subtotal)}`,
    order.discount > 0 ? `Discount: -${money(order.discount)}` : null,
    `Shipping: ${order.shipping === 0 ? "Free" : money(order.shipping)}`,
    `Tax: ${money(order.tax)}`,
    `Total: ${money(order.total)}`,
    order.paymentLast4 ? `Paid with card ending ${order.paymentLast4}` : null,
    "",
    "Questions? support@omnicart.example.com"
  ].filter(Boolean).join("\n");
}

// Refund receipts show the refunded portion only.
export function renderRefundReceipt(order: ReceiptOrder, refundAmount: number): string {
  const money = (n: number) => `${order.currency === "GBP" ? "\u00A3" : "$"}${n.toFixed(2)}`;
  return [
    `Omni Cart refund - order ${order.orderNumber}`,
    `Refunded: ${money(refundAmount)}`,
    `Original total: ${money(order.total)}`,
    "Refunds appear on your statement within 5-10 business days."
  ].join("\n");
}
