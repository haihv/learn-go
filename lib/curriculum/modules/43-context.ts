import type { LessonModule } from "../types";

export const contextModule: LessonModule = {
  type: "lesson",
  id: "43",
  slug: "context",
  title: "context.Context",
  icon: "🔗",
  estimatedMinutes: 13,
  content: `## context.Context

The \`context\` package provides a way to carry deadlines, cancellation signals, and request-scoped values across API boundaries and goroutine trees.

### Why context exists

Without context, cancelling a deep chain of goroutines requires custom done-channels threaded through every function. The \`context.Context\` interface standardises this so any library or handler can participate in cancellation using the same mechanism.

### The Root Contexts

Always start a context chain from one of the two root constructors:

\`\`\`go
ctx := context.Background()  // top-level; never nil, never cancelled
ctx := context.TODO()        // placeholder when you haven't decided the right context yet
\`\`\`

\`context.Background()\` is used in \`main\`, top-level handlers, and tests. \`context.TODO()\` signals that code needs to be updated to accept a real context.

### Cancellation with \`WithCancel\`

\`context.WithCancel\` returns a child context and a \`cancel\` function. Calling \`cancel()\` closes the \`ctx.Done()\` channel, signalling every goroutine that holds the context:

\`\`\`go
ctx, cancel := context.WithCancel(context.Background())
defer cancel() // always call cancel to release resources

go func() {
    select {
    case <-ctx.Done():
        fmt.Println("goroutine cancelled:", ctx.Err())
        return
    case result := <-work:
        fmt.Println("result:", result)
    }
}()
\`\`\`

\`ctx.Err()\` returns \`context.Canceled\` when cancelled manually, and \`context.DeadlineExceeded\` when a deadline expires.

### Deadlines and Timeouts

\`WithTimeout\` and \`WithDeadline\` automatically cancel the context after a duration or at a fixed point in time:

\`\`\`go
// cancel after 2 seconds
ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
defer cancel()

// cancel at a specific time
deadline := time.Now().Add(2 * time.Second)
ctx, cancel := context.WithDeadline(context.Background(), deadline)
defer cancel()
\`\`\`

Always \`defer cancel()\` even with timeouts — the parent context may be cancelled before the timeout fires, and calling cancel releases resources immediately.

\`\`\`go
package main

import (
    "context"
    "fmt"
    "time"
)

func slowOp(ctx context.Context) error {
    select {
    case <-time.After(500 * time.Millisecond):
        return nil
    case <-ctx.Done():
        return ctx.Err()
    }
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 100*time.Millisecond)
    defer cancel()

    if err := slowOp(ctx); err != nil {
        fmt.Println("timed out:", err) // timed out: context deadline exceeded
    }
}
\`\`\`

### Passing Values with \`WithValue\`

\`context.WithValue\` stores a key/value pair in the context chain. Use it for request-scoped data like trace IDs and user IDs — not for optional parameters:

\`\`\`go
// unexported key type prevents collisions with other packages
type contextKey string

const requestIDKey contextKey = "requestID"

func withRequestID(ctx context.Context, id string) context.Context {
    return context.WithValue(ctx, requestIDKey, id)
}

func getRequestID(ctx context.Context) string {
    id, _ := ctx.Value(requestIDKey).(string)
    return id
}
\`\`\`

**Always use an unexported custom key type** (not a plain string). Using \`string\` as a key type risks collisions if another package stores a value under the same string key.

### The ctx-first convention

By convention, \`ctx\` is always the first parameter of any function that accepts a context:

\`\`\`go
func fetchUser(ctx context.Context, userID int) (*User, error) { ... }
func processOrder(ctx context.Context, orderID string) error { ... }
\`\`\`

Contexts flow top-down through the call chain. **Never store a context in a struct** — pass it explicitly so the call graph is always clear.

### Propagation through call chains

\`\`\`go
func handleRequest(ctx context.Context) {
    // create a 5-second budget for the entire request
    ctx, cancel := context.WithTimeout(ctx, 5*time.Second)
    defer cancel()

    data, err := fetchFromDB(ctx)   // passes same deadline
    if err != nil { return }

    result, err := callService(ctx, data)  // same deadline, less time remaining
    _ = result
}
\`\`\`

Child contexts inherit the parent's deadline. If the parent times out first, all children are cancelled automatically.
`,
  quiz: [
    {
      question: "What does `defer cancel()` do when used with `context.WithCancel`?",
      options: [
        "Cancels the context after the current function returns, releasing resources",
        "Cancels the context immediately when the line is reached",
        "Schedules the context to expire after 1 second",
        "Marks the context as done without releasing resources",
      ],
      correctIndex: 0,
    },
    {
      question: "Why should you use an unexported custom type as a context key instead of a plain string?",
      options: [
        "Custom types are faster to look up in the context chain",
        "Plain strings are not allowed by the context package",
        "It prevents key collisions with values stored by other packages",
        "Context values require comparable types, and strings are not comparable",
      ],
      correctIndex: 2,
    },
    {
      question: "What does `ctx.Err()` return when a context times out?",
      options: [
        "context.Canceled",
        "context.DeadlineExceeded",
        "io.EOF",
        "nil",
      ],
      correctIndex: 1,
    },
  ],
};
