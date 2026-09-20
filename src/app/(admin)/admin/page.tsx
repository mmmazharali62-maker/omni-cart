import { GlassPanel } from "@/components/ui/glass-panel";
import { getDashboardStats, getDailySalesSeries, getTopProducts } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";
import { AdminSalesChart, AdminTopProducts } from "@/components/admin/charts";

// Admin Dashboard (spec section 14): live stats + charts.
export default async function AdminDashboardPage() {
  const [stats, series, top] = await Promise.all([
    getDashboardStats().catch(() => null),
    getDailySalesSeries(30).catch(() => []),
    getTopProducts(10).catch(() => [])
  ]);

  if (!stats) {
    return (
      <section className="glass p-8">
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-white/60 mt-2">
          Database not connected yet. Run `npx prisma migrate dev` with a valid
          DATABASE_URL to see live revenue, order, and inventory data here.
        </p>
      </section>
    );
  }

  const tiles = [
    { label: "Revenue (all time)", value: formatMoney(stats.revenue) },
    { label: "Orders (last 7d)", value: String(stats.orders.last7d) },
    { label: "Avg. Order Value", value: formatMoney(stats.averageOrderValue) },
    { label: "Customers", value: String(stats.customers) },
    { label: "Active Products", value: String(stats.activeProducts) },
    { label: "Refunds", value: String(stats.refunds) },
    { label: "Failed Orders", value: String(stats.failedOrders) },
    { label: "Low-Stock Variants", value: String(stats.lowStockVariants) }
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {tiles.map((t) => (
          <GlassPanel key={t.label} className="p-5">
            <p className="text-xs text-white/50">{t.label}</p>
            <p className="text-2xl font-semibold mt-2">{t.value}</p>
          </GlassPanel>
        ))}
      </div>
      <div className="mt-8 grid lg:grid-cols-2 gap-4">
        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Daily Sales (30 days)</h2>
          <AdminSalesChart data={series} />
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Top Products</h2>
          <AdminTopProducts products={top} />
        </GlassPanel>
      </div>
    </section>
  );
}
