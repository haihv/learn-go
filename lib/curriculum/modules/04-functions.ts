import { LessonModule } from "../types";

export const functions: LessonModule = {
  type: "lesson",
  id: "04",
  slug: "functions",
  title: "Functions",
  icon: "⚙️",
  estimatedMinutes: 12,
  content: `# Functions

Functions are the building blocks of Go programs. They encapsulate reusable logic and are declared with the \`func\` keyword.

## Basic Function Syntax

A function declaration specifies the function name, parameters with their types, and the return type.

\`\`\`go
func add(a, b int) int {
    return a + b
}

func main() {
    result := add(3, 4)
    fmt.Println(result) // 7
}
\`\`\`

When consecutive parameters share the same type, you can group them: \`a, b int\` instead of \`a int, b int\`.

## Multiple Return Values

One of Go's most distinctive features is the ability to return multiple values from a single function. This is especially powerful for error handling, eliminating the need for exceptions or out-parameters used in other languages.

\`\`\`go
func divide(a, b float64) (float64, error) {
    if b == 0 {
        return 0, fmt.Errorf("division by zero")
    }
    return a / b, nil
}

func main() {
    result, err := divide(10, 2)
    if err != nil {
        fmt.Println("Error:", err)
        return
    }
    fmt.Println(result) // 5
}
\`\`\`

The caller uses multiple assignment (\`:=\`) to capture both return values. By convention, the last return value is an \`error\` when the function can fail.

## Named Return Values

Go allows you to name the return variables directly in the function signature. Named returns are initialized to their zero values and can be returned with a bare \`return\` statement.

\`\`\`go
func minMax(nums []int) (min, max int) {
    min, max = nums[0], nums[0]
    for _, n := range nums[1:] {
        if n < min {
            min = n
        }
        if n > max {
            max = n
        }
    }
    return
}
\`\`\`

Named return values serve as documentation — the signature itself communicates what each value represents. However, avoid using bare returns in long functions, as they reduce readability by making it unclear what values are being returned.

## Variadic Functions

A variadic function accepts any number of arguments of a given type using the \`...T\` syntax. Inside the function, the variadic parameter behaves as a slice.

\`\`\`go
func sum(nums ...int) int {
    total := 0
    for _, n := range nums {
        total += n
    }
    return total
}

func main() {
    fmt.Println(sum(1, 2, 3))        // 6
    fmt.Println(sum(10, 20, 30, 40)) // 100

    numbers := []int{1, 2, 3, 4}
    fmt.Println(sum(numbers...))     // 10
}
\`\`\`

You can also expand an existing slice into variadic arguments using the \`...\` spread syntax when calling the function.

## Functions as First-Class Values

In Go, functions are first-class values — they can be assigned to variables, passed as arguments to other functions, and returned from functions. This enables powerful patterns like callbacks, middleware, and higher-order functions, which you will explore in later modules.
`,
  quiz: [
    {
      question: "How do you declare a function that returns two values in Go?",
      options: [
        "func f() (int, string) {}",
        "func f() int, string {}",
        "func f(): (int, string) {}",
        "func f() -> (int, string) {}",
      ],
      correctIndex: 0,
    },
    {
      question: "What operator makes a parameter variadic (accepts any number of arguments)?",
      options: ["**", "...", "->", ".."],
      correctIndex: 1,
    },
    {
      question: "What does a bare `return` statement do in a function with named return values?",
      options: [
        "Returns nil",
        "Returns zero values",
        "Returns the named variables as declared in the signature",
        "Causes a compile error",
      ],
      correctIndex: 2,
    },
  ],
};
