"use client";

import { useCallback, useState } from "react";

export function useAction(action: () => Promise<unknown>, onDone?: () => void) {
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const run = useCallback(async () => {
    setPending(true);
    setError(null);
    try {
      await action();
      onDone?.();
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setPending(false);
    }
  }, [action, onDone]);

  return { run, pending, error };
}
