import type { LessonModule } from "../types";

export const errorHandling: LessonModule = {
	type: "lesson",
	id: "22",
	slug: "error-handling",
	title: "Error Handling",
	icon: "⚠️",
	estimatedMinutes: 16,
	content: `# Error Handling

## The error Interface

In Go, errors are values. The built-in \`error\` type is a simple interface:

\`\`\`go
type error interface {
	Error() string
}
\`\`\`

Any type that implements \`Error() string\` satisfies the \`error\` interface. This means errors are ordinary values that can be passed around, stored, compared, and wrapped — just like any other value in Go.

Functions that can fail return an error as their last return value. The caller is responsible for checking it:

\`\`\`go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	n, err := strconv.Atoi("not a number")
	if err != nil {
		fmt.Println("conversion failed:", err)
		return
	}
	fmt.Println("parsed:", n)
}
\`\`\`

## Creating Simple Errors: errors.New

\`errors.New\` creates a static error with a fixed message:

\`\`\`go
package main

import (
	"errors"
	"fmt"
)

func divide(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func main() {
	result, err := divide(10, 0)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	fmt.Println("result:", result)
}
\`\`\`

Use \`errors.New\` when you need a simple, fixed message and don't need to add dynamic context.

## Wrapping Errors: fmt.Errorf and %w

When an error propagates up through multiple layers, you should add context to explain what operation failed. \`fmt.Errorf\` with the \`%w\` verb wraps the original error while adding a message:

\`\`\`go
package main

import (
	"errors"
	"fmt"
	"strconv"
)

func parseAge(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		// %w wraps err so callers can inspect it with errors.Is / errors.As
		return 0, fmt.Errorf("parseAge: %w", err)
	}
	return n, nil
}

func main() {
	_, err := parseAge("abc")
	if err != nil {
		fmt.Println(err) // parseAge: strconv.Atoi: parsing "abc": invalid syntax
	}
}
\`\`\`

The \`%w\` verb (not \`%v\` or \`%e\`) is the key: it stores the original error inside the new one, allowing the error chain to be inspected later.

## Sentinel Errors

Sentinel errors are package-level error values that callers can check against by identity. They represent expected, named failure conditions:

\`\`\`go
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) (string, error) {
	users := map[int]string{1: "Alice", 2: "Bob"}
	name, ok := users[id]
	if !ok {
		return "", ErrNotFound
	}
	return name, nil
}

func main() {
	_, err := findUser(99)
	if errors.Is(err, ErrNotFound) {
		fmt.Println("user does not exist")
	}
}
\`\`\`

Define sentinel errors at the package level with a \`var\` declaration. The \`Err\` prefix is the conventional naming style.

## errors.Is: Walking the Error Chain

\`errors.Is(err, target)\` checks whether \`target\` appears anywhere in the error chain — it unwraps wrapped errors automatically. This makes it safe to use with wrapped errors:

\`\`\`go
package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

func fetchRecord(id int) error {
	return fmt.Errorf("fetchRecord: %w", ErrNotFound)
}

func main() {
	err := fetchRecord(99)
	// errors.Is unwraps the chain — it still finds ErrNotFound inside
	if errors.Is(err, ErrNotFound) {
		fmt.Println("record not found") // prints this
	}
}
\`\`\`

Use \`errors.Is\` when you want to check for a specific sentinel error, regardless of how many layers of wrapping exist.

## Custom Error Types

When you need to attach structured data to an error (such as HTTP status codes, field names, or operation names), define a custom struct that implements the \`error\` interface:

\`\`\`go
package main

import "fmt"

type ValidationError struct {
	Field   string
	Message string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}

func validateAge(age int) error {
	if age < 0 || age > 150 {
		return ValidationError{Field: "age", Message: "must be between 0 and 150"}
	}
	return nil
}

func main() {
	err := validateAge(200)
	if err != nil {
		fmt.Println(err) // validation failed on age: must be between 0 and 150
	}
}
\`\`\`

## errors.As: Extracting a Typed Error

\`errors.As(err, &target)\` walks the error chain looking for an error that can be assigned to \`target\`. If found, it sets \`target\` and returns \`true\`. This lets you extract a typed error even when it has been wrapped:

\`\`\`go
package main

import (
	"errors"
	"fmt"
)

type ValidationError struct {
	Field   string
	Message string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("validation failed on %s: %s", e.Field, e.Message)
}

func process(age int) error {
	if age < 0 {
		return fmt.Errorf("process: %w", ValidationError{Field: "age", Message: "must not be negative"})
	}
	return nil
}

func main() {
	err := process(-1)

	var ve ValidationError
	// errors.As unwraps the chain and extracts the ValidationError if present
	if errors.As(err, &ve) {
		fmt.Println("bad field:", ve.Field)     // bad field: age
		fmt.Println("reason:", ve.Message)      // reason: must not be negative
	}
}
\`\`\`

The difference between \`errors.Is\` and \`errors.As\`:
- \`errors.Is\` checks identity — is this specific error value in the chain?
- \`errors.As\` checks type — is there an error of this type in the chain, and can I get it?

## Idiomatic Error Handling Patterns

**Always check errors immediately.** The Go convention is to handle the error before proceeding:

\`\`\`go
// good: early return on error
f, err := os.Open("file.txt")
if err != nil {
	return fmt.Errorf("openFile: %w", err)
}
defer f.Close()
\`\`\`

**Never silently discard errors.** Assigning an error to \`_\` hides bugs:

\`\`\`go
// bad: discards the error entirely
f, _ := os.Open("file.txt")
\`\`\`

**Add context when wrapping.** The format \`"operation: %w"\` builds a readable error chain that helps with debugging.

## Panic vs Error

\`panic\` is for programmer mistakes that should never happen in correct code — not for expected runtime failures. Use errors for anything that could reasonably fail:

| Situation | Use |
|---|---|
| File not found, network timeout, invalid user input | \`error\` return |
| Index out of bounds in a function you control | \`panic\` |
| Nil pointer dereference you want to make explicit | \`panic\` |
| Initialisation that cannot possibly fail at runtime | \`panic\` (e.g., \`regexp.MustCompile\`) |

A function that accepts user input or calls external services must never panic — always return an error. Panics are reserved for bugs in your own code that indicate the program is in an impossible state.
`,
	quiz: [
		{
			question: "What verb wraps an error so errors.Is can unwrap it?",
			options: ["%e", "%w", "%v", "%err"],
			correctIndex: 1,
		},
		{
			question: "What is the difference between errors.Is and errors.As?",
			options: [
				"Is checks error message, As checks type",
				"Is checks identity via unwrapping, As extracts a typed error via unwrapping",
				"They are identical",
				"Is is for custom errors, As is for stdlib errors",
			],
			correctIndex: 1,
		},
		{
			question: "When should you use panic instead of returning an error?",
			options: [
				"For all unexpected errors",
				"For user input validation failures",
				"Only for programmer bugs that should never occur in correct code",
				"When you want to skip error handling",
			],
			correctIndex: 2,
		},
	],
};
