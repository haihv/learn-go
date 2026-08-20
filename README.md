# learn-go

An interactive Go learning platform built with Next.js. Work through lessons, workshops, and labs — write real Go code in the browser and see it run instantly.

## Features

- Structured curriculum with lessons, workshops (guided exercises), and labs (open-ended challenges)
- Go runs **in your browser** — the [Yaegi](https://github.com/traefik/yaegi) interpreter compiled to WebAssembly executes programs in a Web Worker with zero network latency; programs that need `testing`, `os/exec`, `database/sql`, non-stdlib imports, or that the interpreter can't handle fall back transparently to the [Go Playground](https://go.dev/play) API (proxied server-side)
- Progress tracked locally in `localStorage`
- Full-text search across every lesson, workshop, lab, and deep stem — press `⌘K` / `Ctrl+K` anywhere, or use `/search?q=…` for a shareable results page
- Syntax highlighting with CodeMirror 6

## Getting Started

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

Or visit the live site at [learn-go.haihv.dev](https://learn-go.haihv.dev).

## Tech Stack

- [Next.js 16](https://nextjs.org) (App Router) + React 19
- TypeScript + Tailwind CSS v4
- Zustand v5 for state management
- CodeMirror 6 for the code editor

## Scripts

```bash
pnpm dev      # development server
pnpm wasm     # build the in-browser Go runtime into public/wasm/ (needs Go, or downloads a pinned toolchain)
pnpm build    # pnpm wasm + production build
pnpm lint     # ESLint
```

The wasm runtime (`public/wasm/yaegi.wasm`, ~40 MB raw / ~8 MB compressed) is gitignored and built by `scripts/wasm/build.sh` — locally with your `go`, on Vercel by downloading the pinned Go version. Run `pnpm wasm` once before `pnpm dev` if you want the in-browser engine in development; without it the app simply uses the Playground.

## Built with

This project was built with [Claude](https://claude.ai) (Anthropic's AI assistant) using [Claude Code](https://claude.ai/code).

## License

MIT © haihv
