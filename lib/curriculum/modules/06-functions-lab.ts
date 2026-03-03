import type { LabModule } from "../types";

export const functionsLab: LabModule = {
  type: "lab",
  id: "06",
  slug: "functions-lab",
  title: "Temperature Converter Lab",
  icon: "🌡️",
  estimatedMinutes: 20,
  description: "Build a temperature converter with two functions.",
  instructions: `## Temperature Converter Lab

In this lab, you will implement two temperature conversion functions in Go.

### Your Task

Implement the following two functions:

**1. \`celsiusToFahrenheit(c float64) float64\`**
- Formula: \`c * 9 / 5 + 32\`

**2. \`fahrenheitToCelsius(f float64) float64\`**
- Formula: \`(f - 32) * 5 / 9\`

Then, in \`main\`, convert and print the following:
- 100°C → °F
- 32°F → °C
- 0°C → °F

### Expected Output

\`\`\`
100°C = 212.00°F
32°F = 0.00°C
0°C = 32.00°F
\`\`\`
`,
  starterCode: `package main

import "fmt"

func celsiusToFahrenheit(c float64) float64 {
	// TODO: implement the formula c*9/5 + 32
	return 0
}

func fahrenheitToCelsius(f float64) float64 {
	// TODO: implement the formula (f - 32) * 5 / 9
	return 0
}

func main() {
	// TODO: convert 100°C to °F and print the result
	// TODO: convert 32°F to °C and print the result
	// TODO: convert 0°C to °F and print the result
	fmt.Println("Implement the functions above!")
}
`,
  solutionCode: `package main

import "fmt"

func celsiusToFahrenheit(c float64) float64 {
	return c*9/5 + 32
}

func fahrenheitToCelsius(f float64) float64 {
	return (f - 32) * 5 / 9
}

func main() {
	fmt.Printf("100°C = %.2f°F\\n", celsiusToFahrenheit(100))
	fmt.Printf("32°F = %.2f°C\\n", fahrenheitToCelsius(32))
	fmt.Printf("0°C = %.2f°F\\n", celsiusToFahrenheit(0))
}
`,
  tests: [
    {
      name: "celsiusToFahrenheit function exists",
      description: "Your code must define a function named celsiusToFahrenheit.",
      validate: (code: string, _stdout: string) => code.includes("func celsiusToFahrenheit"),
    },
    {
      name: "fahrenheitToCelsius function exists",
      description: "Your code must define a function named fahrenheitToCelsius.",
      validate: (code: string, _stdout: string) => code.includes("func fahrenheitToCelsius"),
    },
    {
      name: "100°C converts to 212°F",
      description: "Converting 100°C should produce 212.00°F in the output.",
      validate: (_code: string, stdout: string) => stdout.includes("212"),
    },
    {
      name: "32°F converts to 0°C",
      description: "Converting 32°F should produce 0.00°C in the output.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("0.00") || stdout.includes("0°C") || stdout.includes("= 0"),
    },
    {
      name: "Uses float64 for precision",
      description: "Your functions must use float64 as the parameter and return type.",
      validate: (code: string, _stdout: string) => code.includes("float64"),
    },
  ],
};
