export type SearchDocKind = "lesson" | "workshop" | "lab" | "stem" | "domain";

export type SearchDoc = {
  id: string;
  kind: SearchDocKind;
  title: string;
  icon: string;
  href: string;
  // Short secondary line shown under the title (e.g. "~14 min" or the domain)
  meta: string;
  // Plain text (markdown stripped) used for full-text matching and snippets
  body: string;
};

export type SearchHit = {
  doc: SearchDoc;
  score: number;
  // A ~150-char window of the body around the first matched term, or the
  // start of the body when the match was only in the title
  snippet: string;
  // Lower-cased query terms (and prefix-expanded terms) that matched this doc,
  // so the UI can highlight them without re-tokenizing
  matchedTerms: string[];
};
