import type { LessonModule } from "../types";

export const stringsRunes: LessonModule = {
	type: "lesson",
	id: "28",
	slug: "strings-runes",
	title: "Strings & Runes",
	icon: "📝",
	estimatedMinutes: 14,
	content: `# Strings & Runes

## Strings Are Byte Slices

In Go, a string is an immutable sequence of bytes — specifically, UTF-8 encoded bytes. This means a string is not a sequence of characters; it is a sequence of raw bytes that happen to encode text.

\`\`\`go
package main

import "fmt"

func main() {
	s := "hello"
	fmt.Println(len(s)) // 5 — five bytes, one per ASCII character

	s2 := "日本語"
	fmt.Println(len(s2)) // 9 — three characters, but 3 bytes each in UTF-8
}
\`\`\`

The key insight: \`len(s)\` returns the **byte count**, not the number of visible characters. For ASCII-only strings these are equal, but for multi-byte Unicode text they are not.

## Runes: Unicode Code Points

Go introduces the \`rune\` type as an alias for \`int32\`. A rune represents a single Unicode code point — what most languages call a "character".

\`\`\`go
package main

import "fmt"

func main() {
	r := '日'
	fmt.Printf("rune value: %d, char: %c\\n", r, r)
	// rune value: 26085, char: 日
}
\`\`\`

Single-quoted literals produce a \`rune\` (int32). Double-quoted literals produce a \`string\`.

## Iterating: range vs index

There are two ways to iterate over a string, and they behave differently:

**Range loop — iterates over runes (Unicode-safe):**

\`\`\`go
package main

import "fmt"

func main() {
	s := "日本語"
	for i, ch := range s {
		fmt.Printf("index %d: %c (rune %d)\\n", i, ch, ch)
	}
}
// index 0: 日 (rune 26085)
// index 3: 本 (rune 26412)
// index 6: 語 (rune 35486)
\`\`\`

Notice the byte indices jump by 3 because each character occupies 3 bytes.

**Index loop — iterates over bytes:**

\`\`\`go
package main

import "fmt"

func main() {
	s := "hi"
	for i := 0; i < len(s); i++ {
		fmt.Printf("byte[%d] = %d\\n", i, s[i])
	}
}
\`\`\`

Use range for text processing; use direct index access only when you are deliberately working with raw bytes.

## The strings Package

The \`strings\` package covers virtually every common string operation:

\`\`\`go
package main

import (
	"fmt"
	"strings"
)

func main() {
	s := "  Hello, Go!  "

	fmt.Println(strings.TrimSpace(s))          // "Hello, Go!"
	fmt.Println(strings.ToUpper("hello"))       // "HELLO"
	fmt.Println(strings.ToLower("HELLO"))       // "hello"
	fmt.Println(strings.Contains(s, "Go"))      // true
	fmt.Println(strings.HasPrefix("golang", "go")) // false — case-sensitive
	fmt.Println(strings.HasSuffix("golang", "lang")) // true
	fmt.Println(strings.Count("mississippi", "ss")) // 2
	fmt.Println(strings.Replace("aabbcc", "b", "x", 1)) // "aaxbcc"

	parts := strings.Split("a,b,c", ",")
	fmt.Println(parts)                         // [a b c]
	fmt.Println(strings.Join(parts, " - "))    // "a - b - c"

	words := strings.Fields("  foo  bar  baz  ")
	fmt.Println(words)                         // [foo bar baz]

	fmt.Println(strings.Repeat("ab", 3))       // "ababab"
}
\`\`\`

\`strings.Fields\` splits on any whitespace and ignores leading/trailing spaces — often more convenient than \`strings.Split(s, " ")\`.

## The strconv Package

\`strconv\` converts between strings and primitive types:

\`\`\`go
package main

import (
	"fmt"
	"strconv"
)

func main() {
	// integer ↔ string
	n, err := strconv.Atoi("42")
	if err == nil {
		fmt.Println(n + 1) // 43
	}
	fmt.Println(strconv.Itoa(100)) // "100"

	// float ↔ string
	f, _ := strconv.ParseFloat("3.14", 64)
	fmt.Println(f * 2)                          // 6.28
	fmt.Println(strconv.FormatFloat(f, 'f', 2, 64)) // "3.14"

	// bool ↔ string
	b, _ := strconv.ParseBool("true")
	fmt.Println(b)                              // true
	fmt.Println(strconv.FormatBool(false))      // "false"
}
\`\`\`

Always check the \`error\` return from \`Atoi\` and \`ParseFloat\` — user input may not be valid.

## Efficient Concatenation with strings.Builder

Concatenating strings with \`+\` inside a loop creates a new string allocation on every iteration, giving O(n²) total work. \`strings.Builder\` accumulates writes into a single buffer and produces the final string with one allocation:

\`\`\`go
package main

import (
	"fmt"
	"strings"
)

func main() {
	var b strings.Builder
	for i := 0; i < 5; i++ {
		fmt.Fprintf(&b, "item %d\\n", i)
	}
	result := b.String()
	fmt.Print(result)
}
\`\`\`

Use \`strings.Builder\` any time you are building a string incrementally — it satisfies \`io.Writer\`, so \`fmt.Fprintf\` works directly.

## Type Conversions

Go lets you convert freely between strings, byte slices, and rune slices:

\`\`\`go
package main

import "fmt"

func main() {
	s := "hello"

	// string → []byte and back
	b := []byte(s)
	b[0] = 'H'
	fmt.Println(string(b)) // "Hello"

	// string → []rune and back (Unicode-safe character indexing)
	runes := []rune("日本語")
	fmt.Println(len(runes))        // 3 — character count
	fmt.Println(string(runes[1:])) // "本語"

	// build a string from individual runes
	r := []rune{72, 101, 108, 108, 111}
	fmt.Println(string(r)) // "Hello"
}
\`\`\`

Converting to \`[]rune\` is the correct way to index into a string by character position rather than byte position.
`,
	quiz: [
		{
			question: 'What does `len("hello")` return in Go?',
			options: [
				"The number of runes",
				"The number of bytes",
				"The number of words",
				"Always 5",
			],
			correctIndex: 1,
		},
		{
			question: "Which type represents a Unicode code point in Go?",
			options: ["char", "byte", "rune", "unicode"],
			correctIndex: 2,
		},
		{
			question:
				"What is the advantage of strings.Builder over repeated string concatenation?",
			options: [
				"It's shorter to write",
				"It avoids O(n²) allocations by building the string in one buffer",
				"It supports Unicode better",
				"It's thread-safe",
			],
			correctIndex: 1,
		},
	],
};
