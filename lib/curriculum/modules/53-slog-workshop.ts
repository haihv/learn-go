import type { WorkshopModule } from "../types";

export const slogWorkshop: WorkshopModule = {
  type: "workshop",
  id: "53",
  slug: "slog-workshop",
  title: "slog Workshop",
  icon: "📋",
  estimatedMinutes: 20,
  description: "Replace fmt.Println debug prints with structured slog calls, add attributes, and create custom handlers.",
  steps: [
    {
      instruction:
        "Replace the `fmt.Println` debug prints with `slog.Info` calls. The starter code simulates a server startup sequence — replace each `fmt.Println` with an equivalent `slog.Info` that carries the same information as key-value pairs.",
      starterCode: `package main

import (
	"fmt"
	"log/slog"
)

func startServer(port int) {
	fmt.Println("starting server on port", port)  // replace with slog.Info
	fmt.Println("loading config from config.yaml") // replace with slog.Info
	fmt.Println("server ready")                    // replace with slog.Info
	_ = slog.Info
}

func main() {
	startServer(8080)
}
`,
      hint: `package main

import "log/slog"

func startServer(port int) {
	slog.Info("starting server", "port", port)
	slog.Info("loading config", "file", "config.yaml")
	slog.Info("server ready")
}

func main() {
	startServer(8080)
}
`,
      validate: (code: string) =>
        code.includes("slog.Info") &&
        !code.includes('fmt.Println("starting'),
      successMessage:
        "slog.Info takes a message followed by key-value pairs — the keys become queryable fields in structured log systems, unlike free-form Println strings.",
    },
    {
      instruction:
        "Add structured attributes to a log call. Write a `logRequest` function that logs an HTTP request with `slog.Info` using typed attributes: `slog.String(\"method\", method)`, `slog.String(\"path\", path)`, `slog.Int(\"status\", status)`, and `slog.Duration(\"latency\", latency)`.",
      starterCode: `package main

import (
	"log/slog"
	"time"
)

func logRequest(method, path string, status int, latency time.Duration) {
	// TODO: call slog.Info("request") with typed slog.String, slog.Int, slog.Duration attrs
}

func main() {
	logRequest("GET", "/api/users", 200, 12*time.Millisecond)
	logRequest("POST", "/api/orders", 201, 45*time.Millisecond)
	logRequest("GET", "/api/missing", 404, 3*time.Millisecond)
}
`,
      hint: `package main

import (
	"log/slog"
	"time"
)

func logRequest(method, path string, status int, latency time.Duration) {
	slog.Info("request",
		slog.String("method", method),
		slog.String("path", path),
		slog.Int("status", status),
		slog.Duration("latency", latency),
	)
}

func main() {
	logRequest("GET", "/api/users", 200, 12*time.Millisecond)
	logRequest("POST", "/api/orders", 201, 45*time.Millisecond)
	logRequest("GET", "/api/missing", 404, 3*time.Millisecond)
}
`,
      validate: (code: string) =>
        code.includes("slog.String") &&
        code.includes("slog.Int") &&
        code.includes("slog.Duration"),
      successMessage:
        "Typed attributes (slog.String, slog.Int, slog.Duration) avoid reflection overhead compared to passing raw key/value pairs — prefer them in hot paths.",
    },
    {
      instruction:
        "Create a JSON-format logger writing to a `bytes.Buffer`. Use `slog.NewJSONHandler(&buf, nil)` and `slog.New(handler)` to build the logger, then call `logger.Info(\"order placed\", \"orderID\", \"ord-99\", \"total\", 49.99)`. Print the buffer contents to verify the JSON output.",
      starterCode: `package main

import (
	"bytes"
	"fmt"
	"log/slog"
)

func main() {
	var buf bytes.Buffer

	// TODO: create a JSON handler writing to &buf
	// TODO: create a logger from that handler
	// TODO: log "order placed" with orderID and total attributes
	// TODO: print buf.String() to see the JSON

	_ = slog.NewJSONHandler
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"bytes"
	"fmt"
	"log/slog"
)

func main() {
	var buf bytes.Buffer

	handler := slog.NewJSONHandler(&buf, nil)
	logger := slog.New(handler)

	logger.Info("order placed", "orderID", "ord-99", "total", 49.99)

	fmt.Println(buf.String())
}
`,
      validate: (code: string) =>
        code.includes("slog.NewJSONHandler") &&
        code.includes("slog.New"),
      successMessage:
        "Writing to a bytes.Buffer is useful in tests — you can assert that log output contains specific fields without capturing stderr or setting up a real log aggregator.",
    },
    {
      instruction:
        "Use `logger.With` to add a `requestID` to every log line in an HTTP-handler simulation. Create a base JSON logger. In a `handleRequest` function, call `logger.With(\"requestID\", reqID)` to get a request-scoped logger, then use it for two log calls: one at the start and one at the end of handling.",
      starterCode: `package main

import (
	"bytes"
	"fmt"
	"log/slog"
)

func handleRequest(logger *slog.Logger, reqID string, path string) {
	// TODO: create a request-scoped logger with logger.With("requestID", reqID)
	// TODO: log "handling request" with "path"
	// TODO: log "request complete" with "status" 200
	_ = reqID
	_ = path
}

func main() {
	var buf bytes.Buffer
	logger := slog.New(slog.NewJSONHandler(&buf, nil))

	handleRequest(logger, "req-1", "/api/users")
	handleRequest(logger, "req-2", "/api/orders")

	fmt.Println(buf.String())
}
`,
      hint: `package main

import (
	"bytes"
	"fmt"
	"log/slog"
)

func handleRequest(logger *slog.Logger, reqID string, path string) {
	log := logger.With("requestID", reqID)
	log.Info("handling request", "path", path)
	log.Info("request complete", "status", 200)
}

func main() {
	var buf bytes.Buffer
	logger := slog.New(slog.NewJSONHandler(&buf, nil))

	handleRequest(logger, "req-1", "/api/users")
	handleRequest(logger, "req-2", "/api/orders")

	fmt.Println(buf.String())
}
`,
      validate: (code: string) =>
        code.includes("logger.With") ||
        code.includes(".With("),
      successMessage:
        "logger.With returns a child logger that prepends fixed attributes to every call — it's the clean alternative to threading a requestID parameter through every logging statement.",
    },
  ],
};
