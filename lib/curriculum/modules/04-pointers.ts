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

## Pointer Indirection in Method Calls

Go quietly bridges the gap between value and pointer receivers at call sites. When you call a pointer-receiver method on an addressable value variable, Go rewrites the call as \`(&v).Method()\` for you. The reverse also applies: a value-receiver method called on a pointer is rewritten as \`(*p).Method()\`.

\`\`\`go
type Counter struct{ n int }

func (c *Counter) Inc() { c.n++ }          // pointer receiver — mutates
func (c Counter) Value() int { return c.n } // value receiver — reads copy

func main() {
    c := Counter{}
    c.Inc()               // Go rewrites as (&c).Inc() — c is addressable
    fmt.Println(c.Value()) // 1

    p := &Counter{}
    p.Inc()               // normal pointer-receiver call
    fmt.Println(p.Value()) // Go rewrites as (*p).Value() — 1
}
\`\`\`

**The addressability constraint** is the key limit: Go can only auto-take the address of a variable, not of an expression that produces a temporary value. A composite literal used directly as a call target is not addressable, so \`Counter{}.Inc()\` is a compile error — there is no variable whose address Go can use.

The practical takeaway: declare your receiver as a variable (\`c := Counter{}\`) and Go handles the \`&\` and \`*\` mechanics transparently.

## Choosing a Value or Pointer Receiver

The Tour of Go gives clear guidance on which receiver type to choose. The decision affects correctness, performance, and interface satisfaction.

### Use a pointer receiver when:

- **The method must modify the receiver.** A value receiver gets a copy; mutations are discarded when the method returns.
- **The struct is large.** Copying a large struct on every call wastes CPU and stack space; a pointer costs only 8 bytes.
- **Consistency.** If any method on a type uses a pointer receiver, all methods should — mixing creates confusion about which calls mutate the original and which do not, and it breaks interface satisfaction in subtle ways.

### Use a value receiver when:

- **The method only reads the receiver** and the type is small enough that copying is cheap.
- **You want call-site immutability** — callers pass a value and the method cannot affect their copy.
- **The type is a primitive alias** (e.g., \`type Celsius float64\`) where pointer overhead is not justified.

### The consistency rule in practice

\`\`\`go
type Account struct {
    owner   string
    balance float64
}

// All methods use pointer receivers for consistency, even though
// Owner() does not mutate — mixing would force callers to track which
// methods need a pointer and which do not.
func (a *Account) Deposit(amount float64) { a.balance += amount }
func (a *Account) Withdraw(amount float64) { a.balance -= amount }
func (a *Account) Balance() float64        { return a.balance }
func (a *Account) Owner() string           { return a.owner }
\`\`\`

When a type satisfies an interface, Go requires that the method set matches. A pointer receiver method is only in the method set of \`*T\`, not \`T\` — so keeping all methods on pointer receivers avoids the common mistake of passing a value where a pointer is needed to satisfy an interface.
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
      question: "You have `var c Counter` and `func (c *Counter) Inc()`. How do you call Inc?",
      options: [
        "Must use: (&c).Inc()",
        "c.Inc() — Go auto-takes the address of an addressable variable",
        "Cannot call pointer-receiver methods on a value",
        "*c.Inc()",
      ],
      correctIndex: 1,
    },
  ],
};
