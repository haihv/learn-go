// T-shaped, Bloom-laddered course architecture.
//
// A "stem" is one deep dive into a single domain. It climbs Bloom's six
// levels — Remember -> Understand -> Apply -> Analyze -> Evaluate -> Create —
// and each level has exactly one interaction shape. The consistency is the
// point: learners stop parsing UI and spend attention on content.
//
// Every stem is pure data. The six level interactions are parameterized
// components (components/stem/levels), so authoring a new deep dive means
// writing one of these objects — no new React.

export type BloomLevel = 1 | 2 | 3 | 4 | 5 | 6;

// L1 Remember — flip-to-reveal term chips (retrieval practice, not re-reading)
export type RecallLevel = {
  level: 1;
  verb: "recall";
  title: string;
  lead: string;
  terms: { term: string; reveal: string }[];
};

// L2 Understand — tap each stage of a pipeline for the "why"; ends on a takeaway
export type FlowLevel = {
  level: 2;
  verb: "explain";
  title: string;
  lead: string;
  stages: { label: string; why: string }[];
  takeaway: string;
};

// L3 Apply — a build checklist you'd use this week (+ optional code peek)
export type ApplyLevel = {
  level: 3;
  verb: "use";
  title: string;
  lead: string;
  checklist: string[];
  codePeek?: string;
};

// L4 Analyze — a tradeoff slider + an either/or toggle (every gain has a bill)
export type AnalyzeLevel = {
  level: 4;
  verb: "compare";
  title: string;
  lead: string;
  slider: {
    leftLabel: string;
    rightLabel: string;
    // notes keyed by slider position 0..100; nearest stop wins
    stops: { at: number; note: string }[];
  };
  toggle: {
    question: string;
    optionA: string;
    optionB: string;
    answer: "A" | "B";
    why: string;
  };
};

// L5 Evaluate — spot-the-flaw / bust-a-myth MCQ with a reveal
export type EvaluateLevel = {
  level: 5;
  verb: "judge";
  title: string;
  lead: string;
  prompt: string;
  options: { text: string; correct: boolean; reveal: string }[];
};

// L6 Create — a spec generator (compose choices) + the real build card
export type CreateLevel = {
  level: 6;
  verb: "build";
  title: string;
  lead: string;
  choices: { id: string; label: string; options: string[] }[];
  specTemplate: string; // e.g. "A {scope} that {behavior}, gated by {check}."
  buildCard: {
    title: string;
    deliverable: string;
    acceptance: string[];
  };
};

export type StemLevel =
  | RecallLevel
  | FlowLevel
  | ApplyLevel
  | AnalyzeLevel
  | EvaluateLevel
  | CreateLevel;

export type Stem = {
  id: string;
  slug: string;
  domainId: string;
  title: string;
  icon: string;
  oneLiner: string; // the durable idea this stem refines
  estimatedMinutes: number;
  levels: [
    RecallLevel,
    FlowLevel,
    ApplyLevel,
    AnalyzeLevel,
    EvaluateLevel,
    CreateLevel,
  ];
};

// A domain is one of the 6–9 carved areas of the field (the horizontal bar of
// the T). It links to a deep stem once one is authored.
export type AtlasDomain = {
  id: string;
  title: string;
  icon: string;
  blurb: string;
  createDeliverable: string; // the Create-level build this domain works toward
  stemSlug?: string; // present once the deep stem exists
};

export type Atlas = {
  field: string;
  oneIdea: string; // the single idea the whole field refines
  oneIdeaExpanded: string;
  domains: AtlasDomain[];
};

// Literal Tailwind class names per level — interpolated class strings
// (`bg-${color}`) are NOT seen by Tailwind v4's scanner, so we spell them out.
export const BLOOM_META: Record<
  BloomLevel,
  { name: string; verb: string; bar: string; text: string }
> = {
  1: { name: "Remember", verb: "recall", bar: "bg-go-cyan", text: "text-go-cyan" },
  2: { name: "Understand", verb: "explain", bar: "bg-go-blue", text: "text-go-blue" },
  3: { name: "Apply", verb: "use", bar: "bg-go-green", text: "text-go-green" },
  4: { name: "Analyze", verb: "compare", bar: "bg-go-yellow", text: "text-go-yellow" },
  5: { name: "Evaluate", verb: "judge", bar: "bg-go-purple", text: "text-go-purple" },
  6: { name: "Create", verb: "build", bar: "bg-go-red", text: "text-go-red" },
};
