import type { StackLayer } from "./types";

// The Go stack, layer by layer, with one dated current-best pick each (2026).
// Picks are deliberately replaceable — the layer's role is the durable part.
export const stackMap: StackLayer[] = [
  {
    layer: "Language & runtime",
    role: "The language itself, its garbage collector, and scheduler.",
    pick: "Go 1.22+",
    since: "2024",
    note: "1.22 fixed the loop-variable capture footgun and added range-over-integer; 1.21 added the cmp/slices/maps packages. Stay on a recent toolchain — upgrades are cheap and backward-compatible.",
  },
  {
    layer: "Dependencies & build",
    role: "Resolve packages, pin versions, produce a binary.",
    pick: "Go modules + the go command",
    since: "2019",
    note: "go.mod / go.sum are built in; `go build` cross-compiles with GOOS/GOARCH and needs no external build tool. Reach for a Makefile only to script multi-step tasks.",
  },
  {
    layer: "Testing",
    role: "Prove behavior; benchmark; detect races.",
    pick: "stdlib testing (table-driven) + go test -race",
    since: "2012",
    note: "The standard library is enough for almost everything. Add testify/require only if you want terser assertions; reach for a mocking lib rarely — small interfaces + hand-written fakes beat generated mocks.",
  },
  {
    layer: "Lint & static analysis",
    role: "Catch bugs the compiler allows.",
    pick: "golangci-lint (bundles go vet, staticcheck, …)",
    since: "2023",
    note: "Run go vet always; golangci-lint aggregates the high-value linters behind one config and one command. staticcheck alone is a great minimal step up.",
  },
  {
    layer: "HTTP & routing",
    role: "Serve and route HTTP.",
    pick: "net/http ServeMux (1.22); chi for middleware",
    since: "2024",
    note: "1.22's ServeMux added method + wildcard patterns, so the stdlib covers most APIs. Reach for chi when you want composable middleware stacks; full frameworks (echo, gin) only when you want batteries included.",
  },
  {
    layer: "Persistence",
    role: "Talk to a database with type safety.",
    pick: "pgx + sqlc (Postgres)",
    since: "2023",
    note: "database/sql is the portable baseline; pgx is the fast Postgres driver, and sqlc generates type-safe Go from your SQL. Reach for an ORM (GORM) only when you want convenience over control.",
  },
  {
    layer: "Configuration & CLI",
    role: "Parse flags, env, and subcommands.",
    pick: "flag (stdlib); cobra for multi-command CLIs",
    since: "2012",
    note: "The stdlib flag package handles simple tools. cobra (+ viper for config) earns its weight once you have many subcommands and rich help.",
  },
  {
    layer: "Logging",
    role: "Structured, leveled logs.",
    pick: "log/slog",
    since: "2023",
    note: "slog landed in the stdlib in 1.21 — structured key/value logging with levels and handlers. No reason to add zap/zerolog unless you've measured a hot-path allocation problem.",
  },
  {
    layer: "Concurrency tooling",
    role: "Coordinate goroutines safely.",
    pick: "go test -race + golang.org/x/sync (errgroup)",
    since: "2023",
    note: "The race detector is non-negotiable in CI. errgroup gives you bounded fan-out with first-error cancellation; semaphore caps concurrency when a worker pool is overkill.",
  },
  {
    layer: "Observability",
    role: "Profile and trace in production.",
    pick: "net/http/pprof + OpenTelemetry",
    since: "2024",
    note: "pprof ships with the runtime — CPU, heap, goroutine, and block profiles for free. OpenTelemetry is the vendor-neutral choice for traces and metrics across services.",
  },
  {
    layer: "Build & ship",
    role: "Package the binary for production.",
    pick: "multi-stage Docker → distroless/static",
    since: "2022",
    note: "A static Go binary (CGO_ENABLED=0) drops into a distroless or scratch image for a tiny, attack-surface-minimal container. ko is a nice alternative that skips the Dockerfile entirely.",
  },
];
