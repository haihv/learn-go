import type { LessonModule } from "../types";

export const timeSync: LessonModule = {
  type: "lesson",
  id: "48",
  slug: "time-sync",
  title: "time & sync extras",
  icon: "⏱️",
  estimatedMinutes: 13,
  content: `## time & sync extras

### The \`time\` package

#### \`time.Time\` and \`time.Now\`

\`time.Time\` represents a moment in time. \`time.Now()\` returns the current local time:

\`\`\`go
t := time.Now()
fmt.Println(t.Format(time.RFC3339)) // "2024-01-15T10:30:00+07:00"
\`\`\`

#### Measuring elapsed time

\`time.Since(t)\` returns how much time has passed since \`t\` — the idiomatic way to time an operation:

\`\`\`go
start := time.Now()
doWork()
elapsed := time.Since(start)
fmt.Printf("took %v\\n", elapsed) // "took 2.1ms"
\`\`\`

#### \`time.Duration\`

A \`time.Duration\` is just \`int64\` nanoseconds. Use the named constants to avoid magic numbers:

\`\`\`go
d := 500 * time.Millisecond
d2 := 2*time.Hour + 30*time.Minute
fmt.Println(d.Seconds()) // 0.5
\`\`\`

#### \`time.Sleep\` and \`time.After\`

\`time.Sleep\` blocks the current goroutine. \`time.After\` returns a channel that receives after the duration — useful in \`select\`:

\`\`\`go
// pause for 100ms
time.Sleep(100 * time.Millisecond)

// select with timeout
select {
case result := <-work:
    fmt.Println("got:", result)
case <-time.After(1 * time.Second):
    fmt.Println("timed out")
}
\`\`\`

#### \`time.Ticker\`

A \`Ticker\` fires on a regular interval. Always call \`ticker.Stop()\` when done — a forgotten ticker leaks a goroutine:

\`\`\`go
ticker := time.NewTicker(200 * time.Millisecond)
defer ticker.Stop() // prevent goroutine leak

for i := 0; i < 3; i++ {
    t := <-ticker.C
    fmt.Println("tick at", t.Format("15:04:05.000"))
}
\`\`\`

---

### \`sync.Once\` — exactly-once initialisation

\`sync.Once\` runs a function exactly once, no matter how many goroutines call it concurrently. The classic use case is lazy singleton initialisation:

\`\`\`go
type Config struct {
    DSN string
}

var (
    instance *Config
    once     sync.Once
)

func getConfig() *Config {
    once.Do(func() {
        // runs only on the first call, even under concurrent load
        instance = &Config{DSN: "postgres://..."}
        fmt.Println("config initialised")
    })
    return instance
}
\`\`\`

After the first call completes, \`once.Do\` becomes a no-op for every subsequent call — even from other goroutines. No mutex needed in the caller.

---

### \`sync.RWMutex\` — shared reads, exclusive writes

A \`sync.RWMutex\` allows **multiple concurrent readers** but only **one writer at a time**. Use it when reads are frequent and writes are rare:

\`\`\`go
type Cache struct {
    mu   sync.RWMutex
    data map[string]string
}

func (c *Cache) Get(key string) (string, bool) {
    c.mu.RLock()         // multiple goroutines can hold RLock simultaneously
    defer c.mu.RUnlock()
    v, ok := c.data[key]
    return v, ok
}

func (c *Cache) Set(key, value string) {
    c.mu.Lock()          // exclusive: blocks all readers and other writers
    defer c.mu.Unlock()
    c.data[key] = value
}
\`\`\`

| Method | Behaviour |
|--------|-----------|
| \`mu.Lock()\` | Exclusive write lock — blocks until all readers/writers release |
| \`mu.Unlock()\` | Release write lock |
| \`mu.RLock()\` | Shared read lock — multiple goroutines can hold simultaneously |
| \`mu.RUnlock()\` | Release read lock |

**Rule of thumb:** if reads outnumber writes significantly (e.g., a cache), \`sync.RWMutex\` gives better throughput than a plain \`sync.Mutex\`. For balanced read/write access, the overhead of tracking read locks may not be worth it.
`,
  quiz: [
    {
      question: "What is the idiomatic Go way to measure how long a function call takes?",
      options: [
        "start := time.Now() before the call, then time.Since(start) after",
        "Use time.Tick with a 1ms ticker and count ticks",
        "Read os.Clock() before and after and subtract",
        "Use time.Benchmark(func() { ... })",
      ],
      correctIndex: 0,
    },
    {
      question: "Why must you call ticker.Stop() when done with a time.Ticker?",
      options: [
        "Stop() sends the final tick value on the channel",
        "Without Stop(), the ticker's internal goroutine keeps running, causing a goroutine leak",
        "Tickers panic if not explicitly stopped",
        "Stop() flushes any pending ticks from the channel",
      ],
      correctIndex: 1,
    },
    {
      question: "How does sync.RWMutex differ from sync.Mutex?",
      options: [
        "RWMutex allows multiple concurrent readers but only one writer; Mutex allows only one holder at a time",
        "RWMutex is faster for all workloads",
        "RWMutex requires explicit reader/writer registration before use",
        "There is no difference — RWMutex is just an alias for Mutex",
      ],
      correctIndex: 0,
    },
  ],
};
