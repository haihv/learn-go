import type { LabModule } from "../types";

export const httpLab: LabModule = {
	type: "lab",
	id: "39",
	slug: "http-lab",
	title: "Item Store API Lab",
	icon: "🛒",
	estimatedMinutes: 35,
	description: "Build an in-memory item store API tested with net/http/httptest.",
	instructions: `## Item Store API Lab

Build a small in-memory REST-style API for items. All testing is done with \`net/http/httptest\` — no real server needed.

### Data type

\`\`\`go
type Item struct {
	ID    string  \`json:"id"\`
	Name  string  \`json:"name"\`
	Price float64 \`json:"price"\`
}
\`\`\`

Use a package-level map as storage:

\`\`\`go
var store = map[string]Item{}
\`\`\`

### Endpoints

Register all routes on an \`http.NewServeMux()\`.

**GET /items**
- Marshal the full contents of \`store\` as a JSON array
- Respond with status 200

**GET /items/{id}**
- Use \`strings.TrimPrefix\` to extract the ID from the path (e.g. \`strings.TrimPrefix(r.URL.Path, "/items/")\`)
- If found, respond with the item JSON and status 200
- If not found, respond with body \`"not found"\` and status 404

**POST /items**
- Decode the JSON request body into an \`Item\`
- Store it in \`store\` by its ID field
- Respond with status 201 (Created)

### Middleware

Write \`withContentType(next http.Handler) http.Handler\` that sets the \`Content-Type: application/json\` header on every response before delegating to the inner handler.

Wrap the entire mux with this middleware.

### Testing in main

Use \`httptest.NewRecorder\` and \`httptest.NewRequest\` to exercise all three endpoints:

1. POST \`{"id":"1","name":"Widget","price":9.99}\` to \`/items\` — expect status 201
2. GET \`/items\` — expect the response body to contain \`"Widget"\`
3. GET \`/items/1\` — expect status 200 and \`"id":"1"\` in the body
4. GET \`/items/999\` — expect status 404

Print each status code and relevant body excerpt so the output makes the results visible.
`,
	starterCode: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
)

type Item struct {
	ID    string  \`json:"id"\`
	Name  string  \`json:"name"\`
	Price float64 \`json:"price"\`
}

var store = map[string]Item{}

func listItems(w http.ResponseWriter, r *http.Request) {
	// TODO: marshal all items in store as a JSON array and write with status 200
}

func getItem(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/items/")
	// TODO: look up id in store; write JSON + 200 if found, "not found" + 404 if not
	_ = id
}

func createItem(w http.ResponseWriter, r *http.Request) {
	// TODO: decode JSON body into Item, store by ID, respond with 201
}

func withContentType(next http.Handler) http.Handler {
	// TODO: set Content-Type: application/json then call next.ServeHTTP
	return next
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/items", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			createItem(w, r)
		} else {
			listItems(w, r)
		}
	})
	mux.HandleFunc("/items/", getItem)

	handler := withContentType(mux)

	// 1. POST a new item
	body := strings.NewReader(\`{"id":"1","name":"Widget","price":9.99}\`)
	req := httptest.NewRequest("POST", "/items", body)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	fmt.Println("POST /items:", rec.Code)

	// 2. GET all items
	req2 := httptest.NewRequest("GET", "/items", nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	fmt.Println("GET /items:", rec2.Code, rec2.Body.String())

	// 3. GET single item
	req3 := httptest.NewRequest("GET", "/items/1", nil)
	rec3 := httptest.NewRecorder()
	handler.ServeHTTP(rec3, req3)
	fmt.Println("GET /items/1:", rec3.Code, rec3.Body.String())

	// 4. GET missing item
	req4 := httptest.NewRequest("GET", "/items/999", nil)
	rec4 := httptest.NewRecorder()
	handler.ServeHTTP(rec4, req4)
	fmt.Println("GET /items/999:", rec4.Code)
}
`,
	solutionCode: `package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"net/http/httptest"
	"strings"
)

type Item struct {
	ID    string  \`json:"id"\`
	Name  string  \`json:"name"\`
	Price float64 \`json:"price"\`
}

var store = map[string]Item{}

func listItems(w http.ResponseWriter, r *http.Request) {
	items := make([]Item, 0, len(store))
	for _, item := range store {
		items = append(items, item)
	}
	data, err := json.Marshal(items)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func getItem(w http.ResponseWriter, r *http.Request) {
	id := strings.TrimPrefix(r.URL.Path, "/items/")
	item, ok := store[id]
	if !ok {
		http.Error(w, "not found", http.StatusNotFound)
		return
	}
	data, err := json.Marshal(item)
	if err != nil {
		http.Error(w, "internal error", http.StatusInternalServerError)
		return
	}
	w.WriteHeader(http.StatusOK)
	w.Write(data)
}

func createItem(w http.ResponseWriter, r *http.Request) {
	var item Item
	if err := json.NewDecoder(r.Body).Decode(&item); err != nil {
		http.Error(w, "bad request", http.StatusBadRequest)
		return
	}
	store[item.ID] = item
	w.WriteHeader(http.StatusCreated)
}

func withContentType(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Content-Type", "application/json")
		next.ServeHTTP(w, r)
	})
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/items", func(w http.ResponseWriter, r *http.Request) {
		if r.Method == http.MethodPost {
			createItem(w, r)
		} else {
			listItems(w, r)
		}
	})
	mux.HandleFunc("/items/", getItem)

	handler := withContentType(mux)

	// 1. POST a new item
	body := strings.NewReader(\`{"id":"1","name":"Widget","price":9.99}\`)
	req := httptest.NewRequest("POST", "/items", body)
	rec := httptest.NewRecorder()
	handler.ServeHTTP(rec, req)
	fmt.Println("POST /items:", rec.Code)

	// 2. GET all items
	req2 := httptest.NewRequest("GET", "/items", nil)
	rec2 := httptest.NewRecorder()
	handler.ServeHTTP(rec2, req2)
	fmt.Println("GET /items:", rec2.Code, rec2.Body.String())

	// 3. GET single item
	req3 := httptest.NewRequest("GET", "/items/1", nil)
	rec3 := httptest.NewRecorder()
	handler.ServeHTTP(rec3, req3)
	fmt.Println("GET /items/1:", rec3.Code, rec3.Body.String())

	// 4. GET missing item
	req4 := httptest.NewRequest("GET", "/items/999", nil)
	rec4 := httptest.NewRecorder()
	handler.ServeHTTP(rec4, req4)
	fmt.Println("GET /items/999:", rec4.Code)
}
`,
	tests: [
		{
			name: "Item type with JSON tags",
			description: "Define an Item struct with json struct tags.",
			validate: (code: string, _stdout: string) =>
				code.includes("type Item struct") &&
				code.includes('json:"'),
		},
		{
			name: "GET /items handler",
			description: "Implement a handler that marshals all items to JSON.",
			validate: (code: string, _stdout: string) =>
				code.includes("/items") &&
				(code.includes("json.Marshal") || code.includes("json.NewEncoder")),
		},
		{
			name: "POST handler stores item",
			description: "Implement a handler that decodes a JSON body and stores the item.",
			validate: (code: string, _stdout: string) =>
				code.includes("json.NewDecoder") ||
				code.includes("json.Unmarshal"),
		},
		{
			name: "404 for missing item",
			description: "GET /items/999 must produce a 404 response.",
			validate: (_code: string, stdout: string) =>
				stdout.includes("404") ||
				stdout.includes("not found"),
		},
		{
			name: "withContentType middleware",
			description: "Implement withContentType middleware that sets the Content-Type header.",
			validate: (code: string, _stdout: string) =>
				code.includes("withContentType") &&
				code.includes("Content-Type"),
		},
		{
			name: "Uses httptest",
			description: "Test all handlers using httptest.NewRecorder and httptest.NewRequest.",
			validate: (code: string, _stdout: string) =>
				code.includes("httptest.NewRecorder") &&
				code.includes("httptest.NewRequest"),
		},
	],
};
