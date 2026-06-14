"use client";
import { useState } from "react";
import type { CreateLevel } from "@/lib/stems/types";

// L6 Create — a spec generator that composes the learner's own choices into a
// build spec, plus the real build card stating the deliverable in one sentence
// with implicit acceptance criteria.
export default function SpecBuilder({
  data,
  onEngage,
}: {
  data: CreateLevel;
  onEngage: () => void;
}) {
  const [picks, setPicks] = useState<Record<string, string>>({});

  const choose = (id: string, option: string) => {
    onEngage();
    setPicks((prev) => ({ ...prev, [id]: option }));
  };

  const allChosen = data.choices.every((c) => picks[c.id]);
  const spec = data.specTemplate.replace(/\{(\w+)\}/g, (_m, key: string) =>
    picks[key] ? picks[key] : `{${key}}`
  );

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        {data.choices.map((c) => (
          <div key={c.id}>
            <p className="text-xs uppercase tracking-wide text-navy-500 mb-2">{c.label}</p>
            <div className="flex flex-wrap gap-2">
              {c.options.map((opt) => {
                const chosen = picks[c.id] === opt;
                return (
                  <button
                    key={opt}
                    onClick={() => choose(c.id, opt)}
                    className={`rounded-md border px-3 py-1.5 text-sm transition-colors cursor-pointer ${
                      chosen
                        ? "border-go-red bg-go-red/15 text-stone-900"
                        : "border-navy-600 bg-navy-900 text-stone-700 hover:border-go-red"
                    }`}
                  >
                    {opt}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="rounded-lg border border-navy-600 bg-navy-800 p-4">
        <p className="text-xs uppercase tracking-wide text-navy-500 mb-1">Your spec</p>
        <p className={allChosen ? "text-stone-900 text-sm" : "text-navy-500 text-sm"}>{spec}</p>
      </div>

      <div className="rounded-lg border-2 border-go-red/50 bg-navy-900 p-4">
        <p className="text-go-red text-xs uppercase tracking-wide font-bold mb-2">
          🛠 Build card — {data.buildCard.title}
        </p>
        <p className="text-stone-800 text-sm mb-3">{data.buildCard.deliverable}</p>
        <p className="text-xs uppercase tracking-wide text-navy-500 mb-1">Acceptance criteria</p>
        <ul className="list-disc list-inside flex flex-col gap-1">
          {data.buildCard.acceptance.map((a, i) => (
            <li key={i} className="text-stone-700 text-sm">
              {a}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
