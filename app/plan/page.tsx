import Link from "next/link";
import type { Metadata } from "next";
import { plan, planGoal } from "@/lib/orient";
import { getStemBySlug } from "@/lib/stems";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "The Plan",
  description: "A time-boxed, week-by-week path from Go fundamentals to a shipped service.",
  alternates: { canonical: "/plan" },
  openGraph: {
    title: "The Plan — Learn Go",
    description: "A time-boxed, week-by-week path from Go fundamentals to a shipped service.",
    url: "/plan",
  },
};

// Tier 1 — the Plan. A time-boxed path to a concrete goal; each week ends in a
// deliverable and links the deep stems that power it.
export default function PlanPage() {
  return (
    <main className="min-h-screen bg-navy-950">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/atlas" className="text-go-blue text-sm hover:underline">
          ← Atlas
        </Link>

        <header className="mt-4 mb-8">
          <p className="text-go-yellow text-sm font-mono mb-2">🗓 Tier 1 · Orient</p>
          <h1 className="text-4xl font-bold font-serif text-stone-900 mb-3">The Plan</h1>
          <p className="text-stone-700 max-w-2xl">{planGoal}.</p>
        </header>

        <ol className="flex flex-col gap-4">
          {plan.map((w) => (
            <li key={w.week} className="rounded-xl border border-navy-600 bg-navy-800 p-5">
              <div className="flex items-center gap-3">
                <span className="shrink-0 h-8 w-8 rounded-full bg-go-blue text-navy-950 font-bold text-sm flex items-center justify-center">
                  {w.week}
                </span>
                <h2 className="text-stone-900 font-bold font-serif text-lg">{w.theme}</h2>
              </div>

              <ul className="mt-3 list-disc list-inside flex flex-col gap-1">
                {w.focus.map((f, i) => (
                  <li key={i} className="text-stone-700 text-sm">{f}</li>
                ))}
              </ul>

              <p className="mt-3 text-sm text-stone-700">
                <span className="text-go-red font-bold">Deliverable:</span> {w.deliverable}
              </p>

              {w.stems.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                  {w.stems.map((slug) => {
                    const stem = getStemBySlug(slug);
                    if (!stem) return null;
                    return (
                      <Link
                        key={slug}
                        href={`/stem/${slug}`}
                        className="rounded-full border border-navy-600 bg-navy-900 px-3 py-1 text-xs text-go-cyan hover:border-go-cyan transition-colors"
                      >
                        {stem.icon} {stem.title}
                      </Link>
                    );
                  })}
                </div>
              )}
            </li>
          ))}
        </ol>
      </div>
    </main>
  );
}
