import type { LessonModule } from "../types";

export const modulesPackages: LessonModule = {
  type: "lesson",
  id: "54",
  slug: "modules-packages",
  title: "Go Modules & Packages",
  icon: "📦",
  estimatedMinutes: 14,
  content: `## Go Modules & Packages

### Why modules replaced GOPATH

Before Go 1.11, all Go code had to live under a single \`GOPATH\` directory. This made it impossible to have two projects depending on different versions of the same library. **Go modules** (introduced in Go 1.11, made default in 1.16) solve this: each project is a self-contained module with an explicit dependency manifest.

### go mod init

Create a new module with:

\`\`\`bash
go mod init github.com/alice/myapp
\`\`\`

The argument is the **module path** — the canonical import prefix for all packages in this module. By convention it matches the repository URL so tools can fetch it automatically.

### go.mod anatomy

\`\`\`
module github.com/alice/myapp

go 1.22

require (
    github.com/pkg/errors v0.9.1
    golang.org/x/sync v0.6.0
)
\`\`\`

| Directive | Meaning |
|-----------|---------|
| \`module\` | Module path (import prefix) |
| \`go\` | Minimum Go toolchain version |
| \`require\` | Direct dependencies and their versions |

### go.sum

\`go.sum\` stores cryptographic hashes of every dependency (direct and transitive). The toolchain refuses to use a dependency whose hash doesn't match — this prevents supply-chain attacks.

**Always commit both \`go.mod\` and \`go.sum\`.** Never hand-edit \`go.sum\`.

### Managing dependencies

\`\`\`bash
go get github.com/pkg/errors@v0.9.1   # add or upgrade to specific version
go get github.com/pkg/errors@latest   # upgrade to latest release
go mod tidy                           # remove unused, add missing dependencies
\`\`\`

Run \`go mod tidy\` before every commit to keep \`go.mod\` and \`go.sum\` accurate.

### Package naming rules

- Directory name = package name (they must match)
- Package names: **lowercase, no underscores** (e.g. \`mathutil\`, not \`math_util\`)
- One package per directory (except \`_test\` packages)
- The \`main\` package is special — it's the entry point for an executable

\`\`\`
myapp/
├── go.mod              (module github.com/alice/myapp)
├── main.go             (package main)
└── mathutil/
    └── mathutil.go     (package mathutil)
\`\`\`

Import the sub-package using the full module-relative path:

\`\`\`go
import "github.com/alice/myapp/mathutil"
\`\`\`

### Exported vs unexported

Capitalisation controls visibility across packages:

\`\`\`go
package mathutil

func Add(a, b int) int { return a + b }   // exported — visible everywhere
func clamp(v, lo, hi int) int { ... }      // unexported — only inside mathutil
\`\`\`

This is Go's entire access-control system. There are no \`public\`/\`private\` keywords.

### internal/ packages

Placing a package under an \`internal/\` directory restricts who can import it:

\`\`\`
myapp/
├── internal/
│   └── db/         — only importable by code rooted at myapp/
└── api/
    └── handler.go  — can import myapp/internal/db ✓
\`\`\`

External modules (other people's code) cannot import anything under your \`internal/\`. Use this to expose a stable public API while hiding implementation details.

### Avoiding import cycles

Go packages must form a **directed acyclic graph (DAG)** — circular imports are a compile error.

\`\`\`
❌  package a imports b, package b imports a  →  compile error
\`\`\`

The fix is to extract shared types into a third package that neither \`a\` nor \`b\` imports from each other:

\`\`\`
✓  a → types ← b     (both import types; neither imports the other)
\`\`\`

A \`types\` or \`model\` package containing only plain structs and interfaces — no logic — is the standard pattern for breaking cycles.
`,
  quiz: [
    {
      question: "What does `go mod tidy` do?",
      options: [
        "Formats all .go files with gofmt",
        "Removes unused dependencies and adds any missing ones to go.mod and go.sum",
        "Upgrades all dependencies to their latest versions",
        "Initialises a new module in the current directory",
      ],
      correctIndex: 1,
    },
    {
      question: "Why would you place a package under an `internal/` directory?",
      options: [
        "To make it run faster at compile time",
        "To restrict imports so only code within the same module tree can use it",
        "To prevent the package from being tested",
        "To mark the package as a dependency of the main package",
      ],
      correctIndex: 1,
    },
    {
      question: "What makes an identifier exported in Go?",
      options: [
        "Declaring it with the `export` keyword",
        "Placing it in a file named exports.go",
        "Starting its name with an uppercase letter",
        "Adding a `// +export` comment above it",
      ],
      correctIndex: 2,
    },
  ],
};
