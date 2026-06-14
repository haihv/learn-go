import Link from "next/link";
import type { Metadata } from "next";
import RecallDeck from "@/components/orient/RecallDeck";
import ThemeToggle from "@/components/ui/ThemeToggle";

export const metadata: Metadata = {
  title: "The Recall Deck — Learn Go",
  description: "Spaced-repetition flashcards for Go's durable facts — the daily hook.",
};

// Tier 1 — the Recall Deck. Spaced repetition is the daily return hook; the
// scheduler lives in the store, the cards in lib/orient/deck.ts.
export default function DeckPage() {
  return (
    <main className="min-h-screen bg-navy-950">
      <ThemeToggle className="fixed top-4 right-4 z-50" />
      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link href="/atlas" className="text-go-blue text-sm hover:underline">
          ← Atlas
        </Link>

        <header className="mt-4 mb-8">
          <p className="text-go-yellow text-sm font-mono mb-2">🃏 Tier 1 · Orient</p>
          <h1 className="text-4xl font-bold font-serif text-stone-900 mb-3">The Recall Deck</h1>
          <p className="text-stone-500 max-w-2xl">
            Retrieval beats re-reading. Recall the answer before flipping, then grade yourself —
            confident cards drift further out, missed ones come right back.
          </p>
        </header>

        <RecallDeck />
      </div>
    </main>
  );
}
