import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { ReturnsList } from "@/components/returns/returns-list";
import { pageMeta } from "@/lib/seo-meta";
import { EmptyState } from "@/components/ui/empty-state";

export const metadata = pageMeta("My Returns", "Track your return requests and refunds.");

export default async function ReturnsPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as { id?: string })?.id;

  const returns = userId
    ? await db.returnRequest.findMany({
        where: { userId },
        orderBy: { createdAt: "desc" },
        take: 20
      }).catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-3xl font-semibold">My returns</h1>
      <p className="text-sm text-white/50 mt-1 mb-6">30-day return window on eligible items.</p>
      {userId ? (
        <ReturnsList returns={returns.map((r) => ({ ...r, createdAt: r.createdAt.toISOString(), refundAmount: r.refundAmount ? Number(r.refundAmount) : null }))} />
      ) : (
        <EmptyState title="Sign in to see your returns" message="Or track an order with its ID on the track-order page." />
      )}
    </section>
  );
}
