// Email notifications (spec section 21). Uses Resend when EMAIL_PROVIDER_API_KEY
// is set; logs otherwise so dev flows work without credentials.
import { renderTemplate, type TemplateData } from "./templates";

export type EmailNotification =
  | "order_received" | "payment_successful" | "order_processing" | "order_shipped"
  | "tracking_updated" | "delivered" | "cancellation" | "refund" | "supplier_failure" | "admin_alert";

const FROM = process.env.EMAIL_FROM ?? "Omni Cart <orders@omnicart.example.com>";

export async function sendEmailNotification(type: EmailNotification, to: string, data: TemplateData) {
  const { subject, body } = renderTemplate(type, data);
  const apiKey = process.env.EMAIL_PROVIDER_API_KEY; // Resend key (re-api-...)

  if (!apiKey) {
    console.log(`[email:dev] "${subject}" -> ${to}`);
    return { sent: false as const, reason: "no_provider" };
  }

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from: FROM,
      to,
      subject,
      text: body
    })
  });

  if (!res.ok) {
    console.error(`[email] provider error ${res.status} for ${type} -> ${to}`);
    return { sent: false as const, reason: "provider_error" };
  }
  return { sent: true as const };
}
