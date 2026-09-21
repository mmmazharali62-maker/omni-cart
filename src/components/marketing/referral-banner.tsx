import Link from "next/link";

// Rewards page call-to-action banner (spec section 15).
export function ReferralBanner() {
  return (
    <div className="glass p-6 rounded-2xl text-center bg-gradient-to-r from-brand-500/20 to-brand-700/20">
      <h2 className="text-xl font-semibold">Give $5, get $5</h2>
      <p className="text-sm text-white/60 mt-2">
        Invite friends. They save $5 on their first order over $15; you earn $5 when it delivers.
      </p>
      <Link
        href="/rewards"
        className="inline-block mt-4 bg-brand-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium"
      >
        Get your invite code
      </Link>
    </div>
  );
}
