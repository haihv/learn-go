import type { LessonModule } from "../types";

export const httpClient: LessonModule = {
  type: "lesson",
  id: "70",
  slug: "http-client",
  title: "HTTP Client",
  icon: "📡",
  estimatedMinutes: 13,
  content: `## HTTP Client

### Never use the default http.Get in production

\`http.Get(url)\` uses the default client which has **no timeout**. A slow server can hang your goroutine forever:

\`\`\`go
// Dangerous — no timeout
resp, err := http.Get("https://api.example.com/data")
\`\`\`

Always create a client with an explicit timeout:

\`\`\`go
client := &http.Client{Timeout: 10 * time.Second}
resp, err := client.Get("https://api.example.com/data")
\`\`\`

### Always close the response body

\`\`\`go
resp, err := client.Get(url)
if err != nil {
    return err
}
defer resp.Body.Close()  // prevent connection leak

body, err := io.ReadAll(resp.Body)
\`\`\`

An unclosed response body holds a TCP connection in the pool. Always \`defer resp.Body.Close()\` immediately after checking the error.

### Checking status codes

The HTTP client does not return an error for 4xx/5xx responses — only network errors:

\`\`\`go
if resp.StatusCode != http.StatusOK {
    return fmt.Errorf("unexpected status: %d", resp.StatusCode)
}
\`\`\`

Check \`resp.StatusCode\` explicitly after every request.

### Building a request manually

\`client.Do(req)\` gives full control over method, headers, and body:

\`\`\`go
req, err := http.NewRequestWithContext(ctx, "POST", url, bytes.NewReader(body))
if err != nil {
    return err
}
req.Header.Set("Content-Type", "application/json")
req.Header.Set("Authorization", "Bearer "+token)

resp, err := client.Do(req)
\`\`\`

Always prefer \`http.NewRequestWithContext\` over \`http.NewRequest\` so the request respects context cancellation.

### Reading JSON responses

\`\`\`go
var result struct {
    ID   int    \`json:"id"\`
    Name string \`json:"name"\`
}
if err := json.NewDecoder(resp.Body).Decode(&result); err != nil {
    return err
}
\`\`\`

\`json.NewDecoder\` reads directly from the response body without buffering the entire payload — important for large responses.

### Custom transport for connection pooling

\`\`\`go
transport := &http.Transport{
    MaxIdleConns:        100,
    MaxIdleConnsPerHost: 10,
    IdleConnTimeout:     90 * time.Second,
}
client := &http.Client{
    Transport: transport,
    Timeout:   10 * time.Second,
}
\`\`\`

Create the client once at startup (package-level or in a struct) and reuse it. Creating a new \`http.Client\` per request bypasses connection pooling.

### Retries with exponential backoff

For transient failures (5xx, network errors), retry with backoff:

\`\`\`go
for attempt := 0; attempt < 3; attempt++ {
    resp, err = client.Do(req)
    if err == nil && resp.StatusCode < 500 {
        break
    }
    time.Sleep(time.Duration(1<<attempt) * 100 * time.Millisecond)
}
\`\`\`
`,
  quiz: [
    {
      question:
        "Why should you always create `http.Client{Timeout: ...}` rather than using `http.Get` directly?",
      options: [
        "http.Get does not support HTTPS",
        "The default client has no timeout — a slow server can block the goroutine forever",
        "http.Client is faster due to connection reuse",
        "http.Get is deprecated in Go 1.20+",
      ],
      correctIndex: 1,
    },
    {
      question: "What happens if you forget to call `resp.Body.Close()`?",
      options: [
        "The HTTP client panics on the next request",
        "The TCP connection is held in the pool indefinitely, eventually exhausting available connections",
        "The response is cached in memory forever",
        "Nothing — the GC closes it automatically",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Why use http.NewRequestWithContext instead of http.NewRequest?",
      options: [
        "NewRequestWithContext supports HTTP/2; NewRequest does not",
        "NewRequestWithContext attaches a context so the request is cancelled when the context is cancelled, enabling timeout and cancellation propagation",
        "NewRequest cannot set custom headers",
        "There is no difference — they are aliases",
      ],
      correctIndex: 1,
    },
  ],
};
