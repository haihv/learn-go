"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

type CourseState = {
  completedSlugs: string[];
  workshopSteps: Record<string, number>;
  markComplete: (slug: string) => void;
  setWorkshopStep: (slug: string, step: number) => void;
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      completedSlugs: [],
      workshopSteps: {},
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
    }),
    { name: "go-course-progress" }
  )
);
