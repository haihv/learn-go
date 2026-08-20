import Link from "next/link";
import type { Metadata } from "next";
import { searchCurriculum, getSearchDocuments } from "@/lib/search";
import type { SearchDocKind } from "@/lib/search";
import ThemeToggle from "@/components/ui/ThemeToggle";
import SearchButton from "@/components/search/SearchButton";

export const metadata: Metadata = {
  title: "Search",
  description: "Search every lesson, workshop, lab, and deep stem in Learn Go.",
  // Query-specific result pages are not worth indexing
  robots: { index: false, follow: true },
};

const KIND_LABEL: Record<SearchDocKind, { label: string; className: string }> = {
  lesson: { label: "LESSON", className: "bg-go-blue/10 text-go-blue border-go-blue/40" },
  workshop: { label: "WORKSHOP", className: "bg-go-purple/10 text-go-purple border-go-purple/40" },
  lab: { label: "LAB", className: "bg-go-green/10 text-go-green border-go-green/40" },
  stem: { label: "STEM", className: "bg-go-cyan/10 text-go-cyan border-go-cyan/40" },
  domain: { label: "ATLAS", className: "bg-go-yellow/10 text-go-yellow border-go-yellow/40" },
};

type Props = { searchParams: Promise<{ q?: string | string[] }> };

// Server-rendered twin of the ⌘K palette: shareable URLs, works without JS,
// and shows the full ranked list instead of the palette's top 12.
export default async function SearchPage({ searchParams }: Props) {
  const params = await searchParams;
  const raw = Array.isArray(params.q) ? params.q[0] : params.q;
  const query = (raw ?? "").trim().slice(0, 200);
  const hits = query ? searchCurriculum(query, 50) : [];
  const total = getSearchDocuments().length;

  return (
    <main className="min-h-screen bg-navy-950">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/" className="text-go-blue text-sm hover:underline">
          ← Home
        </Link>

        <header className="mt-4 mb-8">
          <h1 className="text-stone-900 font-serif text-3xl font-bold mb-4">Search</h1>
          <form action="/search" method="get" role="search" className="flex gap-2">
            <input
              type="search"
              name="q"
              defaultValue={query}
              placeholder={`Search ${total} lessons, workshops, labs & stems…`}
              aria-label="Search query"
              autoFocus={!query}
              className="flex-1 rounded border border-navy-600 bg-navy-800 px-3 py-2 text-sm text-stone-900 placeholder:text-navy-500 outline-none focus:border-go-cyan"
            />
            <button
              type="submit"
              className="rounded bg-go-cyan px-4 py-2 text-sm font-bold text-navy-950 cursor-pointer"
            >
              Search
            </button>
          </form>
          <p className="mt-2 text-xs text-navy-500">
            Tip: press <kbd className="font-mono">⌘K</kbd> / <kbd className="font-mono">Ctrl+K</kbd> on any
            page for the quick palette. <SearchButton variant="icon" className="align-middle" />
          </p>
        </header>

        {query && (
          <p className="mb-4 text-sm text-stone-600">
            {hits.length === 0
              ? <>No results for <span className="font-bold text-stone-900">“{query}”</span>.</>
              : <>{hits.length} result{hits.length === 1 ? "" : "s"} for <span className="font-bold text-stone-900">“{query}”</span></>}
          </p>
        )}

        <ol className="flex flex-col gap-2">
          {hits.map((hit) => {
            const kind = KIND_LABEL[hit.doc.kind];
            return (
              <li key={hit.doc.id}>
                <Link
                  href={hit.doc.href}
                  className="flex items-start gap-3 rounded-lg border border-navy-600 bg-navy-800 px-4 py-3 hover:border-go-cyan transition-colors"
                >
                  <span className="mt-0.5 w-6 text-center text-lg" aria-hidden>
                    {hit.doc.icon}
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="flex items-center gap-2">
                      <span className="truncate text-sm font-bold text-stone-900">{hit.doc.title}</span>
                      <span
                        className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide ${kind.className}`}
                      >
                        {kind.label}
                      </span>
                      <span className="ml-auto shrink-0 text-xs text-navy-500">{hit.doc.meta}</span>
                    </span>
                    <span className="mt-1 block text-xs leading-relaxed text-stone-600">{hit.snippet}</span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>
    </main>
  );
}
