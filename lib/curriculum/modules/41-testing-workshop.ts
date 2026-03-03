import type { WorkshopModule } from "../types";

export const testingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "41",
  slug: "testing-workshop",
  title: "Testing Workshop",
  icon: "🧪",
  estimatedMinutes: 25,
  description: "Write unit tests, table-driven tests, subtests, and benchmarks for a simple add function.",
  steps: [
    {
      instruction:
        "Write a basic test for an `add` function. The starter code provides `add(a, b int) int`. Write `TestAdd` that calls `add(2, 3)` and uses `t.Errorf` to fail if the result is not `5`.",
      starterCode: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	// TODO: call add(2, 3), check it equals 5
	// use t.Errorf if it doesn't match
}

func main() {
	// Run our test manually to see output in the playground
	t := &testing.T{}
	TestAdd(t)
	if !t.Failed() {
		fmt.Println("TestAdd passed")
	}
}
`,
      hint: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	got := add(2, 3)
	want := 5
	if got != want {
		t.Errorf("add(2, 3) = %d, want %d", got, want)
	}
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	if !t.Failed() {
		fmt.Println("TestAdd passed")
	}
}
`,
      validate: (code: string) =>
        code.includes("func TestAdd") &&
        code.includes("t.Errorf"),
      successMessage:
        "t.Errorf marks the test as failed but lets it continue running — use t.Fatalf when a failure makes subsequent assertions meaningless.",
    },
    {
      instruction:
        "Expand `TestAdd` into a table-driven test. Define a slice of anonymous structs with fields `name`, `a`, `b`, and `want`. Include at least three cases: positive numbers, negative numbers, and zero. Loop over the slice and check each case.",
      starterCode: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name string
		a, b int
		want int
	}{
		// TODO: add at least 3 test cases
	}

	for _, tc := range tests {
		// TODO: call add(tc.a, tc.b) and compare to tc.want
		_ = tc
	}
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	if !t.Failed() {
		fmt.Println("All table-driven cases passed")
	}
}
`,
      hint: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name string
		a, b int
		want int
	}{
		{"positive", 2, 3, 5},
		{"negative", -4, -6, -10},
		{"zero", 0, 0, 0},
		{"mixed", -1, 1, 0},
	}

	for _, tc := range tests {
		got := add(tc.a, tc.b)
		if got != tc.want {
			t.Errorf("%s: add(%d, %d) = %d, want %d", tc.name, tc.a, tc.b, got, tc.want)
		}
	}
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	if !t.Failed() {
		fmt.Println("All table-driven cases passed")
	}
}
`,
      validate: (code: string) =>
        code.includes("tests := []struct") &&
        code.includes("for") &&
        code.includes("range tests"),
      successMessage:
        "Table-driven tests are the Go standard — adding a new test case is just adding a struct literal, no new function needed.",
    },
    {
      instruction:
        "Wrap each table case in a subtest using `t.Run(tc.name, func(t *testing.T) { ... })`. This lets you run a single case with `go test -run TestAdd/negative` and get clearer output.",
      starterCode: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name string
		a, b int
		want int
	}{
		{"positive", 2, 3, 5},
		{"negative", -4, -6, -10},
		{"zero", 0, 0, 0},
	}

	for _, tc := range tests {
		// TODO: wrap in t.Run(tc.name, func(t *testing.T) { ... })
		got := add(tc.a, tc.b)
		if got != tc.want {
			t.Errorf("add(%d, %d) = %d, want %d", tc.a, tc.b, got, tc.want)
		}
	}
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	if !t.Failed() {
		fmt.Println("All subtests passed")
	}
}
`,
      hint: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name string
		a, b int
		want int
	}{
		{"positive", 2, 3, 5},
		{"negative", -4, -6, -10},
		{"zero", 0, 0, 0},
	}

	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := add(tc.a, tc.b)
			if got != tc.want {
				t.Errorf("add(%d, %d) = %d, want %d", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	if !t.Failed() {
		fmt.Println("All subtests passed")
	}
}
`,
      validate: (code: string) =>
        code.includes("t.Run") &&
        code.includes("func(t *testing.T)"),
      successMessage:
        "Subtests isolate failures — a failed subtest doesn't prevent subsequent subtests from running, and you can target a single case with go test -run.",
    },
    {
      instruction:
        "Write a benchmark `BenchmarkAdd` that measures the performance of `add`. The benchmark body must loop `b.N` times, calling `add(100, 200)` on each iteration.",
      starterCode: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

// TODO: write BenchmarkAdd(b *testing.B) that loops b.N times calling add(100, 200)

func main() {
	// Simulate running the benchmark with N=1000
	b := testing.Benchmark(func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			add(100, 200)
		}
	})
	fmt.Printf("BenchmarkAdd: %d ns/op\\n", b.NsPerOp())
}
`,
      hint: `package main

import (
	"fmt"
	"testing"
)

func add(a, b int) int {
	return a + b
}

func BenchmarkAdd(b *testing.B) {
	for i := 0; i < b.N; i++ {
		add(100, 200)
	}
}

func main() {
	b := testing.Benchmark(func(b *testing.B) {
		for i := 0; i < b.N; i++ {
			add(100, 200)
		}
	})
	fmt.Printf("BenchmarkAdd: %d ns/op\\n", b.NsPerOp())
}
`,
      validate: (code: string) =>
        code.includes("func BenchmarkAdd") &&
        code.includes("b.N"),
      successMessage:
        "The b.N loop is key — Go adjusts N automatically so the benchmark runs long enough for a reliable measurement. Never set N yourself.",
    },
  ],
};
