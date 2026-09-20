// Email notifications (spec section 21). Provider-agnostic; plug in
// Resend/SendGrid/Postmark etc. via EMAIL_PROVIDER_API_KEY later.

export type EmailNotification =
  | "order_received" | "payment_successful" | "order_processing" | "order_shipped"
  | "tracking_updated" | "delivered" | "cancellation" | "refund" | "supplier_failure" | "admin_alert";

export async function sendEmailNotification(type: EmailNotification, to: string, data: Record<string, unknown>) {
  // TODO: call email provider API.
  console.log(`[email] ${type} -> ${to}`, data);
}
