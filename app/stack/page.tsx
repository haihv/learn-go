import Link from "next/link";
import type { Metadata } from "next";
import { stackMap } from "@/lib/orient";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "The Stack Map — Learn Go",
  description: "The Go toolchain layer by layer, with one dated current-best pick each.",
};

// Tier 1 — the Stack Map. Concepts are durable, tools are swappable: each pick
// is current-best and dated, so it can be replaced without touching its layer.
export default function StackPage() {
  return (
    <main className="min-h-screen bg-navy-950">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <Link href="/atlas" className="text-go-blue text-sm hover:underline">
          ← Atlas
        </Link>

        <header className="mt-4 mb-8">
          <p className="text-go-yellow text-sm font-mono mb-2">🧱 Tier 1 · Orient</p>
          <h1 className="text-4xl font-bold font-serif text-stone-900 mb-3">The Stack Map</h1>
          <p className="text-stone-500 max-w-2xl">
            The Go stack, layer by layer, with one current-best pick each. Concepts are durable;
            tools are swappable — every pick is dated, so replace it without relearning the layer.
          </p>
        </header>

        <div className="flex flex-col gap-3">
          {stackMap.map((l) => (
            <div key={l.layer} className="rounded-xl border border-navy-600 bg-navy-800 p-5">
              <div className="flex items-baseline justify-between gap-3 flex-wrap">
                <h2 className="text-stone-900 font-bold font-serif text-lg">{l.layer}</h2>
                <span className="text-navy-500 text-xs font-mono">since {l.since}</span>
              </div>
              <p className="text-stone-500 text-sm mt-1">{l.role}</p>
              <p className="mt-3 text-sm">
                <span className="text-go-green font-mono font-bold">{l.pick}</span>
              </p>
              <p className="text-stone-700 text-sm mt-2">{l.note}</p>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
