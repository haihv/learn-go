import type { WorkshopModule } from "../types";

export const pointersWorkshop: WorkshopModule = {
  type: "workshop",
  id: "05",
  slug: "pointers-workshop",
  title: "Pointers Workshop",
  icon: "📍",
  estimatedMinutes: 20,
  description:
    "Build hands-on fluency with Go pointers — from address-of and dereference to pointer receivers and nil safety.",
  steps: [
    {
      instruction:
        "Declare `n := 42`, then create a pointer `p := &n`. Print the value at the pointer using `*p`. You should see `42` in the output.",
      starterCode: `package main

import "fmt"

func main() {
	// Declare n, then take its address with &
	// Print the dereferenced value with *p
	fmt.Println()
}
`,
      hint: `package main

import "fmt"

func main() {
	n := 42
	p := &n
	fmt.Println(*p)
}
`,
      validate: (code: string) =>
        code.includes("&n") && code.includes("*p"),
      successMessage:
        "`&n` gives you the address of n. `*p` follows that address back to the value — this is the foundation of every pointer operation in Go.",
    },
    {
      instruction:
        "Write a function `double(p *int)` that doubles the integer the pointer points to by assigning `*p = *p * 2`. Call it with `&n` and print `n` to confirm it changed.",
      starterCode: `package main

import "fmt"

// Write double here — it takes a *int and doubles the value in place

func main() {
	n := 42
	p := &n
	fmt.Println(*p)
	// Call double with &n, then print n
}
`,
      hint: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

func main() {
	n := 42
	p := &n
	fmt.Println(*p)
	double(&n)
	fmt.Println(n)
}
`,
      validate: (code: string) =>
        code.includes("func double") && code.includes("*p"),
      successMessage:
        "By receiving a `*int`, `double` can reach into the caller's stack frame and mutate `n` directly — something impossible with a plain `int` parameter.",
    },
    {
      instruction:
        "Write a function `swap(a, b *int)` that swaps the values the two pointers point to. Call it with two variables and print them before and after to confirm the swap.",
      starterCode: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

// Write swap here — it takes two *int pointers and swaps their values

func main() {
	n := 42
	double(&n)
	fmt.Println(n)

	x, y := 10, 20
	fmt.Println(x, y) // before swap
	// Call swap with &x and &y
	fmt.Println(x, y) // after swap
}
`,
      hint: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

func swap(a, b *int) {
	tmp := *a
	*a = *b
	*b = tmp
}

func main() {
	n := 42
	double(&n)
	fmt.Println(n)

	x, y := 10, 20
	fmt.Println(x, y)
	swap(&x, &y)
	fmt.Println(x, y)
}
`,
      validate: (code: string) =>
        code.includes("func swap") &&
        code.includes("*a") &&
        code.includes("*b"),
      successMessage:
        "With pointers you can swap two variables without returning anything — the mutations happen directly on the caller's variables, so no return value is needed.",
    },
    {
      instruction:
        "Define a `Counter` struct with a single `Count int` field. Add a pointer receiver method `Increment()` on `*Counter` that adds 1 to `Count`. In main, create a `Counter`, call `Increment` twice, and print `Count`.",
      starterCode: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

func swap(a, b *int) {
	tmp := *a
	*a = *b
	*b = tmp
}

// Define Counter struct and its Increment pointer receiver method here

func main() {
	n := 42
	double(&n)
	fmt.Println(n)

	x, y := 10, 20
	swap(&x, &y)
	fmt.Println(x, y)

	// Create a Counter, call Increment twice, print Count
}
`,
      hint: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

func swap(a, b *int) {
	tmp := *a
	*a = *b
	*b = tmp
}

type Counter struct {
	Count int
}

func (c *Counter) Increment() {
	c.Count++
}

func main() {
	n := 42
	double(&n)
	fmt.Println(n)

	x, y := 10, 20
	swap(&x, &y)
	fmt.Println(x, y)

	c := Counter{}
	c.Increment()
	c.Increment()
	fmt.Println(c.Count)
}
`,
      validate: (code: string) =>
        code.includes("func (c *Counter)") || code.includes("*Counter"),
      successMessage:
        "A pointer receiver method mutates the original struct value. If you used a value receiver `(c Counter)`, `Count` would stay 0 — each call would work on a throwaway copy.",
    },
    {
      instruction:
        "Write a function `safePrint(p *int)` that prints the value if `p != nil`, or prints `\"pointer is nil\"` otherwise. Call it once with a valid pointer and once with `nil`.",
      starterCode: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

func swap(a, b *int) {
	tmp := *a
	*a = *b
	*b = tmp
}

type Counter struct {
	Count int
}

func (c *Counter) Increment() {
	c.Count++
}

// Write safePrint here — guard against nil before dereferencing

func main() {
	n := 42
	double(&n)
	fmt.Println(n)

	x, y := 10, 20
	swap(&x, &y)
	fmt.Println(x, y)

	c := Counter{}
	c.Increment()
	c.Increment()
	fmt.Println(c.Count)

	val := 99
	safePrint(&val) // should print 99
	safePrint(nil)  // should print "pointer is nil"
}
`,
      hint: `package main

import "fmt"

func double(p *int) {
	*p = *p * 2
}

func swap(a, b *int) {
	tmp := *a
	*a = *b
	*b = tmp
}

type Counter struct {
	Count int
}

func (c *Counter) Increment() {
	c.Count++
}

func safePrint(p *int) {
	if p != nil {
		fmt.Println(*p)
	} else {
		fmt.Println("pointer is nil")
	}
}

func main() {
	n := 42
	double(&n)
	fmt.Println(n)

	x, y := 10, 20
	swap(&x, &y)
	fmt.Println(x, y)

	c := Counter{}
	c.Increment()
	c.Increment()
	fmt.Println(c.Count)

	val := 99
	safePrint(&val)
	safePrint(nil)
}
`,
      validate: (code: string) => code.includes("!= nil"),
      successMessage:
        "Checking `p != nil` before dereferencing is the standard nil-safety guard in Go. Skipping it on a nil pointer causes a runtime panic — always defend at the boundary where a pointer might be nil.",
    },
  ],
};
