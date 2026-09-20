"use client";

import { useEffect, useState } from "react";
import { NewsletterSignup } from "./newsletter-signup";

// Exit-intent email capture (spec section 15): once per session, dismissible.
export function ExitIntent() {
  const [show, setShow] = useState(false);
  const [dismissed, setDismissed] = useState(true);

  useEffect(() => {
    setDismissed(sessionStorage.getItem("omni-exit-intent") === "1");
    function onLeave(e: MouseEvent) {
      if (e.clientY <= 0 && !dismissed) {
        setShow(true);
        sessionStorage.setItem("omni-exit-intent", "1");
      }
    }
    document.addEventListener("mouseout", onLeave);
    return () => document.removeEventListener("mouseout", onLeave);
  }, [dismissed]);

  if (!show) return null;

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/50" role="dialog" aria-label="Special offer">
      <div className="glass p-6 max-w-md mx-4 relative">
        <button
          onClick={() => setShow(false)}
          aria-label="Close"
          className="absolute top-3 right-3 text-white/50 hover:text-white"
        >
          ×
        </button>
        <h2 className="text-xl font-semibold">Wait - take 10% off</h2>
        <p className="text-sm text-white/60 mt-2">Join our list and we'll send you a code for your first order.</p>
        <div className="mt-4">
          <NewsletterSignup />
        </div>
      </div>
    </div>
  );
}
