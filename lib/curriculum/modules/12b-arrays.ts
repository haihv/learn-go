import { LessonModule } from "../types";

export const arrays: LessonModule = {
  type: "lesson",
  id: "12b",
  slug: "arrays",
  title: "Arrays",
  icon: "📦",
  estimatedMinutes: 10,
  content: `# Arrays

Arrays are Go's fixed-length sequences. Unlike slices, **the length is part of the type** — \`[3]int\` and \`[4]int\` are entirely distinct types and are not interchangeable.

## Declaring Arrays

The type syntax is \`[n]Type\` where \`n\` is a compile-time constant:

\`\`\`go
var a [5]int          // zero-valued: [0 0 0 0 0]
var b [3]string       // zero-valued: ["" "" ""]
\`\`\`

Go zero-initializes every element, so you always get a predictable starting state without explicit initialization.

## Array Literals

Use a composite literal to declare and initialize at once:

\`\`\`go
primes := [5]int{2, 3, 5, 7, 11}
colors := [3]string{"red", "green", "blue"}
\`\`\`

You can also let the compiler count the elements with \`...\`:

\`\`\`go
days := [...]string{"Mon", "Tue", "Wed", "Thu", "Fri"}
// compiler infers length 5; type is [5]string
\`\`\`

## Indexing and Length

Elements are accessed with zero-based indices. \`len\` always returns the declared size — it is constant for a given array type:

\`\`\`go
a := [3]float64{1.1, 2.2, 3.3}

fmt.Println(a[0])    // 1.1
fmt.Println(len(a))  // 3

a[2] = 9.9           // mutation is fine
\`\`\`

Because the length is baked into the type, \`len\` on an array is a compile-time constant — the runtime never needs to look it up.

## Value Semantics — Assignment Copies

This is the most important behavioral difference from slices. **Assigning one array to another copies every element:**

\`\`\`go
x := [3]int{1, 2, 3}
y := x       // full copy of all three elements

y[0] = 99

fmt.Println(x) // [1 2 3]  — x is unchanged
fmt.Println(y) // [99 2 3]
\`\`\`

The same applies when passing an array to a function — the callee receives an independent copy. Modifying it has no effect on the caller's original. This contrasts sharply with slices, which hold a pointer to a backing array and therefore exhibit reference semantics.

## Arrays as the Backing Store for Slices

Every slice in Go is a three-field descriptor — a pointer, a length, and a capacity — that references a region of an underlying array. When you create a slice from an array, both share the same memory:

\`\`\`go
a := [5]int{10, 20, 30, 40, 50}
s := a[1:4]  // slice backed by a; s == [20 30 40]

s[0] = 99
fmt.Println(a) // [10 99 30 40 50] — mutation visible through the array
\`\`\`

Understanding this relationship makes slice behavior predictable. The upcoming **Slices** lesson builds directly on this foundation.

## When to Use Arrays

Because arrays are value types with a fixed size, they shine in specific contexts where that predictability matters:

- **Cryptographic digests** — \`[32]byte\` for a SHA-256 hash; the fixed size is part of the API contract.
- **Fixed-size buffers** — e.g., reading exactly 512 bytes at a time from a file.
- **Pixel and color data** — \`[4]uint8\` for RGBA channels avoids allocation overhead.
- **Small lookup tables** — a \`[12]string\` for month names is clearer and cheaper than a slice.

For variable-length collections, prefer slices. Reach for an array when the count is a known constant that belongs in the type.
`,
  quiz: [
    {
      question: "In Go, are `[3]int` and `[4]int` the same type?",
      options: [
        "Yes — length is metadata, not part of the type",
        "No — the length is embedded in the type, so they are distinct types",
        "It depends on the Go version",
        "Yes — both are just 'integer arrays'",
      ],
      correctIndex: 1,
    },
    {
      question: "What happens when you assign one array to another in Go?",
      options: [
        "Both variables point to the same underlying memory",
        "Only the pointer is copied; elements are shared",
        "A full copy of all elements is made",
        "The compiler rejects it because arrays are not assignable",
      ],
      correctIndex: 2,
    },
    {
      question: "What does `len` return for `var a [7]float64`?",
      options: [
        "0, because no elements have been assigned yet",
        "The number of non-zero elements",
        "7",
        "It varies at runtime depending on memory layout",
      ],
      correctIndex: 2,
    },
  ],
};
