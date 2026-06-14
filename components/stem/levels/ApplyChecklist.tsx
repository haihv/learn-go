"use client";
import { useState } from "react";
import type { ApplyLevel } from "@/lib/stems/types";

// L3 Apply — a build checklist you'd actually use this week, plus an optional
// code peek. Concrete steps, not theory.
export default function ApplyChecklist({
  data,
  onEngage,
}: {
  data: ApplyLevel;
  onEngage: () => void;
}) {
  const [checked, setChecked] = useState<Set<number>>(new Set());
  const [showCode, setShowCode] = useState(false);

  const toggle = (i: number) => {
    onEngage();
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div>
      <ul className="flex flex-col gap-2">
        {data.checklist.map((item, i) => {
          const done = checked.has(i);
          return (
            <li key={i}>
              <button
                onClick={() => toggle(i)}
                className="flex w-full items-start gap-3 text-left rounded-lg border border-navy-600 bg-navy-900 p-3 hover:border-go-green transition-colors cursor-pointer"
              >
                <span
                  className={`mt-0.5 shrink-0 h-5 w-5 rounded border flex items-center justify-center text-xs ${
                    done
                      ? "border-go-green bg-go-green text-navy-950"
                      : "border-navy-500 text-transparent"
                  }`}
                  aria-hidden
                >
                  ✓
                </span>
                <span className={done ? "text-navy-500 line-through text-sm" : "text-stone-700 text-sm"}>
                  {item}
                </span>
              </button>
            </li>
          );
        })}
      </ul>

      {data.codePeek && (
        <div className="mt-4">
          <button
            onClick={() => {
              onEngage();
              setShowCode((v) => !v);
            }}
            className="text-go-green text-sm font-bold cursor-pointer hover:underline"
          >
            {showCode ? "▼ Hide code peek" : "▶ Code peek"}
          </button>
          {showCode && (
            <pre className="mt-2 overflow-x-auto rounded-lg border border-navy-600 bg-navy-950 p-4 text-sm">
              <code className="font-mono text-stone-800">{data.codePeek}</code>
            </pre>
          )}
        </div>
      )}
    </div>
  );
}
