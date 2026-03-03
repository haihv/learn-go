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

Declare the following:

**Constants (use \`const\` or a \`const\` block with \`iota\`):**
- \`maxConnections\` — a constant int set to \`100\`
- A \`Role\` const block using \`iota\`: \`Guest = iota\`, \`User\`, \`Admin\` (values 0, 1, 2)

**Variables:**
- \`name\` — a \`string\` representing the user's name (e.g., \`"Alice"\`)
- \`age\` — an \`int\` representing the user's age (e.g., \`25\`)
- \`country\` — a \`string\` representing the user's country (e.g., \`"Vietnam"\`)
- \`isStudent\` — a \`bool\` representing whether the user is a student (e.g., \`true\`)
- \`role\` — assign it the value \`Admin\`

Then print everything so the output looks like:

\`\`\`
Name: Alice
Age: 25
Country: Vietnam
Student: true
Role: 2
Max connections: 100
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

// TODO: declare const maxConnections = 100

// TODO: declare a const block with iota for roles:
// Guest = iota, User, Admin

func main() {
	// TODO: declare name, age, country, isStudent variables
	// TODO: declare role := Admin
	// TODO: print all values using fmt.Printf
	_ = fmt.Sprintf // remove this line when you add your fmt.Printf calls
}
`,
  solutionCode: `package main

import "fmt"

const maxConnections = 100

const (
	Guest = iota
	User
	Admin
)

func main() {
	name := "Alice"
	age := 25
	country := "Vietnam"
	isStudent := true
	role := Admin

	fmt.Printf("Name: %s\\n", name)
	fmt.Printf("Age: %d\\n", age)
	fmt.Printf("Country: %s\\n", country)
	fmt.Printf("Student: %v\\n", isStudent)
	fmt.Printf("Role: %d\\n", role)
	fmt.Printf("Max connections: %d\\n", maxConnections)
}
`,
  tests: [
    {
      name: "Declares name and age variables",
      description: "Your code must declare variables called 'name' and 'age'.",
      validate: (code: string, _stdout: string) => code.includes("name") && code.includes("age"),
    },
    {
      name: "Uses const with iota",
      description: "Your code must use the const keyword and iota.",
      validate: (code: string, _stdout: string) => code.includes("const") && code.includes("iota"),
    },
    {
      name: "Declares maxConnections constant",
      description: "Your code must declare a constant named 'maxConnections'.",
      validate: (code: string, _stdout: string) => code.includes("maxConnections"),
    },
    {
      name: "Prints name in output",
      description: "Your output should include the user's name.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Name:") || stdout.toLowerCase().includes("alice"),
    },
    {
      name: "Prints max connections value",
      description: "Your output should include the maxConnections value (100).",
      validate: (_code: string, stdout: string) => stdout.includes("100"),
    },
    {
      name: "Uses fmt.Printf for formatting",
      description: "Use fmt.Printf to print the profile fields.",
      validate: (code: string, _stdout: string) => code.includes("fmt.Printf"),
    },
  ],
};
