"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CourseState = {
  completedSlugs: string[];
  workshopSteps: Record<string, number>;
  // Saved user solutions: slug → step index → code
  workshopSolutions: Record<string, Record<number, string>>;
  markComplete: (slug: string) => void;
  setWorkshopStep: (slug: string, step: number) => void;
  saveStepSolution: (slug: string, step: number, code: string) => void;
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      completedSlugs: [],
      workshopSteps: {},
      workshopSolutions: {},
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
    }),
    { name: "go-course-progress" }
  )
);
