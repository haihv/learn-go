"use client";
import { useState } from "react";
import type { AnalyzeLevel } from "@/lib/stems/types";

// L4 Analyze — a tradeoff slider (every gain has a bill) plus an either/or
// toggle. The slider surfaces the cost of moving along an axis; the toggle
// forces a judgement with a justification.
export default function TradeoffAnalyze({
  data,
  onEngage,
}: {
  data: AnalyzeLevel;
  onEngage: () => void;
}) {
  const [pos, setPos] = useState(0);
  const [pick, setPick] = useState<"A" | "B" | null>(null);

  // Nearest stop to the current slider position wins.
  const nearest = data.slider.stops.reduce((best, s) =>
    Math.abs(s.at - pos) < Math.abs(best.at - pos) ? s : best
  );

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="flex justify-between text-xs text-navy-500 mb-1">
          <span>{data.slider.leftLabel}</span>
          <span>{data.slider.rightLabel}</span>
        </div>
        <input
          type="range"
          min={0}
          max={100}
          value={pos}
          onChange={(e) => {
            onEngage();
            setPos(Number(e.target.value));
          }}
          className="w-full accent-go-yellow cursor-pointer"
          aria-label={`${data.slider.leftLabel} to ${data.slider.rightLabel}`}
        />
        <div className="mt-3 rounded-lg border border-go-yellow/40 bg-navy-800 p-4">
          <p className="text-stone-700 text-sm">{nearest.note}</p>
        </div>
      </div>

      <div>
        <p className="text-stone-800 text-sm font-bold mb-3">{data.toggle.question}</p>
        <div className="flex flex-col sm:flex-row gap-3">
          {(["A", "B"] as const).map((key) => {
            const label = key === "A" ? data.toggle.optionA : data.toggle.optionB;
            const chosen = pick === key;
            const correct = data.toggle.answer === key;
            return (
              <button
                key={key}
                onClick={() => {
                  onEngage();
                  setPick(key);
                }}
                className={`flex-1 rounded-lg border p-3 text-sm text-left transition-colors cursor-pointer ${
                  chosen
                    ? correct
                      ? "border-go-green bg-go-green/15 text-stone-900"
                      : "border-go-red bg-go-red/15 text-stone-900"
                    : "border-navy-600 bg-navy-900 text-stone-700 hover:border-go-yellow"
                }`}
              >
                {chosen && <span aria-hidden>{correct ? "✓ " : "✗ "}</span>}
                {label}
              </button>
            );
          })}
        </div>
        {pick && (
          <p className="mt-3 text-stone-700 text-sm border-l-2 border-go-yellow pl-3">
            {data.toggle.why}
          </p>
        )}
      </div>
    </div>
  );
}
