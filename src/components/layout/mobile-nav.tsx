"use client";

import { useState } from "react";
import Link from "next/link";

const links = [
  ["Shop", "/shop"],
  ["Categories", "/categories"],
  ["Deals", "/deals"],
  ["New", "/new-arrivals"],
  ["Best Sellers", "/best-sellers"],
  ["Bundles", "/bundles"],
  ["Blog", "/blog"],
  ["Rewards", "/rewards"],
  ["Gift Cards", "/gift-cards"],
  ["Track Order", "/track-order"]
];

export function MobileNav() {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setOpen(!open)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="glass px-3 py-2 rounded-lg"
      >
        <span className="block w-4 h-0.5 bg-white mb-1" />
        <span className="block w-4 h-0.5 bg-white mb-1" />
        <span className="block w-4 h-0.5 bg-white" />
      </button>
      {open && (
        <nav className="absolute left-4 right-4 mt-3 glass rounded-2xl p-4 flex flex-col gap-2 z-50">
          {links.map(([label, href]) => (
            <Link key={href} href={href} onClick={() => setOpen(false)} className="px-2 py-2 rounded-lg text-sm hover:bg-white/10">
              {label}
            </Link>
          ))}
          <Link href="/account/signin" onClick={() => setOpen(false)} className="px-2 py-2 rounded-lg text-sm text-brand-400">Sign In</Link>
        </nav>
      )}
    </div>
  );
}
