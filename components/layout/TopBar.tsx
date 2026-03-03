import Badge from "@/components/ui/Badge";
import { CourseModule } from "@/lib/curriculum/types";

type TopBarProps = {
  module: CourseModule;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isComplete: boolean;
  onMarkComplete: () => void;
  onMenuToggle?: () => void;
};

export default function TopBar({
  module,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
  isComplete,
  onMarkComplete,
  onMenuToggle,
}: TopBarProps) {
  return (
    <div className="w-full h-14 bg-navy-900 border-b border-navy-600 flex items-center px-4 gap-4">
      <button
        className="md:hidden text-slate-200 text-xl"
        onClick={onMenuToggle}
      >
        ☰
      </button>

      <div className="flex-1 flex items-center gap-3">
        <span className="text-xl">{module.icon}</span>
        <span className="text-slate-100 font-bold text-sm truncate">{module.title}</span>
        <Badge type={module.type} />
        <span className="text-navy-500 text-xs hidden md:inline">~{module.estimatedMinutes} min</span>
      </div>

      <div className="flex items-center gap-2">
        {hasPrev && (
          <button
            className="bg-navy-700 text-slate-200 px-3 py-1.5 rounded text-sm"
            onClick={onPrev}
          >
            ← Prev
          </button>
        )}

        {!isComplete && (
          <button
            className="bg-go-cyan text-navy-950 px-3 py-1.5 rounded text-sm font-bold"
            onClick={onMarkComplete}
          >
            Mark Complete ✓
          </button>
        )}

        {isComplete && hasNext && (
          <button
            className="bg-go-cyan text-navy-950 px-3 py-1.5 rounded text-sm font-bold"
            onClick={onNext}
          >
            Next →
          </button>
        )}

        {isComplete && !hasNext && (
          <span className="text-go-cyan text-sm font-bold">Course Complete! 🎉</span>
        )}
      </div>
    </div>
  );
}
