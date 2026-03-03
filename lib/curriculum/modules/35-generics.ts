import type { LessonModule } from "../types";

export const generics: LessonModule = {
	type: "lesson",
	id: "35",
	slug: "generics",
	title: "Generics",
	icon: "🧬",
	estimatedMinutes: 14,
	content: `## Generics

### The problem generics solve

Before Go 1.18, writing a function that worked on multiple types meant one of two awkward choices: copy-paste the logic for each concrete type, or accept \`any\` (the empty interface) and sprinkle type assertions everywhere — assertions that panic at runtime if the caller passes the wrong type.

\`\`\`go
// Pre-generics: only works for int
func MinInt(a, b int) int {
	if a < b {
		return a
	}
	return b
}

// Pre-generics: works for anything, but loses type safety
func MinAny(a, b any) any {
	// type assertion required — panics if types differ
	if a.(int) < b.(int) {
		return a
	}
	return b
}
\`\`\`

Generics let you write one function that is type-safe and reusable across many types at once.

### Generic function syntax

A generic function declares one or more **type parameters** in square brackets between the function name and its regular parameter list:

\`\`\`go
func Min[T constraints.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}
\`\`\`

- \`[T constraints.Ordered]\` — the type parameter block; \`T\` is the name, \`constraints.Ordered\` is the constraint
- \`a, b T\` — both parameters use the same type \`T\`
- The return type is also \`T\`

The compiler instantiates a concrete version of \`Min\` for each distinct type you call it with, so there is no runtime overhead from type dispatch.

### Type constraints

A constraint specifies what operations are legal inside the function body. The three most common:

| Constraint | Meaning |
|---|---|
| \`any\` | No restrictions — the type parameter can be anything |
| \`comparable\` | Supports \`==\` and \`!=\` (required for map keys) |
| \`constraints.Ordered\` | Supports \`<\`, \`>\`, \`<=\`, \`>=\` — covers integers, floats, strings |

\`constraints.Ordered\` lives in the \`golang.org/x/exp/constraints\` package for Go 1.18–1.20. Starting with Go 1.21 the standard library provides \`cmp.Ordered\` in the \`cmp\` package:

\`\`\`go
import "cmp"

func Min[T cmp.Ordered](a, b T) T {
	if a < b {
		return a
	}
	return b
}

fmt.Println(Min(3, 7))       // 3
fmt.Println(Min(3.14, 2.71)) // 2.71
fmt.Println(Min("go", "py")) // go
\`\`\`

### Multiple type parameters

You can declare more than one type parameter:

\`\`\`go
func Zip[A, B any](as []A, bs []B) []struct{ A A; B B } {
	n := len(as)
	if len(bs) < n {
		n = len(bs)
	}
	out := make([]struct{ A A; B B }, n)
	for i := range n {
		out[i] = struct{ A A; B B }{as[i], bs[i]}
	}
	return out
}
\`\`\`

### Generic higher-order functions

\`\`\`go
package main

import "fmt"

// Map transforms every element of a slice using fn.
func Map[A, B any](slice []A, fn func(A) B) []B {
	out := make([]B, len(slice))
	for i, v := range slice {
		out[i] = fn(v)
	}
	return out
}

// Filter keeps only elements for which pred returns true.
func Filter[T any](slice []T, pred func(T) bool) []T {
	var out []T
	for _, v := range slice {
		if pred(v) {
			out = append(out, v)
		}
	}
	return out
}

func main() {
	nums := []int{1, 2, 3, 4, 5}

	doubled := Map(nums, func(n int) int { return n * 2 })
	fmt.Println(doubled) // [2 4 6 8 10]

	evens := Filter(nums, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens) // [2 4]

	strs := Map(nums, func(n int) string { return fmt.Sprintf("%d!", n) })
	fmt.Println(strs) // [1! 2! 3! 4! 5!]
}
\`\`\`

The compiler infers \`A\` and \`B\` from the arguments, so you rarely need to write them explicitly.

### Generic types

Type parameters are not limited to functions — you can parameterize a struct too:

\`\`\`go
package main

import "fmt"

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) {
	s.items = append(s.items, v)
}

// Pop removes and returns the top element; the bool indicates whether the stack was non-empty.
func (s *Stack[T]) Pop() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	top := s.items[len(s.items)-1]
	s.items = s.items[:len(s.items)-1]
	return top, true
}

func (s *Stack[T]) Peek() (T, bool) {
	if len(s.items) == 0 {
		var zero T
		return zero, false
	}
	return s.items[len(s.items)-1], true
}

func main() {
	var s Stack[int]
	s.Push(1)
	s.Push(2)
	s.Push(3)

	if top, ok := s.Peek(); ok {
		fmt.Println("top:", top) // top: 3
	}

	for {
		v, ok := s.Pop()
		if !ok {
			break
		}
		fmt.Println("popped:", v)
	}
}
\`\`\`

### Standard library generics (Go 1.21+)

Go 1.21 added generic helpers in the standard library:

\`\`\`go
import (
	"cmp"
	"maps"
	"slices"
)

nums := []int{3, 1, 4, 1, 5}
slices.Sort(nums)
fmt.Println(slices.Contains(nums, 4)) // true

m := map[string]int{"a": 1, "b": 2}
for k := range maps.Keys(m) {
	fmt.Println(k)
}

fmt.Println(cmp.Compare(3, 5)) // -1
\`\`\`

### When NOT to use generics

Generics are not always the right tool. Prefer a regular interface when:

- You want **runtime polymorphism on behavior** — e.g. \`io.Reader\`, \`fmt.Stringer\`
- The abstraction has only one type involved (an interface is simpler)
- The constraint would just be \`any\` and you immediately type-assert inside — that's a sign you want an interface, not a type parameter

Use generics when:
- You have algorithms or data structures whose logic is identical across types (\`Map\`, \`Filter\`, \`Stack\`)
- You need the compiler to enforce type correctness across calls (e.g. a typed cache where the key and value types must match at compile time)
`,
	quiz: [
		{
			question: "What syntax declares a generic function with a type parameter T?",
			options: [
				"func f<T>()",
				"func f[T any]()",
				"func f(T any)",
				"generic func f(T)",
			],
			correctIndex: 1,
		},
		{
			question: "Which constraint allows using < and > operators on a type parameter?",
			options: [
				"any",
				"comparable",
				"constraints.Ordered or cmp.Ordered",
				"numeric",
			],
			correctIndex: 2,
		},
		{
			question: "What does the `comparable` constraint enable?",
			options: [
				"Arithmetic operators",
				"The == and != operators",
				"Ordering operators (<, >)",
				"String conversion",
			],
			correctIndex: 1,
		},
	],
};
