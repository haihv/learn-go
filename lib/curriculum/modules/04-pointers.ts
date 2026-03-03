import type { LessonModule } from "../types";

export const pointers: LessonModule = {
  type: "lesson",
  id: "04",
  slug: "pointers",
  title: "Pointers",
  icon: "📍",
  estimatedMinutes: 14,
  content: `# Pointers

Pointers are one of Go's most important and practical features. They let you work directly with memory addresses — passing references to data rather than copies, and enabling functions to modify variables that live outside their own scope.

## Memory Addresses and the \`&\` Operator

Every variable in your program lives at a specific location in memory. The **address-of operator** \`&\` returns that location as a pointer value.

\`\`\`go
n := 42
p := &n

fmt.Println(n)  // 42
fmt.Println(p)  // 0xc0000b4010 (some memory address)
\`\`\`

The value of \`p\` is not 42 — it is the address where 42 is stored. On most 64-bit systems, a pointer is 8 bytes regardless of what it points to.

## The \`*\` Operator: Dereferencing

To read or write the value that a pointer points to, use the **dereference operator** \`*\`. This follows the pointer to the actual variable.

\`\`\`go
n := 42
p := &n

fmt.Println(*p)  // 42 — reads value at address p
*p = 100         // writes 100 to the address p holds
fmt.Println(n)   // 100 — n was changed through the pointer
\`\`\`

Modifying \`*p\` is exactly the same as modifying \`n\` directly. The pointer is just a path that leads back to the original variable.

## Pointer Types

A pointer's type encodes both the fact that it is a pointer and what type it points to. The type \`*int\` is "pointer to int", \`*string\` is "pointer to string", and so on.

\`\`\`go
var p *int      // pointer to int; zero value is nil
var s *string   // pointer to string; zero value is nil

x := 7
p = &x
fmt.Println(*p) // 7
\`\`\`

The type system prevents you from, for example, assigning a \`*string\` where a \`*int\` is expected — type safety applies to pointers just as it does to regular values.

## Why Use Pointers?

### 1. Modify a caller's variable

Without pointers, a function receives a copy of its arguments. Changes to that copy never escape back to the caller.

\`\`\`go
// This does NOT modify the original
func tryDouble(n int) {
	n *= 2
}

// This DOES modify the original
func double(n *int) {
	*n *= 2
}

func main() {
	x := 5
	tryDouble(x)
	fmt.Println(x) // 5 — unchanged

	double(&x)
	fmt.Println(x) // 10 — modified through pointer
}
\`\`\`

### 2. Avoid copying large structs

When a struct has many fields, passing it by value copies every single field on every call. Passing a pointer copies just the 8-byte address — far cheaper for large types.

\`\`\`go
type BigConfig struct {
	Host     string
	Port     int
	Timeout  int
	MaxConns int
	// ... many more fields
}

// Cheap: only the address is copied
func applyDefaults(cfg *BigConfig) {
	if cfg.Port == 0 {
		cfg.Port = 8080
	}
	if cfg.Timeout == 0 {
		cfg.Timeout = 30
	}
}
\`\`\`

## The Zero Value of a Pointer: \`nil\`

An uninitialized pointer has the zero value \`nil\`, which means it points to nothing. Dereferencing a nil pointer causes a **runtime panic** — one of the most common mistakes in Go.

\`\`\`go
var p *int
fmt.Println(p)  // <nil>
fmt.Println(*p) // PANIC: runtime error: invalid memory address
\`\`\`

Always guard before dereferencing a pointer that might be nil:

\`\`\`go
func printValue(p *int) {
	if p == nil {
		fmt.Println("pointer is nil")
		return
	}
	fmt.Println(*p)
}
\`\`\`

This pattern — check, then dereference — is the standard defense against nil pointer panics.

## Allocating with \`new\`

The built-in \`new(T)\` function allocates memory for a zero-value \`T\` and returns a \`*T\`. It is handy when you want a pointer without first declaring a named variable.

\`\`\`go
p := new(int)     // allocates an int, initialized to 0
fmt.Println(*p)   // 0
*p = 99
fmt.Println(*p)   // 99

s := new(string)
*s = "hello"
fmt.Println(*s)   // hello
\`\`\`

In practice, \`new\` is used less often than you might expect. Most of the time, you either take the address of an existing variable with \`&\`, or use a struct literal with \`&\` to get a pointer to a new struct value.

\`\`\`go
type Point struct{ X, Y int }

p := &Point{X: 3, Y: 4} // *Point; preferred over new(Point) + field setting
fmt.Println(p.X)         // 3
\`\`\`

## Value Receivers vs Pointer Receivers (Preview)

When you define methods on a struct, the receiver can be a value or a pointer. This is the same trade-off as regular function parameters:

- **Value receiver** \`(s MyStruct)\`: the method gets a copy. Reading only, or for small structs.
- **Pointer receiver** \`(s *MyStruct)\`: the method can mutate the original. Required when the method must change fields.

\`\`\`go
type Counter struct {
	Count int
}

// Value receiver — reads but cannot persist changes
func (c Counter) Value() int {
	return c.Count
}

// Pointer receiver — mutations stick
func (c *Counter) Increment() {
	c.Count++
}

func main() {
	c := Counter{}
	c.Increment()
	c.Increment()
	fmt.Println(c.Value()) // 2
}
\`\`\`

Go automatically takes the address of \`c\` when you call a pointer receiver method on an addressable value, so \`c.Increment()\` compiles and works even though \`c\` is not declared as a \`*Counter\`. You will explore this fully in the Structs module.
`,
  quiz: [
    {
      question: "What does `&x` return?",
      options: [
        "The value of x",
        "The memory address of x",
        "A copy of x",
        "nil",
      ],
      correctIndex: 1,
    },
    {
      question: "How do you read the value at a pointer `p`?",
      options: ["*p", "&p", "p.value", "p[]"],
      correctIndex: 0,
    },
    {
      question: "What is the zero value of a pointer type?",
      options: ["0", "false", "nil", "{}"],
      correctIndex: 2,
    },
  ],
};
