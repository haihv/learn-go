import type { Atlas } from "./types";

// Step 0 of the method: map the field. Go carved into 8 domains, each with a
// Create-level deliverable decided up front. The "one idea" is the single thing
// the whole language refines — for Go, that behavior is composed from small
// pieces wired by what they do, not what they are.
export const atlas: Atlas = {
  field: "Go",
  oneIdea:
    "A type's behavior is the set of methods it has — interfaces are satisfied implicitly, so you compose small pieces instead of building hierarchies.",
  oneIdeaExpanded:
    "A Go type never declares which interfaces it implements; if it has the " +
    "methods, it satisfies the interface. So programs are assembled from small, " +
    "orthogonal parts — io.Reader, error, fmt.Stringer — wired by what they do, " +
    "not what they are. Pair that with explicit values everywhere (errors are " +
    "ordinary returns, the zero value is ready to use, no hidden control flow) " +
    "and interfaces, embedding, testing with fakes, and the standard library's " +
    "design all stop being surprises.",
  domains: [
    {
      id: "type-system",
      title: "The Type System & Values",
      icon: "🧬",
      blurb:
        "Zero values, value vs. pointer semantics, structs, identity vs. equality — the layer everything else sits on.",
      createDeliverable:
        "An immutable Money value type with value semantics and a correct Equals, gated by a table test.",
      stemSlug: "stem-type-system",
    },
    {
      id: "interfaces",
      title: "Interfaces & Composition",
      icon: "🧩",
      blurb:
        "Implicit satisfaction, small interfaces, embedding, and \"accept interfaces, return structs.\"",
      createDeliverable:
        "A Notifier interface with email and SMS implementations plus a no-op fake, selected at runtime.",
      stemSlug: "stem-interfaces",
    },
    {
      id: "errors",
      title: "Errors as Values",
      icon: "🛡️",
      blurb:
        "The error interface, wrapping with %w, errors.Is / errors.As, sentinel vs. typed — no exceptions, ever.",
      createDeliverable:
        "A wrapped error chain with a sentinel and a typed error, navigable by errors.Is and errors.As, gated by tests.",
      stemSlug: "stem-errors",
    },
    {
      id: "data-structures",
      title: "Slices & Maps",
      icon: "📦",
      blurb:
        "The built-in containers, len vs. cap, aliasing and growth, and when each is the right reach.",
      createDeliverable:
        "A word-frequency pipeline that picks slice vs. map correctly, with a benchmark justifying preallocation.",
      stemSlug: "stem-data-structures",
    },
    {
      id: "concurrency",
      title: "Goroutines & Channels",
      icon: "⚡",
      blurb:
        "\"Share memory by communicating\" — goroutines, channels, select, and context cancellation.",
      createDeliverable:
        "A concurrent URL fetcher with a worker pool and context cancellation, proven race-free with -race.",
      stemSlug: "stem-concurrency",
    },
    {
      id: "synchronization",
      title: "Synchronization & the Memory Model",
      icon: "🔒",
      blurb:
        "sync.Mutex, WaitGroup, atomics, the happens-before rule, and when a mutex beats a channel.",
      createDeliverable:
        "A concurrent-safe in-memory cache with sharded locks, validated under the race detector.",
      stemSlug: "stem-synchronization",
    },
    {
      id: "generics",
      title: "Generics & Constraints",
      icon: "🧮",
      blurb:
        "Type parameters, constraints, type inference, and when generics beat any or code generation.",
      createDeliverable:
        "A generic Map / Filter / Reduce over any slice, constrained by comparable and ordered, with tests.",
      stemSlug: "stem-generics",
    },
    {
      id: "tooling",
      title: "Testing & Tooling",
      icon: "🔧",
      blurb:
        "Table-driven tests, benchmarks, the race detector, pprof, go vet — the production concerns that keep code honest.",
      createDeliverable:
        "A table-tested, benchmarked package with a pprof report that justifies one optimization.",
      stemSlug: "stem-tooling",
    },
  ],
};
