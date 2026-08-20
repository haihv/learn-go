"use client";
import { useEffect } from "react";
import { useWasmEngine } from "@/hooks/useWasmEngine";
import { useCourseStore } from "@/store/course";
import { wasmEngine } from "@/lib/wasm/engine";

type Props = {
  className?: string;
};

type NetInfo = { saveData?: boolean; effectiveType?: string };

// Shows which engine will run the next program and lets the learner flip
// between the in-browser runtime and the Playground. Mounting it also kicks
// off the wasm download so the first Run is already fast — unless the
// browser says the connection is metered or slow.
export default function EngineBadge({ className = "" }: Props) {
  const { status, error } = useWasmEngine();
  const pref = useCourseStore((s) => s.enginePreference);
  const setPref = useCourseStore((s) => s.setEnginePreference);

  useEffect(() => {
    if (pref !== "auto" || status !== "idle") return;
    const net = (navigator as Navigator & { connection?: NetInfo }).connection;
    if (net?.saveData || net?.effectiveType === "2g" || net?.effectiveType === "slow-2g") return;
    void wasmEngine.load();
  }, [pref, status]);

  let label: string;
  let title: string;
  let tone: string;
  if (pref === "playground") {
    label = "☁ Playground";
    title = "Runs on the Go Playground. Click to run in your browser instead.";
    tone = "text-stone-500 border-navy-600";
  } else if (status === "ready") {
    label = "⚡ In-browser";
    title = "Runs instantly in your browser (no network). Click to use the Playground instead.";
    tone = "text-go-cyan border-go-cyan/40";
  } else if (status === "loading") {
    label = "⏳ Loading runtime…";
    title = "Downloading the in-browser Go runtime (~8 MB). Runs use the Playground until it's ready.";
    tone = "text-go-yellow border-go-yellow/40";
  } else if (status === "error") {
    label = "☁ Playground";
    title = `In-browser runtime unavailable (${error ?? "load failed"}) — using the Playground.`;
    tone = "text-stone-500 border-navy-600";
  } else {
    label = "☁ Playground";
    title = "Click to load the in-browser Go runtime.";
    tone = "text-stone-500 border-navy-600";
  }

  const toggle = () => {
    if (pref === "playground") {
      setPref("auto");
      void wasmEngine.load();
    } else {
      setPref("playground");
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      title={title}
      aria-label={title}
      className={`rounded-full border px-2 py-0.5 text-[11px] font-mono whitespace-nowrap cursor-pointer hover:bg-navy-700 transition-colors ${tone} ${className}`}
    >
      {label}
    </button>
  );
}
