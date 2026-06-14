"use client";
import { useState } from "react";
import type { EvaluateLevel } from "@/lib/stems/types";

// L5 Evaluate — spot-the-flaw / bust-a-myth MCQ. The wrong answers must be
// genuinely tempting; verdicts use ✓/✗ plus color, never color alone.
export default function SpotTheFlaw({
  data,
  onEngage,
}: {
  data: EvaluateLevel;
  onEngage: () => void;
}) {
  const [picked, setPicked] = useState<number | null>(null);

  return (
    <div>
      <p className="text-stone-800 text-sm font-bold mb-4">{data.prompt}</p>
      <div className="flex flex-col gap-3">
        {data.options.map((opt, i) => {
          const isPicked = picked === i;
          const revealed = picked !== null;
          return (
            <div key={i}>
              <button
                disabled={revealed}
                onClick={() => {
                  onEngage();
                  setPicked(i);
                }}
                className={`w-full text-left rounded-lg border p-3 text-sm transition-colors ${
                  revealed ? "cursor-default" : "cursor-pointer hover:border-go-purple"
                } ${
                  isPicked
                    ? opt.correct
                      ? "border-go-green bg-go-green/15"
                      : "border-go-red bg-go-red/15"
                    : revealed && opt.correct
                      ? "border-go-green/60 bg-navy-800"
                      : "border-navy-600 bg-navy-900"
                }`}
              >
                <span className="text-stone-800">
                  {revealed && (
                    <span aria-hidden className="font-bold mr-1">
                      {opt.correct ? "✓" : isPicked ? "✗" : ""}
                    </span>
                  )}
                  {opt.text}
                </span>
              </button>
              {revealed && (isPicked || opt.correct) && (
                <p className="mt-1 ml-1 text-xs text-stone-500">{opt.reveal}</p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
