import { LessonModule } from "../types";

export const controlFlow: LessonModule = {
  type: "lesson",
  id: "11",
  slug: "control-flow",
  title: "Control Flow",
  icon: "🔀",
  estimatedMinutes: 12,
  content: `# Control Flow

Go provides a clean, minimal set of control flow constructs. If you're coming from another language, you'll find them familiar but with a few Go-specific twists.

## if / else if / else

Go's \`if\` statement does not require parentheses around the condition — in fact, \`gofmt\` will remove them if you add them.

\`\`\`go
x := 10

if x > 0 {
    fmt.Println("positive")
} else if x < 0 {
    fmt.Println("negative")
} else {
    fmt.Println("zero")
}
\`\`\`

Go also supports an optional **init statement** before the condition, separated by a semicolon. The variable declared there is scoped to the entire \`if/else\` block:

\`\`\`go
if val := compute(); val > 0 {
    fmt.Println("computed positive:", val)
} else {
    fmt.Println("computed non-positive:", val)
}
// val is not accessible here
\`\`\`

This pattern is common when calling a function that returns a value you only need within the conditional.

## switch

\`switch\` in Go is cleaner than long chains of \`if/else\`. Unlike C or Java, **cases do not fall through automatically** — each case breaks implicitly after executing.

\`\`\`go
day := "Monday"

switch day {
case "Saturday", "Sunday":
    fmt.Println("weekend")
case "Monday", "Friday":
    fmt.Println("start or end of work week")
default:
    fmt.Println("midweek")
}
\`\`\`

A single case can match multiple values by separating them with commas. The \`default\` branch is optional.

If you genuinely need fallthrough behavior, the \`fallthrough\` keyword exists — but it is rare and considered a code smell in most situations. Prefer explicit logic over relying on fallthrough.

Go also supports **expression-less switch**, which acts like a cleaner \`if/else if\` chain:

\`\`\`go
score := 85

switch {
case score >= 90:
    fmt.Println("A")
case score >= 80:
    fmt.Println("B")
default:
    fmt.Println("C or below")
}
\`\`\`

## for — the only loop keyword

Go has exactly one loop keyword: \`for\`. There is no \`while\`, \`do/while\`, or \`repeat\`. The three forms cover every use case.

**C-style loop:**

\`\`\`go
for i := 0; i < 5; i++ {
    fmt.Println(i)
}
\`\`\`

**While-style loop** (omit init and post statements):

\`\`\`go
n := 1
for n < 100 {
    n *= 2
}
\`\`\`

**Infinite loop** (omit everything, use \`break\` to exit):

\`\`\`go
for {
    input := readInput()
    if input == "quit" {
        break
    }
    process(input)
}
\`\`\`

You can also use \`continue\` to skip the rest of the current iteration, and labeled \`break\` or \`continue\` to target an outer loop.

## for range

The \`range\` clause iterates over slices, arrays, strings, maps, and channels.

\`\`\`go
fruits := []string{"apple", "banana", "cherry"}

for i, v := range fruits {
    fmt.Printf("%d: %s\\n", i, v)
}
\`\`\`

Here \`i\` is the index and \`v\` is the value. Use the blank identifier \`_\` to discard whichever you don't need:

\`\`\`go
for _, v := range fruits {
    fmt.Println(v) // only care about values
}

for i := range fruits {
    fmt.Println(i) // only care about indices
}
\`\`\`

For maps, range yields key-value pairs. For strings, range yields the byte index and the Unicode rune at that position — which handles multi-byte characters correctly.
`,
  quiz: [
    {
      question: "In a Go switch statement, what happens after a matching case executes?",
      options: [
        "It falls through to the next case automatically",
        "It requires a break statement",
        "It stops and exits the switch",
        "It panics",
      ],
      correctIndex: 2,
    },
    {
      question: "When using `for i, v := range slice`, what is `i`?",
      options: [
        "The value",
        "The index",
        "The length",
        "A copy of the slice",
      ],
      correctIndex: 1,
    },
    {
      question: "How do you write a while-style loop in Go?",
      options: [
        "while condition { }",
        "for condition { }",
        "loop condition { }",
        "do { } while condition",
      ],
      correctIndex: 1,
    },
  ],
};
