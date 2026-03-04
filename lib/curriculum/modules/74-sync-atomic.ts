import type { LessonModule } from "../types";

export const syncAtomic: LessonModule = {
  type: "lesson",
  id: "74",
  slug: "sync-atomic",
  title: "sync/atomic",
  icon: "⚛️",
  estimatedMinutes: 12,
  content: `## sync/atomic

### Why atomics?

Mutexes protect arbitrary code sections but carry overhead: a \`sync.Mutex\` lock/unlock pair costs ~20–50 ns even uncontended. For a single shared integer — a hit counter, a flag, an index — **atomic operations** provide lock-free synchronisation at the hardware level.

### The typed atomic API (Go 1.19+)

Go 1.19 introduced value types in \`sync/atomic\` that are safe and ergonomic:

\`\`\`go
import "sync/atomic"

var counter atomic.Int64  // zero value is ready to use

counter.Add(1)
counter.Add(-1)
n := counter.Load()   // reads current value
counter.Store(42)     // sets value
\`\`\`

\`atomic.Int64\`, \`atomic.Int32\`, \`atomic.Uint64\`, \`atomic.Bool\`, \`atomic.Pointer[T]\` — all follow the same pattern.

### atomic.Bool — single flag

\`\`\`go
var running atomic.Bool

// goroutine 1
running.Store(true)

// goroutine 2
for running.Load() {
    doWork()
}
\`\`\`

No mutex needed for a single boolean flag.

### Compare-and-swap (CAS)

CAS atomically does: *if current == old, set to new and return true; else return false*.

\`\`\`go
var state atomic.Int64

// Only one goroutine wins the transition from 0 → 1
if state.CompareAndSwap(0, 1) {
    fmt.Println("won the race")
}
\`\`\`

CAS is the building block for lock-free data structures and single-flight deduplication.

### atomic.Pointer[T]

Atomically swap a pointer to any value — useful for hot config reloading:

\`\`\`go
type Config struct{ MaxConns int }

var cfg atomic.Pointer[Config]
cfg.Store(&Config{MaxConns: 10})

// hot reload
cfg.Store(&Config{MaxConns: 20})

// readers always get a consistent snapshot
current := cfg.Load()
fmt.Println(current.MaxConns)
\`\`\`

### When to use atomics vs mutexes

| Use atomics when | Use mutexes when |
|------------------|-----------------|
| Single integer / bool / pointer | Protecting a struct with multiple fields |
| Extremely high-frequency updates | Complex conditional logic across fields |
| Building lock-free algorithms | Correctness is more important than peak perf |

**Default to mutexes.** Reach for atomics only when profiling shows mutex contention is a bottleneck.

### The old function-based API

Before Go 1.19, the API used standalone functions. You'll see this in older code:

\`\`\`go
var n int64
atomic.AddInt64(&n, 1)
v := atomic.LoadInt64(&n)
atomic.StoreInt64(&n, 42)
atomic.CompareAndSwapInt64(&n, 0, 1)
\`\`\`

The newer value types (\`atomic.Int64\`) are safer — they cannot be accidentally copied.
`,
  quiz: [
    {
      question: "When should you prefer sync/atomic over sync.Mutex?",
      options: [
        "Always — atomics are faster in every situation",
        "When protecting a single integer, bool, or pointer and mutex contention is a measured bottleneck",
        "When protecting multiple struct fields that must be updated together",
        "Atomics are deprecated — always use sync.Mutex",
      ],
      correctIndex: 1,
    },
    {
      question: "What does atomic.Int64.CompareAndSwap(old, new) do?",
      options: [
        "Swaps old and new unconditionally and returns the old value",
        "If the current value equals old, it atomically sets it to new and returns true; otherwise returns false without changing anything",
        "Adds old to the current value and stores new",
        "It is equivalent to Load() followed by Store()",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Why are the typed atomics (atomic.Int64) safer than the function-based API (atomic.AddInt64(&n, 1))?",
      options: [
        "The typed API uses hardware instructions; the function API uses software locks",
        "Typed atomic values cannot be accidentally copied — copying an atomic.Int64 would be caught by go vet, whereas copying a plain int64 that is used atomically is silently wrong",
        "The function API does not support 64-bit values on 32-bit platforms",
        "There is no safety difference — they are identical",
      ],
      correctIndex: 1,
    },
  ],
};
