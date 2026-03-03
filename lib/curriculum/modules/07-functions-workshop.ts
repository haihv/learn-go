import { WorkshopModule } from "../types";

export const functionsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "07",
  slug: "functions-workshop",
  title: "Functions Workshop",
  icon: "🔨",
  estimatedMinutes: 20,
  description: "Practice writing Go functions — from simple math to error handling.",
  steps: [
    {
      instruction:
        "Write a function `add(a, b int) int` that returns the sum of two integers. Call it in main and print the result.",
      starterCode: `package main

import "fmt"

// write your add function here

func main() {
	fmt.Println()
}
`,
      hint: `package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func main() {
	fmt.Println(add(3, 4))
}
`,
      validate: (code: string) =>
        code.includes("func add") && code.includes("return a + b"),
      successMessage:
        "Function parameters of the same type can share a type annotation!",
    },
    {
      instruction:
        'Write a function `greet(name string) string` that returns `"Hello, " + name + "!"`. Call it and print the result.',
      starterCode: `package main

import "fmt"

func add(a, b int) int {
	return a + b
}

// write your greet function here

func main() {
	fmt.Println(add(3, 4))
}
`,
      hint: `package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func greet(name string) string {
	return "Hello, " + name + "!"
}

func main() {
	fmt.Println(add(3, 4))
	fmt.Println(greet("Gopher"))
}
`,
      validate: (code: string) =>
        code.includes("func greet") &&
        code.includes("name string") &&
        code.includes("string"),
      successMessage: "String concatenation in Go uses the + operator.",
    },
    {
      instruction:
        "Write a function `swap(a, b string) (string, string)` that returns the two arguments in reverse order. Print both return values.",
      starterCode: `package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func greet(name string) string {
	return "Hello, " + name + "!"
}

// write your swap function here

func main() {
	fmt.Println(add(3, 4))
	fmt.Println(greet("Gopher"))
}
`,
      hint: `package main

import "fmt"

func add(a, b int) int {
	return a + b
}

func greet(name string) string {
	return "Hello, " + name + "!"
}

func swap(a, b string) (string, string) {
	return b, a
}

func main() {
	fmt.Println(add(3, 4))
	fmt.Println(greet("Gopher"))
	x, y := swap("hello", "world")
	fmt.Println(x, y)
}
`,
      validate: (code: string) =>
        code.includes("func swap") &&
        (code.includes("return b, a") || code.includes("return b,a")),
      successMessage:
        "Multiple return values make swap trivial — no temp variable needed!",
    },
    {
      instruction:
        'Write `divide(a, b float64) (float64, error)` that returns an error if b is 0. Use `errors.New("division by zero")`. Otherwise return a/b.',
      starterCode: `package main

import (
	"errors"
	"fmt"
)

func add(a, b int) int {
	return a + b
}

func greet(name string) string {
	return "Hello, " + name + "!"
}

func swap(a, b string) (string, string) {
	return b, a
}

// write your divide function here

func main() {
	fmt.Println(add(3, 4))
	fmt.Println(greet("Gopher"))
	x, y := swap("hello", "world")
	fmt.Println(x, y)
}
`,
      hint: `package main

import (
	"errors"
	"fmt"
)

func add(a, b int) int {
	return a + b
}

func greet(name string) string {
	return "Hello, " + name + "!"
}

func swap(a, b string) (string, string) {
	return b, a
}

func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func main() {
	fmt.Println(add(3, 4))
	fmt.Println(greet("Gopher"))
	x, y := swap("hello", "world")
	fmt.Println(x, y)
	result, err := divide(10, 2)
	if err != nil {
		fmt.Println("Error:", err)
	} else {
		fmt.Println(result)
	}
}
`,
      validate: (code: string) =>
        code.includes("func divide") &&
        code.includes("error") &&
        code.includes("errors.New"),
      successMessage: "Returning errors instead of panicking is the Go way!",
    },
  ],
};
