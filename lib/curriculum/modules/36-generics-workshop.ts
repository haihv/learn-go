import type { WorkshopModule } from "../types";

export const genericsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "36",
  slug: "generics-workshop",
  title: "Generics Workshop",
  icon: "🧬",
  estimatedMinutes: 20,
  description: "Practice writing generic functions and types in Go.",
  steps: [
    {
      instruction:
        "Define a local type constraint `Number` as `interface { ~int | ~float64 }` and write `Min[T Number](a, b T) T` that returns the smaller value. Test with ints and floats.",
      starterCode: `package main

import "fmt"

// TODO: define Number constraint and Min generic function

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))
}
`,
      hint: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))
}
`,
      validate: (code: string) =>
        code.includes("[T ") &&
        code.includes("Min") &&
        code.includes("interface"),
      successMessage:
        "Type constraints define which types a type parameter accepts.",
    },
    {
      instruction:
        "Write generic `Map[A, B any](slice []A, fn func(A) B) []B` that applies fn to each element. Use it to double a []int and to get lengths of []string.",
      starterCode: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

// TODO: write Map[A, B any] generic function

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	// TODO: use Map to double []int{1, 2, 3} and get lengths of []string{"Go", "is", "fun"}
}
`,
      hint: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)
}
`,
      validate: (code: string) =>
        code.includes("func Map[") && code.includes("any"),
      successMessage:
        "Generic Map works on any slice type — write once, use everywhere.",
    },
    {
      instruction:
        "Write generic `Filter[T any](slice []T, pred func(T) bool) []T`. Use it to filter even numbers and to filter strings longer than 3 chars.",
      starterCode: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

// TODO: write Filter[T any] generic function

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	// TODO: use Filter to get even numbers and strings longer than 3 chars
}
`,
      hint: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

func Filter[T any](slice []T, pred func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens)

	long := Filter([]string{"Go", "Rust", "Python", "C"}, func(s string) bool { return len(s) > 3 })
	fmt.Println(long)
}
`,
      validate: (code: string) =>
        code.includes("func Filter[") && code.includes("pred"),
      successMessage:
        "Generic Filter reuses the same logic regardless of the element type.",
    },
    {
      instruction:
        "Define a generic `Stack[T any]` struct with `items []T` field. Add `Push(T)`, `Pop() (T, bool)`, and `Peek() (T, bool)` methods. Test with both int and string stacks.",
      starterCode: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

func Filter[T any](slice []T, pred func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

// TODO: define Stack[T any] with Push, Pop, Peek methods

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens)

	long := Filter([]string{"Go", "Rust", "Python", "C"}, func(s string) bool { return len(s) > 3 })
	fmt.Println(long)

	// TODO: test Stack with int and string
}
`,
      hint: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

func Filter[T any](slice []T, pred func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) {
	s.items = append(s.items, v)
}

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
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens)

	long := Filter([]string{"Go", "Rust", "Python", "C"}, func(s string) bool { return len(s) > 3 })
	fmt.Println(long)

	var intStack Stack[int]
	intStack.Push(10)
	intStack.Push(20)
	v, ok := intStack.Pop()
	fmt.Println(v, ok)

	var strStack Stack[string]
	strStack.Push("hello")
	strStack.Push("world")
	top, _ := strStack.Peek()
	fmt.Println(top)
}
`,
      validate: (code: string) =>
        code.includes("Stack[T") &&
        code.includes("Push") &&
        code.includes("Pop"),
      successMessage:
        "Generic types let you define data structures that work with any type.",
    },
    {
      instruction:
        "Write `Contains[T comparable](slice []T, target T) bool` using the `comparable` constraint (which enables ==). Test with []int, []string, and []bool.",
      starterCode: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

func Filter[T any](slice []T, pred func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) {
	s.items = append(s.items, v)
}

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

// TODO: write Contains[T comparable] function

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens)

	long := Filter([]string{"Go", "Rust", "Python", "C"}, func(s string) bool { return len(s) > 3 })
	fmt.Println(long)

	var intStack Stack[int]
	intStack.Push(10)
	intStack.Push(20)
	v, ok := intStack.Pop()
	fmt.Println(v, ok)

	var strStack Stack[string]
	strStack.Push("hello")
	strStack.Push("world")
	top, _ := strStack.Peek()
	fmt.Println(top)

	// TODO: test Contains with []int, []string, []bool
}
`,
      hint: `package main

import "fmt"

type Number interface {
	~int | ~float64
}

func Min[T Number](a, b T) T {
	if a < b {
		return a
	}
	return b
}

func Map[A, B any](slice []A, fn func(A) B) []B {
	result := make([]B, len(slice))
	for i, v := range slice {
		result[i] = fn(v)
	}
	return result
}

func Filter[T any](slice []T, pred func(T) bool) []T {
	var result []T
	for _, v := range slice {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

type Stack[T any] struct {
	items []T
}

func (s *Stack[T]) Push(v T) {
	s.items = append(s.items, v)
}

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

func Contains[T comparable](slice []T, target T) bool {
	for _, v := range slice {
		if v == target {
			return true
		}
	}
	return false
}

func main() {
	fmt.Println(Min(3, 5))
	fmt.Println(Min(2.7, 1.4))

	doubled := Map([]int{1, 2, 3}, func(n int) int { return n * 2 })
	fmt.Println(doubled)

	lengths := Map([]string{"Go", "is", "fun"}, func(s string) int { return len(s) })
	fmt.Println(lengths)

	evens := Filter([]int{1, 2, 3, 4, 5, 6}, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens)

	long := Filter([]string{"Go", "Rust", "Python", "C"}, func(s string) bool { return len(s) > 3 })
	fmt.Println(long)

	var intStack Stack[int]
	intStack.Push(10)
	intStack.Push(20)
	v, ok := intStack.Pop()
	fmt.Println(v, ok)

	var strStack Stack[string]
	strStack.Push("hello")
	strStack.Push("world")
	top, _ := strStack.Peek()
	fmt.Println(top)

	fmt.Println(Contains([]int{1, 2, 3}, 2))
	fmt.Println(Contains([]string{"Go", "Rust"}, "Python"))
	fmt.Println(Contains([]bool{true, false}, true))
}
`,
      validate: (code: string) =>
        code.includes("comparable") && code.includes("Contains"),
      successMessage:
        "comparable constrains T to types that support == — includes all basic types and structs without slices/maps.",
    },
  ],
};
