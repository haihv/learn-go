"use client";
import { useState, useCallback, useRef } from "react";
import { runGoCode } from "@/lib/go-runner";
import type { RunResult } from "@/lib/go-runner";

type GoRunnerReturn = {
  run: (code: string) => Promise<void>;
  result: RunResult | null;
  isRunning: boolean;
  clear: () => void;
};

export function useGoRunner(): GoRunnerReturn {
  const [result, setResult] = useState<RunResult | null>(null);
  const [isRunning, setIsRunning] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  // Each call gets a unique ID; only the latest ID proceeds past the debounce
  const callIdRef = useRef(0);

  const run = useCallback(async (code: string): Promise<void> => {
    if (timerRef.current !== null) clearTimeout(timerRef.current);

    const id = ++callIdRef.current;

    await new Promise<void>((resolve) => {
      timerRef.current = setTimeout(resolve, 300);
    });

    if (id !== callIdRef.current) return;

    timerRef.current = null;
    setIsRunning(true);
    const output = await runGoCode(code);
    if (id === callIdRef.current) {
      setResult(output);
      setIsRunning(false);
    }
  }, []);

  const clear = useCallback((): void => {
    setResult(null);
  }, []);

  return { run, result, isRunning, clear };
}
