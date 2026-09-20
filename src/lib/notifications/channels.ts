// Notification routing (spec section 15/19): who gets told, on which channel.
export type Channel = "email" | "sms" | "admin-email";

export type NotificationEvent =
  | "order_paid" | "order_shipped" | "order_delivered"
  | "refund_issued" | "return_update" | "stock_alert" | "sync_failure" | "fraud_hold";

// Customer events go where the customer expects; ops events go to admins.
export const ROUTING: Record<NotificationEvent, Channel[]> = {
  order_paid: ["email"],
  order_shipped: ["email", "sms"],
  order_delivered: ["email"],
  refund_issued: ["email"],
  return_update: ["email"],
  stock_alert: ["admin-email"],
  sync_failure: ["admin-email"],
  fraud_hold: ["admin-email"]
};

export function channelsFor(event: NotificationEvent): Channel[] {
  return ROUTING[event] ?? ["email"];
}

// SMS is opt-in per customer; drop it when not subscribed.
export function effectiveChannels(event: NotificationEvent, smsOptIn: boolean): Channel[] {
  return channelsFor(event).filter((c) => c !== "sms" || smsOptIn);
}
