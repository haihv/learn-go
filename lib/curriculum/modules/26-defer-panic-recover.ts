import type { LessonModule } from "../types";

export const deferPanicRecover: LessonModule = {
	type: "lesson",
	id: "26",
	slug: "defer-panic-recover",
	title: "Defer, Panic, and Recover",
	icon: "🛟",
	estimatedMinutes: 14,
	content: `# Defer, Panic, and Recover

## defer

A \`defer\` statement schedules a function call to run at the moment the surrounding function returns — whether it returns normally, returns early, or panics. The deferred call is not executed immediately; it is pushed onto a stack and runs when the function exits.

\`\`\`go
package main

import "fmt"

func greet() {
	defer fmt.Println("goodbye") // runs last
	fmt.Println("hello")
}

func main() {
	greet()
	// Output:
	// hello
	// goodbye
}
\`\`\`

### Argument Evaluation Is Immediate

A deferred call's **arguments are evaluated right away**, even though the call itself is deferred. Only the execution is postponed:

\`\`\`go
package main

import "fmt"

func main() {
	x := 10
	defer fmt.Println("deferred x:", x) // x is evaluated now — captures 10
	x = 20
	fmt.Println("current x:", x) // 20
	// Output:
	// current x: 20
	// deferred x: 10
}
\`\`\`

### LIFO Order for Multiple Defers

When multiple \`defer\` statements appear in the same function, they execute in **last in, first out (LIFO)** order — like a stack. The last \`defer\` to be registered runs first:

\`\`\`go
package main

import "fmt"

func main() {
	defer fmt.Println("first deferred — runs last")
	defer fmt.Println("second deferred — runs second")
	defer fmt.Println("third deferred — runs first")
	fmt.Println("function body")
	// Output:
	// function body
	// third deferred — runs first
	// second deferred — runs second
	// first deferred — runs last
}
\`\`\`

### Classic defer Use Cases

**Resource cleanup.** \`defer\` guarantees a resource is closed even if an early return or error occurs:

\`\`\`go
package main

import (
	"fmt"
	"os"
)

func readFile(name string) error {
	f, err := os.Open(name)
	if err != nil {
		return fmt.Errorf("readFile: %w", err)
	}
	defer f.Close() // always runs when readFile returns

	// read from f ...
	return nil
}
\`\`\`

**Mutex unlock.** Pairing \`Lock\` with a deferred \`Unlock\` prevents deadlocks from forgotten unlocks:

\`\`\`go
mu.Lock()
defer mu.Unlock()
// critical section
\`\`\`

**WaitGroup done.** Ensures the counter is decremented even if the goroutine returns early:

\`\`\`go
func worker(wg *sync.WaitGroup) {
	defer wg.Done()
	// do work
}
\`\`\`

## panic

\`panic\` immediately stops the current function, runs any deferred functions in that function, then unwinds the call stack — running deferred functions at each frame — until the entire goroutine terminates. If no \`recover\` is in place, the program crashes with a stack trace.

\`\`\`go
package main

import "fmt"

func mustPositive(n int) int {
	if n <= 0 {
		// panic signals a programmer mistake — the caller passed an invalid argument
		panic(fmt.Sprintf("mustPositive: got %d, want > 0", n))
	}
	return n
}

func main() {
	fmt.Println(mustPositive(5))  // 5
	fmt.Println(mustPositive(-1)) // panics
}
\`\`\`

Panics carry a value — typically a string or an \`error\`. Deferred functions **still run** even during a panic, so cleanup code protected by \`defer\` is always executed.

## recover

\`recover()\` stops a panic and returns the panic value. It has one strict rule: it must be called **inside a deferred function** — calling it anywhere else is a no-op.

\`\`\`go
package main

import "fmt"

func safeDiv(a, b int) (result int, err error) {
	// deferred function runs on both normal return and panic
	defer func() {
		if r := recover(); r != nil {
			// turn the panic into a regular error so callers can handle it
			err = fmt.Errorf("recovered panic: %v", r)
		}
	}()

	return a / b, nil // panics if b == 0
}

func main() {
	result, err := safeDiv(10, 2)
	fmt.Println(result, err) // 5 <nil>

	result, err = safeDiv(10, 0)
	fmt.Println(result, err) // 0 recovered panic: runtime error: integer divide by zero
}
\`\`\`

The idiom \`defer func() { if r := recover(); r != nil { ... } }()\` is the standard recover pattern. Note the immediately-invoked function literal — the \`()\` at the end is required.

### What recover Returns

\`recover()\` returns \`nil\` when there is no active panic. The pattern \`if r := recover(); r != nil\` therefore distinguishes a real panic from a normal return.

## When NOT to Panic

The most important rule: **use error returns for anything that could realistically fail at runtime**. Panic is appropriate only in a narrow set of situations:

| Appropriate | Inappropriate |
|---|---|
| Invariant violated that proves a bug | File not found |
| \`Must\`-style init functions (e.g. \`regexp.MustCompile\`) | Network timeout |
| Nil receiver where nil is never valid | Invalid user input |
| Index into a slice where the index is programmer-controlled | Database query failure |

When in doubt, return an error. Panics that escape package boundaries are surprising to callers and make APIs hard to reason about.
`,
	quiz: [
		{
			question: "In what order do multiple deferred functions run?",
			options: [
				"First in, first out (FIFO)",
				"Last in, first out (LIFO)",
				"Alphabetical order",
				"Random order",
			],
			correctIndex: 1,
		},
		{
			question: "Where must recover() be called to catch a panic?",
			options: [
				"In the main function",
				"In any goroutine",
				"Inside a deferred function",
				"Before the panic occurs",
			],
			correctIndex: 2,
		},
		{
			question: "When is a defer statement's argument evaluated?",
			options: [
				"When the deferred function executes",
				"When the function returns",
				"Immediately when the defer statement is encountered",
				"At program start",
			],
			correctIndex: 2,
		},
	],
};
