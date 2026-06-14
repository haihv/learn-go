import Link from "next/link";
import type { Metadata } from "next";
import { atlas, BLOOM_META } from "@/lib/stems";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "The Atlas — Learn Go",
  description:
    "A T-shaped map of Go: the one idea, the domains, and the Bloom ladder each deep stem climbs.",
};

// Tier 0 of the method — the Atlas. The map of the field, where to focus, and
// the Bloom ladder explained, before any learner digs into a deep stem.
export default function AtlasPage() {
  return (
    <main className="min-h-screen bg-navy-950">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="mx-auto max-w-4xl px-4 py-12">
        <Link href="/" className="text-go-blue text-sm hover:underline">
          ← Home
        </Link>

        <header className="mt-4 mb-10">
          <p className="text-go-yellow text-sm font-mono mb-2">🗺 The Atlas</p>
          <h1 className="text-4xl font-bold font-serif text-stone-900 mb-4">Learn Go, T-shaped</h1>
          <p className="text-stone-500 max-w-2xl">
            First the whole field, broad and shallow. Then deep stems drive down into one
            domain at a time — each climbing Bloom&apos;s six levels, ending in something you build.
          </p>

          <div className="mt-6 rounded-xl border border-go-cyan/40 bg-navy-800 p-5">
            <p className="text-xs uppercase tracking-wide text-navy-500 mb-1">The one idea</p>
            <p className="text-go-cyan font-bold">{atlas.oneIdea}</p>
            <p className="text-stone-500 text-sm mt-2">{atlas.oneIdeaExpanded}</p>
          </div>
        </header>

        {/* The Bloom ladder explained */}
        <section className="mb-12">
          <h2 className="text-lg font-bold font-serif text-stone-900 mb-4">The ladder every stem climbs</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {([1, 2, 3, 4, 5, 6] as const).map((lvl) => {
              const meta = BLOOM_META[lvl];
              return (
                <div key={lvl} className="rounded-lg border border-navy-600 bg-navy-900 p-3">
                  <div className={`h-1 w-8 rounded-full ${meta.bar} mb-2`} />
                  <p className={`${meta.text} text-xs font-bold`}>L{lvl}</p>
                  <p className="text-stone-800 text-sm">{meta.name}</p>
                  <p className="text-navy-500 text-xs">{meta.verb}</p>
                </div>
              );
            })}
          </div>
        </section>

        {/* The domains — the horizontal bar of the T */}
        <section>
          <h2 className="text-lg font-bold font-serif text-stone-900 mb-4">
            The {atlas.domains.length} domains
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {atlas.domains.map((d) => {
              const ready = Boolean(d.stemSlug);
              const card = (
                <div
                  className={`h-full rounded-xl border p-5 transition-colors ${
                    ready
                      ? "border-go-blue bg-navy-800 hover:border-go-cyan cursor-pointer"
                      : "border-navy-700 bg-navy-900"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-3xl">{d.icon}</span>
                    {ready ? (
                      <span className="text-go-green text-xs font-bold">Deep stem ready →</span>
                    ) : (
                      <span className="text-navy-500 text-xs">Stem coming soon</span>
                    )}
                  </div>
                  <h3 className="text-lg font-bold font-serif text-stone-900 mt-3">{d.title}</h3>
                  <p className="text-stone-500 text-sm mt-1">{d.blurb}</p>
                  <p className="text-navy-500 text-xs mt-3">
                    <span className="text-go-red">Create:</span> {d.createDeliverable}
                  </p>
                </div>
              );
              return d.stemSlug ? (
                <Link key={d.id} href={`/stem/${d.stemSlug}`}>
                  {card}
                </Link>
              ) : (
                <div key={d.id}>{card}</div>
              );
            })}
          </div>
        </section>
      </div>
    </main>
  );
}
