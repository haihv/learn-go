"use client";
import { useState } from "react";

type Tab = "output" | "errors";

type OutputPanelProps = {
  stdout: string;
  stderr: string;
  error: string | null;
  defaultTab?: Tab;
};

export default function OutputPanel({ stdout, stderr, error, defaultTab = "output" }: OutputPanelProps) {
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
    </div>
  );
}
