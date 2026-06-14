"use client";
import { useState } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/course";
import { BLOOM_META } from "@/lib/stems";
import type { Stem, StemLevel } from "@/lib/stems/types";
import ThemeToggle from "@/components/ui/ThemeToggle";
import RecallChips from "./levels/RecallChips";
import TapFlow from "./levels/TapFlow";
import ApplyChecklist from "./levels/ApplyChecklist";
import TradeoffAnalyze from "./levels/TradeoffAnalyze";
import SpotTheFlaw from "./levels/SpotTheFlaw";
import SpecBuilder from "./levels/SpecBuilder";

function LevelBody({ level, onEngage }: { level: StemLevel; onEngage: () => void }) {
  switch (level.level) {
    case 1:
      return <RecallChips data={level} onEngage={onEngage} />;
    case 2:
      return <TapFlow data={level} onEngage={onEngage} />;
    case 3:
      return <ApplyChecklist data={level} onEngage={onEngage} />;
    case 4:
      return <TradeoffAnalyze data={level} onEngage={onEngage} />;
    case 5:
      return <SpotTheFlaw data={level} onEngage={onEngage} />;
    case 6:
      return <SpecBuilder data={level} onEngage={onEngage} />;
  }
}

export default function StemShell({ stem }: { stem: Stem }) {
  const reachStemLevel = useCourseStore((s) => s.reachStemLevel);

  // One level at a time. `current` is the viewed level (1–6); `unlocked` is the
  // highest level the learner has advanced to this session. Kept local so the
  // gated reveal is deterministic and free of hydration mismatch; progress is
  // persisted via reachStemLevel for the Atlas to read later.
  const [current, setCurrent] = useState(1);
  const [unlocked, setUnlocked] = useState(1);

  const total = stem.levels.length;
  const level = stem.levels[current - 1];
  const meta = BLOOM_META[level.level];
  const isLast = current === total;

  const goTo = (n: number) => {
    if (n < 1 || n > total || n > unlocked) return;
    setCurrent(n);
  };

  const advance = () => {
    const next = Math.min(current + 1, total);
    setUnlocked((u) => Math.max(u, next));
    setCurrent(next);
    reachStemLevel(stem.slug, next);
  };

  return (
    <main className="min-h-screen bg-navy-950">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="mx-auto max-w-3xl px-4 py-10">
        <Link href="/atlas" className="text-go-blue text-sm hover:underline">
          ← Atlas
        </Link>

        <header className="mt-4 mb-8">
          <div className="flex items-center gap-3">
            <span className="text-4xl">{stem.icon}</span>
            <div>
              <h1 className="text-3xl font-bold font-serif text-stone-900">{stem.title}</h1>
              <p className="text-navy-500 text-xs">Deep stem · ~{stem.estimatedMinutes} min</p>
            </div>
          </div>
          <p className="mt-4 text-go-cyan text-sm border-l-2 border-go-cyan pl-3">
            {stem.oneLiner}
          </p>

          {/* Bloom ladder — also navigation to any unlocked level */}
          <div className="mt-6 flex items-center gap-1.5">
            {stem.levels.map((l) => {
              const m = BLOOM_META[l.level];
              const isUnlocked = l.level <= unlocked;
              const isCurrent = l.level === current;
              return (
                <button
                  key={l.level}
                  onClick={() => goTo(l.level)}
                  disabled={!isUnlocked}
                  title={`L${l.level} · ${m.name}${isUnlocked ? "" : " (locked)"}`}
                  className={`flex-1 text-center ${isUnlocked ? "cursor-pointer" : "cursor-not-allowed"}`}
                >
                  <div
                    className={`h-1.5 rounded-full transition-colors ${
                      isCurrent ? m.bar : isUnlocked ? `${m.bar} opacity-50` : "bg-navy-700"
                    }`}
                  />
                  <span
                    className={`mt-1 block text-[10px] ${isCurrent ? m.text : "text-navy-500"}`}
                  >
                    {m.name}
                  </span>
                </button>
              );
            })}
          </div>
        </header>

        {/* Only the current level is shown */}
        <section>
          <div className="mb-3 flex items-center gap-2">
            <span className={`${meta.text} font-mono text-xs font-bold uppercase tracking-wide`}>
              L{level.level} · {meta.name}
            </span>
            <span className="text-navy-500 text-xs">
              — {meta.verb} · step {current} of {total}
            </span>
          </div>
          <h2 className="text-xl font-bold font-serif text-stone-900 mb-1">{level.title}</h2>
          <p className="text-stone-500 text-sm mb-4">{level.lead}</p>
          <LevelBody level={level} onEngage={() => reachStemLevel(stem.slug, level.level)} />
        </section>

        {/* Level navigation rails */}
        <nav className="mt-10 flex items-center justify-between border-t border-navy-700 pt-6">
          {current > 1 ? (
            <button
              onClick={() => goTo(current - 1)}
              className="text-stone-700 text-sm hover:text-go-blue cursor-pointer"
            >
              ← {BLOOM_META[stem.levels[current - 2].level].name}
            </button>
          ) : (
            <span />
          )}

          {!isLast ? (
            <button
              onClick={advance}
              className="bg-go-blue text-navy-950 px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Continue → L{current + 1} · {BLOOM_META[stem.levels[current].level].name}
            </button>
          ) : (
            <Link
              href="/atlas"
              className="bg-go-green text-navy-950 px-4 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity"
            >
              Stem complete 🎉 Back to the Atlas
            </Link>
          )}
        </nav>
      </div>
    </main>
  );
}
