import type { LessonModule } from "../types";

export const basicTypes: LessonModule = {
  type: "lesson",
  id: "01b",
  slug: "basic-types",
  title: "Basic Types",
  icon: "🔢",
  estimatedMinutes: 12,
  content: `# Basic Types

## Go's Built-in Types

Go has a fixed set of built-in types. Unlike languages that let you ignore type sizes, Go makes every category explicit — you always know exactly how much memory a value occupies.

| Category | Types |
|---|---|
| Boolean | \`bool\` |
| String | \`string\` |
| Integer | \`int\`, \`int8\`, \`int16\`, \`int32\`, \`int64\` |
| Unsigned int | \`uint\`, \`uint8\`, \`uint16\`, \`uint32\`, \`uint64\`, \`uintptr\` |
| Byte / Rune | \`byte\` (alias for \`uint8\`), \`rune\` (alias for \`int32\`) |
| Float | \`float32\`, \`float64\` |
| Complex | \`complex64\`, \`complex128\` |

All numeric types are distinct — Go will not silently widen or narrow them for you.

## When to Use Which Integer

Picking the right integer type avoids subtle bugs and communicates intent to readers:

- **\`int\`** — the go-to for general-purpose integers. Its size matches the platform: 32-bit on 32-bit systems, 64-bit on 64-bit systems. Use this unless you have a specific reason not to.
- **\`int32\` / \`int64\`** — reach for these when you need a guaranteed width, such as when reading binary file formats or implementing network protocols where the wire format is specified.
- **\`byte\`** — the natural type for raw bytes. Use it for file I/O, network buffers, and anything that processes binary data.
- **\`rune\`** — represents a Unicode code point (a single character in the broadest sense). Use it when iterating over or processing human-readable text, since a \`rune\` correctly handles multi-byte UTF-8 characters that a \`byte\` would split.
- **Avoid \`uint\` for general use** — mixing signed and unsigned integers is a common source of subtle bugs (e.g., subtracting two \`uint\` values where the result should be negative silently wraps around). Only reach for unsigned types when the domain genuinely prohibits negative values *and* you need the extra bit of range.

## Zero Values

Go guarantees that every variable is initialized. If you declare a variable without an explicit value, it receives its type's **zero value** — there is no concept of "undefined" or uninitialized memory in Go.

\`\`\`go
package main

import "fmt"

func main() {
    var i int
    var f float64
    var b bool
    var s string

    fmt.Printf("%v\\n", i) // 0
    fmt.Printf("%v\\n", f) // 0
    fmt.Printf("%v\\n", b) // false
    fmt.Printf("%q\\n", s) // ""
}
\`\`\`

Output:

\`\`\`
0
0
false
""
\`\`\`

Key zero values to remember:

| Type | Zero value |
|---|---|
| \`int\`, \`float64\`, etc. | \`0\` |
| \`bool\` | \`false\` |
| \`string\` | \`""\` (empty string — never \`nil\`) |
| Pointers, slices, maps, channels, functions | \`nil\` |

The \`%q\` verb wraps a string in double quotes, making it obvious that an empty string is truly \`""\` rather than invisible whitespace.

## Type Conversions

Go has **no implicit type conversions**. Every conversion must be written explicitly as \`T(value)\`. This is a deliberate design choice: implicit conversions in other languages are a common source of precision loss, overflow, and surprising behavior that Go's compiler simply refuses to allow.

\`\`\`go
package main

import "fmt"

func main() {
    var i int = 42
    var f float64 = float64(i)  // explicit: int → float64
    var u uint = uint(f)        // explicit: float64 → uint

    fmt.Println(i, f, u)
}
\`\`\`

Contrast this with C or JavaScript, where \`int + float\` silently promotes the integer. In Go, \`var f float64 = i\` is a compile error — the compiler forces you to acknowledge the conversion.

**Truncation is your responsibility.** Converting a \`float64\` to \`int\` drops the fractional part without rounding:

\`\`\`go
var f float64 = 3.99
var i int = int(f) // i == 3, not 4
\`\`\`

## Numeric Constants

Untyped constants in Go carry more precision than any single numeric type. The compiler gives them the type required by their context, so a single constant can behave as an \`int\`, \`float64\`, or anything else without an explicit cast.

\`\`\`go
package main

import "fmt"

// Big and Small are untyped integer constants — no type annotation needed.
// The compiler tracks them as arbitrary-precision integers during compilation.
const Big = 1 << 62
const Small = Big >> 61 // = 2

func needFloat(x float64) float64 { return x * 0.1 }

func main() {
    // Small is used as float64 here because needFloat demands float64.
    fmt.Println(needFloat(Small)) // 0.2

    // Small is used as int here.
    fmt.Println(Small + 0) // 2
}
\`\`\`

This is why you can write \`const Pi = 3.14159\` and use it wherever a \`float32\` or \`float64\` is needed without any cast — the constant adapts. Named typed constants (e.g., \`const x int = 5\`) do not have this flexibility; they behave like regular typed values.
`,
  quiz: [
    {
      question: "What is the zero value of a `string` variable in Go?",
      options: ["nil", '""', '"null"', '"0"'],
      correctIndex: 1,
    },
    {
      question: "`byte` is an alias for which type?",
      options: ["uint16", "int8", "uint8", "int16"],
      correctIndex: 2,
    },
    {
      question: "Converting `int` to `float64` in Go requires:",
      options: ["float64(i)", "(float64)i", "i as float64", "cast<float64>(i)"],
      correctIndex: 0,
    },
  ],
};
