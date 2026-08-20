// Messages between the main thread (engine.ts) and the runtime worker.

export type WorkerRequest = { type: "run"; id: number; code: string };

export type WorkerResponse =
  | { type: "ready" }
  | { type: "load-error"; message: string }
  | {
      type: "result";
      id: number;
      stdout: string;
      stderr: string;
      error: string;
      ms: number;
    }
  // The Go process died (e.g. a panic in a goroutine, os.Exit). The worker
  // is useless afterwards; the engine must respawn it.
  | { type: "exited"; code: number; stdout: string; stderr: string };

export const WASM_URL = "/wasm/yaegi.wasm";
export const WASM_EXEC_URL = "/wasm/wasm_exec.js";
