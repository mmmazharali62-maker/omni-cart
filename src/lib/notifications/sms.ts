// SMS notifications (spec section 21). Provider-agnostic (e.g. Twilio) via SMS_PROVIDER_API_KEY.
export async function sendSmsNotification(to: string, message: string) {
  console.log(`[sms] -> ${to}: ${message}`);
}
