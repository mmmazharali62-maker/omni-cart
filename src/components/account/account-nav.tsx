import Link from "next/link";

// Account sidebar navigation (spec section 6).
const LINKS = [
  ["Overview", "/account"],
  ["Orders", "/account/orders"],
  ["Returns", "/returns"],
  ["Wishlist", "/wishlist"],
  ["Support", "/help"]
] as const;

export function AccountNav({ current }: { current?: string }) {
  return (
    <nav className="glass p-3 h-fit sticky top-24" aria-label="Account">
      <ul className="space-y-1 text-sm">
        {LINKS.map(([label, href]) => (
          <li key={href}>
            <Link
              href={href}
              aria-current={current === href ? "page" : undefined}
              className={`block px-3 py-2 rounded-lg ${current === href ? "bg-brand-600/80" : "hover:bg-white/10"}`}
            >
              {label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
