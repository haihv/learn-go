"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useGoRunner } from "@/hooks/useGoRunner";
import { runLabTests, allPassed } from "@/lib/test-runner";
import { runGoCode } from "@/lib/go-runner";
import LabInstructions from "@/components/lab/LabInstructions";
import TestResults from "@/components/lab/TestResults";
import OutputPanel from "@/components/editor/OutputPanel";
import RunButton from "@/components/editor/RunButton";
import { triggerCelebration } from "@/components/ui/Celebration";
import CelebrationOverlay from "@/components/ui/Celebration";
import type { LabModule } from "@/lib/curriculum/types";
import type { TestResult } from "@/lib/test-runner";

const GoEditor = dynamic(() => import("@/components/editor/GoEditor"), { ssr: false });

type Props = { module: LabModule; onComplete: () => void };

export default function LabView({ module, onComplete }: Props) {
  const [code, setCode] = useState(module.starterCode);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [showCelebration, setShowCelebration] = useState(false);
  const { run, result, isRunning } = useGoRunner();

  const [mobileOpen, setMobileOpen] = useState(false);

  async function handleRun() {
    await run(code);
  }

  async function handleSubmit() {
    const freshResult = await runGoCode(code);
    const results = runLabTests(module.tests, code, freshResult.stdout ?? "");
    setTestResults(results);
    if (allPassed(results)) {
      triggerCelebration();
      setShowCelebration(true);
      setTimeout(() => {
        onComplete();
      }, 1000);
    }
  }

  return (
    <>
      <div className="hidden md:flex flex-row h-full">
        <div className="w-[40%] border-r border-navy-600 overflow-y-auto">
          <LabInstructions instructions={module.instructions} />
        </div>
        <div className="w-[60%] flex flex-col gap-4 p-4">
          <GoEditor value={code} onChange={setCode} onCmdEnter={handleRun} />
          <div className="flex flex-row gap-2">
            <RunButton onRun={handleRun} isRunning={isRunning} />
            <button
              onClick={handleSubmit}
              className="bg-navy-700 border border-go-cyan text-go-cyan px-4 py-2 rounded-lg font-bold"
            >
              Submit
            </button>
          </div>
          <OutputPanel
            stdout={result?.stdout ?? ""}
            stderr={result?.stderr ?? ""}
            error={result?.error ?? null}
          />
          <TestResults results={testResults} />
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
        <div className="flex flex-col gap-4 p-4 flex-1 overflow-y-auto">
          <GoEditor value={code} onChange={setCode} onCmdEnter={handleRun} />
          <div className="flex flex-row gap-2">
            <RunButton onRun={handleRun} isRunning={isRunning} />
            <button
              onClick={handleSubmit}
              className="bg-navy-700 border border-go-cyan text-go-cyan px-4 py-2 rounded-lg font-bold"
            >
              Submit
            </button>
          </div>
          <OutputPanel
            stdout={result?.stdout ?? ""}
            stderr={result?.stderr ?? ""}
            error={result?.error ?? null}
          />
          <TestResults results={testResults} />
        </div>
      </div>

      {showCelebration && <CelebrationOverlay />}
    </>
  );
}
