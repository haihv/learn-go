import type { LabModule } from "../types";

export const variablesLab: LabModule = {
  type: "lab",
  id: "03",
  slug: "variables-lab",
  title: "Variables Lab",
  icon: "🧪",
  estimatedMinutes: 20,
  description: "Declare variables for a user profile and print them in a formatted message.",
  instructions: `## Variables Lab

In this lab, you will declare variables for a user profile and print them using formatted output.

### Your Task

Declare the following variables:
- \`name\` — a \`string\` representing the user's name (e.g., \`"Alice"\`)
- \`age\` — an \`int\` representing the user's age (e.g., \`25\`)
- \`country\` — a \`string\` representing the user's country (e.g., \`"Vietnam"\`)
- \`isStudent\` — a \`bool\` representing whether the user is a student (e.g., \`true\`)

Then print the profile using \`fmt.Printf\` so the output looks like:

\`\`\`
Name: Alice
Age: 25
Country: Vietnam
Student: true
\`\`\`

### Format Verbs

Use these \`fmt.Printf\` format verbs:
- \`%s\` — for strings
- \`%d\` — for integers
- \`%v\` — for booleans (or any value)

### Example

\`\`\`go
fmt.Printf("Name: %s\\n", name)
fmt.Printf("Age: %d\\n", age)
\`\`\`
`,
  starterCode: `package main

import "fmt"

func main() {
	// Declare your variables here
	// name (string) — e.g. "Alice"
	// age (int) — e.g. 25
	// country (string) — e.g. "Vietnam"
	// isStudent (bool) — e.g. true

	// Print the profile using fmt.Printf
	// Expected output:
	// Name: Alice
	// Age: 25
	// Country: Vietnam
	// Student: true
	_ = fmt.Sprintf // remove this line when you add your fmt.Printf calls
}
`,
  solutionCode: `package main

import "fmt"

func main() {
	name := "Alice"
	age := 25
	country := "Vietnam"
	isStudent := true

	fmt.Printf("Name: %s\\n", name)
	fmt.Printf("Age: %d\\n", age)
	fmt.Printf("Country: %s\\n", country)
	fmt.Printf("Student: %v\\n", isStudent)
}
`,
  tests: [
    {
      name: "Declares name variable",
      description: "Your code must declare a variable called 'name'.",
      validate: (code: string, _stdout: string) => code.includes("name"),
    },
    {
      name: "Declares age variable",
      description: "Your code must declare a variable called 'age'.",
      validate: (code: string, _stdout: string) => code.includes("age"),
    },
    {
      name: "Declares isStudent variable",
      description: "Your code must declare a variable called 'isStudent'.",
      validate: (code: string, _stdout: string) => code.includes("isStudent"),
    },
    {
      name: "Prints name in output",
      description: "Your output should include a name label or value (e.g. 'Name:' or 'Alice').",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Name:") ||
        stdout.toLowerCase().includes("alice") ||
        stdout.toLowerCase().includes("name"),
    },
    {
      name: "Uses fmt.Printf for formatting",
      description: "Use fmt.Printf to print the profile fields.",
      validate: (code: string, _stdout: string) => code.includes("fmt.Printf"),
    },
  ],
};
