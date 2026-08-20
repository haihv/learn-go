/// <reference lib="webworker" />
// Runs the Yaegi-in-wasm Go runtime off the main thread. A program that never
// returns is handled by the engine terminating this worker — nothing here
// needs to be interruptible.
import { WASM_EXEC_URL, WASM_URL } from "./protocol";
import type { WorkerRequest, WorkerResponse } from "./protocol";

type GoRun = (code: string, cb: (error: string, ms: number) => void) => void;

type GoShim = {
  importObject: WebAssembly.Imports;
  run(instance: WebAssembly.Instance): Promise<void>;
  exit: (code: number) => void;
};

type FsShim = { writeSync: (fd: number, buf: Uint8Array) => number };

declare const importScripts: ((...urls: string[]) => void) | undefined;

const post = (msg: WorkerResponse) => self.postMessage(msg);

// Everything the Go program writes to fd 1/2 — fmt, os.Stdout, slog, bufio —
// lands here in order. Reset before each run, read when it finishes.
const decoder = new TextDecoder();
let stdout = "";
let stderr = "";
let exitCode: number | null = null;

function captureFds() {
  const fs = (globalThis as unknown as { fs: FsShim }).fs;
  fs.writeSync = (fd, buf) => {
    const text = decoder.decode(buf, { stream: true });
    if (fd === 2) stderr += text;
    else stdout += text;
    return buf.length;
  };
}

async function loadShim(): Promise<void> {
  // wasm_exec.js is a classic script that assigns globalThis.Go. Classic
  // workers have importScripts; module workers (Turbopack) can import() it —
  // the ignore hints stop the bundlers from trying to resolve a public/ URL.
  if (typeof importScripts === "function") {
    importScripts(WASM_EXEC_URL);
  } else {
    await import(/* webpackIgnore: true */ /* turbopackIgnore: true */ WASM_EXEC_URL);
  }
}

async function boot(): Promise<void> {
  try {
    await loadShim();
    captureFds();
    const GoCtor = (globalThis as unknown as { Go: new () => GoShim }).Go;
    const go = new GoCtor();
    go.exit = (code) => {
      exitCode = code;
    };
    const source = fetch(WASM_URL);
    const { instance } =
      "instantiateStreaming" in WebAssembly
        ? await WebAssembly.instantiateStreaming(source, go.importObject)
        : await WebAssembly.instantiate(await (await source).arrayBuffer(), go.importObject);
    // go.run resolves only when the Go program exits. Ours blocks in select{}
    // forever, so resolving means the runtime crashed (goroutine panic,
    // os.Exit) — report it with whatever it printed so the engine can respawn.
    void go.run(instance).then(() => {
      post({ type: "exited", code: exitCode ?? 0, stdout, stderr });
    });
    post({ type: "ready" });
  } catch (err) {
    post({ type: "load-error", message: err instanceof Error ? err.message : String(err) });
  }
}

const booted = boot();
// Runs are serialised: the fd capture is global, so two programs at once
// would interleave their output.
let queue: Promise<void> = Promise.resolve();

function execute(msg: Extract<WorkerRequest, { type: "run" }>): Promise<void> {
  return new Promise((done) => {
    const goRun = (globalThis as unknown as { __goRun?: GoRun }).__goRun;
    if (!goRun || exitCode !== null) {
      post({ type: "result", id: msg.id, stdout: "", stderr: "", error: "runtime not available", ms: 0 });
      done();
      return;
    }
    stdout = "";
    stderr = "";
    try {
      goRun(msg.code, (error, ms) => {
        post({ type: "result", id: msg.id, stdout, stderr, error, ms });
        done();
      });
    } catch (err) {
      post({ type: "result", id: msg.id, stdout, stderr, error: String(err), ms: 0 });
      done();
    }
  });
}

self.onmessage = (e: MessageEvent<WorkerRequest>) => {
  const msg = e.data;
  if (msg.type !== "run") return;
  queue = queue.then(() => booted).then(() => execute(msg));
};
