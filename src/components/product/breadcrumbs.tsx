import Link from "next/link";

// Breadcrumb trail + schema.org (spec section 2/3).
export function Breadcrumbs({ items }: { items: Array<{ label: string; href?: string }> }) {
  return (
    <nav aria-label="Breadcrumb" className="text-xs text-white/50 mb-4">
      <ol className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <li key={i} className="flex gap-1">
            {item.href ? (
              <Link href={item.href} className="hover:text-white">{item.label}</Link>
            ) : (
              <span className="text-white/70">{item.label}</span>
            )}
            {i < items.length - 1 && <span aria-hidden="true">/</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
