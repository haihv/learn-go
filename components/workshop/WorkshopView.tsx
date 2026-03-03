"use client";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useCourseStore } from "@/store/course";
import StepProgress from "@/components/workshop/StepProgress";
import StepInstruction from "@/components/workshop/StepInstruction";
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

  const [currentStep, setCurrentStep] = useState<number>(initialStep);
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);
  const [code, setCode] = useState<string>(module.steps[initialStep].starterCode);
  const [feedback, setFeedback] = useState<Feedback | null>(null);
  const [hintVisible, setHintVisible] = useState<boolean>(false);
  const [showCelebration, setShowCelebration] = useState<boolean>(false);

  function handleCheck() {
    const step = module.steps[currentStep];
    const passed = step.validate(code);

    if (passed) {
      setFeedback({ ok: true, message: step.successMessage });

      setTimeout(() => {
        const isLast = currentStep === module.steps.length - 1;

        if (isLast) {
          setShowCelebration(true);
          setTimeout(() => {
            onComplete();
          }, 1000);
        } else {
          const nextStep = currentStep + 1;
          setCompletedSteps((prev) => [...prev, currentStep]);
          setWorkshopStep(module.slug, nextStep);
          setCurrentStep(nextStep);
          setCode(module.steps[nextStep].starterCode);
          setFeedback(null);
          setHintVisible(false);
        }
      }, 800);
    } else {
      setFeedback({ ok: false, message: "Not quite — check your code and try again." });
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <StepProgress
        steps={module.steps.length}
        currentStep={currentStep}
        completedSteps={completedSteps}
      />

      <GoEditor value={code} onChange={setCode} />

      <button
        className="bg-go-cyan text-navy-950 font-bold px-4 py-2 rounded-lg"
        onClick={handleCheck}
      >
        Check Code
      </button>

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

      <StepInstruction
        step={module.steps[currentStep]}
        stepNumber={currentStep + 1}
        onShowHint={() => setHintVisible(!hintVisible)}
        hintVisible={hintVisible}
      />

      {showCelebration && <CelebrationOverlay />}
    </div>
  );
}
