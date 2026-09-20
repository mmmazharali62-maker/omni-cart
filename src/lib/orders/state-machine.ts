// Order state machine (spec section 7).
// PENDING -> PAID -> PROCESSING -> FULFILLED -> SHIPPED -> IN_TRANSIT -> DELIVERED
// plus CANCELLED / REFUNDED / PARTIALLY_REFUNDED / FAILED side-paths.

export type OrderState =
  | "PENDING" | "PAID" | "PROCESSING" | "FULFILLED" | "SHIPPED" | "IN_TRANSIT" | "DELIVERED"
  | "CANCELLED" | "REFUNDED" | "PARTIALLY_REFUNDED" | "FAILED";

const transitions: Record<OrderState, OrderState[]> = {
  PENDING: ["PAID", "CANCELLED", "FAILED"],
  PAID: ["PROCESSING", "REFUNDED", "CANCELLED"],
  PROCESSING: ["FULFILLED", "REFUNDED", "FAILED"],
  FULFILLED: ["SHIPPED", "REFUNDED"],
  SHIPPED: ["IN_TRANSIT", "PARTIALLY_REFUNDED"],
  IN_TRANSIT: ["DELIVERED", "PARTIALLY_REFUNDED"],
  DELIVERED: ["REFUNDED", "PARTIALLY_REFUNDED"],
  CANCELLED: [],
  REFUNDED: [],
  PARTIALLY_REFUNDED: [],
  FAILED: ["PENDING"] // retry path: failed fulfillment/payment can re-enter as pending
};

export function canTransition(from: OrderState, to: OrderState): boolean {
  return transitions[from]?.includes(to) ?? false;
}
