"use client";
import { useRouter } from "next/navigation";
import { curriculum, getModuleBySlug, getModuleIndex } from "@/lib/curriculum";
import { useProgress } from "@/hooks/useProgress";
import TopBar from "@/components/layout/TopBar";
import LessonContent from "@/components/lesson/LessonContent";
import QuizBlock from "@/components/lesson/QuizBlock";
import WorkshopView from "@/components/workshop/WorkshopView";
import LabView from "@/components/lab/LabView";

type Props = {
  slug: string;
};

export default function ModuleView({ slug }: Props) {
  const router = useRouter();
  const { isComplete, markComplete } = useProgress();

  const mod = getModuleBySlug(slug);
  if (!mod) return null;

  const idx = getModuleIndex(mod.slug);
  const prev = curriculum[idx - 1];
  const next = curriculum[idx + 1];

  const handleComplete = () => {
    markComplete(mod.slug);
    if (next) router.push(`/learn/${next.slug}`);
  };

  const handleMarkComplete = () => {
    markComplete(mod.slug);
  };

  return (
    <div className="flex flex-col h-full">
      <TopBar
        module={mod}
        onPrev={() => prev && router.push(`/learn/${prev.slug}`)}
        onNext={() => next && router.push(`/learn/${next.slug}`)}
        hasPrev={!!prev}
        hasNext={!!next}
        isComplete={isComplete(mod.slug)}
        onMarkComplete={handleMarkComplete}
      />
      <div className="flex-1 overflow-y-auto">
        {mod.type === "lesson" && (
          <div className="max-w-3xl mx-auto p-6">
            <LessonContent content={mod.content} />
            <div className="mt-10 pt-8 border-t border-navy-600">
              <h2 className="text-go-cyan font-bold text-lg font-mono mb-6">Knowledge Check</h2>
              <QuizBlock questions={mod.quiz} onComplete={handleComplete} />
            </div>
          </div>
        )}
        {mod.type === "workshop" && (
          <div className="p-6">
            <WorkshopView module={mod} onComplete={handleComplete} />
          </div>
        )}
        {mod.type === "lab" && (
          <div className="h-full">
            <LabView module={mod} onComplete={handleComplete} />
          </div>
        )}
      </div>
    </div>
  );
}
