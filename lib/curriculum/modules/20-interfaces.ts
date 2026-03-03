import { LessonModule } from "../types";

export const interfaces: LessonModule = {
  type: "lesson",
  id: "20",
  slug: "interfaces",
  title: "Interfaces",
  icon: "🔌",
  estimatedMinutes: 14,
  content: `# Interfaces

## What Is an Interface?

An interface in Go defines a set of method signatures. Any type that implements all the methods of an interface automatically satisfies it — there is no \`implements\` keyword. This is called **implicit satisfaction**, and it keeps Go code decoupled and flexible.

\`\`\`go
type Shape interface {
    Area() float64
}
\`\`\`

Any type with an \`Area() float64\` method satisfies \`Shape\`, regardless of where the type is defined or whether it ever mentions \`Shape\` by name.

## Defining and Using an Interface

Here are two concrete types and a function that works with both through the \`Shape\` interface:

\`\`\`go
package main

import (
    "fmt"
    "math"
)

type Shape interface {
    Area() float64
}

type Circle struct {
    Radius float64
}

func (c Circle) Area() float64 {
    return math.Pi * c.Radius * c.Radius
}

type Rectangle struct {
    Width, Height float64
}

func (r Rectangle) Area() float64 {
    return r.Width * r.Height
}

func printArea(s Shape) {
    fmt.Printf("Area: %.2f\\n", s.Area())
}

func main() {
    printArea(Circle{Radius: 3})
    printArea(Rectangle{Width: 4, Height: 5})
}
\`\`\`

Neither \`Circle\` nor \`Rectangle\` declares that it implements \`Shape\`. The compiler checks at the call site — if the method exists with the right signature, the type satisfies the interface.

## The Empty Interface: any

The empty interface has no methods, so every type satisfies it. In Go 1.18+, \`any\` is an alias for \`interface{}\`:

\`\`\`go
func describe(v any) {
    fmt.Printf("value: %v, type: %T\\n", v, v)
}

func main() {
    describe(42)
    describe("hello")
    describe(true)
}
\`\`\`

\`any\` appears frequently in generic utility functions, containers, and APIs that must accept arbitrary values. The trade-off is that you lose compile-time type safety — to use the underlying value in a typed way, you need a **type assertion**.

## Type Assertions

A type assertion extracts the concrete value from an interface variable:

\`\`\`go
var v any = "hello"

// Safe two-value form — ok is false instead of panicking
s, ok := v.(string)
if ok {
    fmt.Println("string value:", s)
}
\`\`\`

Always prefer the two-value form \`v, ok := x.(T)\` over the single-value form \`v := x.(T)\`, which panics if the assertion fails.

When you need to handle multiple types, a **type switch** is cleaner than chained assertions:

\`\`\`go
switch val := v.(type) {
case int:
    fmt.Println("int:", val)
case string:
    fmt.Println("string:", val)
default:
    fmt.Printf("unknown type: %T\\n", val)
}
\`\`\`

Interfaces are the primary mechanism for polymorphism in Go — small, focused interface definitions lead to composable, testable code.

## fmt.Stringer

The most widely-used single-method interface in Go is \`fmt.Stringer\`, defined in the \`fmt\` package:

\`\`\`go
type Stringer interface {
    String() string
}
\`\`\`

When \`fmt.Println\`, \`fmt.Printf("%v", ...)\`, or \`fmt.Printf("%s", ...)\` receive a value, the \`fmt\` package checks at runtime whether the value's type implements \`Stringer\`. If it does, \`String()\` is called automatically to produce the output.

### Implementing Stringer

\`\`\`go
package main

import "fmt"

type Point struct {
    X, Y float64
}

// String is called automatically by fmt whenever it formats a Point.
// Returning a human-readable string here avoids the default {X:3 Y:4} output.
func (p Point) String() string {
    return fmt.Sprintf("(%g, %g)", p.X, p.Y)
}

func main() {
    p := Point{3, 4}
    fmt.Println(p)        // prints: (3, 4) — calls p.String() automatically
    fmt.Printf("%v\\n", p) // also calls p.String()
    fmt.Printf("%s\\n", p) // also calls p.String()
}
\`\`\`

### Why this is Go's interface system in action

The \`fmt\` package was written *before* your \`Point\` type existed. Yet it can call your type's \`String()\` method — because Go checks for the method at the call site with no registration, no coupling, and no inheritance. Your type never imports or references \`fmt\` to satisfy \`Stringer\`; \`fmt\` simply checks whether the right method exists.

### Other interfaces that work the same way

The same pattern appears throughout the standard library:

- **\`error\`** — \`Error() string\`: checked by \`fmt\` and every function that returns an error. Implement it on any type to make it usable as an error value.
- **\`io.Reader\`** — \`Read([]byte) (int, error)\`: checked by anything that reads bytes — \`json.Decoder\`, \`http.Request.Body\`, \`io.Copy\`, and more. A type satisfying \`io.Reader\` works with all of them.

These are all just interfaces. Go checks for them implicitly at compile time; nothing needs to be declared or registered.

## Interface Composition

Interfaces can embed other interfaces to form larger contracts. The standard library uses this heavily:

\`\`\`go
type Reader interface {
    Read(p []byte) (n int, err error)
}

type Writer interface {
    Write(p []byte) (n int, err error)
}

// ReadWriter composes both — any type satisfying both Read and Write satisfies ReadWriter
type ReadWriter interface {
    Reader
    Writer
}
\`\`\`

\`io.Reader\` and \`io.Writer\` are the most important interfaces in Go's standard library. They appear everywhere: files, network connections, HTTP bodies, in-memory buffers. A function that accepts \`io.Reader\` works with all of them without knowing which one it has received.

## The Interface Nil Pitfall

A common source of bugs: an interface variable is only \`nil\` when both its type and value are nil. A typed nil pointer stored in an interface is **not** nil:

\`\`\`go
var p *Person = nil
var s fmt.Stringer = p  // s has type *Person, value nil

fmt.Println(p == nil) // true
fmt.Println(s == nil) // false! — s has a type component set

// Calling s.String() would panic — *Person is nil
\`\`\`

The fix is to return a bare \`nil\` (untyped) directly rather than assigning a typed nil to an interface variable. This is why error-returning functions should return \`nil\` as the error, not \`(*MyError)(nil)\`.
`,
  quiz: [
    {
      question: "How does a type satisfy an interface in Go?",
      options: [
        "By using the implements keyword",
        "By extending the interface",
        "By declaring it in the struct definition",
        "By implementing all the interface's methods",
      ],
      correctIndex: 3,
    },
    {
      question: "What is the safe way to perform a type assertion?",
      options: [
        "v := x.(T)",
        "v, ok := x.(T)",
        "v := x as T",
        "v := cast(x, T)",
      ],
      correctIndex: 1,
    },
    {
      question: "Which method must a type implement to customize how fmt.Println prints it?",
      options: [
        "Print() string",
        "Format() string",
        "String() string",
        "ToString() string",
      ],
      correctIndex: 2,
    },
  ],
};
