// Welcome email for newsletter subscribers (spec section 15).
export function renderNewsletterWelcome(data: { discountCode?: string; discountPct?: number }) {
  const offer = data.discountCode
    ? ` As a thank-you, here's ${data.discountPct ?? 10}% off your first order with code ${data.discountCode} (valid 7 days).`
    : "";
  return {
    subject: "Welcome to Omni Cart",
    body: `Thanks for subscribing! We'll send you deals, new arrivals, and stock updates - nothing else.${offer}`
  };
}
