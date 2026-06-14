// Tier 1 of the method — "Orient": shallow, fast artifacts that map the field's
// tools and a path through them, before the learner digs into a deep stem.
//
// All three are pure data. The Recall Deck's scheduling lives in the Zustand
// store (deckSchedule / reviewCard); the cards themselves are data here.

// Stack Map — the field's tools, layer by layer, one dated pick each.
// "Concepts are durable, tools are swappable": each pick is current-best and
// dated, so it can be replaced without touching the concept it serves.
export type StackLayer = {
  layer: string;
  role: string; // what this layer is responsible for
  pick: string; // the current-best tool(s)
  since: string; // when this pick became the recommendation (a year)
  note: string; // why this pick, and when to reach past it
};

// Plan — a time-boxed path to a concrete goal, week by week. Each week names a
// deliverable and the deep stems that power it.
export type PlanWeek = {
  week: number;
  theme: string;
  focus: string[];
  deliverable: string;
  stems: string[]; // stem slugs this week leans on
};

// Recall Deck — spaced-repetition vocabulary. One fact per card; the scheduler
// (in the store) decides when each is due.
export type DeckCard = {
  id: string;
  domainId: string; // which Atlas domain it reinforces
  front: string;
  back: string;
};

export type ReviewGrade = "again" | "fuzzy" | "good";
