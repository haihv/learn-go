import type { LessonModule } from "../types";

export const raceDetector: LessonModule = {
  type: "lesson",
  id: "84",
  slug: "race-detector",
  title: "The Race Detector",
  icon: "🏁",
  estimatedMinutes: 11,
  content: `## The Race Detector

### What is a data race?

A data race occurs when two goroutines access the same memory location concurrently and at least one access is a write — with no synchronisation between them. The result is undefined behaviour: corrupted data, crashes, or silent wrong answers that appear intermittently.

\`\`\`go
// DATA RACE — do not do this
var counter int

go func() { counter++ }()
go func() { counter++ }()
// counter could be 0, 1, or 2 — undefined
\`\`\`

### Enabling the race detector

Append \`-race\` to any Go command:

\`\`\`bash
go test -race ./...          # run tests with race detection
go run -race main.go         # run with race detection
go build -race -o myapp .    # build a race-detecting binary
\`\`\`

The race detector is built on ThreadSanitizer. It instruments memory accesses at compile time and reports races at runtime when they actually occur.

### Reading a race report

\`\`\`
==================
WARNING: DATA RACE
Write at 0x00c0000b8008 by goroutine 7:
  main.main.func1()
      /tmp/main.go:10 +0x28

Previous read at 0x00c0000b8008 by goroutine 6:
  main.main.func2()
      /tmp/main.go:14 +0x28

Goroutine 7 (running) created at:
  main.main()
      /tmp/main.go:9 +0x4c
==================
\`\`\`

The report shows: the racing memory address, which goroutine performed each access, the source location of each access, and where each goroutine was created. Fix by adding a mutex, channel, or atomic around the shared variable.

### Fixing races

Three canonical fixes:

\`\`\`go
// 1. sync.Mutex
var mu sync.Mutex
var counter int
mu.Lock()
counter++
mu.Unlock()

// 2. sync/atomic
var counter atomic.Int64
counter.Add(1)

// 3. Channel (ownership transfer)
ch := make(chan int)
go func() { ch <- compute() }()
result := <-ch
\`\`\`

### When to run -race

| Context | Recommendation |
|---------|----------------|
| CI pipeline | Always — run \`go test -race ./...\` on every PR |
| Local development | Enable for concurrent packages during development |
| Production binary | Avoid — 2–20× overhead; only for debugging |
| Benchmarks | Never — overhead skews results |

**Always run \`-race\` in CI.** The detector only fires when a race actually executes, so 100% code coverage under \`-race\` greatly increases confidence.

### -race overhead

The race detector adds approximately:
- 5–15× slowdown in execution speed
- 5–10× increase in memory usage

This is why production binaries ship without it. Accept the overhead in test environments.

### Test coverage flags

While not race-related, often used together:

\`\`\`bash
go test -cover ./...                      # print coverage %
go test -coverprofile=cover.out ./...
go tool cover -html=cover.out             # open browser coverage report
\`\`\`
`,
  quiz: [
    {
      question: "What condition defines a data race?",
      options: [
        "Two goroutines accessing the same variable at any time",
        "Two goroutines accessing the same memory location concurrently where at least one access is a write and there is no synchronisation",
        "A goroutine reading a variable while another goroutine is reading it",
        "Any unsynchronised access to a heap-allocated variable",
      ],
      correctIndex: 1,
    },
    {
      question: "Why should -race never be used for benchmarks?",
      options: [
        "The race detector disables the Go scheduler during benchmarks",
        "The 2–20× runtime overhead skews benchmark results, making measurements unreliable",
        "Benchmarks cannot import testing.B when -race is active",
        "The race detector reports false positives in benchmark loops",
      ],
      correctIndex: 1,
    },
    {
      question:
        "The race detector only fires when a race actually executes at runtime. What does this imply about test coverage?",
      options: [
        "Race-free tests prove the code has no races",
        "Higher test coverage under -race increases confidence, but a race in an untested code path won't be detected",
        "The detector compensates by also analysing untested paths statically",
        "100% code coverage is sufficient to guarantee race freedom",
      ],
      correctIndex: 1,
    },
  ],
};
