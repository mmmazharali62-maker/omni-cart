// Shipping/tracking email (spec section 19).
export function renderShippingUpdate(data: {
  orderNumber: string;
  carrierLabel: string;
  trackingNumber: string;
  trackingUrl: string;
  etaWindow?: string;
}) {
  return {
    subject: `Your order ${data.orderNumber} has shipped`,
    body: `Good news - your order is on its way via ${data.carrierLabel}.\n\nTracking number: ${data.trackingNumber}\nTrack it here: ${data.trackingUrl}${data.etaWindow ? `\nEstimated delivery: ${data.etaWindow}` : ""}`
  };
}
