"use client";
import { useCourseStore } from "@/store/course";
import { curriculum } from "@/lib/curriculum";

type ProgressReturn = {
  isComplete: (slug: string) => boolean;
  markComplete: (slug: string) => void;
  completedCount: number;
  totalCount: number;
};

export function useProgress(): ProgressReturn {
  const completedSlugs = useCourseStore((state) => state.completedSlugs);
  const storeMarkComplete = useCourseStore((state) => state.markComplete);

  const isComplete = (slug: string): boolean => completedSlugs.includes(slug);

  const markComplete = (slug: string): void => {
    storeMarkComplete(slug);
  };

  return {
    isComplete,
    markComplete,
    completedCount: completedSlugs.length,
    totalCount: curriculum.length,
  };
}
