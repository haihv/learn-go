import type { WorkshopModule } from "../types";

export const closuresWorkshop: WorkshopModule = {
  type: "workshop",
  id: "09",
  slug: "closures-workshop",
  title: "Closures Workshop",
  icon: "🔒",
  estimatedMinutes: 22,
  description:
    "Build stateful closures, function factories, and higher-order functions — then fix the classic loop variable capture bug.",
  steps: [
    {
      instruction:
        "Write `makeCounter() func() int` that returns a closure. Each call to the returned function should increment an internal counter by 1 and return the new value. The counter starts at 0.",
      starterCode: `package main

import "fmt"

// TODO: implement makeCounter
// It should return a func() int whose state persists between calls.

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // should print 1
	fmt.Println(counter()) // should print 2
	fmt.Println(counter()) // should print 3
}
`,
      hint: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	// count is captured by reference — every call to the closure
	// increments the same variable that lives in makeCounter's scope.
	return func() int {
		count++
		return count
	}
}

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1
	fmt.Println(counter()) // 2
	fmt.Println(counter()) // 3
}
`,
      validate: (code: string) =>
        code.includes("makeCounter") && code.includes("func() int"),
      successMessage:
        "Closures capture variables by reference — each call shares the same counter!",
    },
    {
      instruction:
        "Write `makeAdder(n int) func(int) int` — a function factory that returns a closure. The returned function should accept an integer and return that integer plus `n`.",
      starterCode: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

// TODO: implement makeAdder

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1
	fmt.Println(counter()) // 2

	add5 := makeAdder(5)
	add10 := makeAdder(10)
	fmt.Println(add5(3))  // should print 8
	fmt.Println(add10(3)) // should print 13
}
`,
      hint: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func makeAdder(n int) func(int) int {
	// n is captured from makeAdder's parameter list.
	// Each call to makeAdder creates an independent closure with its own n.
	return func(x int) int {
		return x + n
	}
}

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1
	fmt.Println(counter()) // 2

	add5 := makeAdder(5)
	add10 := makeAdder(10)
	fmt.Println(add5(3))  // 8
	fmt.Println(add10(3)) // 13
}
`,
      validate: (code: string) =>
        code.includes("makeAdder") && code.includes("return func"),
      successMessage:
        "Function factories create specialized functions from a general template.",
    },
    {
      instruction:
        "Write `filter(nums []int, pred func(int) bool) []int` that returns a new slice containing only the elements for which `pred` returns true. Do not modify the input slice.",
      starterCode: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func makeAdder(n int) func(int) int {
	return func(x int) int {
		return x + n
	}
}

// TODO: implement filter

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1

	add5 := makeAdder(5)
	fmt.Println(add5(3)) // 8

	nums := []int{1, 2, 3, 4, 5, 6}
	evens := filter(nums, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens) // should print [2 4 6]
}
`,
      hint: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func makeAdder(n int) func(int) int {
	return func(x int) int {
		return x + n
	}
}

func filter(nums []int, pred func(int) bool) []int {
	result := []int{}
	for _, v := range nums {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1

	add5 := makeAdder(5)
	fmt.Println(add5(3)) // 8

	nums := []int{1, 2, 3, 4, 5, 6}
	evens := filter(nums, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens) // [2 4 6]
}
`,
      validate: (code: string) =>
        code.includes("func filter") && code.includes("pred("),
      successMessage:
        "Higher-order functions make code composable and reusable.",
    },
    {
      instruction:
        "Write `apply(nums []int, fn func(int) int) []int` that returns a new slice where every element is the result of calling `fn` on the corresponding input element. This is the classic map operation.",
      starterCode: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func makeAdder(n int) func(int) int {
	return func(x int) int {
		return x + n
	}
}

func filter(nums []int, pred func(int) bool) []int {
	result := []int{}
	for _, v := range nums {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

// TODO: implement apply

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1

	add5 := makeAdder(5)
	fmt.Println(add5(3)) // 8

	nums := []int{1, 2, 3, 4, 5, 6}
	evens := filter(nums, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens) // [2 4 6]

	doubled := apply(nums, func(n int) int { return n * 2 })
	fmt.Println(doubled) // should print [2 4 6 8 10 12]
}
`,
      hint: `package main

import "fmt"

func makeCounter() func() int {
	count := 0
	return func() int {
		count++
		return count
	}
}

func makeAdder(n int) func(int) int {
	return func(x int) int {
		return x + n
	}
}

func filter(nums []int, pred func(int) bool) []int {
	result := []int{}
	for _, v := range nums {
		if pred(v) {
			result = append(result, v)
		}
	}
	return result
}

// apply transforms each element using fn without mutating the original slice.
func apply(nums []int, fn func(int) int) []int {
	result := make([]int, len(nums))
	for i, v := range nums {
		result[i] = fn(v)
	}
	return result
}

func main() {
	counter := makeCounter()
	fmt.Println(counter()) // 1

	add5 := makeAdder(5)
	fmt.Println(add5(3)) // 8

	nums := []int{1, 2, 3, 4, 5, 6}
	evens := filter(nums, func(n int) bool { return n%2 == 0 })
	fmt.Println(evens) // [2 4 6]

	doubled := apply(nums, func(n int) int { return n * 2 })
	fmt.Println(doubled) // [2 4 6 8 10 12]
}
`,
      validate: (code: string) =>
        code.includes("func apply") && code.includes("fn("),
      successMessage:
        "The apply pattern transforms each element without mutating the original.",
    },
    {
      instruction:
        "The code below creates a slice of closures inside a loop — but all of them print the same value. Fix the loop variable capture bug so the closures correctly print 0, 1, and 2.",
      // The broken version captures the loop variable by reference.
      // All closures share the same `i`, which equals 3 after the loop ends.
      starterCode: `package main

import "fmt"

func main() {
	funcs := make([]func(), 3)

	for i := 0; i < 3; i++ {
		funcs[i] = func() {
			fmt.Println(i) // bug: all closures share the same i
		}
	}

	for _, f := range funcs {
		f() // prints 3, 3, 3 — not 0, 1, 2
	}
}
`,
      hint: `package main

import "fmt"

func main() {
	funcs := make([]func(), 3)

	for i := 0; i < 3; i++ {
		i := i // shadow the loop variable with a new binding scoped to this iteration
		funcs[i] = func() {
			fmt.Println(i) // captures the per-iteration copy, not the shared loop var
		}
	}

	for _, f := range funcs {
		f() // prints 0, 1, 2
	}
}
`,
      validate: (code: string) =>
        code.includes("i := i") || code.includes("func(n int)"),
      successMessage:
        "Capturing the loop variable by value prevents the classic closure gotcha.",
    },
  ],
};
