import Link from "next/link";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/glass-panel";
import { formatMoney } from "@/lib/utils";

// Customer dashboard (spec section 6): profile + order/review/wishlist shortcuts.
export default async function AccountPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as any)?.id;

  const [orderCount, wishlistCount, reviewCount, recent, spentAgg] = userId
    ? await Promise.all([
        db.order.count({ where: { userId } }),
        db.wishlistItem.count({ where: { userId } }),
        db.review.count({ where: { userId } }),
        db.order.findFirst({ where: { userId }, orderBy: { createdAt: "desc" } }),
        db.order.aggregate({ _sum: { grandTotal: true }, where: { userId, status: { notIn: ["PENDING", "FAILED", "CANCELLED"] } } })
      ]).catch(() => [0, 0, 0, null, null as any])
    : [0, 0, 0, null, null];

  return (
    <section className="mx-4 mt-12 max-w-4xl">
      <h1 className="text-2xl font-semibold mb-2">Account</h1>
      {!userId ? (
        <>
          <p className="text-white/60 text-sm mb-8">Sign in to see your orders, wishlist, and reviews.</p>
          <GlassPanel className="py-16 text-center">
            <p className="text-white/60 text-sm">Authentication UI (sign-in/sign-up) is the next phase.</p>
            <p className="text-white/40 text-xs mt-2">NextAuth is wired; pages coming up.</p>
          </GlassPanel>
        </>
      ) : (
        <>
          <p className="text-white/60 text-sm mb-8">{session?.user?.email}</p>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Orders", value: String(orderCount), href: "/account/orders" },
              { label: "Wishlist", value: String(wishlistCount), href: "/account/wishlist" },
              { label: "Reviews", value: String(reviewCount), href: "/account/reviews" },
              { label: "Lifetime spend", value: formatMoney(spentAgg?._sum?.grandTotal?.toNumber?.() ?? 0), href: "/account/orders" }
            ].map((t) => (
              <Link key={t.label} href={t.href}>
                <GlassPanel className="p-5">
                  <p className="text-xs text-white/50">{t.label}</p>
                  <p className="text-xl font-semibold mt-2">{t.value}</p>
                </GlassPanel>
              </Link>
            ))}
          </div>
          {recent && (
            <Link href={`/account/orders/${recent.id}`}>
              <GlassPanel className="mt-6 flex justify-between items-center">
                <div>
                  <p className="text-sm font-medium">Latest order {recent.id.slice(0, 8)}</p>
                  <p className="text-xs text-white/50 mt-1">{recent.createdAt.toDateString()} · {recent.status.replace(/_/g, " ")}</p>
                </div>
                <p className="text-sm">{formatMoney(Number(recent.grandTotal), recent.currency)}</p>
              </GlassPanel>
            </Link>
          )}
          <div className="mt-6 flex gap-4 text-sm">
            <Link href="/account/addresses" className="text-brand-400">Addresses</Link>
            <Link href="/account/notifications" className="text-brand-400">Notifications</Link>
          </div>
        </>
      )}
    </section>
  );
}
