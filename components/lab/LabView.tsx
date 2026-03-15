"use client";
import dynamic from "next/dynamic";
import { useState, useRef, useEffect } from "react";
import { runGoCode } from "@/lib/go-runner";
import type { RunResult } from "@/lib/go-runner";
import { runLabTests, allPassed } from "@/lib/test-runner";
import LabInstructions from "@/components/lab/LabInstructions";
import TestResults from "@/components/lab/TestResults";
import OutputPanel from "@/components/editor/OutputPanel";
import CelebrationOverlay from "@/components/ui/Celebration";
import { triggerCelebration } from "@/components/ui/Celebration";
import { useShortcutKey } from "@/hooks/useShortcutKey";
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
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Resizable split — instructions width as % of the container
  const [splitPct, setSplitPct] = useState(40);
  const isDragging = useRef(false);
  const splitContainerRef = useRef<HTMLDivElement>(null);

  const { mod } = useShortcutKey();

  // Exit fullscreen on Escape
  useEffect(() => {
    if (!isFullscreen) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") setIsFullscreen(false);
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [isFullscreen]);

  // Resizable drag
  useEffect(() => {
    const onMouseMove = (e: MouseEvent) => {
      if (!isDragging.current || !splitContainerRef.current) return;
      const rect = splitContainerRef.current.getBoundingClientRect();
      const pct = ((e.clientX - rect.left) / rect.width) * 100;
      setSplitPct(Math.min(65, Math.max(20, pct)));
    };
    const onMouseUp = () => { isDragging.current = false; };
    document.addEventListener("mousemove", onMouseMove);
    document.addEventListener("mouseup", onMouseUp);
    return () => {
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

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

  const actionBar = (
    <div className="flex items-center gap-4 shrink-0">
      {passed ? (
        <>
          <button
            onClick={handleNext}
            className="bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg cursor-pointer"
          >
            Next →
          </button>
          <span className="text-navy-500 text-xs">{mod}+Enter</span>
        </>
      ) : (
        <>
          <button
            onClick={handleRun}
            disabled={isRunning}
            className={`bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg flex items-center gap-2 cursor-pointer ${isRunning ? "opacity-50 cursor-not-allowed" : ""}`}
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
          <span className="text-navy-500 text-xs">{mod}+Enter to run</span>
        </>
      )}
    </div>
  );

  const resultsPanel = (runResult || testResults.length > 0) ? (
    <div className={`overflow-y-auto flex flex-col gap-4 ${isFullscreen ? "max-h-[28vh]" : "flex-1 min-h-0"} px-4 pb-4`}>
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
  ) : null;

  const editorSection = (
    <div className="flex flex-col h-full min-h-0">
      <div className="flex flex-col gap-4 p-4 shrink-0">
        <GoEditor
          value={code}
          onChange={setCode}
          onCmdEnter={passed ? handleNext : handleRun}
          height={isFullscreen ? "calc(100vh - 250px)" : "400px"}
          onFullscreen={isFullscreen ? undefined : () => setIsFullscreen(true)}
        />
        {actionBar}
      </div>
      {resultsPanel}
    </div>
  );

  return (
    <>
      {/* Desktop layout — becomes fullscreen overlay when isFullscreen */}
      <div
        ref={splitContainerRef}
        className={
          isFullscreen
            ? "fixed inset-0 z-50 bg-navy-950 flex flex-row"
            : "hidden md:flex flex-row h-full"
        }
      >
        {/* Instructions panel — hidden in fullscreen */}
        {!isFullscreen && (
          <>
            <div
              style={{ width: `${splitPct}%` }}
              className="border-r border-navy-600 overflow-y-auto h-full min-w-0"
            >
              <LabInstructions instructions={module.instructions} />
            </div>
            {/* Drag handle */}
            <div
              className="w-1 cursor-col-resize bg-navy-600 hover:bg-go-cyan active:bg-go-cyan transition-colors select-none shrink-0"
              onMouseDown={() => { isDragging.current = true; }}
              title="Drag to resize"
            />
          </>
        )}

        {/* Editor panel */}
        <div className="flex-1 flex flex-col h-full min-w-0 overflow-hidden">
          {isFullscreen && (
            <div className="h-12 border-b border-navy-600 flex items-center px-4 justify-between shrink-0">
              <span className="text-slate-400 text-sm font-mono">{module.title}</span>
              <button
                onClick={() => setIsFullscreen(false)}
                className="text-slate-400 hover:text-slate-200 bg-navy-800 hover:bg-navy-700 rounded px-3 py-1 text-sm cursor-pointer"
              >
                ✕ Exit Fullscreen
              </button>
            </div>
          )}
          {editorSection}
        </div>
      </div>

      {/* Mobile layout */}
      <div className="flex flex-col md:hidden h-full">
        <div>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="w-full text-left px-4 py-2 bg-navy-800 border-b border-navy-600 font-bold text-go-cyan cursor-pointer"
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
