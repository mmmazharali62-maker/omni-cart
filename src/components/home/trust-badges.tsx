// Trust strip under the hero (spec section 1: UK/US buyer confidence).
const BADGES = [
  ["Secure Checkout", "Stripe-protected payments"],
  ["30-Day Returns", "No-questions refunds"],
  ["Fast US/UK Shipping", "5-14 day delivery"],
  ["Buyer Protection", "Full refund guarantee"]
] as const;

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mx-4 mt-8">
      {BADGES.map(([title, sub]) => (
        <div key={title} className="glass p-4 text-center">
          <p className="text-sm font-medium">{title}</p>
          <p className="text-xs text-white/50 mt-1">{sub}</p>
        </div>
      ))}
    </div>
  );
}
