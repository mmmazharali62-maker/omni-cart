"use client";

import dynamic from "next/dynamic";

// Perf: the personalized rail needs localStorage + an API fetch anyway,
// so it ships only when it can actually show something (after hydration).
const RecentlyViewedRail = dynamic(
  () => import("@/components/home/recently-viewed-rail").then((m) => m.RecentlyViewedRail),
  { ssr: false, loading: () => null }
);

export function RecentlyViewedLazy() {
  return <RecentlyViewedRail />;
}
