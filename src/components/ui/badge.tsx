// Status/label badges (spec section 14 admin + storefront states).
const VARIANTS = {
  neutral: "bg-white/10 text-white/70",
  success: "bg-emerald-500/20 text-emerald-300",
  warning: "bg-amber-500/20 text-amber-300",
  danger: "bg-red-500/20 text-red-300",
  brand: "bg-brand-600/80 text-white"
} as const;

export function Badge({ children, variant = "neutral" }: { children: React.ReactNode; variant?: keyof typeof VARIANTS }) {
  return (
    <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${VARIANTS[variant]}`}>
      {children}
    </span>
  );
}
