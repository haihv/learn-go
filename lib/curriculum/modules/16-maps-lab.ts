import type { LabModule } from "../types";

export const mapsLab: LabModule = {
  type: "lab",
  id: "16",
  slug: "maps-lab",
  title: "Word Frequency Analyzer Lab",
  icon: "📊",
  estimatedMinutes: 25,
  description: "Count how often each word appears in a sentence using a map.",
  instructions: `## Word Frequency Analyzer Lab

In this lab, you will build a word frequency analyzer using a \`map[string]int\`.

### Your Task

Given the input string:

\`\`\`
"the quick brown fox jumps over the lazy dog"
\`\`\`

1. Split it into words using \`strings.Fields\`
2. Count how many times each word appears using a \`map[string]int\`
3. Print all word counts (any order is fine)
4. Print the count for \`"the"\` specifically
5. Print the total number of unique words

### Expected Output

\`\`\`
brown: 1
dog: 1
fox: 1
jumps: 1
lazy: 1
over: 1
quick: 1
the: 2
the: 2
Unique words: 8
\`\`\`

> Note: the order of word count lines may differ since Go maps have no guaranteed iteration order. The important values are \`the: 2\` and \`Unique words: 8\`.
`,
  starterCode: `package main

import (
	"fmt"
	"strings"
)

func main() {
	sentence := "the quick brown fox jumps over the lazy dog"

	// TODO: split sentence into words using strings.Fields
	words := strings.Fields(sentence)

	// TODO: declare a map[string]int to hold word frequencies

	// TODO: iterate over words and increment the count for each word

	// TODO: print all word counts (e.g. fmt.Printf("%s: %d\\n", word, count))

	// TODO: print the count for "the" (e.g. fmt.Printf("the: %d\\n", freq["the"]))

	// TODO: print the number of unique words (e.g. fmt.Printf("Unique words: %d\\n", len(freq)))

	_ = words
	fmt.Println("Implement the word frequency counter above!")
}
`,
  solutionCode: `package main

import (
	"fmt"
	"strings"
)

func main() {
	sentence := "the quick brown fox jumps over the lazy dog"

	words := strings.Fields(sentence)

	freq := make(map[string]int)
	for _, word := range words {
		freq[word]++
	}

	for word, count := range freq {
		fmt.Printf("%s: %d\\n", word, count)
	}

	fmt.Printf("the: %d\\n", freq["the"])
	fmt.Printf("Unique words: %d\\n", len(freq))
}
`,
  tests: [
    {
      name: "Uses map[string]int",
      description: "Your code must declare a map[string]int to store word frequencies.",
      validate: (code: string, _stdout: string) => code.includes("map[string]int"),
    },
    {
      name: '"the" appears twice',
      description: 'The output must show that "the" has a count of 2.',
      validate: (_code: string, stdout: string) =>
        stdout.includes("the: 2") || stdout.includes("the 2") || stdout.includes('"the": 2'),
    },
    {
      name: "Unique word count is 8",
      description: "The sentence contains 8 unique words; your output must include 8.",
      validate: (_code: string, stdout: string) => stdout.includes("8"),
    },
    {
      name: "Uses strings.Fields or strings.Split",
      description: "Split the sentence into words using strings.Fields or strings.Split.",
      validate: (code: string, _stdout: string) =>
        code.includes("strings.Fields") || code.includes("strings.Split"),
    },
    {
      name: "Prints word counts",
      description: "Your output must include individual word counts such as fox or quick.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("fox") || stdout.includes("quick"),
    },
  ],
};
