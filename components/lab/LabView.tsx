"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { runGoCode } from "@/lib/go-runner";
import type { RunResult } from "@/lib/go-runner";
import { runLabTests, allPassed } from "@/lib/test-runner";
import LabInstructions from "@/components/lab/LabInstructions";
import TestResults from "@/components/lab/TestResults";
import OutputPanel from "@/components/editor/OutputPanel";
import CelebrationOverlay from "@/components/ui/Celebration";
import { triggerCelebration } from "@/components/ui/Celebration";
import type { LabModule } from "@/lib/curriculum/types";
import type { TestResult } from "@/lib/test-runner";

const GoEditor = dynamic(() => import("@/components/editor/GoEditor"), { ssr: false });

type Props = { module: LabModule; onComplete: () => void };

export default function LabView({ module, onComplete }: Props) {
  const [code, setCode] = useState(module.starterCode);
  const [isRunning, setIsRunning] = useState(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runCount, setRunCount] = useState(0);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [passed, setPassed] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleRun() {
    if (isRunning) return;
    setIsRunning(true);
    setPassed(false);

    const result = await runGoCode(code);
    setRunResult(result);
    setRunCount((c) => c + 1);

    if (!result.stderr && !result.error) {
      const results = runLabTests(module.tests, code, result.stdout ?? "");
      setTestResults(results);
      if (allPassed(results)) {
        setPassed(true);
        triggerCelebration();
        setShowCelebration(true);
      }
    } else {
      setTestResults([]);
    }

    setIsRunning(false);
  }

  function handleNext() {
    setTimeout(() => onComplete(), 200);
  }

  const editorSection = (
    <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
      <GoEditor
        value={code}
        onChange={setCode}
        onCmdEnter={passed ? handleNext : handleRun}
      />
      <div className="flex items-center gap-4">
        {passed ? (
          <button
            onClick={handleNext}
            className="bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg"
          >
            Next →
          </button>
        ) : (
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg flex items-center gap-2 ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isRunning ? (
              <>
                <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Running…
              </>
            ) : "▶ Run & Check"}
          </button>
        )}
        {!passed && (
          <span className="text-navy-500 text-xs">⌘ Enter (Mac) · Ctrl+Enter (Win/Linux)</span>
        )}
      </div>
      {runResult && (
        <OutputPanel
          key={runCount}
          stdout={runResult.stdout}
          stderr={runResult.stderr}
          error={runResult.error}
          defaultTab={runResult.stderr || runResult.error ? "errors" : "output"}
        />
      )}
      {testResults.length > 0 && <TestResults results={testResults} />}
    </div>
  );

  return (
    <>
      <div className="hidden md:flex flex-row h-full">
        <div className="w-[40%] border-r border-navy-600 overflow-y-auto">
          <LabInstructions instructions={module.instructions} />
        </div>
        <div className="w-[60%] flex flex-col h-full">
          {editorSection}
        </div>
      </div>

      <div className="flex flex-col md:hidden h-full">
        <div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-full text-left px-4 py-2 bg-navy-800 border-b border-navy-600 font-bold text-go-cyan"
          >
            {mobileOpen ? "Hide" : "Show"} Instructions
          </button>
          {mobileOpen && (
            <div className="overflow-y-auto max-h-64 border-b border-navy-600">
              <LabInstructions instructions={module.instructions} />
            </div>
          )}
        </div>
        {editorSection}
      </div>

      {showCelebration && <CelebrationOverlay />}
    </>
  );
}
