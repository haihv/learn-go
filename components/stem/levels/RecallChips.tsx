"use client";
import { useState } from "react";
import type { RecallLevel } from "@/lib/stems/types";

// L1 Remember — flip-to-reveal term chips. Retrieval practice: the learner
// recalls the definition before flipping, rather than re-reading prose.
export default function RecallChips({
  data,
  onEngage,
}: {
  data: RecallLevel;
  onEngage: () => void;
}) {
  const [flipped, setFlipped] = useState<Set<number>>(new Set());

  const toggle = (i: number) => {
    onEngage();
    setFlipped((prev) => {
      const next = new Set(prev);
      if (next.has(i)) next.delete(i);
      else next.add(i);
      return next;
    });
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {data.terms.map((t, i) => {
        const open = flipped.has(i);
        return (
          <button
            key={t.term}
            onClick={() => toggle(i)}
            className={`text-left rounded-lg border p-4 transition-colors cursor-pointer ${
              open
                ? "border-go-cyan bg-navy-800"
                : "border-navy-600 bg-navy-900 hover:border-go-cyan"
            }`}
          >
            <span className="font-mono font-bold text-go-cyan">{t.term}</span>
            {open ? (
              <p className="text-stone-700 text-sm mt-2">{t.reveal}</p>
            ) : (
              <p className="text-navy-500 text-xs mt-2">Tap to reveal — try to recall it first.</p>
            )}
          </button>
        );
      })}
    </div>
  );
}
