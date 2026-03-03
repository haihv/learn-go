import type { LabModule } from "../types";

export const fileIOLab: LabModule = {
  type: "lab",
  id: "47",
  slug: "file-io-lab",
  title: "Word Count Lab",
  icon: "📄",
  estimatedMinutes: 30,
  description: "Build a wordcount program that reads a file and counts its lines and words.",
  instructions: `## Word Count Lab

Build a \`wordcount\` program that reads a text file and reports its line count and word count.

### Program behaviour

Read the file path from \`os.Args[1]\`. Count:
- **Lines**: number of newline-terminated lines (count how many times \\n appears, or use a Scanner)
- **Words**: number of whitespace-separated tokens across all lines

Print the result in exactly this format:

\`\`\`
Lines: 3, Words: 9
\`\`\`

### Implementation steps

1. Read \`os.Args[1]\` as the file path
2. Open the file with \`os.Open\` (remember \`defer f.Close()\`)
3. Use \`bufio.Scanner\` to read line by line
4. For each line, use \`strings.Fields\` to split into words and accumulate the count
5. After the loop, print \`Lines: N, Words: M\`

### Handling an empty file

An empty file should print:

\`\`\`
Lines: 0, Words: 0
\`\`\`

### Testing in main

Since the Playground can't read from disk, simulate the input with \`strings.NewReader\`:

\`\`\`go
// Replace os.Open with strings.NewReader for testing
input := strings.NewReader("the quick brown fox\\njumps over the lazy dog\\nGo is great\\n")
\`\`\`

Your \`countLines\` / main logic should accept an \`io.Reader\` so it works with both a real file and the test input.
`,
  starterCode: `package main

import (
	"bufio"
	"fmt"
	"io"
	"strings"
)

// wordCount reads from r and returns (lines, words).
func wordCount(r io.Reader) (int, int) {
	// TODO: use bufio.Scanner to iterate lines
	// For each line, use strings.Fields to count words
	// Return total lines and total words
	_ = bufio.NewScanner
	_ = strings.Fields
	return 0, 0
}

func main() {
	// Test with a fixed string (simulates reading a file)
	input := strings.NewReader("the quick brown fox\\njumps over the lazy dog\\nGo is great\\n")
	lines, words := wordCount(input)
	fmt.Printf("Lines: %d, Words: %d\\n", lines, words)

	// Test with empty input
	empty := strings.NewReader("")
	lines2, words2 := wordCount(empty)
	fmt.Printf("Lines: %d, Words: %d\\n", lines2, words2)
}
`,
  solutionCode: `package main

import (
	"bufio"
	"fmt"
	"io"
	"strings"
)

func wordCount(r io.Reader) (int, int) {
	scanner := bufio.NewScanner(r)
	lines, words := 0, 0
	for scanner.Scan() {
		lines++
		words += len(strings.Fields(scanner.Text()))
	}
	return lines, words
}

func main() {
	input := strings.NewReader("the quick brown fox\\njumps over the lazy dog\\nGo is great\\n")
	lines, words := wordCount(input)
	fmt.Printf("Lines: %d, Words: %d\\n", lines, words)

	empty := strings.NewReader("")
	lines2, words2 := wordCount(empty)
	fmt.Printf("Lines: %d, Words: %d\\n", lines2, words2)
}
`,
  tests: [
    {
      name: "Uses bufio.Scanner",
      description: "Read input line-by-line with bufio.Scanner.",
      validate: (code: string, _stdout: string) =>
        code.includes("bufio.NewScanner") || code.includes("bufio.Scanner"),
    },
    {
      name: "Counts words with strings.Fields",
      description: "Split each line into words using strings.Fields.",
      validate: (code: string, _stdout: string) =>
        code.includes("strings.Fields"),
    },
    {
      name: "Correct count for three-line input",
      description: "Report Lines: 3, Words: 9 for the sample input.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Lines: 3") && stdout.includes("Words: 9"),
    },
    {
      name: "Handles empty input",
      description: "Report Lines: 0, Words: 0 for an empty reader.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Lines: 0") && stdout.includes("Words: 0"),
    },
    {
      name: "Accepts io.Reader",
      description: "The counting function takes an io.Reader so it works with files and strings alike.",
      validate: (code: string, _stdout: string) =>
        code.includes("io.Reader"),
    },
  ],
};
