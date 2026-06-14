"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { useCourseStore } from "@/store/course";
import { deck } from "@/lib/orient";
import type { ReviewGrade } from "@/lib/orient/types";

// L1-style retrieval, scheduled. One card at a time: recall, reveal, then grade
// yourself. The grade feeds the store's spaced-repetition scheduler.

const DAY_MS = 86_400_000;
const byId = Object.fromEntries(deck.map((c) => [c.id, c]));

type Schedule = Record<string, { due: number; interval: number }>;

// Cards never seen, or whose next-due time has passed, are due now.
function buildDueQueue(schedule: Schedule, now: number): string[] {
  return deck.filter((c) => !schedule[c.id] || schedule[c.id].due <= now).map((c) => c.id);
}

function nextDueLabel(schedule: Schedule, now: number): string | null {
  const times = deck.map((c) => schedule[c.id]?.due).filter((d): d is number => typeof d === "number");
  if (times.length === 0) return null;
  const diff = Math.min(...times) - now;
  if (diff <= 0) return "now";
  const hours = Math.round(diff / 3_600_000);
  return hours < 24 ? `in ~${Math.max(1, hours)}h` : `in ~${Math.round(hours / 24)}d`;
}

type Session = { queue: string[]; pos: number; nextDue: string | null };

export default function RecallDeck() {
  const reviewCard = useCourseStore((s) => s.reviewCard);

  // The schedule is persisted (client-only) state, so the session — which cards
  // are due, in what order — is snapshotted once on mount to stay hydration-safe
  // and deterministic. All time reads live here and in the grade handler, never
  // during render.
  const [session, setSession] = useState<Session | null>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const { deckSchedule } = useCourseStore.getState();
    const now = Date.now();
    // eslint-disable-next-line react-hooks/set-state-in-effect -- one-time client snapshot of persisted schedule + time
    setSession({ queue: buildDueQueue(deckSchedule, now), pos: 0, nextDue: nextDueLabel(deckSchedule, now) });
  }, []);

  if (!session) {
    return <div className="h-48 rounded-xl border border-navy-600 bg-navy-900 animate-pulse" />;
  }

  const { queue, pos, nextDue } = session;
  const remaining = queue.length - pos;
  const done = pos >= queue.length;

  const grade = (g: ReviewGrade) => {
    const id = queue[pos];
    reviewCard(id, g);
    const schedule = useCourseStore.getState().deckSchedule;
    const label = nextDueLabel(schedule, Date.now());
    setRevealed(false);
    setSession((s) =>
      s
        ? {
            // "again" re-queues the card later this session (again-now behavior).
            queue: g === "again" ? [...s.queue, id] : s.queue,
            pos: s.pos + 1,
            nextDue: label,
          }
        : s
    );
  };

  if (done) {
    return (
      <div className="rounded-xl border border-go-green/50 bg-navy-800 p-8 text-center">
        <p className="text-3xl mb-2">🎉</p>
        <p className="text-stone-900 font-bold text-lg">All caught up</p>
        <p className="text-stone-500 text-sm mt-1">
          {nextDue ? `Next review due ${nextDue}.` : "Come back tomorrow to keep the streak."}
        </p>
        <Link href="/atlas" className="inline-block mt-5 text-go-blue text-sm hover:underline">
          ← Back to the Atlas
        </Link>
      </div>
    );
  }

  const card = byId[queue[pos]];

  return (
    <div>
      <div className="flex items-center justify-between mb-3">
        <span className="text-navy-500 text-xs font-mono uppercase tracking-wide">
          {remaining} due · {deck.length} in deck
        </span>
        <span className="text-navy-500 text-xs">Grade yourself honestly — that&apos;s the whole trick.</span>
      </div>

      <div className="rounded-xl border border-navy-600 bg-navy-800 p-8 min-h-[12rem] flex flex-col">
        <p className="text-go-cyan text-xs font-mono uppercase tracking-wide mb-3">Recall</p>
        <p className="text-stone-900 text-lg font-bold">{card.front}</p>

        {revealed ? (
          <p className="mt-4 text-stone-700 text-sm border-l-2 border-go-cyan pl-3">{card.back}</p>
        ) : (
          <div className="mt-auto pt-6">
            <button
              onClick={() => setRevealed(true)}
              className="bg-go-blue text-navy-950 px-5 py-2 rounded-lg text-sm font-bold hover:opacity-90 transition-opacity cursor-pointer"
            >
              Show answer
            </button>
          </div>
        )}
      </div>

      {revealed && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          <button
            onClick={() => grade("again")}
            className="rounded-lg border border-go-red/50 bg-go-red/10 text-go-red font-bold text-sm py-3 hover:bg-go-red/20 transition-colors cursor-pointer"
          >
            Again
            <span className="block text-[10px] font-normal text-stone-500">missed it · now</span>
          </button>
          <button
            onClick={() => grade("fuzzy")}
            className="rounded-lg border border-go-yellow/50 bg-go-yellow/10 text-go-yellow font-bold text-sm py-3 hover:bg-go-yellow/20 transition-colors cursor-pointer"
          >
            Fuzzy
            <span className="block text-[10px] font-normal text-stone-500">shaky · tomorrow</span>
          </button>
          <button
            onClick={() => grade("good")}
            className="rounded-lg border border-go-green/50 bg-go-green/10 text-go-green font-bold text-sm py-3 hover:bg-go-green/20 transition-colors cursor-pointer"
          >
            Good
            <span className="block text-[10px] font-normal text-stone-500">solid · ×2.5</span>
          </button>
        </div>
      )}
    </div>
  );
}
