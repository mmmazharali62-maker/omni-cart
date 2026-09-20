// Email notifications (spec section 21). Provider-agnostic; plug in
// Resend/SendGrid/Postmark etc. via EMAIL_PROVIDER_API_KEY later.
import { renderTemplate, type TemplateData } from "./templates";

export type EmailNotification =
  | "order_received" | "payment_successful" | "order_processing" | "order_shipped"
  | "tracking_updated" | "delivered" | "cancellation" | "refund" | "supplier_failure" | "admin_alert";

export async function sendEmailNotification(type: EmailNotification, to: string, data: TemplateData) {
  const { subject, body } = renderTemplate(type, data);
  // TODO: call email provider API with subject/body.
  console.log(`[email] "${subject}" -> ${to}`);
  console.log(`[email body] ${body}`);
}
