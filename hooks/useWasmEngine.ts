"use client";
import { useSyncExternalStore } from "react";
import { wasmEngine } from "@/lib/wasm/engine";
import type { EngineSnapshot } from "@/lib/wasm/engine";

const serverSnapshot: EngineSnapshot = { status: "unsupported", error: null };

export function useWasmEngine(): EngineSnapshot {
  return useSyncExternalStore(wasmEngine.subscribe, wasmEngine.getSnapshot, () => serverSnapshot);
}
