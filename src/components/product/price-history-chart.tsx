// Price history sparkline (spec section 12): pure SVG, no chart lib.
export function PriceHistoryChart({
  points,
  width = 280,
  height = 64
}: {
  points: Array<{ price: number; capturedAt: string | Date }>;
  width?: number;
  height?: number;
}) {
  if (points.length < 2) {
    return <p className="text-xs text-white/40">Not enough price history yet.</p>;
  }
  const prices = points.map((p) => p.price);
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  const span = max - min || 1;
  const stepX = width / (points.length - 1);

  const path = points
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${height - ((p.price - min) / span) * (height - 8) - 4}`)
    .join(" ");

  const falling = prices[prices.length - 1] <= prices[0];
  const stroke = falling ? "#34d399" : "#f59e0b";

  return (
    <div>
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`Price history: $${min.toFixed(2)} to $${max.toFixed(2)}`}>
        <path d={path} fill="none" stroke={stroke} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
      <p className="text-xs text-white/40">
        30-day range: <span className="text-white/70">${min.toFixed(2)} - ${max.toFixed(2)}</span>
        {falling && <span className="text-emerald-400"> - trending down</span>}
      </p>
    </div>
  );
}
