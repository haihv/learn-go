import type { LessonModule } from "../types";

export const concurrencyPatterns: LessonModule = {
  type: "lesson",
  id: "50",
  slug: "concurrency-patterns",
  title: "Concurrency Patterns",
  icon: "🔀",
  estimatedMinutes: 16,
  content: `## Concurrency Patterns

These recurring patterns show up in nearly every real Go codebase. Recognising and applying them correctly is a key sign of Go fluency.

### Pipeline

A pipeline connects processing stages with channels. Each stage reads from its input channel and writes to its output channel. The stages run concurrently:

\`\`\`go
package main

import "fmt"

// generate sends values on a new channel and closes it when done
func generate(nums ...int) <-chan int {
    out := make(chan int)
    go func() {
        for _, n := range nums {
            out <- n
        }
        close(out)
    }()
    return out
}

// square reads from in, squares each value, sends on out
func square(in <-chan int) <-chan int {
    out := make(chan int)
    go func() {
        for n := range in {
            out <- n * n
        }
        close(out)
    }()
    return out
}

func main() {
    nums := generate(2, 3, 4)
    squares := square(nums)

    for v := range squares {
        fmt.Println(v) // 4 9 16
    }
}
\`\`\`

Each stage function returns a channel — this composable signature is the hallmark of the pipeline pattern.

### Fan-Out / Fan-In

**Fan-out** distributes work from one channel across multiple goroutines. **Fan-in** merges multiple channels back into one:

\`\`\`go
// fanOut launches n workers, each reading from in
func fanOut(in <-chan int, n int) []<-chan int {
    outs := make([]<-chan int, n)
    for i := 0; i < n; i++ {
        outs[i] = square(in) // each worker reads the same channel
    }
    return outs
}

// merge combines multiple channels into a single output channel
func merge(cs ...<-chan int) <-chan int {
    out := make(chan int)
    var wg sync.WaitGroup
    for _, c := range cs {
        wg.Add(1)
        go func(ch <-chan int) {
            defer wg.Done()
            for v := range ch {
                out <- v
            }
        }(c)
    }
    go func() {
        wg.Wait()
        close(out) // close output only after all inputs are drained
    }()
    return out
}
\`\`\`

### Worker Pool

A worker pool keeps a fixed number of goroutines alive, each reading from a shared jobs channel. This bounds resource usage regardless of how many jobs arrive:

\`\`\`go
package main

import (
    "fmt"
    "sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
    defer wg.Done()
    for j := range jobs {
        results <- j * j
        fmt.Printf("worker %d processed job %d\\n", id, j)
    }
}

func main() {
    const numWorkers = 3
    jobs := make(chan int, 10)
    results := make(chan int, 10)
    var wg sync.WaitGroup

    for w := 1; w <= numWorkers; w++ {
        wg.Add(1)
        go worker(w, jobs, results, &wg)
    }

    for j := 1; j <= 9; j++ {
        jobs <- j
    }
    close(jobs) // signal workers: no more jobs

    go func() {
        wg.Wait()
        close(results)
    }()

    for r := range results {
        fmt.Println("result:", r)
    }
}
\`\`\`

Key insight: closing \`jobs\` causes all workers' \`for range\` loops to exit cleanly. The WaitGroup-controlled closer then shuts down the results channel.

### errgroup

\`golang.org/x/sync/errgroup\` is the idiomatic replacement for a WaitGroup when goroutines can fail:

\`\`\`go
import "golang.org/x/sync/errgroup"

func fetchAll(ctx context.Context, urls []string) error {
    g, ctx := errgroup.WithContext(ctx)

    for _, url := range urls {
        url := url // capture loop variable
        g.Go(func() error {
            return fetch(ctx, url) // cancelled if any goroutine errors
        })
    }

    return g.Wait() // returns first non-nil error, waits for all goroutines
}
\`\`\`

\`g.Go\` launches a goroutine. \`g.Wait()\` blocks until all goroutines finish and returns the first error encountered. The \`errgroup.WithContext\` context is cancelled as soon as any goroutine returns an error.

### Timeout with context (tying it together)

Context cancellation composes naturally with select and channels:

\`\`\`go
func fetchWithTimeout(ctx context.Context, url string) ([]byte, error) {
    ctx, cancel := context.WithTimeout(ctx, 3*time.Second)
    defer cancel()

    result := make(chan []byte, 1)
    go func() {
        data, _ := http.Get(url) // simplified
        result <- data
    }()

    select {
    case data := <-result:
        return data, nil
    case <-ctx.Done():
        return nil, ctx.Err()
    }
}
\`\`\`

This pattern — a buffered result channel, a goroutine doing work, and a select watching both the result and \`ctx.Done()\` — appears throughout the Go standard library and ecosystem.
`,
  quiz: [
    {
      question: "In a pipeline, what is the key property of each stage's function signature?",
      options: [
        "Each stage takes a slice and returns a slice",
        "Each stage accepts a context as its first parameter",
        "Each stage reads from one channel and returns a new channel",
        "Each stage must run in its own goroutine",
      ],
      correctIndex: 2,
    },
    {
      question: "In a worker pool, why do you close the jobs channel after sending all jobs?",
      options: [
        "To prevent new goroutines from sending to it",
        "It signals workers that no more jobs are coming, causing their for-range loops to exit",
        "Channels must be closed before the program can exit",
        "To flush any buffered jobs to the workers",
      ],
      correctIndex: 1,
    },
    {
      question: "What does errgroup.Wait() return?",
      options: [
        "A slice of all errors from all goroutines",
        "The last error returned by any goroutine",
        "The first non-nil error returned by any goroutine, after all goroutines finish",
        "nil if any goroutine succeeded, error only if all failed",
      ],
      correctIndex: 2,
    },
  ],
};
