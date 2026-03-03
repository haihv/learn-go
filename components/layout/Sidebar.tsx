"use client";
import { useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import type { CourseModule } from "@/lib/curriculum/types";

type SidebarProps = {
  modules: CourseModule[];
  currentSlug: string;
  onNavigate: (slug: string) => void;
};

type ContentProps = {
  modules: CourseModule[];
  currentSlug: string;
  completedCount: number;
  totalCount: number;
  isComplete: (slug: string) => boolean;
  onNavigate: (slug: string) => void;
};

function SidebarContent({ modules, currentSlug, completedCount, totalCount, isComplete, onNavigate }: ContentProps) {
  return (
    <>
      <div className="p-4 border-b border-navy-600">
        <div className="text-go-cyan font-bold text-lg mb-2">🐹 Learn Go</div>
        <ProgressBar completed={completedCount} total={totalCount} />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {modules.map((m) => (
          <button
            key={m.id}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-navy-700 transition-colors${m.slug === currentSlug ? " bg-navy-700" : ""}`}
            onClick={() => onNavigate(m.slug)}
          >
            <span className="w-6 text-center">
              {isComplete(m.slug) ? "✅" : m.icon}
            </span>
            <span className="flex-1 text-sm text-slate-200">{m.title}</span>
            <Badge type={m.type} />
          </button>
        ))}
      </div>
    </>
  );
}

export default function Sidebar({ modules, currentSlug, onNavigate }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isComplete, completedCount, totalCount } = useProgress();

  const handleNavigate = (slug: string) => {
    onNavigate(slug);
    setMobileOpen(false);
  };

  const contentProps: ContentProps = { modules, currentSlug, completedCount, totalCount, isComplete, onNavigate: handleNavigate };

  return (
    <>
      <aside className="hidden md:flex w-[260px] h-full bg-navy-900 border-r border-navy-600 flex-col">
        <SidebarContent {...contentProps} />
      </aside>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-slate-200 text-xl"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/50"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-40 w-[260px] bg-navy-900 border-r border-navy-600 flex flex-col">
            <SidebarContent {...contentProps} />
          </aside>
        </>
      )}
    </>
  );
}
