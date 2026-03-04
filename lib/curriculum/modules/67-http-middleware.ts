import type { LessonModule } from "../types";

export const httpMiddleware: LessonModule = {
  type: "lesson",
  id: "67",
  slug: "http-middleware",
  title: "HTTP Middleware",
  icon: "🔗",
  estimatedMinutes: 14,
  content: `## HTTP Middleware

### What is middleware?

Middleware wraps an \`http.Handler\` to add cross-cutting behaviour — logging, authentication, rate-limiting, CORS — without polluting route handlers.

The signature every Go middleware follows:
\`\`\`go
func MyMiddleware(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        // before: run setup / checks
        next.ServeHTTP(w, r)  // call the next handler
        // after: run cleanup / logging
    })
}
\`\`\`

\`http.HandlerFunc\` is a function type that implements \`http.Handler\` — it lets you turn any compatible function into a handler.

### Logging middleware

\`\`\`go
func Logger(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        start := time.Now()
        next.ServeHTTP(w, r)
        fmt.Printf("%s %s %s\\n", r.Method, r.URL.Path, time.Since(start))
    })
}
\`\`\`

### Auth middleware

\`\`\`go
func RequireToken(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        if r.Header.Get("X-Token") != "secret" {
            http.Error(w, "forbidden", http.StatusForbidden)
            return  // short-circuit — do not call next
        }
        next.ServeHTTP(w, r)
    })
}
\`\`\`

Short-circuiting (returning before calling \`next.ServeHTTP\`) is how middleware rejects requests.

### Chaining middleware

Apply multiple middlewares by nesting them:
\`\`\`go
http.ListenAndServe(":8080", Logger(RequireToken(mux)))
\`\`\`

Or write a \`Chain\` helper:
\`\`\`go
func Chain(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
    for i := len(middlewares) - 1; i >= 0; i-- {
        h = middlewares[i](h)
    }
    return h
}

// usage
handler := Chain(mux, Logger, RequireToken)
\`\`\`

Middlewares are applied right-to-left so that the leftmost runs first on incoming requests.

### Capturing the response status

To log the status code, wrap \`ResponseWriter\` in a recorder:
\`\`\`go
type statusRecorder struct {
    http.ResponseWriter
    status int
}

func (r *statusRecorder) WriteHeader(code int) {
    r.status = code
    r.ResponseWriter.WriteHeader(code)
}
\`\`\`

Then in the middleware:
\`\`\`go
rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
next.ServeHTTP(rec, r)
fmt.Printf("status: %d\\n", rec.status)
\`\`\`

### Passing values through context

Middleware can attach request-scoped values for downstream handlers:
\`\`\`go
type ctxKey string

func WithUserID(next http.Handler) http.Handler {
    return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
        userID := r.Header.Get("X-User-ID")
        ctx := context.WithValue(r.Context(), ctxKey("userID"), userID)
        next.ServeHTTP(w, r.WithContext(ctx))
    })
}

// In handler:
userID := r.Context().Value(ctxKey("userID")).(string)
\`\`\`

### http.StripPrefix and http.TimeoutHandler

Standard library provides ready-made middleware:
\`\`\`go
// Strip /api prefix before routing
http.Handle("/api/", http.StripPrefix("/api", mux))

// Kill slow handlers after 5 seconds
http.Handle("/slow", http.TimeoutHandler(slowHandler, 5*time.Second, "timeout"))
\`\`\`
`,
  quiz: [
    {
      question: "What is the standard Go middleware signature?",
      options: [
        "func(w http.ResponseWriter, r *http.Request)",
        "func(http.Handler) http.Handler",
        "func(next http.HandlerFunc) http.HandlerFunc",
        "type Middleware interface { Wrap(http.Handler) http.Handler }",
      ],
      correctIndex: 1,
    },
    {
      question: "How does middleware short-circuit a request (prevent the next handler from running)?",
      options: [
        "Call next.ServeHTTP with a nil request",
        "Set a special header on the response",
        "Return from the middleware function before calling next.ServeHTTP",
        "Panic with http.ErrAbortHandler",
      ],
      correctIndex: 2,
    },
    {
      question: "Why is http.HandlerFunc useful in middleware?",
      options: [
        "It is faster than implementing ServeHTTP directly",
        "It converts a plain function with the right signature into an http.Handler, avoiding the need to define a new struct",
        "It provides automatic error recovery",
        "It is required by the http package — custom handlers won't work without it",
      ],
      correctIndex: 1,
    },
  ],
};
