// Return status notification (spec section 29): standalone template renderer
// so the main templates.ts registry stays untouched.
export type ReturnStatus = "requested" | "approved" | "received" | "refunded" | "rejected";

const COPY: Record<ReturnStatus, { subject: string; body: string }> = {
  requested: {
    subject: "We received your return request",
    body: "Hi {{name}}, we got your return request for order {{orderId}}. Our team reviews it within 24 hours."
  },
  approved: {
    subject: "Your return is approved",
    body: "Good news {{name}} - your return for order {{orderId}} is approved. We'll send return instructions shortly."
  },
  received: {
    subject: "We received your return",
    body: "Hi {{name}}, your return for order {{orderId}} arrived at our warehouse. Your refund is being processed."
  },
  refunded: {
    subject: "Refund issued",
    body: "Hi {{name}}, your refund of {{amount}} for order {{orderId}} has been issued. It should appear in 5-10 business days."
  },
  rejected: {
    subject: "Update on your return request",
    body: "Hi {{name}}, unfortunately we can't approve the return for order {{orderId}}. Reply to this email with any questions."
  }
};

export function renderReturnUpdated(status: ReturnStatus, data: { name?: string; orderId: string; amount?: string }) {
  const t = COPY[status];
  return {
    subject: t.subject,
    body: t.body
      .replace("{{name}}", data.name ?? "there")
      .replace("{{orderId}}", data.orderId.slice(0, 8))
      .replace("{{amount}}", data.amount ?? "")
  };
}
