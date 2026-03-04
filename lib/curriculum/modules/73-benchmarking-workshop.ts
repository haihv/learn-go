import type { WorkshopModule } from "../types";

export const benchmarkingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "73",
  slug: "benchmarking-workshop",
  title: "Benchmarking Workshop",
  icon: "⏱️",
  estimatedMinutes: 20,
  description: "Write benchmarks with b.N, compare implementations, use b.ResetTimer, and run parallel benchmarks.",
  steps: [
    {
      instruction:
        "Write a `BenchmarkRepeat(b *testing.B)` function that benchmarks `strings.Repeat(\"x\", 100)` in a `b.N` loop. Include the `testing` import. Add a `main()` that prints `\"run: go test -bench=. -benchmem\"` so the Playground can execute the file.",
      starterCode: `package main

import (
	"fmt"
	"strings"
	"testing"
)

// BenchmarkRepeat measures the cost of strings.Repeat.
func BenchmarkRepeat(b *testing.B) {
	// TODO: loop b.N times, calling strings.Repeat("x", 100) each iteration
	_ = strings.Repeat
	_ = b.N
}

func main() {
	fmt.Println("run: go test -bench=. -benchmem")
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
	"testing"
)

func BenchmarkRepeat(b *testing.B) {
	for i := 0; i < b.N; i++ {
		_ = strings.Repeat("x", 100)
	}
}

func main() {
	fmt.Println("run: go test -bench=. -benchmem")
}
`,
      validate: (code: string) =>
        code.includes("b.N") &&
        code.includes("BenchmarkRepeat") &&
        code.includes("testing.B"),
      successMessage:
        "The b.N loop is the heart of every benchmark. The framework adjusts N until the total run time is stable — you never set N manually.",
    },
    {
      instruction:
        "Write two benchmarks: `BenchmarkConcatPlus` (builds a 100-char string by appending with `+=`) and `BenchmarkConcatBuilder` (uses `strings.Builder`). Both should loop `b.N` times. This comparison reveals the O(n²) allocation cost of `+` concatenation.",
      starterCode: `package main

import (
	"fmt"
	"strings"
	"testing"
)

func BenchmarkConcatPlus(b *testing.B) {
	// TODO: b.N loop — build string by appending "x" 100 times with +=
}

func BenchmarkConcatBuilder(b *testing.B) {
	// TODO: b.N loop — build string using strings.Builder, WriteString("x") 100 times
}

func main() {
	fmt.Println("run: go test -bench=. -benchmem")
	_ = strings.Builder{}
	_ = testing.B{}
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
	"testing"
)

func BenchmarkConcatPlus(b *testing.B) {
	for i := 0; i < b.N; i++ {
		s := ""
		for j := 0; j < 100; j++ {
			s += "x"
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

func main() {
	fmt.Println("run: go test -bench=. -benchmem")
}
`,
      validate: (code: string) =>
        code.includes("BenchmarkConcatPlus") &&
        code.includes("BenchmarkConcatBuilder") &&
        code.includes("strings.Builder"),
      successMessage:
        "strings.Builder pre-allocates and avoids copying on each append. The -benchmem flag will show Builder using ~2 allocs/op vs 99 allocs/op for += — a 50x reduction.",
    },
    {
      instruction:
        "Write a `BenchmarkSort(b *testing.B)` that: (1) generates a 1000-element `[]int` with descending values as setup, (2) calls `b.ResetTimer()`, then (3) loops `b.N` times — on each iteration copy the slice and sort it. This ensures the sort cost is measured, not the slice generation.",
      starterCode: `package main

import (
	"fmt"
	"sort"
	"testing"
)

func BenchmarkSort(b *testing.B) {
	// Setup: generate descending slice (should not be counted)
	data := make([]int, 1000)
	for i := range data {
		data[i] = 1000 - i
	}

	// TODO: call b.ResetTimer() here

	for i := 0; i < b.N; i++ {
		// TODO: copy data into a fresh slice and sort.Ints it
		// (sorting in-place would measure a no-op after the first iteration)
	}
}

func main() {
	fmt.Println("run: go test -bench=BenchmarkSort -benchmem")
	_ = sort.Ints
}
`,
      hint: `package main

import (
	"fmt"
	"sort"
	"testing"
)

func BenchmarkSort(b *testing.B) {
	data := make([]int, 1000)
	for i := range data {
		data[i] = 1000 - i
	}

	b.ResetTimer()

	for i := 0; i < b.N; i++ {
		tmp := make([]int, len(data))
		copy(tmp, data)
		sort.Ints(tmp)
	}
}

func main() {
	fmt.Println("run: go test -bench=BenchmarkSort -benchmem")
}
`,
      validate: (code: string) =>
        code.includes("b.ResetTimer()") &&
        code.includes("BenchmarkSort") &&
        code.includes("sort.Ints"),
      successMessage:
        "Without b.ResetTimer, the timer starts when b.N=0 — the setup cost inflates every reported ns/op. Resetting after setup gives a clean measurement of just the operation under test.",
    },
    {
      instruction:
        "Write a `BenchmarkAtomicCounter(b *testing.B)` that uses `b.RunParallel` to increment a `sync/atomic.Int64` counter concurrently. Inside the parallel closure, loop with `pb.Next()` and call `counter.Add(1)` each iteration.",
      starterCode: `package main

import (
	"fmt"
	"sync/atomic"
	"testing"
)

func BenchmarkAtomicCounter(b *testing.B) {
	var counter atomic.Int64

	b.RunParallel(func(pb *testing.PB) {
		// TODO: for pb.Next() { counter.Add(1) }
		_ = pb.Next
		_ = counter.Add
	})
}

func main() {
	fmt.Println("run: go test -bench=. -cpu=1,2,4,8")
	_ = atomic.Int64{}
	_ = testing.B{}
}
`,
      hint: `package main

import (
	"fmt"
	"sync/atomic"
	"testing"
)

func BenchmarkAtomicCounter(b *testing.B) {
	var counter atomic.Int64

	b.RunParallel(func(pb *testing.PB) {
		for pb.Next() {
			counter.Add(1)
		}
	})
}

func main() {
	fmt.Println("run: go test -bench=. -cpu=1,2,4,8")
}
`,
      validate: (code: string) =>
        code.includes("b.RunParallel") &&
        code.includes("pb.Next()") &&
        code.includes("atomic.Int64"),
      successMessage:
        "b.RunParallel runs in GOMAXPROCS goroutines. Combine with -cpu=1,2,4,8 to measure how throughput scales with core count — essential for evaluating concurrent data structures.",
    },
  ],
};
