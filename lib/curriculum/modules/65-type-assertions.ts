import type { LessonModule } from "../types";

export const typeAssertions: LessonModule = {
  type: "lesson",
  id: "65",
  slug: "type-assertions",
  title: "Type Assertions & Type Switches",
  icon: "🔍",
  estimatedMinutes: 13,
  content: `## Type Assertions & Type Switches

### Type assertions

A type assertion extracts the concrete value stored inside an interface:

\`\`\`go
var w io.Writer = os.Stdout
f := w.(*os.File)  // panics if w is not *os.File
\`\`\`

The two-value (safe) form never panics:
\`\`\`go
f, ok := w.(*os.File)
if ok {
    fmt.Println("it's a file:", f.Name())
}
\`\`\`
Always prefer the two-value form unless a wrong type is a programming error you want to crash on.

### Type switches

A type switch tests an interface value against multiple concrete types in one construct:

\`\`\`go
func describe(v any) string {
    switch x := v.(type) {
    case int:
        return fmt.Sprintf("int: %d", x)
    case string:
        return fmt.Sprintf("string: %q", x)
    case bool:
        return fmt.Sprintf("bool: %t", x)
    default:
        return fmt.Sprintf("unknown: %T", x)
    }
}
\`\`\`

Inside each case, \`x\` is already typed — no further assertion needed.

### The any type

\`any\` is an alias for \`interface{}\` (introduced in Go 1.18). Functions that accept arbitrary values use \`any\`:

\`\`\`go
func printAll(vals ...any) {
    for _, v := range vals {
        fmt.Println(v)
    }
}
\`\`\`

### Checking error types

Type assertions are the mechanism behind \`errors.As\`:

\`\`\`go
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("path:", pathErr.Path)
}
\`\`\`

You can also use a type switch directly on errors:
\`\`\`go
switch e := err.(type) {
case *os.PathError:
    fmt.Println("path error:", e.Path)
case *json.SyntaxError:
    fmt.Println("json syntax error at offset:", e.Offset)
default:
    fmt.Println("unknown error:", e)
}
\`\`\`

### Interface satisfaction check

Use a blank identifier assertion as a compile-time check that a type implements an interface:
\`\`\`go
var _ io.Writer = (*MyWriter)(nil)  // compile error if MyWriter doesn't implement io.Writer
\`\`\`

### Common pitfalls
- Asserting a nil interface panics: \`var w io.Writer; w.(*os.File)\` — always check for nil first
- \`fmt.Errorf("...: %w", err)\` wraps errors — use \`errors.As\` rather than type asserting the raw error to unwrap correctly
- Asserting to an interface (not a concrete type) is valid and often useful for capability checks
`,
  quiz: [
    {
      question:
        "What is the difference between `f := w.(*os.File)` and `f, ok := w.(*os.File)`?",
      options: [
        "The first is faster; the second is safer",
        "The first panics if the assertion fails; the second sets ok=false without panicking",
        "The second requires a nil check before use",
        "There is no difference — ok is always true",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Inside a type switch `switch x := v.(type) { case string: ... }`, what is the type of x inside the string case?",
      options: ["interface{}", "any", "string", "reflect.Type"],
      correctIndex: 2,
    },
    {
      question:
        "What does `var _ io.Writer = (*MyWriter)(nil)` accomplish?",
      options: [
        "It creates a nil MyWriter and discards it",
        "It is a compile-time assertion that *MyWriter implements io.Writer — the program won't compile if it doesn't",
        "It registers MyWriter as a known Writer with the io package",
        "It benchmarks MyWriter's Write method",
      ],
      correctIndex: 1,
    },
  ],
};
