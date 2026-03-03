import type { LessonModule } from "../types";

export const slog: LessonModule = {
  type: "lesson",
  id: "52",
  slug: "slog",
  title: "Structured Logging with slog",
  icon: "📋",
  estimatedMinutes: 13,
  content: `## Structured Logging with slog

Go 1.21 added \`log/slog\` to the standard library — a structured, levelled logger designed to produce machine-parseable output while still being readable by humans.

### Why structured logging?

\`\`\`go
// unstructured: hard to query in a log aggregator
log.Printf("user %d logged in from %s", userID, ip)

// structured: key-value pairs can be indexed and searched
slog.Info("user logged in", "userID", userID, "ip", ip)
\`\`\`

Structured logs let you filter across millions of events with queries like \`userID == 42\` instead of regex scraping.

### Basic usage

The default logger writes to stderr in a human-readable format:

\`\`\`go
slog.Debug("cache miss", "key", "user:42")  // only if level <= Debug
slog.Info("server started", "port", 8080)
slog.Warn("disk usage high", "percent", 87)
slog.Error("db query failed", "err", err)
\`\`\`

Each call takes a message followed by alternating key/value pairs.

### Typed attributes

For performance-sensitive paths, use explicitly typed attributes to avoid reflection:

\`\`\`go
slog.Info("request complete",
    slog.String("method", r.Method),
    slog.Int("status", 200),
    slog.Duration("latency", elapsed),
    slog.Any("headers", r.Header),
)
\`\`\`

\`slog.String\`, \`slog.Int\`, \`slog.Duration\`, \`slog.Any\` — these create \`slog.Attr\` values that carry type information without boxing.

### Creating a custom logger

\`slog.New\` takes a \`Handler\` — the component that formats and writes log records:

\`\`\`go
// JSON output — ideal for log aggregators (Datadog, Splunk, etc.)
jsonHandler := slog.NewJSONHandler(os.Stderr, nil)
jsonLogger := slog.New(jsonHandler)
jsonLogger.Info("user login", "userID", 42)
// {"time":"2024-01-15T10:00:00Z","level":"INFO","msg":"user login","userID":42}

// Text output — human-readable key=value pairs
textHandler := slog.NewTextHandler(os.Stdout, nil)
textLogger := slog.New(textHandler)
textLogger.Info("server started", "port", 8080)
// time=2024-01-15T10:00:00Z level=INFO msg="server started" port=8080
\`\`\`

Pass a \`*slog.HandlerOptions\` as the second argument to customise the minimum level:

\`\`\`go
opts := &slog.HandlerOptions{Level: slog.LevelDebug}
handler := slog.NewJSONHandler(os.Stdout, opts)
logger := slog.New(handler)
\`\`\`

### Log levels

| Level | Value | Use when |
|-------|-------|----------|
| \`slog.LevelDebug\` | -4 | Fine-grained diagnostics |
| \`slog.LevelInfo\` | 0 | Normal operation events |
| \`slog.LevelWarn\` | 4 | Unexpected but recoverable |
| \`slog.LevelError\` | 8 | Errors that need attention |

The default logger's level is Info — Debug messages are dropped unless you set a lower level.

### Setting the default logger

Replace the global default logger with your custom one:

\`\`\`go
slog.SetDefault(slog.New(slog.NewJSONHandler(os.Stdout, nil)))
// now slog.Info(...) writes JSON
\`\`\`

### Adding shared context with \`With\`

\`logger.With\` returns a new logger that attaches fixed attributes to every subsequent log call — perfect for request-scoped fields:

\`\`\`go
func handleRequest(logger *slog.Logger, r *http.Request) {
    // every log call in this handler includes requestID and userID
    log := logger.With(
        "requestID", r.Header.Get("X-Request-ID"),
        "userID", r.Context().Value(userIDKey),
    )

    log.Info("handling request", "path", r.URL.Path)
    // ...
    log.Info("request complete", "status", 200)
}
\`\`\`
`,
  quiz: [
    {
      question: "What is the key advantage of structured logging over fmt.Printf / log.Printf?",
      options: [
        "It is faster to write",
        "Log entries contain typed key-value pairs that can be indexed and queried programmatically",
        "It automatically sends logs to a remote server",
        "It includes stack traces on every line",
      ],
      correctIndex: 1,
    },
    {
      question: "Which slog handler produces output suitable for log aggregators like Datadog or Splunk?",
      options: [
        "slog.NewTextHandler",
        "slog.NewConsoleHandler",
        "slog.NewJSONHandler",
        "slog.NewStructuredHandler",
      ],
      correctIndex: 2,
    },
    {
      question: "What does logger.With(...) return?",
      options: [
        "A new logger that adds the given attributes to every subsequent log call",
        "The same logger with the attributes attached to the next call only",
        "A log entry that must be explicitly emitted",
        "A child context carrying the log attributes",
      ],
      correctIndex: 0,
    },
  ],
};
