import type { LessonModule } from "../types";

export const errorWrapping: LessonModule = {
  type: "lesson",
  id: "86",
  slug: "error-wrapping",
  title: "Error Wrapping & Sentinel Errors",
  icon: "🎁",
  estimatedMinutes: 13,
  content: `## Error Wrapping & Sentinel Errors

### Why wrap errors?

Returning a raw error loses context — the caller sees \`"connection refused"\` with no indication of which operation failed. Wrapping adds context while preserving the original error for programmatic inspection.

### fmt.Errorf with %w

\`\`\`go
func readConfig(path string) error {
    data, err := os.ReadFile(path)
    if err != nil {
        return fmt.Errorf("readConfig %s: %w", path, err)  // wrap
    }
    // ...
}
\`\`\`

The \`%w\` verb wraps the error. The caller sees \`"readConfig /etc/app.yaml: open /etc/app.yaml: no such file or directory"\` — a readable chain — and can still unwrap the original \`*os.PathError\`.

### Sentinel errors

Sentinel errors are package-level variables that represent well-known error conditions:

\`\`\`go
var (
    ErrNotFound   = errors.New("not found")
    ErrPermission = errors.New("permission denied")
)

func findUser(id int) (*User, error) {
    if id <= 0 {
        return nil, ErrNotFound
    }
    // ...
}
\`\`\`

Callers compare with \`errors.Is\`:

\`\`\`go
u, err := findUser(0)
if errors.Is(err, ErrNotFound) {
    // handle missing user
}
\`\`\`

### errors.Is — check along the chain

\`errors.Is\` unwraps the error chain recursively until it finds a match:

\`\`\`go
// Even if ErrNotFound is wrapped:
wrappedErr := fmt.Errorf("service layer: %w", ErrNotFound)
errors.Is(wrappedErr, ErrNotFound) // true — unwraps to find it
\`\`\`

Never compare errors with \`==\` — it fails for wrapped errors. Always use \`errors.Is\`.

### errors.As — extract a specific type

\`errors.As\` unwraps the chain and type-asserts each error until it finds one matching the target type:

\`\`\`go
var pathErr *os.PathError
if errors.As(err, &pathErr) {
    fmt.Println("failed path:", pathErr.Path)
    fmt.Println("OS error:", pathErr.Err)
}
\`\`\`

The target must be a pointer to the error type you want. \`errors.As\` sets the target if found.

### Custom error types with Unwrap

A custom error type participates in the chain by implementing \`Unwrap() error\`:

\`\`\`go
type QueryError struct {
    Query string
    Err   error
}

func (e *QueryError) Error() string {
    return fmt.Sprintf("query %q: %v", e.Query, e.Err)
}

func (e *QueryError) Unwrap() error { return e.Err }
\`\`\`

Now \`errors.Is(queryErr, sql.ErrNoRows)\` works even when wrapped in \`QueryError\`.

### errors.Join (Go 1.20+)

Combine multiple errors into one:

\`\`\`go
err1 := errors.New("validation failed")
err2 := errors.New("rate limit exceeded")
combined := errors.Join(err1, err2)
// combined.Error() → "validation failed\\nrate limit exceeded"

errors.Is(combined, err1) // true
errors.Is(combined, err2) // true
\`\`\`

### The wrapping convention

Follow this pattern for error messages in functions:
- \`"operationName arg: %w"\` — colon-space before the wrapped error
- No capital letter at the start (errors are concatenated mid-sentence)
- No trailing period

\`\`\`go
return fmt.Errorf("connect %s:%d: %w", host, port, err)
// produces: "connect db.example.com:5432: dial tcp: connection refused"
\`\`\`
`,
  quiz: [
    {
      question:
        "What is the difference between errors.Is and == for comparing errors?",
      options: [
        "They are equivalent — both compare error values by identity",
        "errors.Is unwraps the error chain recursively to find a match, while == only checks the top-level error and fails for wrapped errors",
        "== is faster; errors.Is is for interface comparisons only",
        "errors.Is compares error messages as strings; == compares by pointer",
      ],
      correctIndex: 1,
    },
    {
      question: "What does the %w verb in fmt.Errorf do that %v does not?",
      options: [
        "%w formats the error with its full stack trace; %v only prints the message",
        "%w wraps the error so errors.Is and errors.As can unwrap the chain; %v embeds only the string representation, breaking the chain",
        "%w is for warnings; %v is for errors",
        "There is no functional difference — both produce the same string output",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Why must a custom error type implement Unwrap() error to work with errors.Is and errors.As?",
      options: [
        "errors.Is and errors.As only work with *errors.errorString values",
        "errors.Is and errors.As use Unwrap to traverse the error chain — without it, they stop at the custom type and cannot find wrapped errors deeper in the chain",
        "Unwrap is required for the error to satisfy the error interface",
        "The compiler enforces Unwrap on all custom error types",
      ],
      correctIndex: 1,
    },
  ],
};
