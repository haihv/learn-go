"use client";
// Main-thread handle to the in-browser Go runtime. One worker, lazily booted
// (the wasm is ~8 MB over the wire), restarted whenever a run times out.
import type { WorkerRequest, WorkerResponse } from "./protocol";

export type EngineStatus = "unsupported" | "idle" | "loading" | "ready" | "error";

export type EngineSnapshot = { status: EngineStatus; error: string | null };

export type WasmRunResult = {
  stdout: string;
  stderr: string;
  error: string | null;
  timedOut: boolean;
  ms: number;
};

type Pending = { resolve: (r: WasmRunResult) => void; timer: ReturnType<typeof setTimeout> };

const DEFAULT_TIMEOUT_MS = 10_000;

class WasmEngine {
  private snapshot: EngineSnapshot;
  private worker: Worker | null = null;
  private readyPromise: Promise<boolean> | null = null;
  private resolveReady: ((ok: boolean) => void) | null = null;
  private pending = new Map<number, Pending>();
  private nextId = 1;
  private listeners = new Set<() => void>();

  constructor() {
    const supported =
      typeof window !== "undefined" && typeof Worker !== "undefined" && typeof WebAssembly !== "undefined";
    this.snapshot = { status: supported ? "idle" : "unsupported", error: null };
  }

  getSnapshot = (): EngineSnapshot => this.snapshot;

  subscribe = (fn: () => void): (() => void) => {
    this.listeners.add(fn);
    return () => this.listeners.delete(fn);
  };

  private set(next: Partial<EngineSnapshot>) {
    this.snapshot = { ...this.snapshot, ...next };
    for (const fn of this.listeners) fn();
  }

  get status(): EngineStatus {
    return this.snapshot.status;
  }

  // Start downloading/instantiating; safe to call repeatedly. Resolves true
  // once the runtime can execute code, false if it failed to load.
  load(): Promise<boolean> {
    if (this.snapshot.status === "unsupported") return Promise.resolve(false);
    // A failed download (flaky network, dev without `pnpm wasm`) shouldn't
    // be sticky for the whole page lifetime — let the next call retry.
    if (this.snapshot.status === "error") this.readyPromise = null;
    if (this.readyPromise) return this.readyPromise;
    this.readyPromise = new Promise<boolean>((resolve) => {
      this.resolveReady = resolve;
    });
    this.spawn();
    return this.readyPromise;
  }

  private spawn() {
    this.set({ status: "loading", error: null });
    const worker = new Worker(new URL("./worker.ts", import.meta.url));
    this.worker = worker;
    // A terminated worker can still have a queued error (e.g. a Go timer
    // firing after the program exited) — never let it act on its successor.
    worker.onmessage = (e: MessageEvent<WorkerResponse>) => {
      if (this.worker === worker) this.onMessage(e.data);
    };
    worker.onerror = (e) => {
      if (this.worker === worker) this.fail(e.message || "worker error");
    };
  }

  private onMessage(msg: WorkerResponse) {
    switch (msg.type) {
      case "ready":
        this.set({ status: "ready", error: null });
        this.resolveReady?.(true);
        break;
      case "load-error":
        this.fail(msg.message);
        break;
      case "exited": {
        // The Go process is gone. Hand every in-flight run what it printed
        // plus a non-parser error so go-runner re-verifies on the Playground,
        // then boot a fresh worker.
        for (const [, p] of this.pending) {
          clearTimeout(p.timer);
          p.resolve({
            stdout: msg.stdout,
            stderr: msg.stderr,
            error: `runtime exited with code ${msg.code}`,
            timedOut: false,
            ms: 0,
          });
        }
        this.pending.clear();
        this.restart();
        break;
      }
      case "result": {
        const p = this.pending.get(msg.id);
        if (!p) return;
        this.pending.delete(msg.id);
        clearTimeout(p.timer);
        p.resolve({
          stdout: msg.stdout,
          stderr: msg.stderr,
          error: msg.error || null,
          timedOut: false,
          ms: msg.ms,
        });
        break;
      }
    }
  }

  private fail(message: string) {
    this.worker?.terminate();
    this.worker = null;
    this.set({ status: "error", error: message });
    this.resolveReady?.(false);
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.resolve({ stdout: "", stderr: "", error: message, timedOut: false, ms: 0 });
    }
    this.pending.clear();
  }

  async run(code: string, timeoutMs = DEFAULT_TIMEOUT_MS): Promise<WasmRunResult> {
    const ok = await this.load();
    if (!ok || !this.worker) {
      return { stdout: "", stderr: "", error: this.snapshot.error ?? "runtime unavailable", timedOut: false, ms: 0 };
    }
    const worker = this.worker;
    const id = this.nextId++;
    return new Promise<WasmRunResult>((resolve) => {
      const timer = setTimeout(() => {
        this.pending.delete(id);
        resolve({
          stdout: "",
          stderr: "",
          error: `Program timed out after ${timeoutMs / 1000}s (infinite loop or deadlock?)`,
          timedOut: true,
          ms: timeoutMs,
        });
        // The only way to stop a runaway Go program is to kill the worker;
        // boot a fresh one so the next run doesn't pay the penalty twice.
        this.restart();
      }, timeoutMs);
      this.pending.set(id, { resolve, timer });
      const req: WorkerRequest = { type: "run", id, code };
      worker.postMessage(req);
    });
  }

  private restart() {
    this.worker?.terminate();
    this.worker = null;
    for (const [, p] of this.pending) {
      clearTimeout(p.timer);
      p.resolve({ stdout: "", stderr: "", error: "runtime restarted", timedOut: false, ms: 0 });
    }
    this.pending.clear();
    this.readyPromise = new Promise<boolean>((resolve) => {
      this.resolveReady = resolve;
    });
    this.spawn();
  }
}

export const wasmEngine = new WasmEngine();
