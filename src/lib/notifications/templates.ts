// Customer-facing notification templates (spec section 21).
// Each template returns subject + body; the channel adapters (email/sms/push) send them.

export type TemplateData = {
  orderId?: string;
  trackingNumber?: string;
  carrier?: string;
  status?: string;
  reason?: string;
};

const store = { name: "Omni Cart", url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://omnicart1.netlify.app" };

export const templates: Record<string, { subject: string; body: (d: TemplateData) => string }> = {
  order_received: {
    subject: `We've received your order - ${store.name}`,
    body: (d) => `Thanks for shopping with ${store.name}! Order ${d.orderId} is confirmed and being prepared. Track it anytime: ${store.url}/account/orders`
  },
  payment_successful: {
    subject: `Payment confirmed`,
    body: (d) => `Payment for order ${d.orderId} went through successfully. We're getting it ready to ship!`
  },
  order_shipped: {
    subject: `Your order has shipped!`,
    body: (d) => `Good news - order ${d.orderId} is on its way${d.trackingNumber ? ` via ${d.carrier}, tracking ${d.trackingNumber}` : ""}.`
  },
  tracking_updated: {
    subject: `Tracking update`,
    body: (d) => `Order ${d.orderId}: status is now "${d.status}". Tracking: ${d.trackingNumber ?? "n/a"}`
  },
  delivered: {
    subject: `Your order was delivered`,
    body: (d) => `Order ${d.orderId} has been delivered. Enjoy! If anything's wrong, reply or visit ${store.url}/help.`
  },
  cancellation: {
    subject: `Order cancelled`,
    body: (d) => `Order ${d.orderId} has been cancelled.${d.reason ? ` Reason: ${d.reason}` : ""}`
  },
  refund: {
    subject: `Refund processed`,
    body: (d) => `We've refunded order ${d.orderId}. It should appear on your statement in 5-10 business days.`
  },
  supplier_failure: {
    subject: `[ADMIN] Supplier fulfillment failure`,
    body: (d) => `Order ${d.orderId} failed supplier fulfillment (${d.reason}). Retry from the admin orders page.`
  }
};

export function renderTemplate(type: string, data: TemplateData) {
  const t = templates[type];
  if (!t) throw new Error(`Unknown template: ${type}`);
  return { subject: t.subject, body: t.body(data) };
}
