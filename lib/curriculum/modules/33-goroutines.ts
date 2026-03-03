import { LessonModule } from "../types";

export const goroutines: LessonModule = {
  type: "lesson",
  id: "33",
  slug: "goroutines",
  title: "Goroutines & Channels",
  icon: "⚡",
  estimatedMinutes: 16,
  content: `## Goroutines & Channels

### Goroutines

A goroutine is a lightweight thread managed by the Go runtime. You start one by prefixing a function call with \`go\`:

\`\`\`go
package main

import (
    "fmt"
    "time"
)

func greet(name string) {
    fmt.Println("Hello,", name)
}

func main() {
    go greet("Alice")
    go greet("Bob")
    time.Sleep(100 * time.Millisecond) // main must wait, or the program exits before goroutines run
}
\`\`\`

Goroutines are extremely cheap — you can spawn thousands without issue. The key point: if \`main\` returns, all goroutines are killed immediately.

### Channels

Channels are typed conduits that let goroutines communicate safely. Create one with \`make\`:

\`\`\`go
ch := make(chan int)
\`\`\`

Send a value with \`ch <- value\`, and receive with \`value := <-ch\`. Channels synchronize the sender and receiver — both block until the other side is ready.

\`\`\`go
package main

import "fmt"

func sum(a, b int, ch chan int) {
    ch <- a + b
}

func main() {
    ch := make(chan int)
    go sum(3, 4, ch)
    result := <-ch
    fmt.Println("Sum:", result) // Sum: 7
}
\`\`\`

This example is complete and runnable: the main goroutine blocks on \`<-ch\` until \`sum\` sends its result.

### Buffered Channels

A buffered channel accepts sends without a matching receiver — up to its capacity:

\`\`\`go
ch := make(chan int, 5) // buffer of 5
ch <- 1                 // does not block
ch <- 2                 // does not block
fmt.Println(<-ch)       // 1
\`\`\`

Unbuffered channels block on every send until a receiver is ready. Buffered channels only block when the buffer is full (send) or empty (receive).

### The \`select\` Statement

\`select\` is like a \`switch\` for channel operations — it waits for whichever case is ready first:

\`\`\`go
package main

import "fmt"

func main() {
    ch1 := make(chan string, 1)
    ch2 := make(chan string, 1)

    ch1 <- "one"

    select {
    case msg := <-ch1:
        fmt.Println("Received from ch1:", msg)
    case msg := <-ch2:
        fmt.Println("Received from ch2:", msg)
    default:
        fmt.Println("No channel ready")
    }
}
\`\`\`

If multiple cases are ready simultaneously, Go picks one at random. The \`default\` case runs immediately if no channel is ready, avoiding a block.

### \`sync.WaitGroup\`

\`time.Sleep\` is a poor way to wait for goroutines. The idiomatic solution is \`sync.WaitGroup\`:

\`\`\`go
package main

import (
    "fmt"
    "sync"
)

func worker(id int, wg *sync.WaitGroup) {
    defer wg.Done() // signals completion when this function returns
    fmt.Printf("Worker %d done\\n", id)
}

func main() {
    var wg sync.WaitGroup

    for i := 1; i <= 3; i++ {
        wg.Add(1) // increment counter before launching goroutine
        go worker(i, &wg)
    }

    wg.Wait() // blocks until counter reaches zero
    fmt.Println("All workers finished")
}
\`\`\`

- \`wg.Add(n)\` — increment the counter by n before launching goroutines
- \`wg.Done()\` — decrement the counter (always use with \`defer\`)
- \`wg.Wait()\` — block until the counter reaches zero

### Channel Directions

Function signatures can constrain a channel to send-only or receive-only, preventing accidental misuse:

\`\`\`go
// producer can only send — prevents accidental receives inside producer
func produce(ch chan<- int) {
    for i := 0; i < 5; i++ {
        ch <- i
    }
    close(ch)
}

// consumer can only receive — prevents accidental sends inside consumer
func consume(ch <-chan int) {
    for v := range ch {
        fmt.Println(v)
    }
}
\`\`\`

| Syntax | Meaning |
|--------|---------|
| \`chan T\` | Bidirectional (read and write) |
| \`chan<- T\` | Send-only |
| \`<-chan T\` | Receive-only |

Directional channels improve safety and serve as documentation — the signature tells you exactly how the channel is used.

### sync.Mutex

When multiple goroutines share mutable state, protect it with a \`sync.Mutex\`:

\`\`\`go
package main

import (
    "fmt"
    "sync"
)

type SafeCounter struct {
    mu sync.Mutex
    n  int
}

func (c *SafeCounter) Inc() {
    c.mu.Lock()
    defer c.mu.Unlock() // always pair Lock with deferred Unlock
    c.n++
}

func main() {
    counter := &SafeCounter{}
    var wg sync.WaitGroup
    for i := 0; i < 1000; i++ {
        wg.Add(1)
        go func() {
            defer wg.Done()
            counter.Inc()
        }()
    }
    wg.Wait()
    fmt.Println(counter.n) // always 1000
}
\`\`\`

The \`defer c.mu.Unlock()\` pattern ensures the mutex is always released, even if the function returns early or panics.

### Goroutine Leaks

A goroutine that is never able to complete is a **goroutine leak** — it consumes memory and CPU indefinitely. The most common cause is a goroutine blocked on a channel receive when no sender will ever send:

\`\`\`go
// leak: goroutine blocks forever if nobody reads from ch
func leaky() {
    ch := make(chan int)
    go func() { ch <- 1 }()  // goroutine leaks if we don't receive
    // forgot to receive from ch
}
\`\`\`

To prevent leaks: always ensure goroutines have a way to exit — use a \`done\` channel, a \`context.Context\` cancellation, or close the channel when work is complete.
`,
  quiz: [
    {
      question: "In a channel type `chan<- int`, what does `chan<-` mean?",
      options: [
        "Receive-only channel",
        "Bidirectional channel",
        "Send-only channel",
        "Buffered channel",
      ],
      correctIndex: 2,
    },
    {
      question: "What does a `select` statement do?",
      options: [
        "Selects a random goroutine to run",
        "Waits for the first ready channel operation among its cases",
        "Loops through all channel cases",
        "Blocks until all channels are ready",
      ],
      correctIndex: 1,
    },
    {
      question: "Which WaitGroup methods are used to track goroutines?",
      options: [
        "Start, Stop, Finish",
        "Add, Done, Wait",
        "Begin, End, Join",
        "Fork, Join, Sync",
      ],
      correctIndex: 1,
    },
  ],
};
