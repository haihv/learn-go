import type { LessonModule } from "../types";

export const gracefulShutdown: LessonModule = {
  type: "lesson",
  id: "61",
  slug: "graceful-shutdown",
  title: "Graceful Shutdown",
  icon: "🛑",
  estimatedMinutes: 12,
  content: `## Graceful Shutdown

A production HTTP server must not be killed abruptly. In-flight requests could be half-written, database connections could be left open, and buffers could be unflushed. **Graceful shutdown** gives the server a chance to finish ongoing work before exiting.

### Why it matters

When Kubernetes sends \`SIGTERM\` (or a user presses Ctrl-C → \`SIGINT\`), your server has a few seconds to:
1. Stop accepting new connections
2. Finish serving requests already in progress
3. Close database connections and flush log buffers

Skip any of these and you risk data corruption, client errors, or zombie connections.

### Registering signal handlers

\`\`\`go
import (
    "os"
    "os/signal"
    "syscall"
)

quit := make(chan os.Signal, 1)
signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
\`\`\`

\`signal.Notify\` delivers matching OS signals to the channel. The buffer size of 1 prevents the signal from being dropped if the program is momentarily busy.

### The canonical shutdown sequence

\`\`\`go
func main() {
    srv := &http.Server{Addr: ":8080", Handler: mux}

    // Start the server in a goroutine so main() can proceed to the signal wait.
    go func() {
        if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
            log.Fatal(err)
        }
    }()

    quit := make(chan os.Signal, 1)
    signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)
    <-quit  // block until a signal arrives

    // Give in-flight requests up to 5 seconds to complete.
    ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
    defer cancel()

    if err := srv.Shutdown(ctx); err != nil {
        log.Fatal("shutdown error:", err)
    }
    log.Println("server stopped cleanly")
}
\`\`\`

### Shutdown vs Close

| Method | Behaviour |
|--------|-----------|
| \`srv.Shutdown(ctx)\` | Stops accepting new connections, waits for active requests to finish (up to the context deadline) |
| \`srv.Close()\` | Immediately closes all connections — use only as a last resort |

Always prefer \`Shutdown\` with a reasonable timeout. \`Close\` is the emergency brake.

### Why ListenAndServe runs in a goroutine

\`ListenAndServe\` blocks until the server is shut down. If you call it in the main goroutine, you can never reach the signal-handling code. Running it in a separate goroutine lets \`main\` proceed to the \`<-quit\` blocking receive.

After \`Shutdown\` is called, \`ListenAndServe\` returns \`http.ErrServerClosed\` — that error is expected, so it's excluded from the fatal check.

### Shutdown context deadline

The \`context.WithTimeout\` passed to \`Shutdown\` controls the **maximum wait time** for in-flight requests. If a request takes longer than the deadline, \`Shutdown\` returns an error and the server closes forcibly. Choose a deadline shorter than your container's termination grace period (typically 30 s in Kubernetes).

### Background worker shutdown

Goroutines doing background work (sending emails, processing queues) should respect context cancellation:

\`\`\`go
func worker(ctx context.Context, wg *sync.WaitGroup) {
    defer wg.Done()
    for {
        select {
        case <-ctx.Done():
            return  // clean exit
        default:
            doWork()
        }
    }
}

// In main:
ctx, cancel := context.WithCancel(context.Background())
var wg sync.WaitGroup
wg.Add(1)
go worker(ctx, &wg)

<-quit
cancel()   // signal workers to stop
wg.Wait()  // wait for them to finish
srv.Shutdown(...)
\`\`\`
`,
  quiz: [
    {
      question: "What is the difference between http.Server.Shutdown and http.Server.Close?",
      options: [
        "Shutdown is for HTTP/1 servers; Close is for HTTP/2 servers",
        "Shutdown gracefully waits for in-flight requests to finish (up to a context deadline); Close immediately terminates all connections",
        "Close is the recommended method; Shutdown is deprecated",
        "There is no functional difference — they are aliases",
      ],
      correctIndex: 1,
    },
    {
      question: "Why must srv.ListenAndServe() be called in a goroutine?",
      options: [
        "ListenAndServe is not goroutine-safe",
        "It makes the server handle more concurrent connections",
        "ListenAndServe blocks until shutdown, so calling it in main() would prevent reaching the signal-handling and Shutdown code",
        "Goroutines are required for all network I/O in Go",
      ],
      correctIndex: 2,
    },
    {
      question: "What does the context passed to srv.Shutdown(ctx) control?",
      options: [
        "How long the server waits for new connections before starting",
        "The maximum time the server will wait for in-flight requests to complete before closing forcibly",
        "The TLS handshake timeout for new connections",
        "The time allowed for the OS signal to be delivered",
      ],
      correctIndex: 1,
    },
  ],
};
