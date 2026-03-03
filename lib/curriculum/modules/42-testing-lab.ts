import type { LabModule } from "../types";

export const testingLab: LabModule = {
  type: "lab",
  id: "42",
  slug: "testing-lab",
  title: "Calculator Test Lab",
  icon: "🧮",
  estimatedMinutes: 35,
  description: "Write table-driven tests for a calculator with Add, Sub, Mul, and Div functions.",
  instructions: `## Calculator Test Lab

A \`calculator.go\` file provides four functions. Your job is to write comprehensive table-driven tests for all of them.

### The calculator functions

\`\`\`go
func Add(a, b float64) float64 { return a + b }
func Sub(a, b float64) float64 { return a - b }
func Mul(a, b float64) float64 { return a * b }
func Div(a, b float64) (float64, error) {
    if b == 0 { return 0, errors.New("division by zero") }
    return a / b, nil
}
\`\`\`

### What to implement

Write table-driven tests for **all four functions**:

1. **TestAdd** — at least 3 cases: two positives, two negatives, zero identity
2. **TestSub** — at least 3 cases: basic subtraction, negative result, subtracting zero
3. **TestMul** — at least 3 cases: positive, negative, multiply by zero
4. **TestDiv** — at least 3 cases including the **error case** when \`b == 0\`

Each test must:
- Use a slice of struct test cases
- Check the returned value
- For \`TestDiv\`, check both the float result *and* whether an error is returned for \`b == 0\`

### Simulating go test in the Playground

Since the Go Playground doesn't run \`go test\`, call each test function manually from \`main\` using a \`*testing.T{}\`:

\`\`\`go
func main() {
    t := &testing.T{}
    TestAdd(t)
    TestSub(t)
    TestMul(t)
    TestDiv(t)
    if !t.Failed() {
        fmt.Println("all tests passed")
    }
}
\`\`\`
`,
  starterCode: `package main

import (
	"errors"
	"fmt"
	"testing"
)

// --- calculator implementation ---

func Add(a, b float64) float64 { return a + b }
func Sub(a, b float64) float64 { return a - b }
func Mul(a, b float64) float64 { return a * b }
func Div(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

// --- tests ---

func TestAdd(t *testing.T) {
	// TODO: write table-driven test for Add
}

func TestSub(t *testing.T) {
	// TODO: write table-driven test for Sub
}

func TestMul(t *testing.T) {
	// TODO: write table-driven test for Mul
}

func TestDiv(t *testing.T) {
	// TODO: write table-driven test for Div, including the b==0 error case
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	TestSub(t)
	TestMul(t)
	TestDiv(t)
	if !t.Failed() {
		fmt.Println("all tests passed")
	}
}
`,
  solutionCode: `package main

import (
	"errors"
	"fmt"
	"math"
	"testing"
)

func Add(a, b float64) float64 { return a + b }
func Sub(a, b float64) float64 { return a - b }
func Mul(a, b float64) float64 { return a * b }
func Div(a, b float64) (float64, error) {
	if b == 0 {
		return 0, errors.New("division by zero")
	}
	return a / b, nil
}

func TestAdd(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
	}{
		{"two positives", 2, 3, 5},
		{"two negatives", -4, -6, -10},
		{"zero identity", 5, 0, 5},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Add(tc.a, tc.b)
			if got != tc.want {
				t.Errorf("Add(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestSub(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
	}{
		{"basic", 10, 3, 7},
		{"negative result", 3, 10, -7},
		{"subtract zero", 5, 0, 5},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Sub(tc.a, tc.b)
			if got != tc.want {
				t.Errorf("Sub(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestMul(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
	}{
		{"positive", 3, 4, 12},
		{"negative", -3, 4, -12},
		{"by zero", 5, 0, 0},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got := Mul(tc.a, tc.b)
			if got != tc.want {
				t.Errorf("Mul(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func TestDiv(t *testing.T) {
	tests := []struct {
		name    string
		a, b    float64
		want    float64
		wantErr bool
	}{
		{"basic", 10, 2, 5, false},
		{"fractional", 1, 3, 1.0 / 3.0, false},
		{"divide by zero", 5, 0, 0, true},
	}
	for _, tc := range tests {
		t.Run(tc.name, func(t *testing.T) {
			got, err := Div(tc.a, tc.b)
			if (err != nil) != tc.wantErr {
				t.Errorf("Div(%v, %v) error = %v, wantErr %v", tc.a, tc.b, err, tc.wantErr)
				return
			}
			if !tc.wantErr && math.Abs(got-tc.want) > 1e-9 {
				t.Errorf("Div(%v, %v) = %v, want %v", tc.a, tc.b, got, tc.want)
			}
		})
	}
}

func main() {
	t := &testing.T{}
	TestAdd(t)
	TestSub(t)
	TestMul(t)
	TestDiv(t)
	if !t.Failed() {
		fmt.Println("all tests passed")
	}
}
`,
  tests: [
    {
      name: "TestAdd defined with table cases",
      description: "TestAdd uses a slice of struct test cases.",
      validate: (code: string, _stdout: string) =>
        code.includes("func TestAdd") &&
        code.includes("[]struct"),
    },
    {
      name: "TestSub defined with table cases",
      description: "TestSub uses a slice of struct test cases.",
      validate: (code: string, _stdout: string) =>
        code.includes("func TestSub") &&
        code.includes("[]struct"),
    },
    {
      name: "TestMul defined with table cases",
      description: "TestMul uses a slice of struct test cases.",
      validate: (code: string, _stdout: string) =>
        code.includes("func TestMul") &&
        code.includes("[]struct"),
    },
    {
      name: "TestDiv tests the error case",
      description: "TestDiv must verify that Div returns an error when b == 0.",
      validate: (code: string, _stdout: string) =>
        code.includes("func TestDiv") &&
        (code.includes("wantErr") || code.includes("b == 0") || code.includes("division by zero")),
    },
    {
      name: "All tests pass",
      description: "Running all four tests should print 'all tests passed'.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("all tests passed"),
    },
  ],
};
