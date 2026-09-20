// Checkout step indicator (spec section 5).
const STEPS = ["Contact", "Shipping", "Payment"] as const;

export function StepsIndicator({ current }: { current: number }) {
  return (
    <ol className="flex gap-2 mb-8 text-xs" aria-label="Checkout steps">
      {STEPS.map((s, i) => (
        <li
          key={s}
          aria-current={current === i + 1 ? "step" : undefined}
          className={`px-3 py-1.5 rounded-full ${
            current === i + 1
              ? "bg-brand-600 text-white"
              : current > i + 1
                ? "bg-emerald-600/30 text-emerald-300"
                : "bg-white/10 text-white/50"
          }`}
        >
          {i + 1}. {s}
        </li>
      ))}
    </ol>
  );
}
