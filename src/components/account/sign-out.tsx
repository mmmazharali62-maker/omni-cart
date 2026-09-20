"use client";

import { signOut } from "next-auth/react";

export function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="glass px-4 py-2 rounded-lg text-sm hover:bg-white/10"
    >
      Sign Out
    </button>
  );
}
