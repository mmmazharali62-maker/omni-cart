// Retries failed orders with capped, spaced retries (spec section 7/28).
// An order enters FAILED on payment failure/expiry or fulfillment failure; the
// retry job re-opens it as PENDING so payment/fulfillment can be re-attempted,
// but only if it hasn't already been retried too many times (audit-log counted).
import { db } from "@/lib/db";

const MAX_RETRIES = 3;
const MIN_FAILED_AGE_MIN = 15;

export async function runOrderRetryJob() {
  const cutoff = new Date(Date.now() - MIN_FAILED_AGE_MIN * 60 * 1000);
  const failedOrders = await db.order.findMany({
    where: { status: "FAILED", updatedAt: { lte: cutoff } },
    take: 50
  });

  let retried = 0;
  for (const order of failedOrders) {
    const retryCount = await db.auditLog.count({
      where: { orderId: order.id, action: "order.retry.reopened" }
    });
    if (retryCount >= MAX_RETRIES) {
      await db.auditLog.create({
        data: { orderId: order.id, action: "order.retry.exhausted" }
      });
      continue;
    }
    await db.order.update({ where: { id: order.id }, data: { status: "PENDING" } });
    await db.auditLog.create({
      data: { orderId: order.id, action: "order.retry.reopened", meta: { attempt: retryCount + 1 } }
    });
    // TODO: for payment failures, re-issue a Stripe Checkout Session + email the
    // customer a fresh payment link; for fulfillment failures, re-run fulfillOrder.
    retried++;
  }
  return { candidates: failedOrders.length, retried };
}
