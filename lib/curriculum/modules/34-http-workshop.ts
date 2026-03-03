import type { WorkshopModule } from "../types";

export const httpWorkshop: WorkshopModule = {
	type: "workshop",
	id: "34",
	slug: "http-workshop",
	title: "HTTP Workshop",
	icon: "🔨",
	estimatedMinutes: 25,
	description: "Build HTTP handlers tested with net/http/httptest.",
	steps: [
		{
			instruction:
				"Write a handler `helloHandler` that writes `\"Hello, World!\"` with status 200. In main, use `httptest.NewRecorder` and `httptest.NewRequest` to call the handler, then print the status code and body.",
			starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: write "Hello, World!" with status 200
}

func main() {
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	helloHandler(rec, req)

	fmt.Println(rec.Code)        // 200
	fmt.Println(rec.Body.String()) // Hello, World!
}
`,
			hint: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Hello, World!")
}

func main() {
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	helloHandler(rec, req)

	fmt.Println(rec.Code)
	fmt.Println(rec.Body.String())
}
`,
			validate: (code: string) =>
				code.includes("httptest.NewRecorder") &&
				code.includes("Hello"),
			successMessage:
				"ResponseRecorder.Code holds the status and Body holds the response body — no real network needed to verify handler behavior.",
		},
		{
			instruction:
				"Extend the handler to read a `?name=` query parameter and respond with `\"Hello, {name}!\"`. Test it by passing `?name=Gopher` in the request URL.",
			starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: read the "name" query parameter
	// TODO: respond with "Hello, <name>!"
	fmt.Fprintln(w, "Hello, World!")
}

func main() {
	req := httptest.NewRequest("GET", "/?name=Gopher", nil)
	rec := httptest.NewRecorder()

	helloHandler(rec, req)

	fmt.Println(rec.Code)
	fmt.Println(rec.Body.String()) // Hello, Gopher!
}
`,
			hint: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	name := r.URL.Query().Get("name")
	if name == "" {
		name = "World"
	}
	fmt.Fprintf(w, "Hello, %s!\n", name)
}

func main() {
	req := httptest.NewRequest("GET", "/?name=Gopher", nil)
	rec := httptest.NewRecorder()

	helloHandler(rec, req)

	fmt.Println(rec.Code)
	fmt.Println(rec.Body.String())
}
`,
			validate: (code: string) =>
				(code.includes("r.URL.Query()") || code.includes("Query().Get")) &&
				code.includes("name"),
			successMessage:
				"r.URL.Query() parses the raw query string once into a map-like Values type — Get returns the first value for a key or an empty string if absent.",
		},
		{
			instruction:
				"Write a method-aware handler: return `200 OK` for GET requests and `405 Method Not Allowed` for any other method. Test both paths in main.",
			starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func methodHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: allow GET, reject everything else with 405
}

func main() {
	// test GET
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	methodHandler(rec, req)
	fmt.Println(rec.Code) // 200

	// test POST
	req2 := httptest.NewRequest("POST", "/", nil)
	rec2 := httptest.NewRecorder()
	methodHandler(rec2, req2)
	fmt.Println(rec2.Code) // 405
}
`,
			hint: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func methodHandler(w http.ResponseWriter, r *http.Request) {
	if r.Method != http.MethodGet {
		http.Error(w, "method not allowed", http.StatusMethodNotAllowed)
		return
	}
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "OK")
}

func main() {
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()
	methodHandler(rec, req)
	fmt.Println(rec.Code)

	req2 := httptest.NewRequest("POST", "/", nil)
	rec2 := httptest.NewRecorder()
	methodHandler(rec2, req2)
	fmt.Println(rec2.Code)
}
`,
			validate: (code: string) =>
				code.includes("r.Method") &&
				(code.includes("405") || code.includes("MethodNotAllowed")),
			successMessage:
				"Checking r.Method and returning early keeps each branch focused — http.Error is a one-liner that sets the status and plain-text body together.",
		},
		{
			instruction:
				"Write a JSON response handler: define a small struct, marshal it with `json.Marshal`, set the `Content-Type` header to `application/json`, and write status 200. Verify with httptest.",
			starterCode: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
)

type Message struct {
	Text string \`json:"text"\`
}

func jsonHandler(w http.ResponseWriter, r *http.Request) {
	// TODO: marshal Message{Text: "hello"} to JSON
	// TODO: set Content-Type header
	// TODO: write 200 and the JSON body
}

func main() {
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	jsonHandler(rec, req)

	fmt.Println(rec.Code)
	fmt.Println(rec.Header().Get("Content-Type"))
	fmt.Println(rec.Body.String())
}
`,
			hint: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
)

type Message struct {
	Text string \`json:"text"\`
}

func jsonHandler(w http.ResponseWriter, r *http.Request) {
	data, err := json.Marshal(Message{Text: "hello"})
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func main() {
	req := httptest.NewRequest("GET", "/", nil)
	rec := httptest.NewRecorder()

	jsonHandler(rec, req)

	fmt.Println(rec.Code)
	fmt.Println(rec.Header().Get("Content-Type"))
	fmt.Println(rec.Body.String())
}
`,
			validate: (code: string) =>
				code.includes("application/json") &&
				code.includes("json.Marshal"),
			successMessage:
				"Headers must be set before the first call to Write or WriteHeader — once the status line is sent, header changes are silently ignored.",
		},
		{
			instruction:
				"Write a `withLogging` middleware function that prints the request method and path, then calls the wrapped handler. Chain it around `helloHandler` and verify with httptest that the handler still returns 200.",
			starterCode: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Hello, World!")
}

// TODO: implement withLogging(next http.Handler) http.Handler
// It should print r.Method and r.URL.Path, then call next.ServeHTTP(w, r)

func main() {
	req := httptest.NewRequest("GET", "/hello", nil)
	rec := httptest.NewRecorder()

	// TODO: wrap helloHandler with withLogging and call ServeHTTP
	helloHandler(rec, req)

	fmt.Println(rec.Code) // 200
}
`,
			hint: `package main

import (
	"fmt"
	"net/http"
	"net/http/httptest"
)

func helloHandler(w http.ResponseWriter, r *http.Request) {
	w.WriteHeader(http.StatusOK)
	fmt.Fprintln(w, "Hello, World!")
}

func withLogging(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Printf("%s %s\n", r.Method, r.URL.Path)
		next.ServeHTTP(w, r)
	})
}

func main() {
	req := httptest.NewRequest("GET", "/hello", nil)
	rec := httptest.NewRecorder()

	handler := withLogging(http.HandlerFunc(helloHandler))
	handler.ServeHTTP(rec, req)

	fmt.Println(rec.Code)
}
`,
			validate: (code: string) =>
				code.includes("withLogging") &&
				code.includes("http.Handler") &&
				code.includes("next.ServeHTTP"),
			successMessage:
				"Middleware returns an http.Handler wrapping the next one — this makes chains composable and keeps cross-cutting concerns (logging, auth, metrics) out of business logic.",
		},
	],
};
