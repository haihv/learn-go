import type { WorkshopModule } from "../types";

export const profilingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "79",
  slug: "profiling-workshop",
  title: "Profiling Workshop",
  icon: "🔬",
  estimatedMinutes: 22,
  description: "Instrument code with runtime.MemStats, expose a pprof HTTP endpoint, and spot allocation hotspots.",
  steps: [
    {
      instruction:
        "Use `runtime.ReadMemStats` to measure heap allocations. Allocate a large slice, read MemStats before and after, and print the difference in `Alloc` (bytes currently on the heap). Import `runtime` and `fmt`.",
      starterCode: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	var before, after runtime.MemStats

	// TODO: runtime.ReadMemStats(&before)

	// Allocate something measurable
	data := make([]byte, 10*1024*1024) // 10 MB
	_ = data

	// TODO: runtime.ReadMemStats(&after)

	// TODO: print after.Alloc - before.Alloc (bytes allocated on heap)
	_ = fmt.Printf
}
`,
      hint: `package main

import (
	"fmt"
	"runtime"
)

func main() {
	var before, after runtime.MemStats

	runtime.ReadMemStats(&before)

	data := make([]byte, 10*1024*1024) // 10 MB
	_ = data

	runtime.ReadMemStats(&after)

	fmt.Printf("heap delta: %d bytes\\n", after.Alloc-before.Alloc)
}
`,
      validate: (code: string) =>
        code.includes("runtime.ReadMemStats") &&
        code.includes("MemStats") &&
        code.includes(".Alloc"),
      successMessage:
        "runtime.MemStats.Alloc shows current heap bytes — the difference before/after an allocation tells you exactly how much a data structure costs. Useful for quick sanity checks without spinning up pprof.",
    },
    {
      instruction:
        "Write the boilerplate to expose a pprof debug server on port 6060. Import `_ \"net/http/pprof\"` as a side effect, start the debug server in a background goroutine with `http.ListenAndServe(\"localhost:6060\", nil)`, then print the pprof endpoints to stdout. Since we can't actually listen in the Playground, simulate by just printing the setup code paths.",
      starterCode: `package main

import (
	"fmt"
	"log"
	"net/http"
	_ "net/http/pprof" // registers /debug/pprof/ routes on the default mux
)

func main() {
	// TODO: start debug server in a goroutine on localhost:6060
	// log.Println(http.ListenAndServe("localhost:6060", nil))

	fmt.Println("pprof endpoints:")
	fmt.Println("  http://localhost:6060/debug/pprof/")
	fmt.Println("  http://localhost:6060/debug/pprof/heap")
	fmt.Println("  http://localhost:6060/debug/pprof/profile?seconds=30")

	// TODO: print "pprof server started on localhost:6060"
	_ = log.Println
	_ = http.ListenAndServe
}
`,
      hint: `package main

import (
	"fmt"
	"log"
	"net/http"
	_ "net/http/pprof"
)

func main() {
	go func() {
		log.Println(http.ListenAndServe("localhost:6060", nil))
	}()

	fmt.Println("pprof endpoints:")
	fmt.Println("  http://localhost:6060/debug/pprof/")
	fmt.Println("  http://localhost:6060/debug/pprof/heap")
	fmt.Println("  http://localhost:6060/debug/pprof/profile?seconds=30")

	fmt.Println("pprof server started on localhost:6060")
}
`,
      validate: (code: string) =>
        code.includes("net/http/pprof") &&
        code.includes("localhost:6060"),
      successMessage:
        "The blank import `_ \"net/http/pprof\"` registers all pprof HTTP handlers on the default ServeMux as a side effect — no other setup needed. Keeping it on a separate port prevents interference with your main API.",
    },
    {
      instruction:
        "Use `runtime.MemStats` to compare the allocation cost of string concatenation with `+=` vs `strings.Builder`. Measure TotalAlloc before and after each approach building a 1000-character string in a loop. Print the difference for each.",
      starterCode: `package main

import (
	"fmt"
	"runtime"
	"strings"
)

func buildWithPlus() string {
	s := ""
	for i := 0; i < 100; i++ {
		s += "x"
	}
	return s
}

func buildWithBuilder() string {
	var sb strings.Builder
	for i := 0; i < 100; i++ {
		sb.WriteString("x")
	}
	return sb.String()
}

func allocDiff(fn func() string) uint64 {
	var before, after runtime.MemStats
	// TODO: ReadMemStats(&before), call fn(), ReadMemStats(&after)
	// return after.TotalAlloc - before.TotalAlloc
	_ = fn
	return 0
}

func main() {
	fmt.Printf("+=      alloc: %d bytes\\n", allocDiff(buildWithPlus))
	fmt.Printf("Builder alloc: %d bytes\\n", allocDiff(buildWithBuilder))
}
`,
      hint: `package main

import (
	"fmt"
	"runtime"
	"strings"
)

func buildWithPlus() string {
	s := ""
	for i := 0; i < 100; i++ {
		s += "x"
	}
	return s
}

func buildWithBuilder() string {
	var sb strings.Builder
	for i := 0; i < 100; i++ {
		sb.WriteString("x")
	}
	return sb.String()
}

func allocDiff(fn func() string) uint64 {
	var before, after runtime.MemStats
	runtime.ReadMemStats(&before)
	fn()
	runtime.ReadMemStats(&after)
	return after.TotalAlloc - before.TotalAlloc
}

func main() {
	fmt.Printf("+=      alloc: %d bytes\\n", allocDiff(buildWithPlus))
	fmt.Printf("Builder alloc: %d bytes\\n", allocDiff(buildWithBuilder))
}
`,
      validate: (code: string) =>
        code.includes("runtime.ReadMemStats") &&
        code.includes("TotalAlloc") &&
        code.includes("strings.Builder"),
      successMessage:
        "TotalAlloc is monotonically increasing — the difference across a function call measures bytes allocated during that call. This pattern is a lightweight alternative to full pprof for quick A/B allocation comparisons.",
    },
    {
      instruction:
        "The `buildReport` function below uses `fmt.Sprintf` inside a hot loop, causing repeated allocations. Rewrite it using `strings.Builder` and `strconv.Itoa` instead. Then verify the fix by printing MemStats TotalAlloc before and after both versions.",
      starterCode: `package main

import (
	"fmt"
	"runtime"
	"strconv"
	"strings"
)

// Allocation-heavy: fmt.Sprintf allocates on every call
func buildReportSlow(items []string) string {
	result := ""
	for i, item := range items {
		result += fmt.Sprintf("%d: %s\\n", i, item)
	}
	return result
}

// TODO: implement buildReportFast using strings.Builder and strconv.Itoa
// avoid fmt.Sprintf in the loop

func totalAllocOf(fn func()) uint64 {
	var before, after runtime.MemStats
	runtime.ReadMemStats(&before)
	fn()
	runtime.ReadMemStats(&after)
	return after.TotalAlloc - before.TotalAlloc
}

func main() {
	items := []string{"alpha", "beta", "gamma", "delta", "epsilon"}

	slow := totalAllocOf(func() { buildReportSlow(items) })
	fast := totalAllocOf(func() { buildReportFast(items) })

	fmt.Printf("slow: %d bytes\\n", slow)
	fmt.Printf("fast: %d bytes\\n", fast)

	_ = strconv.Itoa
	_ = strings.Builder{}
}
`,
      hint: `package main

import (
	"fmt"
	"runtime"
	"strconv"
	"strings"
)

func buildReportSlow(items []string) string {
	result := ""
	for i, item := range items {
		result += fmt.Sprintf("%d: %s\\n", i, item)
	}
	return result
}

func buildReportFast(items []string) string {
	var sb strings.Builder
	for i, item := range items {
		sb.WriteString(strconv.Itoa(i))
		sb.WriteString(": ")
		sb.WriteString(item)
		sb.WriteString("\\n")
	}
	return sb.String()
}

func totalAllocOf(fn func()) uint64 {
	var before, after runtime.MemStats
	runtime.ReadMemStats(&before)
	fn()
	runtime.ReadMemStats(&after)
	return after.TotalAlloc - before.TotalAlloc
}

func main() {
	items := []string{"alpha", "beta", "gamma", "delta", "epsilon"}

	slow := totalAllocOf(func() { buildReportSlow(items) })
	fast := totalAllocOf(func() { buildReportFast(items) })

	fmt.Printf("slow: %d bytes\\n", slow)
	fmt.Printf("fast: %d bytes\\n", fast)
}
`,
      validate: (code: string) =>
        code.includes("buildReportFast") &&
        code.includes("strings.Builder") &&
        code.includes("strconv.Itoa"),
      successMessage:
        "Replacing fmt.Sprintf with strings.Builder + strconv cuts allocations by an order of magnitude in tight loops. pprof's 'list' command shows exactly these lines when fmt.Sprintf shows up as a hotspot.",
    },
  ],
};
