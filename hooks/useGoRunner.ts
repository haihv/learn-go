// Stub — replaced in Phase 1 (Subagent 1-C)
import type { RunResult } from "@/lib/go-runner";

export function useGoRunner() {
  return {
    run: async (_code: string): Promise<void> => {},
    result: null as RunResult | null,
    isRunning: false,
    clear: () => {},
  };
}
