import Link from "next/link";
import { MobileNav } from "@/components/layout/mobile-nav";
import { CartBadge } from "@/components/layout/cart-badge";
import { GlassPanel } from "@/components/ui/glass-panel";

// Consistent Liquid Glass navigation across the whole site (spec section 1).
const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/categories", label: "Categories" },
  { href: "/deals", label: "Deals" },
  { href: "/new-arrivals", label: "New Arrivals" },
  { href: "/best-sellers", label: "Best Sellers" }
];

export function Navbar() {
  return (
    <header className="sticky top-4 z-50 mx-4">
      <GlassPanel className="flex items-center justify-between px-6 py-3">
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Omni Cart
        </Link>
        <nav className="hidden md:flex gap-6 text-sm text-white/80">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="hover:text-white transition-colors">
              {l.label}
            </Link>
          ))}
        </nav>
        <div className="flex items-center gap-4 text-sm">
          <Link href="/search" aria-label="Search">Search</Link>
          <Link href="/wishlist" aria-label="Wishlist">Wishlist</Link>
          <Link href="/cart" aria-label="Cart">Cart</Link>
          <Link href="/account" aria-label="Account">Account</Link>
        </div>
      </GlassPanel>
          <MobileNav />
          <CartBadge />
    </header>
  );
}
