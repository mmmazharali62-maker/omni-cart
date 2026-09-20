// Push notifications (spec section 21). Provider TBD (web push / FCM / APNs).
export async function sendPushNotification(userId: string, title: string, body: string) {
  console.log(`[push] -> ${userId}: ${title} - ${body}`);
}
