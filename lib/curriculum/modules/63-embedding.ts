import type { LessonModule } from "../types";

export const embedding: LessonModule = {
  type: "lesson",
  id: "63",
  slug: "embedding",
  title: "Struct Embedding",
  icon: "🧩",
  estimatedMinutes: 12,
  content: `## Struct Embedding

Go has no \`extends\` keyword. Instead, **embedding** achieves composition-based code reuse: the outer struct gets all fields and methods of the embedded type promoted to its own namespace, with no type hierarchy involved.

### Basic struct embedding

Embed a type by writing its name alone — no field name, no tag:

\`\`\`go
type Animal struct { Name string }
func (a Animal) Speak() string { return a.Name + " speaks" }

type Dog struct {
    Animal        // embedded — no field name
    Breed string
}

d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
fmt.Println(d.Speak())   // promoted method: d.Speak() == d.Animal.Speak()
fmt.Println(d.Name)      // promoted field
\`\`\`

The compiler rewrites \`d.Speak()\` to \`d.Animal.Speak()\` — it is syntactic sugar, not dynamic dispatch.

### Method promotion rules

All **exported** methods and fields of the embedded type are promoted to the outer struct. You can always bypass promotion and access the embedded struct explicitly:

\`\`\`go
d.Animal.Speak()  // explicit — always works, even when shadowed
\`\`\`

Unexported fields and methods are accessible within the same package but are not promoted across package boundaries.

### Multiple embedding

A struct can embed more than one type. Each embedded type contributes its promoted set independently:

\`\`\`go
type Logger struct { Prefix string }
func (l Logger) Log(msg string) { fmt.Println(l.Prefix, msg) }

type Server struct {
    Logger
    Addr string
}
// s.Log("started") works
\`\`\`

### Overriding promoted methods

Define a method with the same name on the outer struct to shadow the promoted one:

\`\`\`go
func (d Dog) Speak() string { return d.Name + " barks" }  // shadows Animal.Speak
\`\`\`

After this definition \`d.Speak()\` calls \`Dog.Speak\`, but \`d.Animal.Speak()\` still reaches the original.

### Embedding interfaces

Embedding an interface inside a struct declares that the struct satisfies that interface, and lets you build adapter/wrapper types:

\`\`\`go
type ReadWriter struct {
    io.Reader
    io.Writer
}
\`\`\`

You can also embed an interface inside another interface to compose larger interface contracts without repeating method signatures.

### Field collision

If two embedded types expose a field or method with the same name, accessing it without qualification is a **compile error** — the compiler cannot pick one automatically. Always qualify in that case:

\`\`\`go
// both Logger and Metrics embed a field called Name
s.Logger.Name   // unambiguous
s.Metrics.Name  // unambiguous
s.Name          // compile error: ambiguous selector
\`\`\`
`,
  quiz: [
    {
      question:
        "What is the key difference between Go struct embedding and classical inheritance?",
      options: [
        "Embedding copies all methods into the outer struct's vtable",
        "Embedding promotes fields and methods so the outer struct can use them directly, but there is no type hierarchy — Dog is not an Animal",
        "Embedding is only allowed for interfaces, not structs",
        "Embedding creates a parent-child relationship identical to Java extends",
      ],
      correctIndex: 1,
    },
    {
      question:
        "If Dog embeds Animal and both define a method `Speak()`, which version does `d.Speak()` call?",
      options: [
        "Animal.Speak — the embedded type always wins",
        "Dog.Speak — the outer type's method shadows the promoted one",
        "A compile error — duplicate method definitions are forbidden",
        "Both are called in order",
      ],
      correctIndex: 1,
    },
    {
      question:
        "How do you access the embedded Animal struct's fields directly on a Dog value d?",
      options: [
        "d->Animal.Name (C-style pointer)",
        "d[Animal].Name",
        "d.Animal.Name or the promoted shorthand d.Name",
        'embed.Field(d, "Name")',
      ],
      correctIndex: 2,
    },
  ],
};
