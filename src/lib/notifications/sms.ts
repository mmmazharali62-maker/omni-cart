// SMS notifications (spec section 21). Uses Twilio when SMS_PROVIDER_* env vars
// are set; logs otherwise so dev flows work without credentials.
import { renderTemplate, type TemplateData } from "./templates";

// Only high-urgency events text customers - SMS costs money and attention.
const SMS_TYPES = new Set(["order_shipped", "delivered", "cancellation", "refund"]);

export async function sendSmsNotification(type: string, to: string, data: TemplateData) {
  if (!SMS_TYPES.has(type)) return { sent: false as const, reason: "not_sms_type" };

  const accountSid = process.env.SMS_PROVIDER_ACCOUNT_SID;
  const authToken = process.env.SMS_PROVIDER_AUTH_TOKEN;
  const from = process.env.SMS_PROVIDER_FROM_NUMBER;

  if (!accountSid || !authToken || !from) {
    console.log(`[sms:dev] "${type}" -> ${to}`);
    return { sent: false as const, reason: "no_provider" };
  }

  const { body } = renderTemplate(type, data);
  const res = await fetch(`https://api.twilio.com/2010-04-01/Accounts/${accountSid}/Messages.json`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${Buffer.from(`${accountSid}:${authToken}`).toString("base64")}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({ From: from, To: to, Body: body.slice(0, 320) })
  });

  if (!res.ok) {
    console.error(`[sms] provider error ${res.status} for ${type} -> ${to}`);
    return { sent: false as const, reason: "provider_error" };
  }
  return { sent: true as const };
}
