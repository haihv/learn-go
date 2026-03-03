// Stub — replaced in Phase 1 (Subagent 1-A)
export type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
};

export async function runGoCode(_code: string): Promise<RunResult> {
  return { stdout: "", stderr: "", error: null, timedOut: false };
}

export function isCompileError(_result: RunResult): boolean {
  return false;
}
