import Link from "next/link";

const columns = [
  { title: "Shop", links: [["Shop", "/shop"], ["Deals", "/deals"], ["New Arrivals", "/new-arrivals"], ["Best Sellers", "/best-sellers"]] },
  { title: "Account", links: [["Orders", "/account/orders"], ["Wishlist", "/account/wishlist"], ["Addresses", "/account/addresses"]] },
  { title: "Support", links: [["Help/Support", "/help"], ["Track Order", "/account/orders"]] }
];

export function Footer() {
  return (
    <footer className="mt-24 mx-4 mb-6 glass px-8 py-10 text-sm text-white/70">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-white font-semibold text-base">Omni Cart</p>
          <p className="mt-2 max-w-xs">Premium, curated products shipped across the UK and USA.</p>
        </div>
        {columns.map((col) => (
          <div key={col.title}>
            <p className="text-white font-medium mb-3">{col.title}</p>
            <ul className="space-y-2">
              {col.links.map(([label, href]) => (
                <li key={href}><Link href={href} className="hover:text-white">{label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <p className="mt-10 text-white/40">© {new Date().getFullYear()} Omni Cart. All rights reserved.</p>
    </footer>
  );
}
