# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Self-hosted interactive Go learning platform modeled after freeCodeCamp Python v9. Three activity types: **Lessons** (markdown + 3-question quiz), **Workshops** (step-by-step guided coding), **Labs** (free-form coding with automated test suite). See `ROADMAP.md` for the full implementation roadmap.

## Commands

```bash
npm run dev          # start dev server (localhost:3000)
npm run build        # production build
npm run lint         # ESLint
npx tsc --noEmit     # type-check without emitting (run this after every phase)
```

> Gate rule from the plan: `tsc --noEmit` must pass before moving to the next implementation phase.

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | Next.js 16 / React 19 (App Router) |
| Styling | Tailwind CSS v4 with custom navy/go color tokens |
| Code editor | CodeMirror 6 via `@uiw/react-codemirror` |
| Go execution | Go Playground REST API (proxied via `/api/run`) |
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
lib/go-runner.ts                   ← POSTs to /api/run, parses result
lib/test-runner.ts                 ← evaluates LabTest[] against code + stdout
store/course.ts                    ← Zustand store, persists to localStorage
```

### Module types

`CourseModule = LessonModule | WorkshopModule | LabModule` (discriminated union on `type` field). Always switch/narrow on `module.type` before passing to a view component.

### Go Playground proxy

`POST /api/run` (Next.js Route Handler) proxies to `https://go.dev/play/p/run` with a 10 s `AbortController` timeout. Returns `RunResult { stdout, stderr, error, timedOut }`. Never call the Playground directly from the client.

### CodeMirror SSR

`GoEditor.tsx` **must** have `'use client'` at the top. Any server or shared component that renders it must use:
```ts
const GoEditor = dynamic(() => import("@/components/editor/GoEditor"), { ssr: false });
```

### Zustand store shape

```ts
{ completedSlugs: string[], workshopSteps: Record<string, number>,
  markComplete(slug), setWorkshopStep(slug, step) }
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
