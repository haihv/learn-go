import type { WorkshopModule } from "../types";

export const httpMiddlewareWorkshop: WorkshopModule = {
  type: "workshop",
  id: "68",
  slug: "http-middleware-workshop",
  title: "HTTP Middleware Workshop",
  icon: "🔗",
  estimatedMinutes: 22,
  description: "Write logging and auth middleware, chain them, and capture response status codes.",
  steps: [
    {
      instruction:
        "Write a `Logger` middleware that prints `METHOD PATH` before calling `next.ServeHTTP`. Use `httptest.NewRecorder()` and `httptest.NewRequest` to test it without starting a real server. Print the request info from inside the middleware.",
      starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: print r.Method and r.URL.Path
		next.ServeHTTP(w, r)
	})
}

func main() {
	final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "ok")
	})

	handler := Logger(final)

	req := httptest.NewRequest("GET", "/hello", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
}
`,
      hint: "fmt.Printf(\"%s %s\\\\n\", r.Method, r.URL.Path) before calling next",
      validate: (code: string) =>
        code.includes("func Logger(next http.Handler)") &&
        code.includes("next.ServeHTTP"),
      successMessage:
        "Logger wraps any handler. Because it calls next.ServeHTTP, it transparently passes control to downstream handlers after logging.",
    },
    {
      instruction:
        "Write a `RequireToken` middleware that reads the `X-Token` header. If it equals `\"secret\"`, call next; otherwise respond 403 and return. Test with both valid and invalid tokens using httptest.",
      starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func RequireToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		// TODO: get r.Header.Get("X-Token")
		// if != "secret": http.Error(w, "forbidden", 403) and return
		// else: call next.ServeHTTP
	})
}

func main() {
	final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "welcome")
	})
	handler := RequireToken(final)

	// Valid token
	req1 := httptest.NewRequest("GET", "/", nil)
	req1.Header.Set("X-Token", "secret")
	rec1 := httptest.NewRecorder()
	handler.ServeHTTP(rec1, req1)
	fmt.Println(rec1.Code, rec1.Body.String())

	// Invalid token
	req2 := httptest.NewRequest("GET", "/", nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	fmt.Println(rec2.Code)
}
`,
      hint: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func RequireToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Token") != "secret" {
			http.Error(w, "forbidden", http.StatusForbidden)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func main() {
	final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "welcome")
	})
	handler := RequireToken(final)

	req1 := httptest.NewRequest("GET", "/", nil)
	req1.Header.Set("X-Token", "secret")
	rec1 := httptest.NewRecorder()
	handler.ServeHTTP(rec1, req1)
	fmt.Println(rec1.Code, rec1.Body.String())

	req2 := httptest.NewRequest("GET", "/", nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	fmt.Println(rec2.Code)
}
`,
      validate: (code: string) =>
        code.includes("X-Token") &&
        code.includes("http.Error") &&
        code.includes("return"),
      successMessage:
        "Returning before calling next.ServeHTTP short-circuits the chain. The 403 is written and the downstream handler never runs.",
    },
    {
      instruction:
        "Write a `Chain(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler` helper that applies middlewares right-to-left. Chain Logger and RequireToken around a final handler, then test with a valid token request.",
      starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func Logger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Println("log:", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func RequireToken(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Header.Get("X-Token") != "secret" {
			http.Error(w, "forbidden", 403)
			return
		}
		next.ServeHTTP(w, r)
	})
}

func Chain(h http.Handler, middlewares ...func(http.Handler) http.Handler) http.Handler {
	// TODO: apply middlewares right-to-left (last in = outermost wrap)
	return h
}

func main() {
	final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	})

	handler := Chain(final, Logger, RequireToken)

	req := httptest.NewRequest("GET", "/api", nil)
	req.Header.Set("X-Token", "secret")
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	fmt.Println(rec.Code)
}
`,
      hint: `for i := len(middlewares) - 1; i >= 0; i-- { h = middlewares[i](h) }`,
      validate: (code: string) =>
        code.includes("func Chain(") &&
        (code.includes("len(middlewares)") || code.includes("range middlewares")),
      successMessage:
        "Applying middlewares in reverse order means the first argument is outermost: Logger runs before RequireToken for incoming requests.",
    },
    {
      instruction:
        "Define a `statusRecorder` struct that embeds `http.ResponseWriter` and records the status code written via `WriteHeader`. Use it in a middleware to log the response status after calling next. Print the status from the middleware.",
      starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(code int) {
	// TODO: save code to r.status and call r.ResponseWriter.WriteHeader(code)
}

func StatusLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		// TODO: print "status:", rec.status
	})
}

func main() {
	final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintln(w, "created")
	})

	handler := StatusLogger(final)
	req := httptest.NewRequest("POST", "/items", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
}
`,
      hint: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

type statusRecorder struct {
	http.ResponseWriter
	status int
}

func (r *statusRecorder) WriteHeader(code int) {
	r.status = code
	r.ResponseWriter.WriteHeader(code)
}

func StatusLogger(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		rec := &statusRecorder{ResponseWriter: w, status: http.StatusOK}
		next.ServeHTTP(rec, r)
		fmt.Println("status:", rec.status)
	})
}

func main() {
	final := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusCreated)
		fmt.Fprintln(w, "created")
	})

	handler := StatusLogger(final)
	req := httptest.NewRequest("POST", "/items", nil)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
}
`,
      validate: (code: string) =>
        code.includes("statusRecorder") &&
        code.includes("http.ResponseWriter") &&
        code.includes("WriteHeader"),
      successMessage:
        "Wrapping ResponseWriter lets middleware observe the status code without intercepting the response body. This pattern powers access-log middleware that records 4xx/5xx rates.",
    },
  ],
};
