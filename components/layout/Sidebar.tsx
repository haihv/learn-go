"use client";
import { useEffect, useRef, useState } from "react";
import { useProgress } from "@/hooks/useProgress";
import ProgressBar from "@/components/ui/ProgressBar";
import Badge from "@/components/ui/Badge";
import SearchButton from "@/components/search/SearchButton";
import type { CourseModule } from "@/lib/curriculum/types";

type SidebarProps = {
  modules: CourseModule[];
  currentSlug: string;
  onNavigate: (slug: string) => void;
  onCollapse: () => void;
  collapsed: boolean;
};

type ContentProps = {
  modules: CourseModule[];
  currentSlug: string;
  completedCount: number;
  totalCount: number;
  isComplete: (slug: string) => boolean;
  onNavigate: (slug: string) => void;
  onCollapse: () => void;
};

function SidebarContent({ modules, currentSlug, completedCount, totalCount, isComplete, onNavigate, onCollapse }: ContentProps) {
  const activeRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: "start", behavior: "smooth" });
  }, [currentSlug]);

  return (
    <>
      <div className="p-4 border-b border-navy-600">
        <div className="flex items-start justify-between mb-2">
          <div className="text-go-cyan font-bold text-lg">🐹 Learn Go</div>
          <button
            onClick={onCollapse}
            className="text-stone-500 hover:text-stone-800 text-base shrink-0 mt-0.5 ml-2 cursor-pointer"
            title="Hide sidebar"
          >
            «
          </button>
        </div>
        <ProgressBar completed={completedCount} total={totalCount} />
        <SearchButton className="mt-3" />
      </div>
      <div className="flex-1 overflow-y-auto py-2">
        {modules.map((m) => (
          <button
            key={m.id}
            ref={m.slug === currentSlug ? activeRef : null}
            className={`w-full text-left px-4 py-3 flex items-center gap-3 border-l-2 hover:bg-navy-700 transition-colors cursor-pointer ${m.slug === currentSlug ? "bg-navy-700 border-go-cyan" : "border-transparent"}`}
            onClick={() => onNavigate(m.slug)}
          >
            <span className="w-6 text-center">
              {isComplete(m.slug) ? "✅" : m.icon}
            </span>
            <span className="flex-1 text-sm text-stone-800">{m.title}</span>
            <Badge type={m.type} />
          </button>
        ))}
      </div>
    </>
  );
}

export default function Sidebar({ modules, currentSlug, onNavigate, onCollapse, collapsed }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isComplete, completedCount, totalCount } = useProgress();

  const handleNavigate = (slug: string) => {
    onNavigate(slug);
    setMobileOpen(false);
  };

  const contentProps: ContentProps = {
    modules,
    currentSlug,
    completedCount,
    totalCount,
    isComplete,
    onNavigate: handleNavigate,
    onCollapse,
  };

  return (
    <>
      <aside className={`hidden md:flex h-full bg-navy-900 border-r border-navy-600 flex-col shrink-0 overflow-hidden transition-[width] duration-150 ease-in-out ${collapsed ? "w-0" : "w-[260px]"}`}>
        <SidebarContent {...contentProps} />
      </aside>

      <button
        className="md:hidden fixed top-4 left-4 z-50 text-stone-800 text-xl cursor-pointer"
        onClick={() => setMobileOpen(true)}
        aria-label="Open menu"
      >
        ☰
      </button>

      {mobileOpen && (
        <>
          <div
            className="md:hidden fixed inset-0 z-30 bg-black/50 cursor-pointer"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="md:hidden fixed inset-y-0 left-0 z-40 w-[260px] bg-navy-900 border-r border-navy-600 flex flex-col">
            <SidebarContent {...contentProps} onCollapse={() => setMobileOpen(false)} />
          </aside>
        </>
      )}
    </>
  );
}
