"use client";
import { useState } from "react";
import type { WorkshopStep } from "@/lib/curriculum/types";

type Props = {
  step: WorkshopStep;
  stepNumber: number;
  onShowHint: () => void;
  hintVisible: boolean;
};

export default function StepInstruction({ step, stepNumber, onShowHint, hintVisible }: Props) {
  return (
    <div>
      <p className="text-go-cyan text-xs uppercase tracking-widest mb-2">Step {stepNumber}</p>
      <div className="border-l-4 border-go-cyan bg-navy-800 p-4 rounded-r-lg mb-4">
        <p className="text-slate-300">{step.instruction}</p>
      </div>
      <button className="text-go-yellow text-sm underline" onClick={onShowHint}>
        {hintVisible ? "Hide Hint" : "Show Hint"}
      </button>
      {hintVisible && (
        <div className="mt-3 bg-navy-900 rounded-lg p-4 border border-navy-600">
          <pre className="font-mono text-sm text-slate-300 overflow-x-auto whitespace-pre">{step.hint}</pre>
        </div>
      )}
    </div>
  );
}
