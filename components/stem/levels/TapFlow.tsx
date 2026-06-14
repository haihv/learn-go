"use client";
import { useState } from "react";
import type { FlowLevel } from "@/lib/stems/types";

// L2 Understand — a pipeline; tap each stage for the "why". Forces a causal
// model and ends with a one-line takeaway.
export default function TapFlow({
  data,
  onEngage,
}: {
  data: FlowLevel;
  onEngage: () => void;
}) {
  const [active, setActive] = useState<number | null>(null);
  const [seen, setSeen] = useState<Set<number>>(new Set());

  const select = (i: number) => {
    onEngage();
    setActive(i);
    setSeen((prev) => new Set(prev).add(i));
  };

  const allSeen = seen.size === data.stages.length;

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {data.stages.map((s, i) => (
          <div key={s.label} className="flex items-center gap-2">
            <button
              onClick={() => select(i)}
              className={`font-mono text-sm rounded-md border px-3 py-2 transition-colors cursor-pointer ${
                active === i
                  ? "border-go-blue bg-go-blue/20 text-stone-900"
                  : seen.has(i)
                    ? "border-navy-600 bg-navy-800 text-stone-500"
                    : "border-navy-600 bg-navy-900 text-stone-800 hover:border-go-blue"
              }`}
            >
              {s.label}
            </button>
            {i < data.stages.length - 1 && (
              <span className="text-navy-500" aria-hidden>
                →
              </span>
            )}
          </div>
        ))}
      </div>

      <div className="mt-4 min-h-[3.5rem] rounded-lg border border-navy-600 bg-navy-800 p-4">
        {active === null ? (
          <p className="text-navy-500 text-sm">Tap a stage to see why it happens.</p>
        ) : (
          <p className="text-stone-700 text-sm">{data.stages[active].why}</p>
        )}
      </div>

      {allSeen && (
        <p className="mt-4 text-go-blue text-sm font-bold border-l-2 border-go-blue pl-3">
          {data.takeaway}
        </p>
      )}
    </div>
  );
}
