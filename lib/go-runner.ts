import { wasmEngine } from "@/lib/wasm/engine";

export type Engine = "wasm" | "playground";

// "auto" = in-browser runtime when it can handle the program, Playground
// otherwise; "playground" = always the remote compiler.
export type EnginePreference = "auto" | "playground";

export type RunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
  // Which engine produced this result, and — when the browser runtime was
  // skipped or overruled — why (surfaced in the output panel)
  engine?: Engine;
  fallbackReason?: string;
};

export type RunOptions = {
  engine?: EnginePreference;
};

// Packages the interpreter cannot provide in a browser. Anything outside the
// standard library (first path element has a dot) is unsupported too.
const UNSUPPORTED_IMPORTS = new Set([
  "os/exec", "os/signal", "syscall", "plugin", "database/sql",
  "runtime/pprof", "runtime/trace", "net/rpc", "testing",
]);

const IMPORT_BLOCK_RE = /import\s*\(([\s\S]*?)\)/g;
const IMPORT_LINE_RE = /import\s+(?:[\w.]+\s+)?["`]([^"`]+)["`]/g;
const QUOTED_RE = /["`]([^"`]+)["`]/g;

const COMMENT_RE = /\/\/[^\n]*|\/\*[\s\S]*?\*\//g;

export function extractImports(source: string): string[] {
  // Comments can contain ")" or quotes that would truncate/confuse the scan
  const code = source.replace(COMMENT_RE, "");
  const found = new Set<string>();
  for (const block of code.matchAll(IMPORT_BLOCK_RE)) {
    for (const q of block[1].matchAll(QUOTED_RE)) found.add(q[1]);
  }
  for (const line of code.matchAll(IMPORT_LINE_RE)) found.add(line[1]);
  return [...found];
}

// Decide up front whether the in-browser runtime can run this program, so the
// learner never waits on a doomed attempt.
export function browserRuntimeBlocker(code: string): string | null {
  for (const imp of extractImports(code)) {
    if (UNSUPPORTED_IMPORTS.has(imp)) return `${imp} needs the Playground`;
    if (imp.split("/")[0].includes(".")) return `non-stdlib import ${imp}`;
  }
  if (/^\s*func\s+Test\w*\s*\(\s*\w+\s+\*testing\.T\)/m.test(code)) return "tests need the Playground";
  return null;
}

export async function runOnPlayground(code: string): Promise<RunResult> {
  try {
    const res = await fetch("/api/run", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
    });
    return { ...((await res.json()) as RunResult), engine: "playground" };
  } catch (err) {
    return { stdout: "", stderr: "", error: String(err), timedOut: false, engine: "playground" };
  }
}

// Yaegi's parser prefixes syntax errors with the file name; everything else
// (type-check and runtime errors) comes bare. Parser errors are trustworthy
// and instant, so we keep them; for the rest the Playground is authoritative.
const PARSER_ERROR_RE = /^_\.go:\d+:\d+:/m;

export async function runGoCode(code: string, opts: RunOptions = {}): Promise<RunResult> {
  const pref = opts.engine ?? "auto";
  if (pref === "playground" || wasmEngine.status === "unsupported" || wasmEngine.status === "error") {
    return runOnPlayground(code);
  }

  const blocker = browserRuntimeBlocker(code);
  if (blocker) {
    const r = await runOnPlayground(code);
    return { ...r, fallbackReason: blocker };
  }

  // First run while the wasm is still downloading: don't make the learner
  // wait — use the Playground now, the next run lands in the browser.
  if (wasmEngine.status !== "ready") {
    void wasmEngine.load();
    const r = await runOnPlayground(code);
    return { ...r, fallbackReason: "browser runtime still loading" };
  }

  const w = await wasmEngine.run(code);
  if (w.error && !w.timedOut && !PARSER_ERROR_RE.test(w.error)) {
    const r = await runOnPlayground(code);
    return { ...r, fallbackReason: "verified on the Playground" };
  }
  return {
    stdout: w.stdout,
    stderr: w.stderr,
    // Match the Playground's file name so error lines look familiar
    error: w.error ? w.error.replace(/^_\.go:/gm, "./prog.go:") : null,
    timedOut: w.timedOut,
    engine: "wasm",
  };
}

export function isCompileError(result: RunResult): boolean {
  const lower = result.stderr.toLowerCase();
  return lower.includes("syntax error") || lower.includes("undefined");
}
