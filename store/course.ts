"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { EnginePreference } from "@/lib/go-runner";

type CourseState = {
  completedSlugs: string[];
  workshopSteps: Record<string, number>;
  // Saved user solutions: slug → step index → code
  workshopSolutions: Record<string, Record<number, string>>;
  // Bloom-stem progress: stem slug → highest Bloom level revealed (1–6)
  stemLevels: Record<string, number>;
  // Recall Deck schedule: card id → next-due epoch ms + current interval (days)
  deckSchedule: Record<string, { due: number; interval: number }>;
  // Where Go code runs: "auto" = in-browser wasm runtime when possible
  enginePreference: EnginePreference;
  markComplete: (slug: string) => void;
  setWorkshopStep: (slug: string, step: number) => void;
  saveStepSolution: (slug: string, step: number, code: string) => void;
  reachStemLevel: (slug: string, level: number) => void;
  reviewCard: (id: string, grade: "again" | "fuzzy" | "good") => void;
  setEnginePreference: (pref: EnginePreference) => void;
};

const DAY_MS = 86_400_000;

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      completedSlugs: [],
      workshopSteps: {},
      workshopSolutions: {},
      stemLevels: {},
      deckSchedule: {},
      enginePreference: "auto",
      markComplete: (slug) =>
        set((state) => ({
          completedSlugs: state.completedSlugs.includes(slug)
            ? state.completedSlugs
            : [...state.completedSlugs, slug],
        })),
      setWorkshopStep: (slug, step) =>
        set((state) => ({
          workshopSteps: { ...state.workshopSteps, [slug]: step },
        })),
      saveStepSolution: (slug, step, code) =>
        set((state) => ({
          workshopSolutions: {
            ...state.workshopSolutions,
            [slug]: { ...(state.workshopSolutions[slug] ?? {}), [step]: code },
          },
        })),
      reachStemLevel: (slug, level) =>
        set((state) => ({
          stemLevels: {
            ...state.stemLevels,
            [slug]: Math.max(state.stemLevels[slug] ?? 0, level),
          },
        })),
      setEnginePreference: (pref) => set({ enginePreference: pref }),
      // Spaced repetition: ×2.5 the interval on a confident recall, reset to
      // tomorrow on a fuzzy one, and re-show this session on a miss.
      reviewCard: (id, grade) =>
        set((state) => {
          const now = Date.now();
          const prev = state.deckSchedule[id];
          let interval: number;
          let due: number;
          if (grade === "again") {
            interval = 0;
            due = now; // stays due — the deck re-queues it this session
          } else if (grade === "fuzzy") {
            interval = 1;
            due = now + DAY_MS;
          } else {
            interval = prev && prev.interval >= 1 ? prev.interval * 2.5 : 1;
            due = now + interval * DAY_MS;
          }
          return {
            deckSchedule: { ...state.deckSchedule, [id]: { due, interval } },
          };
        }),
    }),
    { name: "go-course-progress" }
  )
);
