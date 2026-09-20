"use client";

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip } from "recharts";

export function AdminSalesChart({ data }: { data: Array<{ date: string; revenue: number; orders: number }> }) {
  if (data.length === 0) return <p className="text-white/40 text-sm">No sales data yet.</p>;
  return (
    <ResponsiveContainer width="100%" height={240}>
      <AreaChart data={data} margin={{ top: 4, right: 4, left: 4, bottom: 4 }}>
        <defs>
          <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#5a8dff" stopOpacity={0.35} />
            <stop offset="100%" stopColor="#5a8dff" stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis dataKey="date" stroke="rgba(255,255,255,0.4)" fontSize={11} />
        <YAxis stroke="rgba(255,255,255,0.4)" fontSize={11} />
        <Tooltip
          contentStyle={{ background: "rgba(15,20,35,0.9)", border: "1px solid rgba(255,255,255,0.15)", borderRadius: 12 }}
        />
        <Area type="monotone" dataKey="revenue" stroke="#5a8dff" fill="url(#revenueFill)" strokeWidth={2} />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function AdminTopProducts({ products }: { products: Array<{ title: string; unitsSold: number }> }) {
  if (products.length === 0) return <p className="text-white/40 text-sm">No product sales yet.</p>;
  const max = Math.max(...products.map((p) => p.unitsSold), 1);
  return (
    <ul className="space-y-3">
      {products.map((p) => (
        <li key={p.title}>
          <div className="flex justify-between text-sm mb-1">
            <span className="text-white/80 truncate max-w-[70%]">{p.title}</span>
            <span className="text-white/50">{p.unitsSold} sold</span>
          </div>
          <div className="h-2 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full bg-brand-400" style={{ width: `${(p.unitsSold / max) * 100}%` }} />
          </div>
        </li>
      ))}
    </ul>
  );
}
