import type { LessonModule } from "../types";

export const closures: LessonModule = {
  type: "lesson",
  id: "08",
  slug: "closures",
  title: "Closures",
  icon: "🔒",
  estimatedMinutes: 14,
  content: `# Closures

A **closure** is a function value that references variables from outside its own body. When a function is defined inside another function, it "closes over" the variables in its surrounding scope — those variables become part of the closure's environment and remain accessible even after the outer function has returned.

## Capture by Reference, Not by Value

This is the most important thing to understand about closures in Go: **captured variables are shared, not copied**. The closure holds a reference to the variable itself, so mutations are visible to everyone who holds that reference.

\`\`\`go
package main

import "fmt"

func main() {
	x := 10
	add := func(n int) {
		x += n // modifies the original x, not a copy
	}
	add(5)
	fmt.Println(x) // 15
}
\`\`\`

This sharing is intentional and powerful — it is what makes stateful closures work.

## Function Factories

A **function factory** is a function that constructs and returns another function. The returned function closes over the factory's parameters, creating a specialized version of a general behavior.

\`\`\`go
package main

import "fmt"

func makeMultiplier(n int) func(int) int {
	return func(x int) int {
		return x * n // n is captured from makeMultiplier's scope
	}
}

func main() {
	double := makeMultiplier(2)
	triple := makeMultiplier(3)

	fmt.Println(double(7))  // 14
	fmt.Println(triple(7))  // 21
}
\`\`\`

Each call to \`makeMultiplier\` produces a closure that remembers its own copy of \`n\`. \`double\` and \`triple\` are independent — they do not share state with each other.

## Stateful Closures

Because closures capture variables by reference, they can maintain private mutable state across calls without needing a struct or global variable. This is a lightweight alternative when the state is simple.

\`\`\`go
package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++ // each call increments the shared count variable
		return count
	}
}

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1
	fmt.Println(counter()) // 2
	fmt.Println(counter()) // 3

	// a second counter has its own independent count
	other := makeCounter()
	fmt.Println(other()) // 1
}
\`\`\`

Each call to \`makeCounter\` allocates a new \`count\` variable. The returned closure is the only thing that can touch it — effectively giving you encapsulated state with zero boilerplate.

## Higher-Order Functions

A **higher-order function** either accepts a function as an argument, returns a function, or both. Closures are the natural building block for higher-order patterns.

\`\`\`go
package main

import "fmt"

// apply calls fn on every element of nums and returns the results
func apply(nums []int, fn func(int) int) []int {
	result := make([]int, len(nums))
	for i, v := range nums {
		result[i] = fn(v)
	}
	return result
}

func main() {
	nums := []int{1, 2, 3, 4, 5}

	doubled := apply(nums, func(n int) int { return n * 2 })
	fmt.Println(doubled) // [2 4 6 8 10]

	squared := apply(nums, func(n int) int { return n * n })
	fmt.Println(squared) // [1 4 9 16 25]
}
\`\`\`

The inline \`func\` literals passed to \`apply\` are closures — they can reference variables from \`main\` if needed.

## Real-World Uses

**HTTP middleware** — wrapping a handler to add logging, authentication, or tracing:

\`\`\`go
func withLogging(next http.HandlerFunc) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		log.Printf("%s %s", r.Method, r.URL.Path)
		next(w, r) // delegates to the wrapped handler
	}
}
\`\`\`

**Sort callbacks** — providing a comparison function to \`sort.Slice\`:

\`\`\`go
sort.Slice(people, func(i, j int) bool {
	return people[i].Age < people[j].Age
})
\`\`\`

**Deferred cleanup** — closures in \`defer\` statements capture the variables they need at definition time, so cleanup logic always refers to the right values:

\`\`\`go
func openFile(path string) error {
	f, err := os.Open(path)
	if err != nil {
		return err
	}
	defer func() {
		f.Close() // captures f — runs when the surrounding function returns
	}()
	// ... use f
	return nil
}
\`\`\`

## The Loop Variable Capture Gotcha

This is one of the most common bugs in Go code involving goroutines or deferred functions. The loop variable \`i\` is a single variable that is reused each iteration. If a closure captures \`i\` directly, all closures end up sharing the same variable — which has already advanced to its final value by the time they run.

\`\`\`go
// BROKEN: all goroutines print the same final value of i
for i := 0; i < 3; i++ {
	go func() {
		fmt.Println(i) // captures the loop variable by reference
	}()
}
\`\`\`

**Fix 1 — shadow with a new variable inside the loop:**

\`\`\`go
for i := 0; i < 3; i++ {
	i := i // new variable shadows the loop variable; each closure gets its own copy
	go func() {
		fmt.Println(i)
	}()
}
\`\`\`

**Fix 2 — pass i as an argument to the goroutine function:**

\`\`\`go
for i := 0; i < 3; i++ {
	go func(n int) {
		fmt.Println(n) // n is a parameter, not a captured variable
	}(i)
}
\`\`\`

Both fixes create a new binding for each iteration. Fix 2 is often preferred for goroutines because it makes the data flow explicit.

> Note: Go 1.22 changed loop semantics so each iteration creates a new loop variable automatically — but understanding the classic gotcha remains essential for reading existing code and for goroutines in older codebases.
`,
  quiz: [
    {
      question: "What does a closure capture?",
      options: [
        "A copy of all variables",
        "Only global variables",
        "The variables from its surrounding lexical scope",
        "Nothing — functions are pure",
      ],
      correctIndex: 2,
    },
    {
      question: "Which pattern correctly fixes loop variable capture?",
      options: [
        "go func() { fmt.Println(i) }()",
        "go func(n int) { fmt.Println(n) }(i)",
        "go func() { fmt.Println(&i) }()",
        "go func() { fmt.Println(*i) }()",
      ],
      correctIndex: 1,
    },
    {
      question: "What does a function factory return?",
      options: ["A struct", "A channel", "Another function", "An interface"],
      correctIndex: 2,
    },
  ],
};
