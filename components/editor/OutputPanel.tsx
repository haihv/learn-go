"use client";
import { useState } from "react";
import type { Engine } from "@/lib/go-runner";

type Tab = "output" | "errors";

type OutputPanelProps = {
  stdout: string;
  stderr: string;
  error: string | null;
  defaultTab?: Tab;
  engine?: Engine;
  fallbackReason?: string;
};

export default function OutputPanel({ stdout, stderr, error, defaultTab = "output", engine, fallbackReason }: OutputPanelProps) {
  const [activeTab, setActiveTab] = useState<Tab>(defaultTab);

  const errorsContent = [stderr, error].filter(Boolean).join("\n");

  return (
    <div>
      <div className="flex border-b border-navy-600 mb-2">
        <button
          onClick={() => setActiveTab("output")}
          className={`px-4 py-2 text-sm font-medium ${activeTab === "output" ? "border-b-2 border-go-cyan text-go-cyan" : "text-navy-500"}`}
        >
          Output
        </button>
        <button
          onClick={() => setActiveTab("errors")}
          className={`px-4 py-2 text-sm font-medium ${activeTab === "errors" ? "border-b-2 border-go-cyan text-go-cyan" : "text-navy-500"}`}
        >
          Errors
        </button>
      </div>

      {activeTab === "output" && (
        <pre className="bg-navy-800 p-4 rounded-lg font-mono text-sm overflow-x-auto min-h-[100px]">
          {stdout ? (
            <span className="text-go-green">{stdout}</span>
          ) : (
            <span className="text-navy-500">No output yet</span>
          )}
        </pre>
      )}

      {activeTab === "errors" && (
        <pre className="bg-navy-800 p-4 rounded-lg font-mono text-sm overflow-x-auto min-h-[100px]">
          {errorsContent ? (
            <span className="text-go-red">{errorsContent}</span>
          ) : (
            <span className="text-navy-500">No errors</span>
          )}
        </pre>
      )}

      {engine && (
        <p className="mt-1 text-[11px] text-navy-500 font-mono">
          {engine === "wasm" ? "⚡ ran in your browser" : "☁ ran on the Go Playground"}
          {fallbackReason ? ` · ${fallbackReason}` : ""}
        </p>
      )}
    </div>
  );
}
