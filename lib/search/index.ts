import { buildIndex, search as runSearch } from "./engine";
import type { SearchIndex } from "./engine";
import { getSearchDocuments } from "./documents";
import type { SearchHit } from "./types";

export type { SearchDoc, SearchDocKind, SearchHit } from "./types";
export { tokenize, makeSnippet } from "./engine";
export { getSearchDocuments, stripMarkdown } from "./documents";

let index: SearchIndex | null = null;

// Lazily built on first query so the palette's first paint doesn't pay for
// tokenising ~100 documents; subsequent queries reuse it.
export function getSearchIndex(): SearchIndex {
  if (!index) index = buildIndex(getSearchDocuments());
  return index;
}

export function searchCurriculum(query: string, limit = 12): SearchHit[] {
  return runSearch(getSearchIndex(), query, limit);
}
