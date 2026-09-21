"use client";

import { useEffect, useState } from "react";
import { ensureVisitorId } from "@/lib/visitor-id";

// Stable anonymous id for cart merge + feature flags (spec section 6/26).
export function useVisitorId(): string | null {
  const [id, setId] = useState<string | null>(null);
  useEffect(() => setId(ensureVisitorId()), []);
  return id;
}
