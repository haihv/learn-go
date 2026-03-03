import type { WorkshopModule } from "../types";

export const controlFlowWorkshop: WorkshopModule = {
  type: "workshop",
  id: "12",
  slug: "control-flow-workshop",
  title: "Control Flow Workshop",
  icon: "🔀",
  estimatedMinutes: 20,
  description: "Practice if/else, for loops, switch, and range in Go.",
  steps: [
    {
      instruction:
        "Write a function `classify(n int) string` that returns \"negative\", \"zero\", or \"positive\" using if/else if/else. Call it on -5, 0, 7 and print results.",
      starterCode: `package main

import "fmt"

// TODO: write classify function here

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))
}
`,
      hint: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))
}
`,
      validate: (code: string) =>
        code.includes("func classify") && code.includes("else"),
      successMessage:
        "Go's if/else needs no parentheses around conditions.",
    },
    {
      instruction:
        "Write a `for` loop that prints numbers 1 to 10 (one per line).",
      starterCode: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	// TODO: write a for loop that prints 1 to 10
}
`,
      hint: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}
}
`,
      validate: (code: string) =>
        code.includes("for") &&
        (code.includes(":= 1") || code.includes("= 1")),
      successMessage:
        "Go has only one loop keyword: for. It covers while-style and C-style loops.",
    },
    {
      instruction:
        "Use a `for range` loop over `[]string{\"Go\", \"is\", \"fun\"}` and print each word with its index.",
      starterCode: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}

	// TODO: use for range over []string{"Go", "is", "fun"} and print index + word
}
`,
      hint: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}

	words := []string{"Go", "is", "fun"}
	for i, w := range words {
		fmt.Println(i, w)
	}
}
`,
      validate: (code: string) =>
        code.includes("range") && code.includes(`[]string{`),
      successMessage:
        "range gives you both index and value — use _ to discard either.",
    },
    {
      instruction:
        "Write a `switch` statement on an `int` variable `day` (1-7) that prints the day name. Include a default case.",
      starterCode: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}

	words := []string{"Go", "is", "fun"}
	for i, w := range words {
		fmt.Println(i, w)
	}

	// TODO: write a switch on day (1-7) that prints the day name
	day := 3
	_ = day
}
`,
      hint: `package main

import "fmt"

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}

	words := []string{"Go", "is", "fun"}
	for i, w := range words {
		fmt.Println(i, w)
	}

	day := 3
	switch day {
	case 1:
		fmt.Println("Monday")
	case 2:
		fmt.Println("Tuesday")
	case 3:
		fmt.Println("Wednesday")
	case 4:
		fmt.Println("Thursday")
	case 5:
		fmt.Println("Friday")
	case 6:
		fmt.Println("Saturday")
	case 7:
		fmt.Println("Sunday")
	default:
		fmt.Println("Invalid day")
	}
}
`,
      validate: (code: string) =>
        code.includes("switch") &&
        code.includes("case") &&
        code.includes("default"),
      successMessage:
        "Go switch cases don't fall through by default — no break needed.",
    },
    {
      instruction:
        "Write a `fizzbuzz` function that takes `n int` and returns \"Fizz\" if divisible by 3, \"Buzz\" if by 5, \"FizzBuzz\" if both, otherwise the number as a string. Call it for 1..15.",
      starterCode: `package main

import (
	"fmt"
	"strconv"
)

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

// TODO: write fizzbuzz function here

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}

	words := []string{"Go", "is", "fun"}
	for i, w := range words {
		fmt.Println(i, w)
	}

	day := 3
	switch day {
	case 1:
		fmt.Println("Monday")
	case 2:
		fmt.Println("Tuesday")
	case 3:
		fmt.Println("Wednesday")
	case 4:
		fmt.Println("Thursday")
	case 5:
		fmt.Println("Friday")
	case 6:
		fmt.Println("Saturday")
	case 7:
		fmt.Println("Sunday")
	default:
		fmt.Println("Invalid day")
	}

	// TODO: call fizzbuzz for 1..15 and print results
	_ = strconv.Itoa
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
)

func classify(n int) string {
	if n < 0 {
		return "negative"
	} else if n == 0 {
		return "zero"
	} else {
		return "positive"
	}
}

func fizzbuzz(n int) string {
	if n%3 == 0 && n%5 == 0 {
		return "FizzBuzz"
	} else if n%3 == 0 {
		return "Fizz"
	} else if n%5 == 0 {
		return "Buzz"
	}
	return strconv.Itoa(n)
}

func main() {
	fmt.Println(classify(-5))
	fmt.Println(classify(0))
	fmt.Println(classify(7))

	for i := 1; i <= 10; i++ {
		fmt.Println(i)
	}

	words := []string{"Go", "is", "fun"}
	for i, w := range words {
		fmt.Println(i, w)
	}

	day := 3
	switch day {
	case 1:
		fmt.Println("Monday")
	case 2:
		fmt.Println("Tuesday")
	case 3:
		fmt.Println("Wednesday")
	case 4:
		fmt.Println("Thursday")
	case 5:
		fmt.Println("Friday")
	case 6:
		fmt.Println("Saturday")
	case 7:
		fmt.Println("Sunday")
	default:
		fmt.Println("Invalid day")
	}

	for i := 1; i <= 15; i++ {
		fmt.Println(fizzbuzz(i))
	}
}
`,
      validate: (code: string) =>
        code.includes("fizzbuzz") ||
        code.includes("FizzBuzz") ||
        code.includes("Fizz"),
      successMessage:
        "FizzBuzz in Go: combine conditions with &&, use strconv.Itoa for int→string.",
    },
  ],
};
