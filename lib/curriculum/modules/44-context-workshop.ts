import type { WorkshopModule } from "../types";

export const contextWorkshop: WorkshopModule = {
  type: "workshop",
  id: "44",
  slug: "context-workshop",
  title: "Context Workshop",
  icon: "🔗",
  estimatedMinutes: 22,
  description: "Practice cancellation, timeouts, and value passing with context.Context.",
  steps: [
    {
      instruction:
        "Cancel a goroutine via `ctx.Done()`. Create a context with `context.WithCancel`, launch a goroutine that loops forever printing \"working...\" every 50 ms until `<-ctx.Done()`, then after 150 ms call `cancel()` from main and wait for the goroutine to finish using a `sync.WaitGroup`.",
      starterCode: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func worker(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			fmt.Println("worker stopped:", ctx.Err())
			return
		default:
			fmt.Println("working...")
			time.Sleep(50 * time.Millisecond)
		}
	}
}

func main() {
	// TODO: create a context with WithCancel
	// TODO: launch worker goroutine with WaitGroup
	// TODO: sleep 150ms, then call cancel()
	// TODO: wait for goroutine to finish
	_ = context.WithCancel
	_ = worker
}
`,
      hint: `package main

import (
	"context"
	"fmt"
	"sync"
	"time"
)

func worker(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			fmt.Println("worker stopped:", ctx.Err())
			return
		default:
			fmt.Println("working...")
			time.Sleep(50 * time.Millisecond)
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())
	var wg sync.WaitGroup
	wg.Add(1)
	go worker(ctx, &wg)

	time.Sleep(150 * time.Millisecond)
	cancel()
	wg.Wait()
	fmt.Println("main done")
}
`,
      validate: (code: string) =>
        code.includes("context.WithCancel") &&
        code.includes("cancel()") &&
        code.includes("ctx.Done()"),
      successMessage:
        "context.WithCancel is the building block for all cancellation — every derived context (WithTimeout, WithDeadline) is built on this mechanism.",
    },
    {
      instruction:
        "Add a timeout to a slow operation. Write a `slowQuery` function that takes a `context.Context` and simulates a 500 ms database query using `time.After`. Use `context.WithTimeout` with a 200 ms budget in main. Print whether it succeeded or timed out.",
      starterCode: `package main

import (
	"context"
	"fmt"
	"time"
)

func slowQuery(ctx context.Context) (string, error) {
	select {
	case <-time.After(500 * time.Millisecond):
		return "data", nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

func main() {
	// TODO: create a context with 200ms timeout
	// TODO: call slowQuery and print the result
	// TODO: defer cancel()
	_ = context.WithTimeout
	_ = slowQuery
}
`,
      hint: `package main

import (
	"context"
	"fmt"
	"time"
)

func slowQuery(ctx context.Context) (string, error) {
	select {
	case <-time.After(500 * time.Millisecond):
		return "data", nil
	case <-ctx.Done():
		return "", ctx.Err()
	}
}

func main() {
	ctx, cancel := context.WithTimeout(context.Background(), 200*time.Millisecond)
	defer cancel()

	result, err := slowQuery(ctx)
	if err != nil {
		fmt.Println("query failed:", err)
	} else {
		fmt.Println("query result:", result)
	}
}
`,
      validate: (code: string) =>
        code.includes("context.WithTimeout") &&
        code.includes("ctx.Done()"),
      successMessage:
        "WithTimeout is WithDeadline(time.Now().Add(d)) — both fire ctx.Done() and set ctx.Err() to context.DeadlineExceeded when the time expires.",
    },
    {
      instruction:
        "Pass a request ID through the context. Define an unexported `contextKey` type and a `requestIDKey` constant. Write `withRequestID(ctx, id)` that stores the ID with `context.WithValue`, and `requestID(ctx)` that retrieves it. In main, create a context with a request ID and pass it through two helper functions that each log the ID.",
      starterCode: `package main

import (
	"context"
	"fmt"
)

// TODO: define unexported key type and constant
// type contextKey string
// const requestIDKey contextKey = "requestID"

// TODO: write withRequestID(ctx context.Context, id string) context.Context

// TODO: write requestID(ctx context.Context) string

func handleRequest(ctx context.Context) {
	fmt.Println("handleRequest, requestID:", requestID(ctx))
	processData(ctx)
}

func processData(ctx context.Context) {
	fmt.Println("processData, requestID:", requestID(ctx))
}

func requestID(ctx context.Context) string {
	// placeholder — replace with real implementation
	return ""
}

func main() {
	ctx := context.Background()
	// TODO: add a request ID "req-42" to ctx
	// TODO: call handleRequest with ctx
	_ = withRequestID
	handleRequest(ctx)
}

func withRequestID(ctx context.Context, id string) context.Context {
	return ctx // placeholder
}
`,
      hint: `package main

import (
	"context"
	"fmt"
)

type contextKey string

const requestIDKey contextKey = "requestID"

func withRequestID(ctx context.Context, id string) context.Context {
	return context.WithValue(ctx, requestIDKey, id)
}

func requestID(ctx context.Context) string {
	id, _ := ctx.Value(requestIDKey).(string)
	return id
}

func handleRequest(ctx context.Context) {
	fmt.Println("handleRequest, requestID:", requestID(ctx))
	processData(ctx)
}

func processData(ctx context.Context) {
	fmt.Println("processData, requestID:", requestID(ctx))
}

func main() {
	ctx := context.Background()
	ctx = withRequestID(ctx, "req-42")
	handleRequest(ctx)
}
`,
      validate: (code: string) =>
        code.includes("context.WithValue") &&
        code.includes("ctx.Value("),
      successMessage:
        "The unexported key type is the key insight — it ensures your context values can't be accidentally overwritten or read by code in other packages using the same string.",
    },
  ],
};
