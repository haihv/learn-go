import type { LessonModule } from "../types";

export const profiling: LessonModule = {
  type: "lesson",
  id: "78",
  slug: "profiling",
  title: "Profiling with pprof",
  icon: "🔬",
  estimatedMinutes: 14,
  content: `## Profiling with pprof

### The profiling workflow

Never optimise without data. The Go toolchain ships with \`pprof\`, a profiling tool that identifies exactly which functions consume the most CPU time or allocate the most memory.

The workflow is always:
1. Collect a profile (CPU or memory)
2. Analyse with \`go tool pprof\`
3. Identify the hottest functions
4. Optimise and re-measure

### CPU profiling via go test

The easiest way to collect a CPU profile is through the test runner:

\`\`\`bash
go test -bench=BenchmarkFoo -benchmem -cpuprofile=cpu.prof ./pkg/...
go tool pprof cpu.prof
\`\`\`

Inside \`pprof\`:

\`\`\`
(pprof) top10          # top 10 functions by CPU time
(pprof) list FuncName  # annotated source showing hot lines
(pprof) web            # open flame graph in browser (requires graphviz)
\`\`\`

### Memory profiling

\`\`\`bash
go test -bench=. -memprofile=mem.prof ./...
go tool pprof mem.prof
\`\`\`

Key pprof commands for memory:
- \`top\` — functions by allocated bytes
- \`list funcName\` — show allocations per line
- \`-alloc_objects\` vs \`-inuse_objects\` — total allocated vs currently live

### net/http/pprof — always-on profiling in production

Import the pprof HTTP handler as a side effect in your \`main.go\`:

\`\`\`go
import _ "net/http/pprof"  // registers /debug/pprof/ routes
\`\`\`

Then expose a debug server (on a separate port, internal-only):

\`\`\`go
go func() {
    log.Println(http.ListenAndServe("localhost:6060", nil))
}()
\`\`\`

Now you can collect live profiles from a running production server:

\`\`\`bash
# 30-second CPU profile from live server
go tool pprof http://localhost:6060/debug/pprof/profile?seconds=30

# heap snapshot
go tool pprof http://localhost:6060/debug/pprof/heap
\`\`\`

**Security**: Never expose \`:6060\` publicly. Bind to \`localhost\` or protect with a firewall rule.

### Reading a flame graph

A flame graph shows call stacks as nested rectangles:
- Width = proportion of CPU time (or allocations)
- The widest frames at the top are the hottest call sites
- Click a frame to zoom in

### runtime.MemStats — inline memory inspection

For quick in-process checks without pprof:

\`\`\`go
var m runtime.MemStats
runtime.ReadMemStats(&m)
fmt.Printf("Alloc: %v MB\\n", m.Alloc/1024/1024)
fmt.Printf("TotalAlloc: %v MB\\n", m.TotalAlloc/1024/1024)
fmt.Printf("NumGC: %v\\n", m.NumGC)
\`\`\`

- \`Alloc\` — bytes currently allocated on the heap
- \`TotalAlloc\` — bytes allocated over the entire lifetime (monotonically increasing)
- \`NumGC\` — number of GC cycles completed

### Common findings and fixes

| Finding | Fix |
|---------|-----|
| \`strings.Builder\` missing | Stop using \`+=\` in a loop |
| \`json.Marshal\` hot | Cache marshalled bytes or use a streaming encoder |
| \`sync.Mutex\` contention | Use \`sync.RWMutex\`, sharding, or \`sync/atomic\` |
| Excessive GC (high \`NumGC\`) | Use \`sync.Pool\`, reduce allocations in hot paths |
| \`fmt.Sprintf\` in hot path | Switch to \`strconv\` or pre-allocated buffers |
`,
  quiz: [
    {
      question: "What is the correct order of steps in the Go profiling workflow?",
      options: [
        "Optimise → measure → profile → repeat",
        "Collect profile → analyse with go tool pprof → identify hot functions → optimise → re-measure",
        "Write benchmarks → enable race detector → run pprof → deploy",
        "Import net/http/pprof → restart server → read logs",
      ],
      correctIndex: 1,
    },
    {
      question: "Why should the net/http/pprof debug server only bind to localhost?",
      options: [
        "pprof routes require HTTP/2 which is only available locally",
        "The /debug/pprof/ endpoints expose detailed internal profiling data that would give an attacker information about memory layout, goroutines, and code paths",
        "Binding to localhost makes profiling faster",
        "The Go runtime limits pprof to loopback addresses by default",
      ],
      correctIndex: 1,
    },
    {
      question: "What does runtime.MemStats.TotalAlloc represent?",
      options: [
        "Bytes currently allocated on the heap (decreases after GC)",
        "Total bytes allocated over the program's entire lifetime — it only ever increases",
        "The maximum heap size allowed by the OS",
        "Bytes freed by the garbage collector",
      ],
      correctIndex: 1,
    },
  ],
};
