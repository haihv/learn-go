import type { WorkshopModule } from "../types";

export const modulesPackagesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "55",
  slug: "modules-packages-workshop",
  title: "Modules & Packages Workshop",
  icon: "📦",
  estimatedMinutes: 20,
  description: "Write go.mod files, multi-package layouts, internal/ usage, and fix import cycles.",
  steps: [
    {
      instruction:
        "Write a valid `go.mod` file content as a string literal and print it. The module path should be `github.com/alice/myapp` and the Go version directive should be `go 1.22`. Your printed output must contain both the `module` and `go` directives.",
      starterCode: `package main

import "fmt"

func main() {
	gomod := \`TODO: write the contents of a go.mod file here\`
	fmt.Println(gomod)
}
`,
      hint: `package main

import "fmt"

func main() {
	gomod := \`module github.com/alice/myapp

go 1.22
\`
	fmt.Println(gomod)
}
`,
      validate: (code: string) =>
        code.includes("module") &&
        code.includes("go 1."),
      successMessage:
        "A go.mod file needs at minimum a module path and a go directive. The require block is only needed once you add dependencies.",
    },
    {
      instruction:
        "Simulate a two-package layout in a single file. Define a `mathutil` package's exported `Add` function as a regular function, then call it from `main`. Your code must include `package mathutil` in a comment (to show you know the separation) and define an `Add` function that sums two ints.",
      starterCode: `package main

import "fmt"

// In a real project this would be in mathutil/mathutil.go:
// package mathutil
//
// func Add(a, b int) int { return a + b }

// For the Playground, we implement it directly here.
func Add(a, b int) int {
	// TODO: implement Add
	return 0
}

func main() {
	result := Add(3, 4)
	fmt.Println(result)
}
`,
      hint: `package main

import "fmt"

// In a real project this would be in mathutil/mathutil.go:
// package mathutil
//
// func Add(a, b int) int { return a + b }

func Add(a, b int) int {
	return a + b
}

func main() {
	result := Add(3, 4)
	fmt.Println(result)
}
`,
      validate: (code: string) =>
        code.includes("package mathutil") &&
        code.includes("func Add(") &&
        code.includes("return a + b"),
      successMessage:
        "In a real module, mathutil would live in its own directory. The import path would be the module path plus the relative directory: github.com/alice/myapp/mathutil.",
    },
    {
      instruction:
        "Demonstrate `internal/` package access rules with a comment-driven example. Write code that imports a simulated `internal/config` package. Show the import path as a comment and explain why external modules cannot use it. Then print a config value to stdout.",
      starterCode: `package main

import "fmt"

// Simulating: import "github.com/alice/myapp/internal/config"
// External modules cannot import anything under internal/ —
// the compiler enforces this boundary.

type Config struct {
	Port int
	Host string
}

// TODO: write a newConfig() function that returns a Config with Port=8080 and Host="localhost"

func main() {
	// TODO: call newConfig() and print cfg.Port and cfg.Host
	_ = fmt.Println
}
`,
      hint: `package main

import "fmt"

// Simulating: import "github.com/alice/myapp/internal/config"
// External modules cannot import anything under internal/ —
// the compiler enforces this boundary.

type Config struct {
	Port int
	Host string
}

func newConfig() Config {
	return Config{Port: 8080, Host: "localhost"}
}

func main() {
	cfg := newConfig()
	fmt.Println(cfg.Port, cfg.Host)
}
`,
      validate: (code: string) =>
        code.includes("internal/") &&
        code.includes("Config"),
      successMessage:
        "The internal/ boundary is enforced by the Go toolchain — it's the only access-control mechanism below the package level. Use it to hide implementation packages from downstream consumers of your module.",
    },
    {
      instruction:
        "Fix an import cycle by extracting a shared type. Two packages `order` and `invoice` both need an `Amount` type, causing a cycle. Extract `Amount` into a standalone `types` package that neither imports the other. Show the fix by defining `Amount` as a type alias for `float64` and using it in both a simulated `order` and `invoice` function.",
      starterCode: `package main

import "fmt"

// BEFORE (broken — cycle):
// package order   imports invoice
// package invoice imports order
//
// FIX: extract Amount into a shared types package
// package types   (no imports of order or invoice)
// package order   imports types
// package invoice imports types

// TODO: define type Amount = float64  (the shared type)

// TODO: write func newOrder(total Amount) string
// TODO: write func newInvoice(total Amount) string

func main() {
	// TODO: call both functions and print results
	_ = fmt.Println
}
`,
      hint: `package main

import "fmt"

// BEFORE (broken — cycle):
// package order   imports invoice
// package invoice imports order
//
// FIX: extract Amount into a shared types package
// package types   (no imports of order or invoice)
// package order   imports types
// package invoice imports types

type Amount = float64

func newOrder(total Amount) string {
	return fmt.Sprintf("order: $%.2f", total)
}

func newInvoice(total Amount) string {
	return fmt.Sprintf("invoice: $%.2f", total)
}

func main() {
	fmt.Println(newOrder(99.50))
	fmt.Println(newInvoice(99.50))
}
`,
      validate: (code: string) =>
        code.includes("type Amount") &&
        code.includes("Amount") &&
        (code.includes("newOrder") || code.includes("newInvoice")),
      successMessage:
        "Extracting shared types into a dependency-free types package is the standard Go pattern for breaking import cycles. The types package has no logic — just plain structs, interfaces, and type aliases.",
    },
  ],
};
