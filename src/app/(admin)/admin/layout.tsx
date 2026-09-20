import Link from "next/link";

// Admin operations center (spec section 14). Route group is protected by
// middleware (see src/middleware.ts) checking role === "ADMIN" | manager roles.
const links = [
  ["Dashboard", "/admin"],
  ["Products", "/admin/products"],
  ["Suppliers", "/admin/suppliers"],
  ["Orders", "/admin/orders"],
  ["Reviews", "/admin/reviews"],
  ["Customers", "/admin/customers"],
  ["Inventory", "/admin/inventory"],
  ["Pricing", "/admin/pricing"],
  ["Analytics", "/admin/analytics"],
  ["Settings", "/admin/settings"]
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      <aside className="w-56 p-4 glass m-4 h-fit sticky top-4">
        <p className="font-semibold mb-4 px-2">Omni Cart Admin</p>
        <nav className="flex flex-col gap-1 text-sm text-white/80">
          {links.map(([label, href]) => (
            <Link key={href} href={href} className="px-2 py-2 rounded-lg hover:bg-white/10">
              {label}
            </Link>
          ))}
        </nav>
      </aside>
      <main className="flex-1 p-4">{children}</main>
    </div>
  );
}
