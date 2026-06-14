"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CourseState = {
  completedSlugs: string[];
  workshopSteps: Record<string, number>;
  // Saved user solutions: slug → step index → code
  workshopSolutions: Record<string, Record<number, string>>;
  // Bloom-stem progress: stem slug → highest Bloom level revealed (1–6)
  stemLevels: Record<string, number>;
  markComplete: (slug: string) => void;
  setWorkshopStep: (slug: string, step: number) => void;
  saveStepSolution: (slug: string, step: number, code: string) => void;
  reachStemLevel: (slug: string, level: number) => void;
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      completedSlugs: [],
      workshopSteps: {},
      workshopSolutions: {},
      stemLevels: {},
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
    }),
    { name: "go-course-progress" }
  )
);
