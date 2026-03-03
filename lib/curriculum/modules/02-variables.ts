import { WorkshopModule } from "../types";

export const variables: WorkshopModule = {
  type: "workshop",
  id: "02",
  slug: "variables",
  title: "Variables",
  icon: "📦",
  estimatedMinutes: 15,
  description: "Learn Go's two ways to declare variables and how zero values work.",
  steps: [
    {
      instruction:
        "Declare an integer variable named `score` using the `var` keyword and assign it the value 42. Then print it with `fmt.Println`.",
      starterCode: `package main

import "fmt"

func main() {
	// TODO: declare an integer variable named score with value 42 using var
	fmt.Println()
}
`,
      hint: `package main

import "fmt"

func main() {
	var score int = 42
	fmt.Println(score)
}
`,
      validate: (code: string) => code.includes("var ") && code.includes("score"),
      successMessage: "Great! The `var` keyword declares a variable with an explicit type.",
    },
    {
      instruction:
        "Declare a string variable named `name` using the short declaration operator `:=` and assign it your name. Print it.",
      starterCode: `package main

import "fmt"

func main() {
	// TODO: use := to declare a string variable named name
	fmt.Println()
}
`,
      hint: `package main

import "fmt"

func main() {
	name := "Gopher"
	fmt.Println(name)
}
`,
      validate: (code: string) => code.includes(":=") && code.includes("name"),
      successMessage: "The `:=` operator infers the type — no need to write `string`.",
    },
    {
      instruction:
        "Declare two variables `x` and `y` on a single line using `:=`, then print both.",
      starterCode: `package main

import "fmt"

func main() {
	// TODO: declare x and y on a single line, e.g. x, y := ...
	fmt.Println()
}
`,
      hint: `package main

import "fmt"

func main() {
	x, y := 10, 20
	fmt.Println(x, y)
}
`,
      validate: (code: string) =>
        code.includes(":=") &&
        code.includes(",") &&
        code.includes("x") &&
        code.includes("y"),
      successMessage: "Multiple assignment keeps code concise!",
    },
    {
      instruction:
        "Declare three variables using `var` without assigning values: an `int`, a `string`, and a `bool`. Print each to see their zero values.",
      starterCode: `package main

import "fmt"

func main() {
	var i int
	var s string
	var b bool
	// TODO: print i, s, and b to see their zero values
}
`,
      hint: `package main

import "fmt"

func main() {
	var i int
	var s string
	var b bool
	fmt.Println(i)
	fmt.Println(s)
	fmt.Println(b)
}
`,
      validate: (code: string) =>
        code.includes("var ") &&
        (code.includes("false") || code.match(/var\s+\w+\s+bool/) !== null),
      successMessage: "Every Go type has a zero value — no undefined or null!",
    },
  ],
};
