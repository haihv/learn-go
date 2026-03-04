import type { WorkshopModule } from "../types";

export const httpClientWorkshop: WorkshopModule = {
  type: "workshop",
  id: "71",
  slug: "http-client-workshop",
  title: "HTTP Client Workshop",
  icon: "📡",
  estimatedMinutes: 22,
  description:
    "Make GET and POST requests with timeouts, handle status codes, and build a reusable API client.",
  steps: [
    {
      instruction:
        "Create an `http.Client` with a 5-second timeout. Start a test server with `httptest.NewServer` that returns `\"hello\"`. Make a GET request to `srv.URL`, read the body with `io.ReadAll`, and print it. Always `defer resp.Body.Close()`.",
      starterCode: `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	}))
	defer srv.Close()

	client := &http.Client{Timeout: 5 * time.Second}

	// TODO: client.Get(srv.URL) and handle error
	// TODO: defer resp.Body.Close()
	// TODO: io.ReadAll(resp.Body) and print
	_ = client
	_ = io.ReadAll
}
`,
      hint: `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	}))
	defer srv.Close()

	client := &http.Client{Timeout: 5 * time.Second}

	resp, err := client.Get(srv.URL)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	defer resp.Body.Close()

	body, err := io.ReadAll(resp.Body)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	fmt.Print(string(body))
}
`,
      validate: (code: string) =>
        code.includes("http.Client{") &&
        code.includes("Timeout:") &&
        code.includes("resp.Body.Close()"),
      successMessage:
        "Always pair resp.Body.Close() with an explicit Timeout. The timeout guards against slow servers; Close() returns the connection to the pool for reuse.",
    },
    {
      instruction:
        "POST JSON `{\"name\":\"Alice\"}` to a test server. Use `http.NewRequestWithContext` with `context.Background()`, set `Content-Type: application/json` header. The server echoes back the body. Print the server's response.",
      starterCode: `package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	}))
	defer srv.Close()

	client := &http.Client{Timeout: 5 * time.Second}
	payload := []byte(\`{"name":"Alice"}\`)

	// TODO: http.NewRequestWithContext(context.Background(), "POST", srv.URL, bytes.NewReader(payload))
	// TODO: req.Header.Set("Content-Type", "application/json")
	// TODO: client.Do(req) and read+print response body
	_ = client
	_ = payload
	_ = bytes.NewReader
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"bytes"
	"context"
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		body, _ := io.ReadAll(r.Body)
		w.Header().Set("Content-Type", "application/json")
		w.Write(body)
	}))
	defer srv.Close()

	client := &http.Client{Timeout: 5 * time.Second}
	payload := []byte(\`{"name":"Alice"}\`)

	req, err := http.NewRequestWithContext(context.Background(), "POST", srv.URL, bytes.NewReader(payload))
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	req.Header.Set("Content-Type", "application/json")

	resp, err := client.Do(req)
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	defer resp.Body.Close()

	body, _ := io.ReadAll(resp.Body)
	fmt.Println(string(body))
}
`,
      validate: (code: string) =>
        code.includes("http.NewRequestWithContext") &&
        code.includes("Content-Type") &&
        code.includes("client.Do"),
      successMessage:
        "http.NewRequestWithContext attaches a context so cancellation and deadlines propagate into the HTTP layer — always prefer it over http.NewRequest in production code.",
    },
    {
      instruction:
        "Write a `fetch(client *http.Client, url string) ([]byte, error)` function that: (1) makes a GET request, (2) checks `resp.StatusCode` — if not 200, return an error with the status code, (3) reads and returns the body. Test with a server that returns 404.",
      starterCode: `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func fetch(client *http.Client, url string) ([]byte, error) {
	// TODO: client.Get(url), defer resp.Body.Close()
	// TODO: if resp.StatusCode != http.StatusOK, return error
	// TODO: return io.ReadAll(resp.Body)
	return nil, nil
}

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	}))
	defer srv.Close()

	client := &http.Client{Timeout: 5 * time.Second}
	_, err := fetch(client, srv.URL)
	if err != nil {
		fmt.Println("error:", err)
	}
}
`,
      hint: `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

func fetch(client *http.Client, url string) ([]byte, error) {
	resp, err := client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	return io.ReadAll(resp.Body)
}

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		http.NotFound(w, r)
	}))
	defer srv.Close()

	client := &http.Client{Timeout: 5 * time.Second}
	_, err := fetch(client, srv.URL)
	if err != nil {
		fmt.Println("error:", err)
	}
}
`,
      validate: (code: string) =>
        code.includes("resp.StatusCode") &&
        code.includes("StatusOK") &&
        code.includes("fmt.Errorf"),
      successMessage:
        "HTTP clients don't error on 4xx/5xx — only network failures. Always check StatusCode and treat non-2xx as an application-level error.",
    },
    {
      instruction:
        "Build an `APIClient` struct with a `BaseURL string` and an embedded `*http.Client`. Add a `Get(path string) ([]byte, error)` method that concatenates BaseURL+path, makes the request, checks status, and returns the body. Test it with a local server.",
      starterCode: `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

type APIClient struct {
	BaseURL string
	*http.Client
}

func (c *APIClient) Get(path string) ([]byte, error) {
	// TODO: build url := c.BaseURL + path
	// TODO: c.Client.Get(url), defer resp.Body.Close()
	// TODO: check status, read and return body
	return nil, nil
}

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "path: %s", r.URL.Path)
	}))
	defer srv.Close()

	client := &APIClient{
		BaseURL: srv.URL,
		Client:  &http.Client{Timeout: 5 * time.Second},
	}

	body, err := client.Get("/users")
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	fmt.Println(string(body))
}
`,
      hint: `package main

import (
	"fmt"
	"io"
	"net/http"
	"net/http/httptest"
	"time"
)

type APIClient struct {
	BaseURL string
	*http.Client
}

func (c *APIClient) Get(path string) ([]byte, error) {
	url := c.BaseURL + path
	resp, err := c.Client.Get(url)
	if err != nil {
		return nil, err
	}
	defer resp.Body.Close()

	if resp.StatusCode != http.StatusOK {
		return nil, fmt.Errorf("unexpected status: %d", resp.StatusCode)
	}

	return io.ReadAll(resp.Body)
}

func main() {
	srv := httptest.NewServer(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintf(w, "path: %s", r.URL.Path)
	}))
	defer srv.Close()

	client := &APIClient{
		BaseURL: srv.URL,
		Client:  &http.Client{Timeout: 5 * time.Second},
	}

	body, err := client.Get("/users")
	if err != nil {
		fmt.Println("error:", err)
		return
	}
	fmt.Println(string(body))
}
`,
      validate: (code: string) =>
        code.includes("type APIClient struct") &&
        code.includes("BaseURL") &&
        code.includes("func (c *APIClient) Get("),
      successMessage:
        "Wrapping http.Client in a domain-specific struct lets you add auth headers, base URLs, retries, and metrics in one place rather than repeating logic across every call site.",
    },
  ],
};
