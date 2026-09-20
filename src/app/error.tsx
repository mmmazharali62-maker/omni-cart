"use client";

import { Button } from "@/components/ui/button";

export default function GlobalError({ reset }: { error: Error & { digest?: string }; reset: () => void }) {
  return (
    <section className="mx-4 mt-24 text-center">
      <p className="text-6xl font-semibold text-white/20">Oops</p>
      <h1 className="text-2xl font-semibold mt-4">Something went wrong</h1>
      <p className="text-white/60 text-sm mt-2">We've logged the issue. Please try again.</p>
      <Button variant="primary" className="mt-8" onClick={reset}>Try Again</Button>
    </section>
  );
}
