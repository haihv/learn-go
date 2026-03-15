"use client";
import { useShortcutKey } from "@/hooks/useShortcutKey";
import Badge from "@/components/ui/Badge";
import type { CourseModule } from "@/lib/curriculum/types";

type TopBarProps = {
  module: CourseModule;
  onPrev: () => void;
  onNext: () => void;
  hasPrev: boolean;
  hasNext: boolean;
  isComplete: boolean;
  onMarkComplete: () => void;
  onMenuToggle?: () => void;
  sidebarCollapsed: boolean;
  onToggleSidebar: () => void;
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
  sidebarCollapsed,
  onToggleSidebar,
}: TopBarProps) {
  const { alt } = useShortcutKey();

  return (
    <div className="w-full h-14 bg-navy-900 border-b border-navy-600 flex items-center px-4 gap-3">
      {/* Mobile menu toggle */}
      <button
        className="md:hidden text-slate-400 hover:text-slate-200 text-xl cursor-pointer"
        onClick={onMenuToggle}
        aria-label="Open menu"
      >
        ☰
      </button>

      {/* Desktop sidebar toggle — only visible when sidebar is hidden */}
      {sidebarCollapsed && (
        <button
          className="hidden md:flex text-slate-400 hover:text-slate-200 text-xl cursor-pointer"
          onClick={onToggleSidebar}
          title="Show sidebar"
          aria-label="Show sidebar"
        >
          »
        </button>
      )}

      <div className="flex-1 flex items-center gap-3 min-w-0">
        <span className="text-xl shrink-0">{module.icon}</span>
        <span className="text-slate-100 font-bold text-sm truncate">{module.title}</span>
        <Badge type={module.type} />
        <span className="text-navy-500 text-xs hidden md:inline shrink-0">~{module.estimatedMinutes} min</span>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        {hasPrev && (
          <button
            className="bg-navy-700 text-slate-200 px-3 py-1.5 rounded text-sm cursor-pointer"
            onClick={onPrev}
            title={`Previous module (${alt}+←)`}
          >
            ← Prev
          </button>
        )}

        {!isComplete && (
          <button
            className="bg-go-cyan text-navy-950 px-3 py-1.5 rounded text-sm font-bold cursor-pointer"
            onClick={onMarkComplete}
          >
            Mark Complete ✓
          </button>
        )}

        {isComplete && hasNext && (
          <div className="flex items-center gap-1.5">
            <button
              className="bg-go-cyan text-navy-950 px-3 py-1.5 rounded text-sm font-bold cursor-pointer"
              onClick={onNext}
              title={`Next module (${alt}+→)`}
            >
              Next →
            </button>
            <span className="text-navy-500 text-xs hidden lg:inline">{alt}+→</span>
          </div>
        )}

        {isComplete && !hasNext && (
          <span className="text-go-cyan text-sm font-bold">Course Complete! 🎉</span>
        )}
      </div>
    </div>
  );
}
