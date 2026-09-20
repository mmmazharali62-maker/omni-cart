// Free-shipping progress bar (spec section 4).
export function FreeShippingProgress({ remaining }: { remaining: number }) {
  const threshold = 50;
  const pct = Math.min(100, Math.round(((threshold - remaining) / threshold) * 100));
  return (
    <div className="glass p-4">
      <p className="text-sm">
        {remaining > 0
          ? <>Add <span className="font-semibold">{`$${remaining.toFixed(2)}`}</span> more for FREE shipping</>
          : "🎉 You've unlocked FREE shipping!"}
      </p>
      <div className="mt-2 h-2 rounded-full bg-white/10 overflow-hidden">
        <div className="h-full rounded-full bg-brand-400 transition-all" style={{ width: `${pct}%` }} />
      </div>
    </div>
  );
}
