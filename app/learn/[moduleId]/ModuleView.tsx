"use client";
import { useRouter } from "next/navigation";
import { curriculum, getModuleIndex } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import TopBar from "@/components/layout/TopBar";
import LessonContent from "@/components/lesson/LessonContent";
import QuizBlock from "@/components/lesson/QuizBlock";
import WorkshopView from "@/components/workshop/WorkshopView";
import LabView from "@/components/lab/LabView";
import type { CourseModule } from "@/lib/curriculum/types";

type Props = {
  module: CourseModule;
};

export default function ModuleView({ module }: Props) {
  const router = useRouter();
  const { isComplete, markComplete } = useProgress();

  const idx = getModuleIndex(module.slug);
  const prev = curriculum[idx - 1];
  const next = curriculum[idx + 1];

  const handleComplete = () => {
    markComplete(module.slug);
    if (next) router.push(`/learn/${next.slug}`);
  };

  const handleMarkComplete = () => {
    markComplete(module.slug);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        module={module}
        onPrev={() => prev && router.push(`/learn/${prev.slug}`)}
        onNext={() => next && router.push(`/learn/${next.slug}`)}
        hasPrev={!!prev}
        hasNext={!!next}
        isComplete={isComplete(module.slug)}
        onMarkComplete={handleMarkComplete}
      />
      <div className="flex-1 overflow-y-auto">
        {module.type === "lesson" && (
          <div className="max-w-3xl mx-auto p-6">
            <LessonContent content={module.content} />
            <div className="mt-10 pt-8 border-t border-navy-600">
              <h2 className="text-go-cyan font-bold text-lg font-mono mb-6">Knowledge Check</h2>
              <QuizBlock questions={module.quiz} onComplete={handleComplete} />
            </div>
          </div>
        )}
        {module.type === "workshop" && (
          <div className="p-6">
            <WorkshopView module={module} onComplete={handleComplete} />
          </div>
        )}
        {module.type === "lab" && (
          <div className="h-full">
            <LabView module={module} onComplete={handleComplete} />
          </div>
        )}
      </div>
    </div>
  );
}
