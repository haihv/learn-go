import type { PlanWeek } from "./types";

// A time-boxed path from the fundamentals to a shipped service, six weeks at a
// realistic part-time pace. Each week ends in a deliverable and leans on the
// deep stems that power it.
export const planGoal = "From Go fundamentals to a shipped, production-shaped service in 6 weeks";

export const plan: PlanWeek[] = [
  {
    week: 1,
    theme: "Values & errors",
    focus: [
      "Value vs. pointer semantics, zero values, structs",
      "Slices and maps and their cost models",
      "Errors as values: wrapping, errors.Is / errors.As",
    ],
    deliverable:
      "A CLI that reads input, transforms it, and reports failures with wrapped errors — no panics on bad input.",
    stems: ["stem-type-system", "stem-data-structures", "stem-errors"],
  },
  {
    week: 2,
    theme: "Interfaces & composition",
    focus: [
      "Implicit satisfaction and small interfaces",
      "Accept interfaces, return structs",
      "Fakes for tests instead of mocks",
    ],
    deliverable:
      "Refactor week 1's CLI behind one or two small interfaces, with a hand-written fake that lets you test it with no real I/O.",
    stems: ["stem-interfaces"],
  },
  {
    week: 3,
    theme: "Concurrency",
    focus: [
      "Goroutines, channels, select, context cancellation",
      "Mutexes vs. channels; the race detector",
      "Bounded concurrency with a worker pool",
    ],
    deliverable:
      "A concurrent fetch-and-process worker pool with context cancellation that passes `go test -race`.",
    stems: ["stem-concurrency", "stem-synchronization"],
  },
  {
    week: 4,
    theme: "HTTP service",
    focus: [
      "net/http ServeMux routing (1.22 patterns)",
      "Middleware, JSON encoding, and request context",
      "Graceful shutdown",
    ],
    deliverable:
      "A JSON API over net/http with logging middleware (log/slog) and a clean shutdown on SIGTERM.",
    stems: ["stem-interfaces", "stem-errors"],
  },
  {
    week: 5,
    theme: "Persistence & generics",
    focus: [
      "database/sql and a Postgres driver (pgx)",
      "Type-safe queries; a repository behind an interface",
      "A generic helper where it genuinely removes duplication",
    ],
    deliverable:
      "Back the API with a Postgres store behind a repository interface, plus one generic helper (e.g. a Map over rows) justified by ≥2 uses.",
    stems: ["stem-generics", "stem-interfaces"],
  },
  {
    week: 6,
    theme: "Production hardening",
    focus: [
      "Table-driven tests and subtests; -race in CI",
      "A benchmark + a pprof pass to justify one optimization",
      "Multi-stage Docker build to a distroless image",
    ],
    deliverable:
      "Ship it: table-tested, race-clean in CI, one profiled-and-justified optimization, in a small distroless container.",
    stems: ["stem-tooling"],
  },
];
