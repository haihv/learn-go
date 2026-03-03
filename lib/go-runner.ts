export type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
};

export async function runGoCode(code: string): Promise<RunResult> {
  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return (await res.json()) as RunResult;
  } catch (err) {
    return { stdout: "", stderr: "", error: String(err), timedOut: false };
  }
}

export function isCompileError(result: RunResult): boolean {
  const lower = result.stderr.toLowerCase();
  return lower.includes("syntax error") || lower.includes("undefined");
}
