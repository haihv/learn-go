import type { LessonModule } from "../types";

export const testing: LessonModule = {
  type: "lesson",
  id: "40",
  slug: "testing",
  title: "Testing in Go",
  icon: "🧪",
  estimatedMinutes: 14,
  content: `## Testing in Go

Go has a built-in testing framework in the standard library — no third-party framework needed.

### The \`go test\` Tool

Run tests with:

\`\`\`bash
go test ./...          # run all tests in all packages
go test -v ./...       # verbose: show each test name and result
go test -run TestAdd   # run only tests whose name matches "TestAdd"
\`\`\`

**File naming rule:** test files must end in \`_test.go\`. They are compiled and run by \`go test\` but excluded from normal builds.

### Writing Tests with \`*testing.T\`

Test functions have the signature \`func TestXxx(t *testing.T)\` where \`Xxx\` starts with an uppercase letter:

\`\`\`go
// math_test.go
package math

import "testing"

func TestAdd(t *testing.T) {
    got := Add(2, 3)
    want := 5
    if got != want {
        t.Errorf("Add(2, 3) = %d, want %d", got, want)
    }
}
\`\`\`

Key \`*testing.T\` methods:

| Method | Behavior |
|--------|----------|
| \`t.Error(args...)\` | Mark test failed, continue running |
| \`t.Errorf(format, args...)\` | Mark test failed with formatted message, continue |
| \`t.Fatal(args...)\` | Mark test failed, stop test immediately |
| \`t.Fatalf(format, args...)\` | Mark test failed with formatted message, stop immediately |
| \`t.Log(args...)\` | Log message (visible with \`-v\` flag) |
| \`t.Logf(format, args...)\` | Log formatted message |

Use \`Fatal\`/\`Fatalf\` when subsequent assertions depend on a previous one succeeding.

### Table-Driven Tests

The most idiomatic Go pattern: define test cases as a slice of structs, then loop:

\`\`\`go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -1, -2},
        {"zero", 0, 0, 0},
    }

    for _, tc := range tests {
        got := Add(tc.a, tc.b)
        if got != tc.want {
            t.Errorf("%s: Add(%d, %d) = %d, want %d",
                tc.name, tc.a, tc.b, got, tc.want)
        }
    }
}
\`\`\`

This approach keeps test data and test logic separate, making it trivial to add new cases.

### Subtests with \`t.Run\`

\`t.Run\` creates a named subtest, which shows up in output as \`TestAdd/positive\`. Each subtest can be run individually:

\`\`\`go
func TestAdd(t *testing.T) {
    tests := []struct {
        name string
        a, b int
        want int
    }{
        {"positive", 2, 3, 5},
        {"negative", -1, -1, -2},
    }

    for _, tc := range tests {
        t.Run(tc.name, func(t *testing.T) {
            got := Add(tc.a, tc.b)
            if got != tc.want {
                t.Errorf("Add(%d, %d) = %d, want %d", tc.a, tc.b, got, tc.want)
            }
        })
    }
}
\`\`\`

Run just one subtest: \`go test -run TestAdd/positive\`

### Benchmarks with \`*testing.B\`

Benchmark functions have the signature \`func BenchmarkXxx(b *testing.B)\`. The key is the \`b.N\` loop — Go runs it enough times to get a stable measurement:

\`\`\`go
func BenchmarkAdd(b *testing.B) {
    for i := 0; i < b.N; i++ {
        Add(100, 200)
    }
}
\`\`\`

Run benchmarks with:

\`\`\`bash
go test -bench=.           # run all benchmarks
go test -bench=. -benchmem # also report memory allocations
\`\`\`

Output looks like:

\`\`\`
BenchmarkAdd-8    1000000000    0.3 ns/op
\`\`\`

\`-8\` is the GOMAXPROCS value; \`0.3 ns/op\` is time per iteration.

### Example Tests

Example functions serve double duty — they are both documentation and executable tests:

\`\`\`go
func ExampleAdd() {
    fmt.Println(Add(2, 3))
    // Output:
    // 5
}
\`\`\`

The \`// Output:\` comment is matched against actual stdout. If it doesn't match, the test fails. Examples appear in \`go doc\` output automatically.
`,
  quiz: [
    {
      question: "What is the idiomatic Go pattern for testing multiple inputs and expected outputs in a single test function?",
      options: [
        "Nested if/else blocks with hardcoded values",
        "Table-driven tests with a slice of structs",
        "Separate test functions for each case",
        "Using a for loop with t.Skip()",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the difference between `t.Error` and `t.Fatal`?",
      options: [
        "t.Error logs the message; t.Fatal marks the test failed",
        "t.Error marks the test failed and continues; t.Fatal marks it failed and stops immediately",
        "t.Fatal is for benchmarks; t.Error is for unit tests",
        "They are identical — both stop the test",
      ],
      correctIndex: 1,
    },
    {
      question: "Which flag runs all benchmarks in a Go package?",
      options: [
        "go test -run=Benchmark",
        "go test -benchmark",
        "go test -bench=.",
        "go test -perf",
      ],
      correctIndex: 2,
    },
  ],
};
