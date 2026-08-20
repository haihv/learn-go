"use client";
import { useShortcutKey } from "@/hooks/useShortcutKey";
import { useSearchStore } from "@/store/search";

type Props = {
  className?: string;
  // "full" shows the label + shortcut hint; "icon" is a compact glyph-only button
  variant?: "full" | "icon";
};

export default function SearchButton({ className = "", variant = "full" }: Props) {
  const setOpen = useSearchStore((s) => s.setOpen);
  const { mod } = useShortcutKey();

  if (variant === "icon") {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className={`text-stone-500 hover:text-stone-800 text-lg cursor-pointer ${className}`}
        title={`Search (${mod}+K)`}
        aria-label="Search the curriculum"
      >
        🔍
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setOpen(true)}
      className={`flex items-center gap-2 w-full rounded border border-navy-600 bg-navy-800 px-3 py-1.5 text-sm text-stone-500 hover:border-go-cyan hover:text-stone-800 transition-colors cursor-pointer ${className}`}
      aria-label="Search the curriculum"
    >
      <span aria-hidden>🔍</span>
      <span className="flex-1 text-left">Search…</span>
      <kbd className="hidden sm:inline rounded border border-navy-600 bg-navy-900 px-1.5 py-0.5 text-[10px] font-mono text-navy-500">
        {mod}K
      </kbd>
    </button>
  );
}
