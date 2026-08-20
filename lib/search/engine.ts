import type { SearchDoc, SearchHit } from "./types";

// Split on anything that isn't a letter/digit/underscore so "fmt.Println"
// indexes as ["fmt", "println"] and a query of either half finds it.
export function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .split(/[^\p{L}\p{N}_]+/u)
    .filter((t) => t.length > 0);
}

const STOP = new Set([
  "the", "a", "an", "and", "or", "of", "to", "in", "is", "it", "for", "on",
  "with", "as", "at", "by", "be", "this", "that", "you", "your", "are", "from",
  "can", "we", "its", "but", "not", "if", "so", "do", "go",
]);

type Posting = { docIndex: number; tf: number; inTitle: boolean };

type Index = {
  docs: SearchDoc[];
  postings: Map<string, Posting[]>;
  // Sorted vocabulary for prefix expansion of the last query term
  vocab: string[];
  docLengths: number[];
  avgDocLength: number;
};

const TITLE_BOOST = 6;
// BM25 constants — k1 saturates term frequency, b normalises by doc length
const K1 = 1.2;
const B = 0.75;

export function buildIndex(docs: SearchDoc[]): Index {
  const postings = new Map<string, Posting[]>();
  const docLengths: number[] = [];

  docs.forEach((doc, docIndex) => {
    const titleTokens = new Set(tokenize(doc.title));
    const tokens = tokenize(`${doc.title} ${doc.body}`);
    docLengths.push(tokens.length);
    const counts = new Map<string, number>();
    for (const t of tokens) counts.set(t, (counts.get(t) ?? 0) + 1);
    for (const [term, tf] of counts) {
      let list = postings.get(term);
      if (!list) {
        list = [];
        postings.set(term, list);
      }
      list.push({ docIndex, tf, inTitle: titleTokens.has(term) });
    }
  });

  const total = docLengths.reduce((a, b) => a + b, 0);
  return {
    docs,
    postings,
    vocab: [...postings.keys()].sort(),
    docLengths,
    avgDocLength: total / Math.max(docs.length, 1),
  };
}

// Binary-search the sorted vocabulary for every term starting with `prefix`.
function expandPrefix(index: Index, prefix: string, limit = 25): string[] {
  const { vocab } = index;
  let lo = 0;
  let hi = vocab.length;
  while (lo < hi) {
    const mid = (lo + hi) >> 1;
    if (vocab[mid] < prefix) lo = mid + 1;
    else hi = mid;
  }
  const out: string[] = [];
  for (let i = lo; i < vocab.length && out.length < limit; i++) {
    if (!vocab[i].startsWith(prefix)) break;
    out.push(vocab[i]);
  }
  return out;
}

function idf(index: Index, term: string): number {
  const df = index.postings.get(term)?.length ?? 0;
  const n = index.docs.length;
  return Math.log(1 + (n - df + 0.5) / (df + 0.5));
}

export function makeSnippet(body: string, terms: string[], width = 150): string {
  const lower = body.toLowerCase();
  let start = -1;
  for (const t of terms) {
    const i = lower.indexOf(t);
    if (i !== -1 && (start === -1 || i < start)) start = i;
  }
  if (start === -1) {
    return body.length > width ? body.slice(0, width).trimEnd() + "…" : body;
  }
  const from = Math.max(0, start - Math.floor(width / 3));
  const to = Math.min(body.length, from + width);
  const prefix = from > 0 ? "…" : "";
  const suffix = to < body.length ? "…" : "";
  return prefix + body.slice(from, to).trim() + suffix;
}

export function search(index: Index, query: string, limit = 12): SearchHit[] {
  const raw = tokenize(query);
  if (raw.length === 0) return [];
  // Keep stop words only when they're all the user typed, so "go" still works.
  const filtered = raw.filter((t) => !STOP.has(t));
  const queryTerms = filtered.length > 0 ? filtered : raw;
  const lastIsPartial = !/\s$/.test(query);

  const scores = new Map<number, number>();
  const matched = new Map<number, Set<string>>();
  // Docs containing every query term (exact or via prefix) rank above partials
  const termsHit = new Map<number, Set<number>>();

  queryTerms.forEach((term, qi) => {
    const isLast = qi === queryTerms.length - 1;
    const candidates = new Set<string>([term]);
    if (isLast && lastIsPartial && term.length >= 2) {
      for (const t of expandPrefix(index, term)) candidates.add(t);
    } else if (term.length >= 4) {
      // Light stemming: "pointer" should find "pointers" and vice versa
      for (const t of expandPrefix(index, term, 8)) candidates.add(t);
    }

    for (const cand of candidates) {
      const list = index.postings.get(cand);
      if (!list) continue;
      // Prefix expansions of the partial last term count for less than an
      // exact hit so "poi" → "pointers" doesn't outrank an exact word.
      const weight = cand === term ? 1 : 0.6;
      const termIdf = idf(index, cand);
      for (const p of list) {
        const dl = index.docLengths[p.docIndex];
        const norm = p.tf * (K1 + 1) / (p.tf + K1 * (1 - B + (B * dl) / index.avgDocLength));
        let s = termIdf * norm * weight;
        if (p.inTitle) s += TITLE_BOOST * weight;
        scores.set(p.docIndex, (scores.get(p.docIndex) ?? 0) + s);
        if (!matched.has(p.docIndex)) matched.set(p.docIndex, new Set());
        matched.get(p.docIndex)!.add(cand);
        if (!termsHit.has(p.docIndex)) termsHit.set(p.docIndex, new Set());
        termsHit.get(p.docIndex)!.add(qi);
      }
    }
  });

  const ranked: { docIndex: number; score: number }[] = [];
  for (const [docIndex, base] of scores) {
    const coverage = (termsHit.get(docIndex)?.size ?? 0) / queryTerms.length;
    // Multi-term queries: strongly prefer docs that contain all the terms
    ranked.push({ docIndex, score: base * (0.5 + coverage) });
  }
  ranked.sort(
    (a, b) =>
      b.score - a.score ||
      index.docs[a.docIndex].title.localeCompare(index.docs[b.docIndex].title),
  );

  // Snippets scan the full body, so only build them for the survivors
  return ranked.slice(0, limit).map(({ docIndex, score }) => {
    const doc = index.docs[docIndex];
    const terms = [...(matched.get(docIndex) ?? [])];
    return { doc, score, snippet: makeSnippet(doc.body, terms), matchedTerms: terms };
  });
}

export type { Index as SearchIndex };
