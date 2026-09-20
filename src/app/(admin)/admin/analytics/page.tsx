import { GlassPanel } from "@/components/ui/glass-panel";
import { getDashboardStats, getDailySalesSeries, getTopProducts } from "@/lib/analytics";
import { formatMoney } from "@/lib/utils";
import { AdminSalesChart, AdminTopProducts } from "@/components/admin/charts";

// Analytics (spec section 22): revenue, AOV, product performance.
export default async function AdminAnalyticsPage() {
  const [stats, series, top] = await Promise.all([
    getDashboardStats().catch(() => null),
    getDailySalesSeries(30).catch(() => []),
    getTopProducts(10).catch(() => [])
  ]);

  if (!stats) {
    return (
      <section className="glass p-8">
        <h1 className="text-2xl font-semibold">Analytics</h1>
        <p className="text-white/60 mt-2">Database not connected - stats appear once DATABASE_URL is provisioned.</p>
      </section>
    );
  }

  const tiles = [
    { label: "Revenue (all time)", value: formatMoney(stats.revenue) },
    { label: "Orders (last 30d)", value: String(stats.orders.last30d) },
    { label: "Avg. Order Value", value: formatMoney(stats.averageOrderValue) },
    { label: "Refund Rate", value: `${stats.refunds}/${stats.orders.last30d || 1}` }
  ];

  return (
    <section>
      <h1 className="text-2xl font-semibold mb-6">Analytics</h1>
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
          <h2 className="text-sm font-medium mb-4">Revenue Trend (30 days)</h2>
          <AdminSalesChart data={series} />
        </GlassPanel>
        <GlassPanel>
          <h2 className="text-sm font-medium mb-4">Product Performance</h2>
          <AdminTopProducts products={top} />
        </GlassPanel>
      </div>
      <p className="text-xs text-white/40 mt-6">
        TODO when sales data exists: conversion rate, category performance, supplier performance, cohort retention.
      </p>
    </section>
  );
}
