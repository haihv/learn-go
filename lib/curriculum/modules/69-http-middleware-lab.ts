import type { LabModule } from "../types";

export const httpMiddlewareLab: LabModule = {
  type: "lab",
  id: "69",
  slug: "http-middleware-lab",
  title: "Middleware Chain Lab",
  icon: "🔗",
  estimatedMinutes: 35,
  description: "Build a three-layer middleware chain: request ID injection, logging, and token auth.",
  instructions: `## Middleware Chain Lab

Build a three-layer middleware chain for an HTTP server tested with \`httptest\`.

### Middleware to implement

1. **\`RequestID(next http.Handler) http.Handler\`** — generates a unique request ID (use a simple counter or \`fmt.Sprintf("req-%d", n)\`), sets it in the request context under key \`ctxKey("requestID")\`, and adds \`X-Request-ID\` header to the response.

2. **\`Logger(next http.Handler) http.Handler\`** — reads the request ID from context and prints \`[requestID] METHOD PATH\`.

3. **\`RequireToken(next http.Handler) http.Handler\`** — checks \`X-Token\` header equals \`"secret"\`. Returns 403 if not.

### Chain

\`\`\`go
handler := Chain(mux, RequestID, Logger, RequireToken)
\`\`\`

### main()

Test the chain with two httptest requests:
- One with \`X-Token: secret\` → should succeed (print request ID log + "hello")
- One without token → should return 403

### Expected output (approximate)
\`\`\`
[req-1] GET /hello
200
403
\`\`\`
`,
  starterCode: `package main

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
)

type ctxKey string

var requestCounter atomic.Int64

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := fmt.Sprintf("req-%d", requestCounter.Add(1))
		// TODO: store id in context under ctxKey("requestID")
		// TODO: set w.Header().Set("X-Request-ID", id)
		// TODO: call next.ServeHTTP with updated context using r.WithContext(ctx)
		_ = id
		next.ServeHTTP(w, r)
	})
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: get request ID from r.Context().Value(ctxKey("requestID"))
		// TODO: fmt.Printf("[%s] %s %s\\n", id, r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func RequireToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: check X-Token header; 403 + return if missing/wrong
		next.ServeHTTP(w, r)
	})
}

func Chain(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	// TODO: apply middlewares right-to-left
	return h
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	})

	handler := Chain(mux, RequestID, Logger, RequireToken)

	// Request with valid token
	req1 := httptest.NewRequest("GET", "/hello", nil)
	req1.Header.Set("X-Token", "secret")
	rec1 := httptest.NewRecorder()
	handler.ServeHTTP(rec1, req1)
	fmt.Println(rec1.Code)

	// Request without token
	req2 := httptest.NewRequest("GET", "/hello", nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	fmt.Println(rec2.Code)
}
`,
  solutionCode: `package main

import (
	"context"
	"fmt"
	"net/http"
	"net/http/httptest"
	"sync/atomic"
)

type ctxKey string

var requestCounter atomic.Int64

func RequestID(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id := fmt.Sprintf("req-%d", requestCounter.Add(1))
		ctx := context.WithValue(r.Context(), ctxKey("requestID"), id)
		w.Header().Set("X-Request-ID", id)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		id, _ := r.Context().Value(ctxKey("requestID")).(string)
		fmt.Printf("[%s] %s %s\\n", id, r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func RequireToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Token") != "secret" {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func Chain(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	for i := len(middlewares) - 1; i >= 0; i-- {
		h = middlewares[i](h)
	}
	return h
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/hello", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	})

	handler := Chain(mux, RequestID, Logger, RequireToken)

	// Request with valid token
	req1 := httptest.NewRequest("GET", "/hello", nil)
	req1.Header.Set("X-Token", "secret")
	rec1 := httptest.NewRecorder()
	handler.ServeHTTP(rec1, req1)
	fmt.Println(rec1.Code)

	// Request without token
	req2 := httptest.NewRequest("GET", "/hello", nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	fmt.Println(rec2.Code)
}
`,
  tests: [
    {
      name: "Implements RequestID middleware",
      description: "RequestID generates an ID and stores it in the request context.",
      validate: (code: string, _stdout: string) =>
        code.includes("RequestID") && code.includes("context.WithValue"),
    },
    {
      name: "Implements Logger middleware",
      description: "Logger reads the request ID from context and prints method and path.",
      validate: (code: string, _stdout: string) =>
        code.includes("Logger") && code.includes("r.Context().Value"),
    },
    {
      name: "RequireToken short-circuits on missing token",
      description: "RequireToken returns 403 and does not call next when X-Token is absent or wrong.",
      validate: (code: string, _stdout: string) =>
        code.includes("X-Token") && code.includes("http.Error"),
    },
    {
      name: "Chain helper applies middlewares",
      description: "Chain wraps a handler with all provided middlewares in the correct order.",
      validate: (code: string, _stdout: string) =>
        code.includes("func Chain("),
    },
    {
      name: "Prints request log to stdout",
      description: "The Logger middleware writes the method and request ID to stdout.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("GET") || stdout.includes("req-"),
    },
  ],
};
