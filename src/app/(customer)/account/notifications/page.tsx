import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { GlassPanel } from "@/components/ui/glass-panel";

export default async function NotificationsPage() {
  const session = await getServerSession(authOptions).catch(() => null);
  const userId = (session?.user as any)?.id;

  const notifications = userId
    ? await db.notification.findMany({ where: { userId }, orderBy: { createdAt: "desc" }, take: 50 }).catch(() => [])
    : [];

  return (
    <section className="mx-4 mt-12 max-w-3xl">
      <h1 className="text-2xl font-semibold mb-6">Notifications</h1>
      {!userId || notifications.length === 0 ? (
        <p className="text-white/50 text-sm">No notifications yet.</p>
      ) : (
        <div className="space-y-3">
          {notifications.map((n) => (
            <GlassPanel key={n.id} className={`p-4 ${n.readAt ? "opacity-60" : ""}`}>
              <p className="text-sm font-medium">{n.type.replace(/_/g, " ")}</p>
              <p className="text-xs text-white/50 mt-1">{n.createdAt.toLocaleString()}</p>
            </GlassPanel>
          ))}
        </div>
      )}
    </section>
  );
}
