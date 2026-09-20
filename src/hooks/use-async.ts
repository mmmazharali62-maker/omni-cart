"use client";

import { useCallback, useState } from "react";

// Async action state: loading/error wrappers for buttons and forms.
export function useAsync<T>(fn: (...args: any[]) => Promise<T>) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(
    async (...args: any[]) => {
      setLoading(true);
      setError(null);
      try {
        return await fn(...args);
      } catch (e: any) {
        setError(e?.message ?? "Something went wrong");
        return undefined;
      } finally {
        setLoading(false);
      }
    },
    [fn]
  );

  return { run, loading, error };
}
