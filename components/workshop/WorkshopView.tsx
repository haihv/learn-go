"use client";
import dynamic from "next/dynamic";
import { useState, useCallback, useEffect } from "react";
import { useCourseStore } from "@/store/course";
import { runGoCode } from "@/lib/go-runner";
import type { RunResult } from "@/lib/go-runner";
import StepProgress from "@/components/workshop/StepProgress";
import StepInstruction from "@/components/workshop/StepInstruction";
import OutputPanel from "@/components/editor/OutputPanel";
import CelebrationOverlay from "@/components/ui/Celebration";
import type { WorkshopModule } from "@/lib/curriculum/types";

const GoEditor = dynamic(() => import("@/components/editor/GoEditor"), { ssr: false });

type Props = {
  module: WorkshopModule;
  onComplete: () => void;
};

type Feedback = {
  ok: boolean;
  message: string;
};

export default function WorkshopView({ module, onComplete }: Props) {
  const setWorkshopStep = useCourseStore((state) => state.setWorkshopStep);
  const initialStep = useCourseStore((state) => state.workshopSteps[module.slug] ?? 0);

  // Guard against a stored step that exceeds the current module's step count
  const safeInitialStep = Math.min(initialStep, module.steps.length - 1);
  const [currentStep, setCurrentStep] = useState<number>(safeInitialStep);
  // All steps before the initial step were already completed in a previous session
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    Array.from({ length: safeInitialStep }, (_, i) => i)
  );
  const [code, setCode] = useState<string>(module.steps[safeInitialStep].starterCode);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  // Incremented on each run so OutputPanel remounts with the correct default tab
  const [runCount, setRunCount] = useState<number>(0);

  const handleCheck = useCallback(async () => {
    if (isChecking) return;
    setIsChecking(true);
    setFeedback(null);

    const result = await runGoCode(code);
    setRunResult(result);
    setRunCount((c) => c + 1);

    if (result.stderr || result.error) {
      setFeedback({ ok: false, message: "Fix the errors above and try again." });
      setIsChecking(false);
      return;
    }

    const step = module.steps[currentStep];
    const passed = step.validate(code);
    setIsChecking(false);

    if (passed) {
      setFeedback({ ok: true, message: step.successMessage });
      setTimeout(() => {
        const isLast = currentStep === module.steps.length - 1;
        if (isLast) {
          setShowCelebration(true);
          setTimeout(() => { onComplete(); }, 1000);
        } else {
          const nextStep = currentStep + 1;
          setCompletedSteps((prev) => [...prev, currentStep]);
          setWorkshopStep(module.slug, nextStep);
          setCurrentStep(nextStep);
          setCode(module.steps[nextStep].starterCode);
          setFeedback(null);
          setHintVisible(false);
          setRunResult(null);
        }
      }, 800);
    } else {
      setFeedback({ ok: false, message: "Not quite — check your code and try again." });
    }
  }, [isChecking, code, currentStep, module, setWorkshopStep, onComplete]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        handleCheck();
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [handleCheck]);

  function handleStepClick(step: number) {
    setCurrentStep(step);
    setCode(module.steps[step].starterCode);
    setFeedback(null);
    setHintVisible(false);
    setRunResult(null);
  }

  return (
    <div className="flex flex-col gap-6">
      <StepProgress
        steps={module.steps.length}
        currentStep={currentStep}
        completedSteps={completedSteps}
        onStepClick={handleStepClick}
      />

      <StepInstruction
        step={module.steps[currentStep]}
        stepNumber={currentStep + 1}
        onShowHint={() => setHintVisible(!hintVisible)}
        hintVisible={hintVisible}
      />

      <GoEditor value={code} onChange={setCode} />

      <div className="flex items-center gap-4">
        <button
          className="bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg disabled:opacity-50"
          onClick={handleCheck}
          disabled={isChecking}
        >
          {isChecking ? "Running…" : "Check Code"}
        </button>
        <span className="text-navy-500 text-xs">⌘ Enter (Mac) · Ctrl+Enter (Win/Linux)</span>
      </div>

      {feedback && (
        <div
          className={
            feedback.ok
              ? "bg-go-green/20 border border-go-green text-go-green rounded-lg px-4 py-3"
              : "bg-go-red/20 border border-go-red text-go-red rounded-lg px-4 py-3"
          }
        >
          {feedback.message}
        </div>
      )}

      {runResult && (
        <OutputPanel
          key={runCount}
          stdout={runResult.stdout}
          stderr={runResult.stderr}
          error={runResult.error}
          defaultTab={runResult.stderr || runResult.error ? "errors" : "output"}
        />
      )}

      {showCelebration && <CelebrationOverlay />}
    </div>
  );
}
