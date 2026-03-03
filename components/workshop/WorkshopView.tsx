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
const CodeBlock = dynamic(() => import("@/components/lesson/CodeBlock"), { ssr: false });

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
  const saveStepSolution = useCourseStore((state) => state.saveStepSolution);
  const initialStep = useCourseStore((state) => state.workshopSteps[module.slug] ?? 0);
  // ?? {} must be outside the selector — returning a new {} inside the selector
  // creates a different reference every render, causing an infinite loop.
  const savedSolutions = useCourseStore((state) => state.workshopSolutions[module.slug]) ?? {};

  const safeInitialStep = Math.min(initialStep, module.steps.length - 1);
  const [currentStep, setCurrentStep] = useState<number>(safeInitialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>(
    Array.from({ length: safeInitialStep }, (_, i) => i)
  );
  const [code, setCode] = useState<string>(
    savedSolutions[safeInitialStep] ?? module.steps[safeInitialStep].starterCode
  );
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);
  const [isChecking, setIsChecking] = useState<boolean>(false);
  const [runResult, setRunResult] = useState<RunResult | null>(null);
  const [runCount, setRunCount] = useState<number>(0);
  // Set when the current step's validation passes — shows the Next Step button
  const [readyToAdvance, setReadyToAdvance] = useState<boolean>(false);

  const handleCheck = useCallback(async () => {
    if (isChecking) return;
    setIsChecking(true);
    setFeedback(null);
    setReadyToAdvance(false);

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
      // Save the passing code as the user's solution for this step
      saveStepSolution(module.slug, currentStep, code);
      setFeedback({ ok: true, message: step.successMessage });
      // Only offer to advance if this step wasn't already completed before
      const alreadyDone = completedSteps.includes(currentStep);
      if (!alreadyDone) setReadyToAdvance(true);
    } else {
      setFeedback({ ok: false, message: "Not quite — check your code and try again." });
    }
  }, [isChecking, code, currentStep, module, completedSteps, saveStepSolution]);

  function handleAdvance() {
    const isLast = currentStep === module.steps.length - 1;
    if (isLast) {
      setShowCelebration(true);
      setTimeout(() => { onComplete(); }, 1000);
    } else {
      const nextStep = currentStep + 1;
      setCompletedSteps((prev) => [...prev, currentStep]);
      setWorkshopStep(module.slug, nextStep);
      setCurrentStep(nextStep);
      setCode(savedSolutions[nextStep] ?? module.steps[nextStep].starterCode);
      setFeedback(null);
      setHintVisible(false);
      setRunResult(null);
      setReadyToAdvance(false);
    }
  }

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
    // Load the user's saved solution if available, otherwise the starter code
    setCode(savedSolutions[step] ?? module.steps[step].starterCode);
    setFeedback(null);
    setHintVisible(false);
    setRunResult(null);
    setReadyToAdvance(false);
  }

  const isLastStep = currentStep === module.steps.length - 1;

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
      />

      <GoEditor value={code} onChange={setCode} />

      <div className="flex items-center gap-4">
        {readyToAdvance ? (
          <button
            className="bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg"
            onClick={handleAdvance}
          >
            {isLastStep ? "Finish Workshop 🎉" : "Next Step →"}
          </button>
        ) : (
          <button
            className="bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg disabled:opacity-50"
            onClick={handleCheck}
            disabled={isChecking}
          >
            {isChecking ? "Running…" : "Check Code"}
          </button>
        )}
        {!readyToAdvance && (
          <span className="text-navy-500 text-xs">⌘ Enter (Mac) · Ctrl+Enter (Win/Linux)</span>
        )}
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

      {/* Hint is at the bottom so it doesn't obscure the workspace */}
      <div className="border-t border-navy-700 pt-4">
        <button
          className="text-go-yellow text-sm underline"
          onClick={() => setHintVisible((v) => !v)}
        >
          {hintVisible ? "Hide Hint" : "💡 Show Hint"}
        </button>
        {hintVisible && (
          <div className="mt-3">
            <CodeBlock code={module.steps[currentStep].hint} />
          </div>
        )}
      </div>

      {showCelebration && <CelebrationOverlay />}
    </div>
  );
}
