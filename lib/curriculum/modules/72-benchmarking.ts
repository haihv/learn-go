import type { LessonModule } from "../types";

export const benchmarking: LessonModule = {
  type: "lesson",
  id: "72",
  slug: "benchmarking",
  title: "Benchmarking",
  icon: "⏱️",
  estimatedMinutes: 12,
  content: `## Benchmarking

### Why benchmark?

Profile before optimising. Without measurements you are guessing. Go's testing package includes a built-in benchmarking framework that runs functions under controlled conditions and reports time-per-operation and allocations.

### Writing a benchmark

Benchmark functions live in \`_test.go\` files and follow the \`BenchmarkXxx(b *testing.B)\` signature:

\`\`\`go
// in strings_test.go
func BenchmarkConcatPlus(b *testing.B) {
    for i := 0; i < b.N; i++ {
        s := ""
        for j := 0; j < 100; j++ {
            s += "x"  // O(n²) allocations
        }
        _ = s
    }
}

func BenchmarkConcatBuilder(b *testing.B) {
    for i := 0; i < b.N; i++ {
        var sb strings.Builder
        for j := 0; j < 100; j++ {
            sb.WriteString("x")
        }
        _ = sb.String()
    }
}
\`\`\`

The \`b.N\` loop is run enough times for the framework to get a stable measurement.

### Running benchmarks

\`\`\`bash
go test -bench=. -benchmem ./...
\`\`\`

| Flag | Meaning |
|------|---------|
| \`-bench=.\` | Run all benchmarks (regex match) |
| \`-benchmem\` | Report memory allocations per op |
| \`-benchtime=5s\` | Run for at least 5 seconds |
| \`-count=3\` | Repeat 3 times for variance |

### Reading the output

\`\`\`
BenchmarkConcatPlus-8     50000    23456 ns/op    4096 B/op    99 allocs/op
BenchmarkConcatBuilder-8  500000    2345 ns/op      32 B/op     2 allocs/op
\`\`\`

- \`ns/op\` — nanoseconds per operation
- \`B/op\` — bytes allocated per operation
- \`allocs/op\` — heap allocations per operation

### b.ResetTimer — exclude setup time

\`\`\`go
func BenchmarkWithSetup(b *testing.B) {
    data := generateLargeSlice()  // expensive setup
    b.ResetTimer()                // reset clock after setup
    for i := 0; i < b.N; i++ {
        process(data)
    }
}
\`\`\`

Call \`b.ResetTimer()\` after any setup that should not be counted in the benchmark time.

### b.RunParallel — concurrent benchmarks

\`\`\`go
func BenchmarkParallel(b *testing.B) {
    b.RunParallel(func(pb *testing.PB) {
        for pb.Next() {
            doWork()
        }
    })
}
\`\`\`

\`b.RunParallel\` runs the closure in \`GOMAXPROCS\` goroutines simultaneously — useful for benchmarking concurrent data structures or measuring lock contention.

### Comparing benchmarks with benchstat

After collecting results with \`-count=5\`, use \`benchstat\` to get statistically significant comparisons:

\`\`\`bash
go test -bench=. -count=5 > old.txt
# make change
go test -bench=. -count=5 > new.txt
benchstat old.txt new.txt
\`\`\`
`,
  quiz: [
    {
      question: "What does b.N represent in a benchmark loop?",
      options: [
        "The number of CPU cores available",
        "The iteration count chosen by the framework to run the benchmark long enough for a stable measurement",
        "The number of goroutines to use",
        "The number of times the test file is compiled",
      ],
      correctIndex: 1,
    },
    {
      question: "When should you call b.ResetTimer()?",
      options: [
        "At the start of every benchmark to initialise the timer",
        "After expensive setup that should not be counted in the per-operation time",
        "Before b.RunParallel to synchronise goroutines",
        "It is called automatically — you never need to call it manually",
      ],
      correctIndex: 1,
    },
    {
      question: "What does the `-benchmem` flag add to benchmark output?",
      options: [
        "Memory limit for each benchmark run",
        "Per-operation heap allocation count and bytes allocated",
        "Memory profiling output written to mem.prof",
        "CPU cache miss statistics",
      ],
      correctIndex: 1,
    },
  ],
};
