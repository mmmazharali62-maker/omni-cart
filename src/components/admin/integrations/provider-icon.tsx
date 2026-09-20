// Category icon letter-badge (no external assets, Liquid Glass neutral).
const COLORS = {
  database: "bg-sky-500/20 text-sky-300",
  payments: "bg-emerald-500/20 text-emerald-300",
  supplier: "bg-brand-600/40 text-white",
  notifications: "bg-fuchsia-500/20 text-fuchsia-300"
} as const;

export function ProviderIcon({ category, label }: { category: keyof typeof COLORS; label: string }) {
  return (
    <span className={`w-9 h-9 rounded-xl grid place-items-center font-semibold ${COLORS[category]}`} aria-hidden="true">
      {label.slice(0, 1)}
    </span>
  );
}
