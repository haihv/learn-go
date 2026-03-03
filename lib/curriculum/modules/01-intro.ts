import type { LessonModule } from "../types";

export const intro: LessonModule = {
  type: "lesson",
  id: "01",
  slug: "intro",
  title: "Introduction to Go",
  icon: "🐹",
  estimatedMinutes: 10,
  content: `# Introduction to Go

## What Makes Go Special

Go (also called Golang) is a compiled, statically typed language created at Google in 2009. Unlike Python or JavaScript — which are interpreted at runtime — Go compiles directly to machine code, making programs start fast and run efficiently.

Here is a quick comparison:

| Feature | Go | Python | JavaScript |
|---|---|---|---|
| Typing | Static | Dynamic | Dynamic |
| Execution | Compiled | Interpreted | JIT/Interpreted |
| Concurrency | Built-in (goroutines) | Threads/asyncio | Event loop / Workers |
| Memory | Garbage collected | Garbage collected | Garbage collected |

Go's syntax is intentionally small. There are no classes, no inheritance, and no operator overloading. What you get instead is a lean set of features that are easy to read and reason about — something Python aims for but Go enforces through tooling and language design.

## Anatomy of a Go File

Every Go source file begins with a **package declaration**. For a program you can run directly, the package must be named \`main\`:

\`\`\`go
package main

import "fmt"

func main() {
    fmt.Println("Hello, Go!")
}
\`\`\`

- \`package main\` — tells the compiler this file belongs to the executable package.
- \`import "fmt"\` — brings in the standard-library package for formatted I/O.
- \`func main()\` — the entry point; execution starts here, just like \`main\` in C or Java.

Running this with \`go run main.go\` prints:

\`\`\`
Hello, Go!
\`\`\`

## fmt.Println

\`fmt.Println\` writes its arguments to standard output followed by a newline. Multiple values are separated by spaces automatically:

\`\`\`go
fmt.Println("Go version:", 1.22)
// Output: Go version: 1.22
\`\`\`

Unlike \`console.log\` in JavaScript or \`print\` in Python, \`Println\` always appends a newline — no trailing \`\\n\` needed.

## fmt.Printf and Format Verbs

\`fmt.Printf\` gives you C-style format strings but with Go's own verbs:

| Verb | Meaning |
|---|---|
| \`%s\` | String |
| \`%d\` | Integer (decimal) |
| \`%f\` | Floating-point |
| \`%v\` | Default format for any value |
| \`%+v\` | Struct with field names |
| \`%#v\` | Go syntax representation |
| \`%q\` | Quoted string |
| \`%02d\` | Zero-padded integer |
| \`%T\` | Type of the value |

\`\`\`go
package main

import "fmt"

func main() {
    name := "Gopher"
    age := 15
    score := 98.6

    fmt.Printf("Name: %s\\n", name)
    fmt.Printf("Age: %d\\n", age)
    fmt.Printf("Score: %.1f\\n", score)
    fmt.Printf("Value: %v, Type: %T\\n", age, age)
}
\`\`\`

Output:

\`\`\`
Name: Gopher
Age: 15
Score: 98.6
Value: 15, Type: int
\`\`\`

\`%v\` is the all-purpose verb — reach for it when you just want to see a value without caring about exact formatting. \`%T\` is especially useful while learning because it reveals what type Go inferred.

## The Go Toolchain

Go ships with a complete toolchain. You will use these commands constantly:

\`\`\`
go run main.go        # compile and immediately run a program
go build ./...        # compile all packages, produce binaries
go mod init myapp     # initialize a new module (creates go.mod)
go get package@v1.2   # add or upgrade a dependency
gofmt -w .            # format all Go files in place (auto-run by editors)
go test ./...         # run all tests
\`\`\`

Every Go project is a **module**, identified by its \`go.mod\` file. The module path (e.g., \`github.com/you/myapp\`) is used in import statements. For the small playground programs in this course you can skip \`go mod init\` — the playground handles that for you.

\`gofmt\` enforces a single canonical style. There is no debate about tabs vs spaces in Go: the answer is always tabs, enforced by tooling.

## The Standard Library

Go's standard library is unusually comprehensive. Before reaching for a third-party package, check if stdlib already has what you need:

| Package | Purpose |
|---|---|
| \`fmt\` | Formatted I/O |
| \`net/http\` | HTTP client and server |
| \`encoding/json\` | JSON marshal / unmarshal |
| \`strings\` | String manipulation |
| \`strconv\` | Number ↔ string conversions |
| \`os\` | File system and environment |
| \`sync\` | Mutexes, WaitGroups |
| \`errors\` | Error creation and inspection |

You will use most of these packages before you finish this course.

## Go's Philosophy of Simplicity

Go was designed with one guiding principle: *simplicity scales*. A small language means faster onboarding for new team members, consistent code style across large codebases, and fewer surprises at 2 am when something breaks in production. As you work through this course, you will see that most Go code looks the same whether it was written by a beginner or a ten-year veteran. That consistency is the point.
`,
  quiz: [
    {
      question: "What must every executable Go program's package be named?",
      options: ["library", "main", "program", "go"],
      correctIndex: 1,
    },
    {
      question: "Which syntax correctly imports the fmt package?",
      options: ['import { fmt }', 'import "fmt"', '#include <fmt>', 'using fmt;'],
      correctIndex: 1,
    },
    {
      question: "What is the entry point function of a Go program?",
      options: ["init()", "start()", "main()", "run()"],
      correctIndex: 2,
    },
  ],
};
