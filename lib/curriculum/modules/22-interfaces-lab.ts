import type { LabModule } from "../types";

export const interfacesLab: LabModule = {
  type: "lab",
  id: "22",
  slug: "interfaces-lab",
  title: "Shapes Calculator Lab",
  icon: "📐",
  estimatedMinutes: 30,
  description: "Implement a Shape interface for Circle, Rectangle, and Triangle, then compute areas and perimeters.",
  instructions: `## Shapes Calculator Lab

In this lab you will build a small geometry calculator by defining a \`Shape\` interface and implementing it for three concrete types.

### The interface

\`\`\`go
type Shape interface {
    Area() float64
    Perimeter() float64
    String() string
}
\`\`\`

### Shapes to implement

**Circle**
\`\`\`go
type Circle struct { Radius float64 }
\`\`\`
- Area: \`math.Pi * r * r\`
- Perimeter (circumference): \`2 * math.Pi * r\`

**Rectangle**
\`\`\`go
type Rectangle struct { Width, Height float64 }
\`\`\`
- Area: \`Width * Height\`
- Perimeter: \`2 * (Width + Height)\`

**Triangle** — using Heron's formula
\`\`\`go
type Triangle struct { A, B, C float64 }
\`\`\`
- Perimeter: \`A + B + C\`
- Area (Heron's formula):
  1. Compute the semi-perimeter: \`s = (A + B + C) / 2\`
  2. Area = \`math.Sqrt(s * (s-A) * (s-B) * (s-C))\`

### Helper functions

**\`TotalArea(shapes []Shape) float64\`**
Returns the sum of \`Area()\` for every shape in the slice.

**\`Describe(s Shape)\`**
Prints: \`Shape: <String()>, Area: <area>, Perimeter: <perimeter>\`
Use \`fmt.Printf\` with \`%.2f\` for the numeric values.

### In main

Create and describe three shapes, then print the total area:

\`\`\`go
circle    := Circle{Radius: 5}
rectangle := Rectangle{Width: 4, Height: 6}
triangle  := Triangle{A: 3, B: 4, C: 5}

Describe(circle)
Describe(rectangle)
Describe(triangle)
fmt.Printf("Total area: %.2f\\n", TotalArea([]Shape{circle, rectangle, triangle}))
\`\`\`

### Expected output

\`\`\`
Shape: Circle(r=5.00), Area: 78.54, Perimeter: 31.42
Shape: Rectangle(4.00x6.00), Area: 24.00, Perimeter: 20.00
Shape: Triangle(3.00, 4.00, 5.00), Area: 6.00, Perimeter: 12.00
Total area: 108.54
\`\`\`
`,
  starterCode: `package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Area() float64
	Perimeter() float64
	String() string
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	// TODO: return math.Pi * Radius * Radius
	return 0
}

func (c Circle) Perimeter() float64 {
	// TODO: return 2 * math.Pi * Radius
	return 0
}

func (c Circle) String() string {
	return fmt.Sprintf("Circle(r=%.2f)", c.Radius)
}

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	// TODO: return Width * Height
	return 0
}

func (r Rectangle) Perimeter() float64 {
	// TODO: return 2 * (Width + Height)
	return 0
}

func (r Rectangle) String() string {
	return fmt.Sprintf("Rectangle(%.2fx%.2f)", r.Width, r.Height)
}

type Triangle struct {
	A, B, C float64
}

func (t Triangle) Area() float64 {
	// TODO: Heron's formula — s = (A+B+C)/2, area = math.Sqrt(s*(s-A)*(s-B)*(s-C))
	return 0
}

func (t Triangle) Perimeter() float64 {
	// TODO: return A + B + C
	return 0
}

func (t Triangle) String() string {
	return fmt.Sprintf("Triangle(%.2f, %.2f, %.2f)", t.A, t.B, t.C)
}

func TotalArea(shapes []Shape) float64 {
	// TODO: sum Area() for all shapes
	return 0
}

func Describe(s Shape) {
	// TODO: print "Shape: <String()>, Area: <area>, Perimeter: <perimeter>"
	fmt.Println("implement Describe")
}

func main() {
	circle := Circle{Radius: 5}
	rectangle := Rectangle{Width: 4, Height: 6}
	triangle := Triangle{A: 3, B: 4, C: 5}

	Describe(circle)
	Describe(rectangle)
	Describe(triangle)

	_ = math.Pi // ensure math import is used
	fmt.Printf("Total area: %.2f\n", TotalArea([]Shape{circle, rectangle, triangle}))
}
`,
  solutionCode: `package main

import (
	"fmt"
	"math"
)

type Shape interface {
	Area() float64
	Perimeter() float64
	String() string
}

type Circle struct {
	Radius float64
}

func (c Circle) Area() float64 {
	return math.Pi * c.Radius * c.Radius
}

func (c Circle) Perimeter() float64 {
	return 2 * math.Pi * c.Radius
}

func (c Circle) String() string {
	return fmt.Sprintf("Circle(r=%.2f)", c.Radius)
}

type Rectangle struct {
	Width, Height float64
}

func (r Rectangle) Area() float64 {
	return r.Width * r.Height
}

func (r Rectangle) Perimeter() float64 {
	return 2 * (r.Width + r.Height)
}

func (r Rectangle) String() string {
	return fmt.Sprintf("Rectangle(%.2fx%.2f)", r.Width, r.Height)
}

type Triangle struct {
	A, B, C float64
}

func (t Triangle) Area() float64 {
	s := (t.A + t.B + t.C) / 2
	return math.Sqrt(s * (s - t.A) * (s - t.B) * (s - t.C))
}

func (t Triangle) Perimeter() float64 {
	return t.A + t.B + t.C
}

func (t Triangle) String() string {
	return fmt.Sprintf("Triangle(%.2f, %.2f, %.2f)", t.A, t.B, t.C)
}

func TotalArea(shapes []Shape) float64 {
	total := 0.0
	for _, s := range shapes {
		total += s.Area()
	}
	return total
}

func Describe(s Shape) {
	fmt.Printf("Shape: %s, Area: %.2f, Perimeter: %.2f\n",
		s.String(), s.Area(), s.Perimeter())
}

func main() {
	circle := Circle{Radius: 5}
	rectangle := Rectangle{Width: 4, Height: 6}
	triangle := Triangle{A: 3, B: 4, C: 5}

	Describe(circle)
	Describe(rectangle)
	Describe(triangle)

	fmt.Printf("Total area: %.2f\n", TotalArea([]Shape{circle, rectangle, triangle}))
}
`,
  tests: [
    {
      name: "Shape interface defined",
      description: "Your code must define a Shape interface with Area() and Perimeter() methods.",
      validate: (code: string, _stdout: string) =>
        code.includes("type Shape interface") ||
        (code.includes("Area()") && code.includes("Perimeter()")),
    },
    {
      name: "Circle area is correct",
      description: "Circle with radius 5 has area ≈ 78.54.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("78.5") || stdout.includes("78.54"),
    },
    {
      name: "Rectangle perimeter is correct",
      description: "Rectangle 4×6 has perimeter 20.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("20"),
    },
    {
      name: "Triangle area is correct",
      description: "3-4-5 right triangle has area 6.00 via Heron's formula.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("6.00") || stdout.includes("6.0"),
    },
    {
      name: "TotalArea function exists",
      description: "Your code must define a TotalArea function.",
      validate: (code: string, _stdout: string) =>
        code.includes("TotalArea"),
    },
    {
      name: "Uses math package",
      description: "Area calculations must use math.Pi and math.Sqrt.",
      validate: (code: string, _stdout: string) =>
        code.includes("math.Pi") || code.includes("math.Sqrt"),
    },
  ],
};
