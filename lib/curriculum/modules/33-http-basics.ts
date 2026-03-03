import type { LessonModule } from "../types";

export const httpBasics: LessonModule = {
	type: "lesson",
	id: "33",
	slug: "http-basics",
	title: "HTTP Basics",
	icon: "🌐",
	estimatedMinutes: 16,
	content: `## HTTP Basics

### net/http: batteries included

Go's standard library ships with a production-capable HTTP package — no framework required. \`net/http\` covers both the server and client sides. For the server, three concepts cover almost everything: the Handler interface, the ServeMux router, and ResponseWriter.

### The Handler interface

Every HTTP handler in Go satisfies one interface:

\`\`\`go
type Handler interface {
	ServeHTTP(ResponseWriter, *Request)
}
\`\`\`

\`ResponseWriter\` is where you write the response; \`*Request\` carries everything the client sent (URL, method, headers, body). Any type with a \`ServeHTTP\` method can be registered as a handler.

### http.HandlerFunc

Writing a full type just to satisfy the Handler interface for a simple function is verbose. \`http.HandlerFunc\` is an adapter that promotes a plain function to a Handler:

\`\`\`go
// HandlerFunc is defined in the stdlib as:
// type HandlerFunc func(ResponseWriter, *Request)
// func (f HandlerFunc) ServeHTTP(w ResponseWriter, r *Request) { f(w, r) }

hello := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
})
\`\`\`

In practice you usually just pass the function directly to \`mux.Handle\` or \`mux.HandleFunc\`.

### http.NewServeMux — routing

A ServeMux matches incoming request paths to registered handlers:

\`\`\`go
mux := http.NewServeMux()

mux.HandleFunc("/", homeHandler)        // matches everything not matched elsewhere
mux.HandleFunc("/hello", helloHandler)  // exact match
mux.HandleFunc("/api/", apiHandler)     // trailing slash: matches /api/ and all sub-paths
\`\`\`

Go 1.22 added method-qualified patterns like \`"GET /users/{id}"\`, but exact-path + manual method checking works everywhere.

### Inspecting the request

\`*http.Request\` carries all the information sent by the client:

\`\`\`go
func handler(w http.ResponseWriter, r *http.Request) {
	fmt.Println(r.Method)              // "GET", "POST", etc.
	fmt.Println(r.URL.Path)            // "/hello"
	name := r.URL.Query().Get("name")  // ?name=Gopher → "Gopher"

	// read the request body (POST, PUT, PATCH)
	body, err := io.ReadAll(r.Body)
	if err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	defer r.Body.Close()
	fmt.Println(string(body))
}
\`\`\`

### Writing responses

\`http.ResponseWriter\` is an interface with three key operations, and order matters:

1. Set headers — **before** calling WriteHeader
2. Call WriteHeader with the status code (optional; defaults to 200 on first Write)
3. Write the body

\`\`\`go
func jsonHandler(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK) // 200
	fmt.Fprintln(w, \`{"message":"ok"}\`)
}
\`\`\`

\`http.Error\` is a convenience shortcut that sets a plain-text body and status in one call:

\`\`\`go
http.Error(w, "not found", http.StatusNotFound) // 404
\`\`\`

### Middleware pattern

Middleware wraps a handler to run code before and/or after the inner handler. It returns a new Handler, so middleware chains compose cleanly:

\`\`\`go
func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("%s %s\\n", r.Method, r.URL.Path)
		next.ServeHTTP(w, r) // delegate to the wrapped handler
	})
}

mux := http.NewServeMux()
mux.HandleFunc("/hello", helloHandler)

// wrap the entire mux with logging
http.ListenAndServe(":8080", withLogging(mux))
\`\`\`

Because the return type is \`http.Handler\`, you can stack multiple middleware layers:

\`\`\`go
handler := withAuth(withLogging(mux))
\`\`\`

### Testing with net/http/httptest

You never need to start a real server to test your handlers. The \`net/http/httptest\` package provides in-process test helpers:

\`\`\`go
package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	fmt.Fprintln(w, "Hello, World!")
}

func main() {
	// httptest.NewRequest builds a synthetic *http.Request
	req := httptest.NewRequest("GET", "/hello", nil)

	// httptest.NewRecorder captures what the handler writes
	rec := httptest.NewRecorder()

	helloHandler(rec, req)

	resp := rec.Result()
	fmt.Println(resp.StatusCode) // 200
	fmt.Println(rec.Body.String()) // Hello, World!
}
\`\`\`

\`ResponseRecorder\` stores the status code, headers, and body in memory so you can assert on them after the handler returns. This makes handler tests fast, isolated, and free of network I/O.

### Starting a real server

For completeness — the one-liner to bind and serve (you cannot run this in the Playground because it blocks and requires a network):

\`\`\`go
mux := http.NewServeMux()
mux.HandleFunc("/hello", helloHandler)

// ListenAndServe blocks until the process is killed or the listener errors
log.Fatal(http.ListenAndServe(":8080", mux))
\`\`\`

In production code you usually call \`http.Server{Addr: ":8080", Handler: mux}.ListenAndServe()\` for more control over timeouts.
`,
	quiz: [
		{
			question: "What interface must a Go HTTP handler implement?",
			options: [
				"http.Responder",
				"http.Handler with ServeHTTP(ResponseWriter, *Request)",
				"http.Server",
				"io.Writer",
			],
			correctIndex: 1,
		},
		{
			question: "What is http.HandlerFunc?",
			options: [
				"A function that starts a server",
				"An adapter that lets a plain function satisfy the Handler interface",
				"A middleware function",
				"A type for HTTP client requests",
			],
			correctIndex: 1,
		},
		{
			question: "What does httptest.NewRecorder() return?",
			options: [
				"A real HTTP response",
				"A ResponseRecorder that captures the handler's response for testing",
				"A mock HTTP client",
				"A test server",
			],
			correctIndex: 1,
		},
	],
};
