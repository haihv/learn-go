# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Self-hosted interactive Go learning platform modeled after freeCodeCamp Python v9. Three activity types: **Lessons** (markdown + 3-question quiz), **Workshops** (step-by-step guided coding), **Labs** (free-form coding with automated test suite). See `ROADMAP.md` for the full implementation roadmap.

## Commands

```bash
pnpm dev          # start dev server (localhost:3000)
pnpm wasm         # build the in-browser Go runtime → public/wasm/ (gitignored)
pnpm build        # pnpm wasm + production build
pnpm lint         # ESLint
npx tsc --noEmit     # type-check without emitting (run this after every phase)
```

> Gate rule from the plan: `tsc --noEmit` must pass before moving to the next implementation phase.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 / React 19 (App Router) |
| Styling | Tailwind CSS v4 with custom navy/go color tokens |
| Code editor | CodeMirror 6 via `@uiw/react-codemirror` |
| Go execution | In-browser: Yaegi interpreter → wasm in a Web Worker; fallback: Go Playground REST API (proxied via `/api/run`) |
| State | Zustand + `persist` middleware → localStorage |

## Architecture

### Data flow

```
lib/curriculum/types.ts   ← single source of truth for all TypeScript types
lib/curriculum/modules/   ← one file per module, exports a typed CourseModule
lib/curriculum/index.ts   ← aggregates all 12 modules into `curriculum[]`
                                     ↓
app/learn/[moduleId]/page.tsx  ← server component, resolves slug → module
                                     ↓
components/{lesson,workshop,lab}/  ← client components per activity type
                                     ↓
components/editor/GoEditor.tsx     ← CodeMirror, browser-only
lib/go-runner.ts                   ← picks an engine (wasm → Playground fallback), normalises RunResult
lib/wasm/engine.ts                 ← main-thread handle to the wasm worker (lazy load, timeout → respawn)
lib/wasm/worker.ts                 ← Web Worker: loads public/wasm/{wasm_exec.js,yaegi.wasm}, runs programs
lib/test-runner.ts                 ← evaluates LabTest[] against code + stdout
store/course.ts                    ← Zustand store, persists to localStorage
```

### Module types

`CourseModule = LessonModule | WorkshopModule | LabModule` (discriminated union on `type` field). Always switch/narrow on `module.type` before passing to a view component.

### T-shaped / Bloom deep-stems (additive track)

A second, content-agnostic track sits alongside the lesson/workshop/lab curriculum, applying the T-shaped, Bloom-laddered method (teach the field broad-and-shallow via an Atlas, then drive deep stems down into each domain).

```
lib/stems/types.ts        ← Stem + Atlas types; 6 Bloom levels as a union
lib/stems/atlas.ts        ← the "one idea" + Go carved into 8 domains
lib/stems/<domain>.ts     ← one Stem per file (pure data, no React)
lib/stems/index.ts        ← stems[] registry + atlas, getStemBySlug
                                     ↓
app/atlas/page.tsx         ← Tier 0 map: one idea, ladder, domain cards
app/stem/[slug]/page.tsx   ← resolves slug → Stem (SSG via generateStaticParams)
                                     ↓
components/stem/StemShell.tsx       ← header + Bloom progress + prev/next rails
components/stem/levels/*.tsx        ← one component per Bloom level (L1–L6)
```

A deep stem climbs Remember→Understand→Apply→Analyze→Evaluate→Create, one interaction shape per level. Authoring a new stem = write one data file in `lib/stems/`, register it in `index.ts`, and set the matching Atlas domain's `stemSlug`. No new React. `BLOOM_META` in `types.ts` holds **literal** Tailwind class names (e.g. `bg-go-cyan`) — never build color classes by string interpolation, the v4 scanner won't see them. Stem progress persists via the store's `reachStemLevel` / `stemLevels`.

### Search

Client-side full-text search, zero runtime deps. `lib/search/documents.ts` flattens curriculum modules, stems, and atlas domains into `SearchDoc[]` (markdown stripped); `lib/search/engine.ts` is a small BM25 inverted index with title boost, prefix expansion of the last (partial) term, and snippet extraction; `lib/search/index.ts` exposes `searchCurriculum(query)` over a lazily built singleton index. The ⌘K/Ctrl+K palette (`components/search/SearchPalette.tsx`) is mounted once in `app/layout.tsx`; `SearchButton` triggers live in the Sidebar, TopBar, and landing page and all talk to `store/search.ts` (non-persisted Zustand `open` flag). `app/search/page.tsx` is the server-rendered twin (`/search?q=`, noindex) for shareable links and no-JS. New searchable content types go in `documents.ts` only.

### Go execution engines

`runGoCode(code, { engine })` in `lib/go-runner.ts` is the only entry point views call. Engine preference lives in the store (`enginePreference: "auto" | "playground"`, toggled by `components/editor/EngineBadge.tsx`). In `auto` mode the order is: (1) `browserRuntimeBlocker(code)` — denylisted imports (`testing`, `os/exec`, `database/sql`, …), any non-stdlib import, or `func TestX(t *testing.T)` ⇒ Playground; (2) wasm not `ready` yet ⇒ Playground now, wasm download kicked off for next time; (3) run in wasm — keep the result unless the interpreter returned a non-parser error (Yaegi has gaps: some generic inference, `errors.As` with `**T`), in which case re-run on the Playground, which is authoritative. `RunResult.engine` / `fallbackReason` are shown under the output panel.

**wasm runtime:** `scripts/wasm/main.go` wraps Yaegi (`interp` + `stdlib` symbols) and exposes `__goRun(code, cb)`; `scripts/wasm/build.sh` builds it to `public/wasm/yaegi.wasm` + copies the matching `wasm_exec.js` (gitignored, produced by `pnpm wasm`/`pnpm build`; downloads a pinned Go if none is installed — `vercel.json` pins the build command to `pnpm build`). `lib/wasm/engine.ts` is a singleton (`wasmEngine`) that boots one worker lazily, resolves runs by id, and on a 10 s timeout terminates + respawns the worker (the only way to stop a runaway Go program). The CSP needs `'wasm-unsafe-eval'` in `script-src`. A fresh interpreter is created per run so globals/goroutines never leak between programs. Yaegi's single `Eval` of a `package main` file already runs `main()`.

**Playground proxy:** `POST /api/run` (Next.js Route Handler) proxies to `https://play.golang.org/compile?output=json` with a 10 s `AbortController` timeout. Returns `RunResult { stdout, stderr, error, timedOut }`. Never call the Playground directly from the client.

### CodeMirror SSR

`GoEditor.tsx` **must** have `'use client'` at the top. Any server or shared component that renders it must use:
```ts
const GoEditor = dynamic(() => import("@/components/editor/GoEditor"), { ssr: false });
```

### Zustand store shape

```ts
{ completedSlugs: string[], workshopSteps: Record<string, number>,
  enginePreference: "auto" | "playground",
  markComplete(slug), setWorkshopStep(slug, step), setEnginePreference(pref) }
```
Persisted under localStorage key `"go-course-progress"`.

## Workflow

- Commit after every meaningful change (phase completion, new feature, bug fix)

## Conventions

- Use `type` not `interface` everywhere
- Import Node built-ins with the `node:` prefix (e.g. `import crypto from "node:crypto"`)
- Comments explain **why/how**, not what the code does
- Tailwind v4: color tokens are defined in `app/globals.css` via `@theme inline` — no `tailwind.config.ts`. Token names: `navy-{950,900,800,700,600,500}` for backgrounds/borders, `go-{cyan,blue,purple,green,red,yellow}` for accents — never use raw hex in JSX
- `validate` functions in curriculum modules must be **pure and synchronous** — no async, no side effects
- Lab `validate` functions should prefer stdout substring checks over regex pattern matching on source code
