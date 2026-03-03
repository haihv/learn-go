# Go Interactive Course — Implementation Plan v2
> Orchestrator + Subagent Architecture · Optimized for Claude Pro

---

## 1. Project Overview

Build a **self-hosted interactive Go learning platform** modeled after [freeCodeCamp Python v9](https://www.freecodecamp.org/learn/python-v9).

### Core Experience
- **Lessons** → read theory → 3-question comprehension quiz → unlock next
- **Workshops** → step-by-step guided coding with per-step validation
- **Labs** → free-form coding with automated test suite (code + stdout checks)
- **Real Go execution** via Go Playground API proxy
- **Progress persistence** via localStorage (Zustand + persist middleware)

### Tech Stack

| Layer | Choice | Reason |
|-------|--------|--------|
| Framework | Next.js 15 (App Router) | SSR, file-based routing, easy deploy |
| Styling | Tailwind CSS | Utility-first, no runtime cost |
| Code Editor | CodeMirror 6 | Go syntax highlighting, lightweight |
| Go Execution | Go Playground REST API | No WASM setup needed, free |
| State | Zustand + persist | Simple, localStorage built-in |
| Deploy | Vercel | Free tier, perfect for Next.js |

---

## 2. Architecture: Orchestrator + Subagents

### Mental Model

```
YOU (human)
  └── Orchestrator (one Claude Code session — runs the whole time)
        ├── spawns Subagent A → does one atomic task → returns output
        ├── spawns Subagent B → does one atomic task → returns output
        ├── spawns Subagent C → does one atomic task → returns output
        └── integrates all outputs, fixes conflicts, runs checks
```

### Why This Fits Claude Pro

Each subagent handles a **single file or tightly scoped task** — small context, fast completion, low token cost. The orchestrator stays alive across the whole project but only does coordination: spawning tasks, reviewing outputs, resolving conflicts, running `tsc` and `npm run dev` to verify health.

### Orchestrator Responsibilities
- Maintain the master task queue (the phases below)
- Spawn subagents with precise, self-contained prompts
- After each subagent returns: run `tsc --noEmit` to catch errors immediately
- Resolve any cross-file conflicts before moving to next phase
- Gate phase transitions — never start Phase N+1 until Phase N passes type-check

### Subagent Rules
- Each subagent gets **one job**: create or edit specific named files
- Each subagent prompt includes: the relevant TypeScript interfaces, file path, exact requirements
- Each subagent ends its work with: "Files created/modified: [list]"
- Subagents never modify files outside their assigned scope

---

## 3. Repository Structure

```
go-course/
├── app/
│   ├── layout.tsx                 # Root layout (fonts, theme provider)
│   ├── page.tsx                   # Landing page
│   ├── learn/
│   │   ├── layout.tsx             # Course shell (sidebar + topbar)
│   │   └── [moduleId]/
│   │       └── page.tsx           # Dynamic module renderer
│   └── api/
│       └── run/
│           └── route.ts           # Go Playground proxy
├── components/
│   ├── layout/
│   │   ├── Sidebar.tsx
│   │   └── TopBar.tsx
│   ├── lesson/
│   │   ├── LessonContent.tsx      # Markdown + code highlighting
│   │   └── QuizBlock.tsx          # 3-question quiz
│   ├── workshop/
│   │   ├── WorkshopView.tsx       # Step orchestrator
│   │   ├── StepInstruction.tsx    # Instruction + hint panel
│   │   └── StepProgress.tsx       # Step indicator dots
│   ├── lab/
│   │   ├── LabView.tsx            # Two-panel layout
│   │   ├── LabInstructions.tsx    # Requirements panel
│   │   └── TestResults.tsx        # Animated pass/fail list
│   ├── editor/
│   │   ├── GoEditor.tsx           # CodeMirror 6
│   │   ├── OutputPanel.tsx        # stdout/stderr display
│   │   └── RunButton.tsx          # Run + spinner
│   └── ui/
│       ├── ProgressBar.tsx
│       ├── Badge.tsx              # lesson/workshop/lab pill
│       └── Celebration.tsx        # Confetti on complete
├── lib/
│   ├── curriculum/
│   │   ├── types.ts               # ALL shared interfaces — source of truth
│   │   ├── index.ts               # Ordered export of all 12 modules
│   │   └── modules/               # One file per module
│   │       ├── 01-intro.ts
│   │       ├── 02-variables.ts
│   │       ├── 03-variables-lab.ts
│   │       ├── 04-functions.ts
│   │       ├── 05-functions-workshop.ts
│   │       ├── 06-functions-lab.ts
│   │       ├── 07-control-flow.ts
│   │       ├── 08-slices.ts
│   │       ├── 09-maps.ts
│   │       ├── 10-structs.ts
│   │       ├── 11-interfaces.ts
│   │       └── 12-goroutines.ts
│   ├── go-runner.ts               # Playground API client
│   └── test-runner.ts             # Lab test evaluation
├── store/
│   └── course.ts                  # Zustand store
└── hooks/
    ├── useProgress.ts
    └── useGoRunner.ts
```

---

## 4. Shared Interfaces (types.ts — written once by orchestrator)

The orchestrator writes this file **before spawning any subagent**. Every subagent imports from here.

```typescript
// lib/curriculum/types.ts

export type ModuleType = "lesson" | "workshop" | "lab";

export type QuizQuestion = {
  question: string;
  options: [string, string, string, string]; // exactly 4
  correctIndex: 0 | 1 | 2 | 3;
};

export type WorkshopStep = {
  instruction: string;
  hint: string;           // complete working solution
  starterCode: string;
  validate: (code: string) => boolean;  // pure, synchronous
  successMessage: string;
};

export type LabTest = {
  name: string;
  description: string;   // shown to user on failure
  validate: (code: string, stdout: string) => boolean;
};

export type LessonModule = {
  type: "lesson";
  id: string;
  slug: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  content: string;         // markdown string
  quiz: QuizQuestion[];    // exactly 3
};

export type WorkshopModule = {
  type: "workshop";
  id: string;
  slug: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  description: string;
  steps: WorkshopStep[];   // 3-4 steps
};

export type LabModule = {
  type: "lab";
  id: string;
  slug: string;
  title: string;
  icon: string;
  estimatedMinutes: number;
  description: string;
  instructions: string;    // markdown
  starterCode: string;
  tests: LabTest[];        // 4-6 tests
  solutionCode: string;
};

export type CourseModule = LessonModule | WorkshopModule | LabModule;
```

---

## 5. Phase-by-Phase Execution Plan

### Phase 0 — Orchestrator Bootstraps (no subagents)

The orchestrator does this directly, no delegation:

```bash
npx create-next-app@latest go-course \
  --typescript --tailwind --app --no-src-dir --eslint

cd go-course
npm install zustand @uiw/react-codemirror @codemirror/lang-go \
  @codemirror/theme-one-dark react-markdown remark-gfm \
  canvas-confetti @types/canvas-confetti
```

Then the orchestrator manually creates:
- `lib/curriculum/types.ts` — the full types above
- `tailwind.config.ts` — with navy + go color tokens
- All **empty stub files** for every path in the repo structure (so imports don't break)
- `store/course.ts` — Zustand store (spec below)
- `app/layout.tsx` — root layout with font imports (Space Mono from Google Fonts, dark bg)
- `app/api/run/route.ts` — Go Playground proxy

**`store/course.ts` spec (orchestrator writes this directly):**

```typescript
// store/course.ts
"use client";
import { create } from "zustand";
import { persist } from "zustand/middleware";

type CourseState = {
  completedSlugs: string[];
  workshopSteps: Record<string, number>; // slug → last completed step index
  markComplete: (slug: string) => void;
  setWorkshopStep: (slug: string, step: number) => void;
};

export const useCourseStore = create<CourseState>()(
  persist(
    (set) => ({
      completedSlugs: [],
      workshopSteps: {},
      markComplete: (slug) =>
        set((state) => ({
          completedSlugs: state.completedSlugs.includes(slug)
            ? state.completedSlugs
            : [...state.completedSlugs, slug],
        })),
      setWorkshopStep: (slug, step) =>
        set((state) => ({
          workshopSteps: { ...state.workshopSteps, [slug]: step },
        })),
    }),
    { name: "go-course-progress" }
  )
);
```

**Gate:** `npm run dev` starts, `tsc --noEmit` passes. Then spawn Phase 1.

---

### Phase 1 — Infrastructure Subagents (3 subagents, sequential)

These are small, focused, and must complete before curriculum or UI work.

---

#### Subagent 1-A · Go Runner
**File:** `lib/go-runner.ts`

**Prompt to subagent:**
> Create `lib/go-runner.ts`. It exports:
> - `RunResult` interface: `{ stdout: string; stderr: string; error: string | null; timedOut: boolean }`
> - `async function runGoCode(code: string): Promise<RunResult>` — POSTs to `/api/run`, returns parsed result
> - `function isCompileError(result: RunResult): boolean` — true if stderr contains "syntax error" or "undefined"
> No other dependencies. No imports from our codebase.

**Expected output:** 1 file, ~40 lines.

---

#### Subagent 1-B · Test Runner
**File:** `lib/test-runner.ts`

**Prompt to subagent:**
> Create `lib/test-runner.ts`. Import `LabTest` from `./curriculum/types`.
> Export:
> - `interface TestResult { name: string; passed: boolean; message: string }`
> - `function runLabTests(tests: LabTest[], code: string, stdout: string): TestResult[]`
>   — maps over tests, calls `test.validate(code, stdout)`, catches errors gracefully (failed test = `passed: false`)
> - `function allPassed(results: TestResult[]): boolean`

**Expected output:** 1 file, ~35 lines.

---

#### Subagent 1-C · Hooks
**Files:** `hooks/useGoRunner.ts`, `hooks/useProgress.ts`

**Prompt to subagent:**
> Create two hooks.
>
> `hooks/useGoRunner.ts`:
> - imports `runGoCode` from `../lib/go-runner`
> - exports `useGoRunner()` returning `{ run, result, isRunning, clear }`
> - `run(code)` sets `isRunning=true`, calls `runGoCode`, stores result, sets `isRunning=false`
> - 300ms debounce on rapid calls
>
> `hooks/useProgress.ts`:
> - imports `useCourseStore` from `../store/course`
> - exports `useProgress()` returning `{ isComplete, markComplete, completedCount, totalCount }`
> - `isComplete(slug: string): boolean`

**Expected output:** 2 files, ~30 lines each.

**Gate after Phase 1:** `tsc --noEmit` passes.

---

### Phase 2 — Curriculum Subagents (12 subagents, pairs)

One subagent per module. Spawn in pairs (2 at a time max on Claude Pro to preserve quota).

The orchestrator gives each subagent:
1. The `types.ts` interfaces (pasted inline)
2. The module's topic outline
3. The file path to create
4. Quality requirements

**Standard subagent prompt template:**

```
Create `lib/curriculum/modules/[NN-name].ts`.

Import CourseModule types from this interface (pasted below): [paste types.ts]

Module spec:
- type: [lesson|workshop|lab]
- id: "[id]"
- slug: "[slug]"  
- title: "[title]"
- icon: "[emoji]"
- estimatedMinutes: [N]

[Specific content requirements for this module — see table below]

Quality requirements:
- Lessons: content 400-600 words markdown, 3 quiz questions with 4 plausible options
- Workshops: 3-4 steps, each hint is the complete correct solution
- Labs: 4-6 tests, prefer stdout checks over regex pattern checks

Export as: export const [name]: CourseModule = { ... }
```

---

#### Module Subagent Assignments

| Pair | Subagent | File | Type | Content Focus |
|------|----------|------|------|---------------|
| 1 | 2-A | `01-intro.ts` | lesson | Why Go, package main, import, fmt.Println, fmt.Printf. Quiz: package name, import syntax, entry point |
| 1 | 2-B | `02-variables.ts` | workshop | Step 1: var declaration. Step 2: := shorthand. Step 3: multiple assignment. Step 4: zero values |
| 2 | 2-C | `03-variables-lab.ts` | lab | Declare name/age/country/isStudent, print formatted profile. Tests: has all 4 vars, correct types, fmt.Printf used |
| 2 | 2-D | `04-functions.ts` | lesson | Params, return types, multiple returns, named returns, variadic. Quiz: multiple returns syntax, variadic operator, named return behavior |
| 3 | 2-E | `05-functions-workshop.ts` | workshop | Step 1: write add(a,b int) int. Step 2: write greet(name string) string. Step 3: write swap(a,b string)(string,string). Step 4: write divide with error return |
| 3 | 2-F | `06-functions-lab.ts` | lab | Temperature converter: celsiusToFahrenheit + fahrenheitToCelsius. Tests: function names exist, 100°C→212 in stdout, 32°F→0 in stdout, float64 used |
| 4 | 2-G | `07-control-flow.ts` | lesson | if/else, switch (no fallthrough default), for as while, for range. Quiz: switch fallthrough, range index/value, for-as-while syntax |
| 4 | 2-H | `08-slices.ts` | workshop | Step 1: declare slice literal. Step 2: append. Step 3: slice of slice [1:3]. Step 4: range loop printing index+value |
| 5 | 2-I | `09-maps.ts` | workshop | Step 1: make(map[string]int). Step 2: set key. Step 3: get + comma-ok idiom. Step 4: delete. Step 5: range over map |
| 5 | 2-J | `10-structs.ts` | lesson | type struct, literal init, value receiver method, pointer receiver method, embedding. Quiz: pointer vs value receiver, struct literal syntax, embedding vs inheritance |
| 6 | 2-K | `11-interfaces.ts` | lesson | Implicit implementation, defining interface, Stringer interface, empty interface / any, type assertion. Quiz: how interfaces are satisfied, type assertion syntax, empty interface usage |
| 6 | 2-L | `12-goroutines.ts` | lesson | go keyword, channel make/send/receive, buffered channels, select statement, sync.WaitGroup. Quiz: channel direction, select behavior, WaitGroup methods |

---

#### After All 12 Module Subagents

The orchestrator creates `lib/curriculum/index.ts`:

```typescript
import { intro } from "./modules/01-intro";
import { variables } from "./modules/02-variables";
import { variablesLab } from "./modules/03-variables-lab";
import { functions } from "./modules/04-functions";
import { functionsWorkshop } from "./modules/05-functions-workshop";
import { functionsLab } from "./modules/06-functions-lab";
import { controlFlow } from "./modules/07-control-flow";
import { slices } from "./modules/08-slices";
import { maps } from "./modules/09-maps";
import { structs } from "./modules/10-structs";
import { interfaces } from "./modules/11-interfaces";
import { goroutines } from "./modules/12-goroutines";
import { CourseModule } from "./types";

export const curriculum: CourseModule[] = [
  intro, variables, variablesLab,
  functions, functionsWorkshop, functionsLab,
  controlFlow, slices, maps,
  structs, interfaces, goroutines,
];

export function getModuleBySlug(slug: string): CourseModule | undefined {
  return curriculum.find((m) => m.slug === slug);
}

export function getModuleIndex(slug: string): number {
  return curriculum.findIndex((m) => m.slug === slug);
}
```

**Gate after Phase 2:** `tsc --noEmit` passes on all 12 module files.

---

### Phase 3 — UI Component Subagents (10 subagents, pairs)

Same pattern: one subagent per component group. Orchestrator gives each subagent the relevant types + store API.

---

#### Subagent 3-A · Editor Components
**Files:** `components/editor/GoEditor.tsx`, `components/editor/RunButton.tsx`, `components/editor/OutputPanel.tsx`

**Prompt focus:**
> - `GoEditor`: CodeMirror 6 with `@codemirror/lang-go` and `oneDark` theme. Props: `value: string`, `onChange: (v: string) => void`, `readOnly?: boolean`. Min height 280px, Space Mono font, line numbers on. **Must have `'use client'` directive at the top** — CodeMirror is browser-only and will crash on SSR. Consumers should use `dynamic(() => import('./GoEditor'), { ssr: false })`.
> - `RunButton`: Props `onRun: () => void`, `isRunning: boolean`. Shows spinner SVG when running, disabled state. Tailwind styled, go-cyan accent color.
> - `OutputPanel`: Props `stdout: string`, `stderr: string`, `error: string | null`. Two tabs (Output / Errors). Monospace pre block. Error text in red, stdout in green.

---

#### Subagent 3-B · UI Primitives
**Files:** `components/ui/ProgressBar.tsx`, `components/ui/Badge.tsx`, `components/ui/Celebration.tsx`

**Prompt focus:**
> - `ProgressBar`: Props `completed: number`, `total: number`. Green gradient fill, animated width transition, shows "X/N modules" label.
> - `Badge`: Props `type: ModuleType`. Renders colored pill — lesson=blue, workshop=purple, lab=green. Uppercase, small font, rounded-full.
> - `Celebration`: Uses `canvas-confetti`. Exported as a function `triggerCelebration()` and a `<CelebrationOverlay>` component that shows "🎉 Module Complete!" for 2s then fades.

---

#### Subagent 3-C · Quiz Block
**File:** `components/lesson/QuizBlock.tsx`

**Prompt focus:**
> Props: `questions: QuizQuestion[]`, `onComplete: () => void`
> Behavior:
> - Show all 3 questions at once
> - User selects one option per question (radio-button style cards)
> - "Submit" button disabled until all 3 answered
> - On submit: reveal correct (green) and wrong (red) per question
> - Show score "3/3 correct → unlocking next module" or "2/3 — review above"
> - Call `onComplete()` only if all 3 correct
> - Lock all inputs after submission (can't change answers)

---

#### Subagent 3-D · Lesson Content
**File:** `components/lesson/LessonContent.tsx`

**Prompt focus:**
> Props: `content: string` (markdown)
> Uses `react-markdown` with `remark-gfm`
> Custom renderers:
> - `code` blocks: dark background `#0f172a`, syntax-colored, rounded, `Space Mono` font
> - `h1`, `h2`, `h3`: go-cyan / sky-blue colors, Space Mono font
> - `strong`: purple accent
> - inline `code`: small dark pill, green text
> - `p`: slate-300 color, 1.7 line height

---

#### Subagent 3-E · Step Progress + Step Instruction
**Files:** `components/workshop/StepProgress.tsx`, `components/workshop/StepInstruction.tsx`

**Prompt focus:**
> `StepProgress`: Props `steps: number`, `currentStep: number`, `completedSteps: number[]`
> Renders a row of numbered circles. Completed = green with checkmark. Active = blue with step number. Locked = dark with number.
>
> `StepInstruction`: Props `step: WorkshopStep`, `stepNumber: number`, `onShowHint: () => void`, `hintVisible: boolean`
> Shows instruction text in a left-bordered callout box.
> "Show Hint" button toggles a code block showing `step.hint`.
> Hint styled as a collapsed panel that slides open.

---

#### Subagent 3-F · Workshop View
**File:** `components/workshop/WorkshopView.tsx`

**Prompt focus:**
> Props: `module: WorkshopModule`, `onComplete: () => void`
> Uses `useCourseStore` to persist step index per module slug.
> Layout: StepProgress at top, GoEditor in middle, StepInstruction below editor.
> "Check Code" button: calls `currentStep.validate(code)`, shows pass/fail inline.
> On step pass: advance to next step after 800ms delay, reset editor to next step's `starterCode`.
> On final step pass: show Celebration, call `onComplete()`.

---

#### Subagent 3-G · Lab Instructions + Test Results
**Files:** `components/lab/LabInstructions.tsx`, `components/lab/TestResults.tsx`

**Prompt focus:**
> `LabInstructions`: Props `instructions: string`. Renders markdown (reuse LessonContent styles). Shows at top on mobile, left panel on desktop.
>
> `TestResults`: Props `results: TestResult[]`. Animated list — each item: icon (✅/❌) + test name + failure message if failed. Stagger fade-in animation. If all passed: show green "All tests passed!" banner.

---

#### Subagent 3-H · Lab View
**File:** `components/lab/LabView.tsx`

**Prompt focus:**
> Props: `module: LabModule`, `onComplete: () => void`
> Uses `useGoRunner` and `runLabTests` from test-runner.
> Desktop layout: two columns — instructions (left, 40%) + editor+output (right, 60%).
> Mobile layout: stacked — instructions collapsed above editor.
> Buttons: "▶ Run" (runs code, shows output), "Submit" (runs code + evaluates all tests).
> On submit: show TestResults component below editor.
> If all tests pass: call `triggerCelebration()` + `onComplete()` after 1s delay.

---

#### Subagent 3-I · Sidebar
**File:** `components/layout/Sidebar.tsx`

**Prompt focus:**
> Props: `modules: CourseModule[]`, `currentSlug: string`, `onNavigate: (slug: string) => void`
> Uses `useProgress` hook for completion state.
> Top section: logo "🐹 Learn Go" + ProgressBar.
> Module list: each item shows icon + title + Badge + checkmark if complete. Active item highlighted in navy-700. Completed items show ✅ replacing icon.
> Width: 260px fixed on desktop. Collapsible (hidden) on mobile with toggle button.

---

#### Subagent 3-J · Top Bar
**File:** `components/layout/TopBar.tsx`

**Prompt focus:**
> Props: `module: CourseModule`, `onPrev: () => void`, `onNext: () => void`, `hasPrev: boolean`, `hasNext: boolean`, `isComplete: boolean`, `onMarkComplete: () => void`
> Shows: hamburger (sidebar toggle) | module icon + title + Badge | estimated time | Prev/Next buttons.
> "Mark Complete" button appears only if module not yet complete. Replaced by "Next →" highlight when complete.
> Mobile: hide estimated time, compress buttons.

**Gate after Phase 3:** `tsc --noEmit` passes. Every component file exists and has valid exports.

---

### Phase 4 — Pages Subagents (3 subagents, sequential)

---

#### Subagent 4-A · API Route
**File:** `app/api/run/route.ts`

**Prompt focus:**
> Next.js Route Handler. POST endpoint.
> Receives `{ code: string }`.
> Proxies to `https://go.dev/play/p/run` with `version=2`.
> Parses Events array: separate stdout and stderr.
> Returns `RunResult` shape.
> Add 10s timeout via `AbortController`.
> Return 500 with `{ error: "timeout" }` if exceeded.

---

#### Subagent 4-B · Course Layout + Module Page
**Files:** `app/learn/layout.tsx`, `app/learn/[moduleId]/page.tsx`

**Prompt focus:**
> `layout.tsx`: Flex row. Sidebar (uses client-side state for collapse). Main area scrollable.
>
> `[moduleId]/page.tsx`:
> - Server component: calls `getModuleBySlug(params.moduleId)`, returns 404 if not found
> - Passes module to appropriate view component based on `module.type`
> - `onComplete` calls `store.markComplete(slug)` then navigates to next module slug
> - Wraps content in client boundary for interactive parts
> - `generateMetadata`: title = module title, description = module description

---

#### Subagent 4-C · Landing Page
**File:** `app/page.tsx`

**Prompt focus:**
> Hero: Large "Learn Go Interactively" headline, subtext about the course, "Start Learning →" button linking to `/learn/intro`.
> Three feature cards: Lessons (📖), Workshops (🔨), Labs (🧪) — each with a one-line description.
> Curriculum table: all 12 modules, type badge, estimated minutes.
> Footer: "Built with Claude · Inspired by freeCodeCamp"
> Dark navy background, go-cyan accents. Professional but not generic.

**Gate after Phase 4:** Full `npm run dev` + manual smoke test of the flow below.

---

## 6. Smoke Test Checklist (Orchestrator runs after Phase 4)

```
[ ] / loads landing page with curriculum table
[ ] "Start Learning" navigates to /learn/intro
[ ] Lesson content renders with syntax-highlighted code blocks
[ ] Quiz: selecting all 3 answers enables Submit button
[ ] Quiz: submitting all correct answers triggers onComplete
[ ] Next button navigates to /learn/variables
[ ] Workshop: starter code appears in CodeMirror editor
[ ] Workshop: Check Code button shows pass/fail feedback
[ ] Workshop: completing all steps triggers celebration
[ ] Lab: Run button calls /api/run and shows output
[ ] Lab: Submit button shows test results
[ ] Lab: all tests passing triggers celebration and enables Next
[ ] Progress bar increments with each completion
[ ] Completed modules show ✅ in sidebar
[ ] Browser refresh preserves progress (localStorage)
[ ] tsc --noEmit passes with zero errors
```

---

## 7. Subagent Prompt Boilerplate

Use this wrapper for every subagent spawn:

```
You are a focused implementation agent. Your job is ONLY to create or edit
the specific files listed below. Do not modify any other files.

Context you need:
[paste relevant types / interfaces / imports]

Your task:
[specific file requirements]

When done, respond with:
1. A list of every file you created or modified
2. Any TypeScript errors you noticed that need orchestrator attention
3. Nothing else — no explanations, no summaries
```

---

## 8. Token Budget Estimate (Claude Pro)

| Phase | Subagents | Avg tokens each | Total |
|-------|-----------|-----------------|-------|
| 0 (bootstrap) | 0 (orchestrator direct) | ~8k | ~8k |
| 1 (infra) | 3 | ~4k | ~12k |
| 2 (curriculum) | 12 | ~6k | ~72k |
| 3 (UI components) | 10 | ~5k | ~50k |
| 4 (pages) | 3 | ~5k | ~15k |
| **Total** | **28** | | **~157k** |

Claude Pro's 5-hour window comfortably handles this if you **spread Phase 2 across two windows** (modules 01-06 in one session, 07-12 in another). Phases 0, 1, 3, and 4 each fit in a single window.

---

## 9. Styling Tokens

```typescript
// tailwind.config.ts — extend colors
colors: {
  navy: {
    950: "#060e1d",  // page bg
    900: "#080f1e",  // sidebar bg
    800: "#0f172a",  // card bg
    700: "#1e293b",  // input bg
    600: "#334155",  // borders
    500: "#475569",  // muted text
  },
  go: {
    cyan:   "#00d2a0",  // primary (Go brand teal)
    blue:   "#00b4d8",  // secondary
    purple: "#f0abfc",  // lesson accent
    green:  "#86efac",  // success / lab
    red:    "#fca5a5",  // error
    yellow: "#fbbf24",  // hint / warning
  }
}
```

---

## 10. Future Enhancements (Post V1)

- **User accounts** — Supabase Auth, sync progress across devices
- **Streak system** — daily learning streak
- **More modules** — generics, testing, HTTP servers, JSON, databases
- **Self-hosted runner** — Docker Go container, no Playground rate limits
- **Go WASM** — run entirely in browser, zero latency
- **Search** — full-text search across curriculum