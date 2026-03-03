import { LessonModule } from "../types";

export const structs: LessonModule = {
  type: "lesson",
  id: "17",
  slug: "structs",
  title: "Structs",
  icon: "🏗️",
  estimatedMinutes: 14,
  content: `## Structs

Structs are Go's primary way to group related data together. Unlike classes in object-oriented languages, Go structs are simple data containers that you can attach behavior to via methods.

### Defining a Struct

Use the \`type\` keyword to define a struct with named fields:

\`\`\`go
type Person struct {
    Name    string
    Age     int
    Email   string
}
\`\`\`

Each field has a name and a type. Fields are accessed and set individually.

### Struct Literal Initialization

Create a struct value using named-field syntax — this is the preferred approach because it is explicit and resilient to field reordering:

\`\`\`go
p := Person{Name: "Alice", Age: 30, Email: "alice@example.com"}
fmt.Println(p.Name)  // Alice
fmt.Println(p.Age)   // 30
\`\`\`

Access or mutate any field with the dot operator:

\`\`\`go
p.Age = 31
fmt.Println(p.Age)  // 31
\`\`\`

### Value Receiver Methods

A method with a value receiver receives a **copy** of the struct. Changes made inside the method do not affect the original:

\`\`\`go
func (p Person) Greet() string {
    return "Hi, I'm " + p.Name
}

fmt.Println(p.Greet())  // Hi, I'm Alice
\`\`\`

Use value receivers when the method only reads data and the struct is small. The caller's value is never modified.

### Pointer Receiver Methods

A method with a pointer receiver receives a pointer to the original struct, so it **can modify** the caller's value:

\`\`\`go
func (p *Person) Birthday() {
    p.Age++
}

p.Birthday()
fmt.Println(p.Age)  // 32
\`\`\`

Use pointer receivers when:
- The method needs to mutate the struct's fields.
- The struct is large and copying it on every call would be expensive.

Go automatically takes the address of \`p\` when you call a pointer receiver method on an addressable value, so \`p.Birthday()\` works even though \`p\` is not declared as a pointer.

### Embedding (Composition over Inheritance)

Go has no inheritance. Instead, you embed one struct inside another to reuse its fields and methods:

\`\`\`go
type Employee struct {
    Person
    Company string
}

e := Employee{
    Person:  Person{Name: "Bob", Age: 25, Email: "bob@corp.com"},
    Company: "Acme",
}

fmt.Println(e.Name)      // Bob — promoted from Person
fmt.Println(e.Greet())   // Hi, I'm Bob — method promoted from Person
\`\`\`

\`Employee\` automatically gets all of \`Person\`'s fields and methods through **promotion**. This is composition, not inheritance: there is no parent/child relationship, no override chain, and no polymorphism unless you add an interface. You are simply embedding a value of type \`Person\` inside \`Employee\` and letting Go surface its members at the outer level for convenience.

This approach keeps types simple and explicit — you always know exactly where a field or method comes from.

### Struct Tags

Struct fields can carry metadata called **tags**, written as raw string literals after the type. They are used by packages like \`encoding/json\` and \`database/sql\` to control serialization:

\`\`\`go
type User struct {
    Name  string \`json:"name"\`
    Email string \`json:"email,omitempty"\`
    pw    string \`json:"-"\`  // excluded from JSON
}
\`\`\`

Tags are pure metadata — the compiler ignores them; only reflection-based packages read them at runtime.

### Anonymous Structs

For one-off data shapes, you can define a struct inline without giving it a name:

\`\`\`go
point := struct {
    X, Y int
}{X: 3, Y: 4}
fmt.Println(point.X, point.Y) // 3 4
\`\`\`

Anonymous structs are handy for test table rows, temporary groupings, and HTTP request/response shapes that only appear once.

### Struct Comparison

Two struct values are comparable with \`==\` if all their fields are comparable (no slices, maps, or functions). The comparison checks every field:

\`\`\`go
type Point struct{ X, Y int }

a := Point{1, 2}
b := Point{1, 2}
c := Point{1, 3}

fmt.Println(a == b) // true — all fields equal
fmt.Println(a == c) // false — Y differs
\`\`\`

Comparable structs can also be used as map keys:

\`\`\`go
visits := map[Point]int{}
visits[Point{0, 0}]++
\`\`\`
`,
  quiz: [
    {
      question: "A value receiver method receives...",
      options: [
        "A pointer to the struct",
        "A copy of the struct",
        "A reference to the struct",
        "The struct's memory address",
      ],
      correctIndex: 1,
    },
    {
      question: "Which is correct struct literal syntax?",
      options: [
        'Person("Alice", 30)',
        'Person{Name: "Alice", Age: 30}',
        'new Person{Name: "Alice"}',
        'Person.new("Alice", 30)',
      ],
      correctIndex: 1,
    },
    {
      question: "How does Go achieve code reuse similar to inheritance?",
      options: [
        "Using the extends keyword",
        "Through class hierarchies",
        "Through struct embedding (composition)",
        "Using mixins",
      ],
      correctIndex: 2,
    },
  ],
};
