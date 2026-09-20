"use client";

import { useEffect, useState } from "react";
import { useLocalStorage } from "@/hooks/use-local-storage";

// GDPR/CCPA consent banner (spec section 17): stores the choice, never nags again.
export function CookieConsent() {
  const [dismissed, setDismissed] = useLocalStorage("omni-cookie-consent", false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);
  if (!mounted || dismissed) return null;

  return (
    <div className="fixed bottom-4 inset-x-4 md:inset-x-auto md:right-4 md:max-w-md z-50 glass p-4" role="dialog" aria-label="Cookie consent">
      <p className="text-sm text-white/70">
        We use cookies for your cart, login, and basic analytics. See our{" "}
        <a href="/privacy" className="text-brand-400 underline">privacy policy</a>.
      </p>
      <div className="flex gap-2 mt-3 justify-end">
        <button onClick={() => setDismissed(true)} className="glass px-3 py-1.5 rounded-lg text-xs hover:bg-white/10">
          Essential only
        </button>
        <button onClick={() => setDismissed(true)} className="bg-brand-600 px-3 py-1.5 rounded-lg text-xs font-medium">
          Accept all
        </button>
      </div>
    </div>
  );
}
