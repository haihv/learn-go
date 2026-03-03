import type { WorkshopModule } from "../types";

export const stringsRunesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "29",
  slug: "strings-runes-workshop",
  title: "Strings & Runes Workshop",
  icon: "📝",
  estimatedMinutes: 20,
  description: "Practice the strings package, strconv, and strings.Builder.",
  steps: [
    {
      instruction:
        "Use the `strings` package to: check if \"Hello, Gopher!\" contains \"Gopher\", convert to uppercase, split by \", \", and join with \" | \". Print each result.",
      starterCode: `package main

import (
	"fmt"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	// TODO: use strings.Contains, strings.ToUpper, strings.Split, strings.Join
	_ = s
	_ = strings.Contains
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))
}
`,
      validate: (code: string) =>
        code.includes("strings.") &&
        (code.includes("Contains") ||
          code.includes("ToUpper") ||
          code.includes("Split")),
      successMessage:
        "The strings package covers most string manipulation needs without regex.",
    },
    {
      instruction:
        "Use `strconv.Atoi` to parse \"42\" into an int, `strconv.Itoa` to convert 100 back to string, and `strconv.ParseFloat` to parse \"3.14\". Print all results.",
      starterCode: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	// TODO: use strconv.Atoi, strconv.Itoa, strconv.ParseFloat
	_ = strconv.Atoi
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)
}
`,
      validate: (code: string) =>
        code.includes("strconv.") &&
        (code.includes("Atoi") || code.includes("Itoa")),
      successMessage:
        "strconv bridges the gap between strings and numeric types.",
    },
    {
      instruction:
        "Use `strings.Builder` to efficiently build a comma-separated list from `[]string{\"Go\", \"Python\", \"Rust\", \"TypeScript\"}`. Print the result.",
      starterCode: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)

	// TODO: use strings.Builder to build a comma-separated list
	langs := []string{"Go", "Python", "Rust", "TypeScript"}
	_ = langs
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)

	langs := []string{"Go", "Python", "Rust", "TypeScript"}
	var sb strings.Builder
	for i, lang := range langs {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(lang)
	}
	fmt.Println(sb.String())
}
`,
      validate: (code: string) => code.includes("strings.Builder"),
      successMessage:
        "strings.Builder avoids O(n²) allocations from repeated string concatenation.",
    },
    {
      instruction:
        "Iterate over the string \"Hello, 世界\" with `for range` to count runes (characters), then use `len()` to count bytes. Print both. Show they differ for multi-byte characters.",
      starterCode: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)

	langs := []string{"Go", "Python", "Rust", "TypeScript"}
	var sb strings.Builder
	for i, lang := range langs {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(lang)
	}
	fmt.Println(sb.String())

	// TODO: count runes with for range and bytes with len() on "Hello, 世界"
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)

	langs := []string{"Go", "Python", "Rust", "TypeScript"}
	var sb strings.Builder
	for i, lang := range langs {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(lang)
	}
	fmt.Println(sb.String())

	hello := "Hello, 世界"
	runeCount := 0
	for range hello {
		runeCount++
	}
	fmt.Println("runes:", runeCount)
	fmt.Println("bytes:", len(hello))
}
`,
      validate: (code: string) =>
        code.includes("range") && code.includes("len("),
      successMessage:
        "range over a string yields runes; len() counts bytes — they differ for non-ASCII text.",
    },
    {
      instruction:
        "Write `reverseWords(s string) string` that reverses the word order in a sentence (e.g., \"Go is fun\" → \"fun is Go\") using `strings.Fields` and `strings.Join`.",
      starterCode: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

// TODO: write reverseWords(s string) string using strings.Fields and strings.Join

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)

	langs := []string{"Go", "Python", "Rust", "TypeScript"}
	var sb strings.Builder
	for i, lang := range langs {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(lang)
	}
	fmt.Println(sb.String())

	hello := "Hello, 世界"
	runeCount := 0
	for range hello {
		runeCount++
	}
	fmt.Println("runes:", runeCount)
	fmt.Println("bytes:", len(hello))

	fmt.Println(reverseWords("Go is fun"))
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
	"strings"
)

func reverseWords(s string) string {
	words := strings.Fields(s)
	for i, j := 0, len(words)-1; i < j; i, j = i+1, j-1 {
		words[i], words[j] = words[j], words[i]
	}
	return strings.Join(words, " ")
}

func main() {
	s := "Hello, Gopher!"
	fmt.Println(strings.Contains(s, "Gopher"))
	fmt.Println(strings.ToUpper(s))
	parts := strings.Split(s, ", ")
	fmt.Println(parts)
	fmt.Println(strings.Join(parts, " | "))

	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	str := strconv.Itoa(100)
	fmt.Println(str)

	f, err := strconv.ParseFloat("3.14", 64)
	fmt.Println(f, err)

	langs := []string{"Go", "Python", "Rust", "TypeScript"}
	var sb strings.Builder
	for i, lang := range langs {
		if i > 0 {
			sb.WriteString(", ")
		}
		sb.WriteString(lang)
	}
	fmt.Println(sb.String())

	hello := "Hello, 世界"
	runeCount := 0
	for range hello {
		runeCount++
	}
	fmt.Println("runes:", runeCount)
	fmt.Println("bytes:", len(hello))

	fmt.Println(reverseWords("Go is fun"))
}
`,
      validate: (code: string) =>
        code.includes("reverseWords") && code.includes("strings."),
      successMessage:
        "strings.Fields splits on any whitespace — more robust than strings.Split for words.",
    },
  ],
};
