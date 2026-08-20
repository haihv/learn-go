"use client";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { searchCurriculum, getSearchDocuments } from "@/lib/search";
import type { SearchDocKind, SearchHit } from "@/lib/search";
import { useSearchStore } from "@/store/search";
import { useShortcutKey } from "@/hooks/useShortcutKey";

const KIND_LABEL: Record<SearchDocKind, { label: string; className: string }> = {
  lesson: { label: "LESSON", className: "bg-go-blue/10 text-go-blue border-go-blue/40" },
  workshop: { label: "WORKSHOP", className: "bg-go-purple/10 text-go-purple border-go-purple/40" },
  lab: { label: "LAB", className: "bg-go-green/10 text-go-green border-go-green/40" },
  stem: { label: "STEM", className: "bg-go-cyan/10 text-go-cyan border-go-cyan/40" },
  domain: { label: "ATLAS", className: "bg-go-yellow/10 text-go-yellow border-go-yellow/40" },
};

const SUGGESTIONS = ["goroutines", "errors.Is", "generics", "json", "table test", "context"];

function escapeRegExp(s: string): string {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Wrap every occurrence of a matched term in <mark>. Longest terms first so a
// prefix-expanded term ("pointers") doesn't get split by its stem ("point").
function Highlight({ text, terms }: { text: string; terms: string[] }) {
  if (terms.length === 0) return <>{text}</>;
  const sorted = [...terms].sort((a, b) => b.length - a.length).map(escapeRegExp);
  const re = new RegExp(`(${sorted.join("|")})`, "gi");
  // split() with a capturing group places the matches at odd indices — no
  // second regex test needed (and a /g regex's lastIndex would make one flaky)
  const parts = text.split(re);
  return (
    <>
      {parts.map((part, i) =>
        i % 2 === 1 ? (
          <mark key={i} className="bg-go-yellow/25 text-stone-900 rounded-sm px-0.5">
            {part}
          </mark>
        ) : (
          <span key={i}>{part}</span>
        ),
      )}
    </>
  );
}

export default function SearchPalette() {
  const open = useSearchStore((s) => s.open);
  const setOpen = useSearchStore((s) => s.setOpen);
  const toggle = useSearchStore((s) => s.toggle);

  // Global shortcut: ⌘K / Ctrl+K toggles. Escape is handled inside the
  // dialog (and stopped there) so it never also fires the lab/workshop
  // fullscreen-exit listeners on window.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        toggle();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [toggle]);

  // Lock body scroll while the overlay is up
  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  // The dialog owns query/selection state and mounts only while open, so
  // every open starts clean without a reset effect.
  return open ? <PaletteDialog onClose={() => setOpen(false)} /> : null;
}

function PaletteDialog({ onClose }: { onClose: () => void }) {
  const router = useRouter();
  const { mod } = useShortcutKey();
  const listRef = useRef<HTMLUListElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);
  const listId = useId();
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(0);

  // No React Compiler in this project — memoise so arrow/hover re-renders
  // don't re-run the query.
  const hits: SearchHit[] = useMemo(
    () => (query.trim() ? searchCurriculum(query, 12) : []),
    [query],
  );
  const activeIndex = Math.min(active, Math.max(hits.length - 1, 0));

  // Return focus to whatever opened the palette (usually a SearchButton)
  useEffect(() => {
    const opener = document.activeElement as HTMLElement | null;
    return () => opener?.focus?.();
  }, []);

  // Escape closes; Tab cycles within the dialog so focus can't reach the page
  const onDialogKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Escape") {
      e.stopPropagation();
      onClose();
      return;
    }
    if (e.key !== "Tab" || !dialogRef.current) return;
    const focusables = dialogRef.current.querySelectorAll<HTMLElement>(
      'input, button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    );
    if (focusables.length === 0) return;
    const first = focusables[0];
    const last = focusables[focusables.length - 1];
    if (e.shiftKey && document.activeElement === first) {
      e.preventDefault();
      last.focus();
    } else if (!e.shiftKey && document.activeElement === last) {
      e.preventDefault();
      first.focus();
    }
  };

  const go = (href: string) => {
    onClose();
    router.push(href);
  };

  const onInputKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (hits.length === 0) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive(Math.min(activeIndex + 1, hits.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive(Math.max(activeIndex - 1, 0));
    } else if (e.key === "Enter" && hits[activeIndex]) {
      e.preventDefault();
      go(hits[activeIndex].doc.href);
    }
  };

  // Keep the highlighted row in view while arrowing through a long list
  useEffect(() => {
    listRef.current
      ?.querySelector<HTMLElement>(`[data-index="${activeIndex}"]`)
      ?.scrollIntoView({ block: "nearest" });
  }, [activeIndex]);

  const totalDocs = getSearchDocuments().length;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-start justify-center bg-stone-900/40 px-4 pt-[12vh] backdrop-blur-sm"
      onMouseDown={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-label="Search the curriculum"
        onKeyDown={onDialogKey}
        className="w-full max-w-xl overflow-hidden rounded-lg border border-navy-600 bg-navy-800 shadow-2xl"
      >
        <div className="flex items-center gap-3 border-b border-navy-600 px-4">
          <span aria-hidden className="text-lg">🔍</span>
          <input
            autoFocus
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setActive(0);
            }}
            onKeyDown={onInputKey}
            placeholder={`Search ${totalDocs} lessons, workshops, labs & stems…`}
            className="h-12 flex-1 bg-transparent text-sm text-stone-900 placeholder:text-navy-500 outline-none"
            role="combobox"
            aria-expanded={hits.length > 0}
            aria-controls={listId}
            aria-activedescendant={hits[activeIndex] ? `${listId}-${activeIndex}` : undefined}
            aria-autocomplete="list"
            autoComplete="off"
            spellCheck={false}
          />
          <kbd className="hidden sm:inline rounded border border-navy-600 bg-navy-900 px-1.5 py-0.5 text-[10px] font-mono text-navy-500">
            esc
          </kbd>
        </div>

        {query.trim() === "" ? (
          <div className="px-4 py-5 text-sm text-stone-500">
            <p className="mb-3">Try searching for…</p>
            <div className="flex flex-wrap gap-2">
              {SUGGESTIONS.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => {
                    setQuery(s);
                    setActive(0);
                  }}
                  className="rounded-full border border-navy-600 bg-navy-900 px-3 py-1 text-xs font-mono text-stone-600 hover:border-go-cyan hover:text-go-cyan cursor-pointer"
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        ) : hits.length === 0 ? (
          <p className="px-4 py-6 text-center text-sm text-stone-500">
            No results for <span className="font-bold text-stone-800">“{query}”</span>
          </p>
        ) : (
          <ul
            ref={listRef}
            id={listId}
            role="listbox"
            className="max-h-[60vh] overflow-y-auto py-2"
          >
            {hits.map((hit, i) => {
              const kind = KIND_LABEL[hit.doc.kind];
              const selected = i === activeIndex;
              return (
                <li
                  key={hit.doc.id}
                  id={`${listId}-${i}`}
                  data-index={i}
                  role="option"
                  aria-selected={selected}
                  onMouseEnter={() => setActive(i)}
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => go(hit.doc.href)}
                  className={`flex cursor-pointer items-start gap-3 border-l-2 px-4 py-2.5 ${
                    selected ? "bg-navy-700 border-go-cyan" : "border-transparent"
                  }`}
                >
                  <span className="mt-0.5 w-6 text-center text-lg" aria-hidden>
                    {hit.doc.icon}
                  </span>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-stone-900">
                        <Highlight text={hit.doc.title} terms={hit.matchedTerms} />
                      </span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${kind.className}`}
                      >
                        {kind.label}
                      </span>
                      <span className="ml-auto shrink-0 text-xs text-navy-500">{hit.doc.meta}</span>
                    </div>
                    <p className="mt-0.5 line-clamp-2 text-xs leading-relaxed text-stone-600">
                      <Highlight text={hit.snippet} terms={hit.matchedTerms} />
                    </p>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        <div className="flex items-center gap-4 border-t border-navy-600 px-4 py-2 text-[11px] text-navy-500">
          <span><kbd className="font-mono">↑↓</kbd> navigate</span>
          <span><kbd className="font-mono">↵</kbd> open</span>
          {query.trim() && (
            <button
              type="button"
              onClick={() => go(`/search?q=${encodeURIComponent(query.trim())}`)}
              className="text-go-blue hover:underline cursor-pointer"
            >
              All results →
            </button>
          )}
          <span className="ml-auto"><kbd className="font-mono">{mod}K</kbd> toggle</span>
        </div>
      </div>
    </div>
  );
}
