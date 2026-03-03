// Stub — replaced in Phase 1 (Subagent 1-C)
export function useProgress() {
  return {
    isComplete: (_slug: string): boolean => false,
    markComplete: (_slug: string): void => {},
    completedCount: 0,
    totalCount: 12,
  };
}
