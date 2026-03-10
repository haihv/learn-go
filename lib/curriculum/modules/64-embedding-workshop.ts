import type { WorkshopModule } from "../types";

export const embeddingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "64",
  slug: "embedding-workshop",
  title: "Embedding Workshop",
  icon: "🧩",
  estimatedMinutes: 20,
  description:
    "Practice struct embedding, method promotion, override, and interface embedding.",
  steps: [
    {
      instruction:
        "Define an `Animal` struct with a `Name string` field and a `Speak()` method that returns `Name + \" speaks\"`. Embed `Animal` inside a `Dog` struct that also has a `Breed string` field. In `main`, create a Dog, call its promoted `Speak()` method, and print the result.",
      starterCode: `package main

import "fmt"

type Animal struct {
	Name string
}

func (a Animal) Speak() string {
	// TODO: return Name + " speaks"
	return ""
}

type Dog struct {
	// TODO: embed Animal and add Breed string
}

func main() {
	d := Dog{} // TODO: initialise with Name "Rex" and Breed "Labrador"
	fmt.Println(d.Speak())
	fmt.Println(d.Name)
}
`,
      hint: `package main

import "fmt"

type Animal struct {
	Name string
}

func (a Animal) Speak() string {
	return a.Name + " speaks"
}

type Dog struct {
	Animal
	Breed string
}

func main() {
	d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
	fmt.Println(d.Speak())
	fmt.Println(d.Name)
}
`,
      validate: (code: string) =>
        code.includes("Animal") &&
        code.includes("Dog") &&
        (code.includes("Animal\n") ||
          code.includes("Animal ") ||
          code.includes("Animal\t")) &&
        code.includes("d.Speak()"),
      successMessage:
        "d.Speak() calls Animal.Speak through promotion — the outer struct gains the embedded type's methods as if they were its own.",
    },
    {
      instruction:
        "Starting from a Dog that embeds Animal, add a `Speak()` method on Dog itself that returns `Name + \" barks\"`. Verify that `d.Speak()` returns the Dog version, and `d.Animal.Speak()` still works.",
      starterCode: `package main

import "fmt"

type Animal struct{ Name string }
func (a Animal) Speak() string { return a.Name + " speaks" }

type Dog struct {
	Animal
	Breed string
}

// TODO: add a Speak() method on Dog that returns Name + " barks"

func main() {
	d := Dog{Animal: Animal{Name: "Rex"}, Breed: "Labrador"}
	fmt.Println(d.Speak())        // should print "Rex barks"
	fmt.Println(d.Animal.Speak()) // should print "Rex speaks"
}
`,
      hint: `func (d Dog) Speak() string { return d.Name + " barks" }`,
      validate: (code: string) =>
        code.includes("func (d Dog) Speak()") ||
        code.includes("func (d *Dog) Speak()"),
      successMessage:
        "The outer struct's method shadows the promoted one. You can always reach the embedded version explicitly via d.Animal.Speak().",
    },
    {
      instruction:
        'Embed both a `Logger` struct (with a `Log(msg string)` method that prints `Prefix + msg`) and a `Config` struct (with a `Port int` field) inside a `Server`. Call `s.Log("starting")` and print `s.Port` from main.',
      starterCode: `package main

import "fmt"

type Logger struct{ Prefix string }
func (l Logger) Log(msg string) { fmt.Println(l.Prefix, msg) }

type Config struct{ Port int }

type Server struct {
	// TODO: embed Logger and Config
}

func main() {
	s := Server{} // TODO: initialise Logger and Config
	s.Log("starting")
	fmt.Println(s.Port)
}
`,
      hint: `package main

import "fmt"

type Logger struct{ Prefix string }
func (l Logger) Log(msg string) { fmt.Println(l.Prefix, msg) }

type Config struct{ Port int }

type Server struct {
	Logger
	Config
}

func main() {
	s := Server{
		Logger: Logger{Prefix: "[server]"},
		Config: Config{Port: 8080},
	}
	s.Log("starting")
	fmt.Println(s.Port)
}
`,
      validate: (code: string) =>
        code.includes("Logger") &&
        code.includes("Config") &&
        code.includes("s.Log("),
      successMessage:
        "Multiple embedding composes behaviours from several types. Name collisions between embedded fields are caught at compile time.",
    },
    {
      instruction:
        "Define a `Stringer` interface with a `String() string` method. Embed `Stringer` inside a `Wrapper` struct that also holds a concrete `value string`. Implement `String()` on `Wrapper` to return the value. Pass a `Wrapper` to `fmt.Println` — it calls `String()` automatically.",
      starterCode: `package main

import "fmt"

type Stringer interface {
	String() string
}

type Wrapper struct {
	Stringer        // embedded interface
	value string
}

// TODO: implement String() on Wrapper that returns w.value

func main() {
	w := Wrapper{value: "hello"}
	fmt.Println(w.String())
	fmt.Println(w) // fmt calls String() automatically
}
`,
      hint: `func (w Wrapper) String() string { return w.value }`,
      validate: (code: string) =>
        code.includes("Stringer") &&
        (code.includes("func (w Wrapper) String()") ||
          code.includes("func (w *Wrapper) String()")),
      successMessage:
        "Embedding an interface inside a struct is how you build decorator and adapter patterns in Go — the struct asserts it satisfies the interface, and you can override specific methods.",
    },
  ],
};
