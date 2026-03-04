import type { WorkshopModule } from "../types";

export const typeAssertionsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "66",
  slug: "type-assertions-workshop",
  title: "Type Assertions Workshop",
  icon: "🔍",
  estimatedMinutes: 20,
  description:
    "Practice safe type assertions, type switches, error type checks, and compile-time interface assertions.",
  steps: [
    {
      instruction:
        "Write a `toString` function that takes an `any` argument and returns the string value if it's a string, or `\"not a string\"` if not. Use the two-value form `s, ok := v.(string)`.",
      starterCode: `package main

import "fmt"

func toString(v any) string {
	// TODO: use v.(string) two-value form
	// return the string if ok, else return "not a string"
	return ""
}

func main() {
	fmt.Println(toString("hello"))
	fmt.Println(toString(42))
	fmt.Println(toString(true))
}
`,
      hint: `package main

import "fmt"

func toString(v any) string {
	s, ok := v.(string)
	if ok {
		return s
	}
	return "not a string"
}

func main() {
	fmt.Println(toString("hello"))
	fmt.Println(toString(42))
	fmt.Println(toString(true))
}
`,
      validate: (code: string) =>
        code.includes(".(string)") && code.includes(", ok"),
      successMessage:
        "The two-value form `s, ok := v.(string)` is the safe way to assert — ok is false when the dynamic type doesn't match, instead of panicking.",
    },
    {
      instruction:
        "Write a `describe(v any) string` function that uses a type switch to return a description: `\"int: N\"` for ints, `\"string: S\"` for strings, `\"bool: B\"` for bools, and `\"other\"` for anything else. Test it with several values.",
      starterCode: `package main

import "fmt"

func describe(v any) string {
	// TODO: switch x := v.(type) { case int: ... }
	return ""
}

func main() {
	fmt.Println(describe(42))
	fmt.Println(describe("hello"))
	fmt.Println(describe(true))
	fmt.Println(describe(3.14))
}
`,
      hint: `package main

import "fmt"

func describe(v any) string {
	switch x := v.(type) {
	case int:
		return fmt.Sprintf("int: %d", x)
	case string:
		return fmt.Sprintf("string: %s", x)
	case bool:
		return fmt.Sprintf("bool: %t", x)
	default:
		return "other"
	}
}

func main() {
	fmt.Println(describe(42))
	fmt.Println(describe("hello"))
	fmt.Println(describe(true))
	fmt.Println(describe(3.14))
}
`,
      validate: (code: string) =>
        code.includes(".(type)") &&
        code.includes("case int") &&
        code.includes("case string"),
      successMessage:
        "In a type switch, the variable x is already typed in each case — no further assertion is needed and the code reads cleanly without nested if/else chains.",
    },
    {
      instruction:
        "Define a custom error type `ValidationError` with a `Field string` and `Msg string`. Write a function `validate(age int) error` that returns a `*ValidationError` if age < 0. In main, call validate(-1), then use a type switch on the error to print the Field and Msg when it's a ValidationError.",
      starterCode: `package main

import "fmt"

type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string {
	return e.Field + ": " + e.Msg
}

func validate(age int) error {
	// TODO: if age < 0, return &ValidationError{Field: "age", Msg: "must be non-negative"}
	return nil
}

func main() {
	err := validate(-1)
	if err != nil {
		// TODO: type switch on err — print Field and Msg for *ValidationError
	}
}
`,
      hint: `package main

import "fmt"

type ValidationError struct {
	Field string
	Msg   string
}

func (e *ValidationError) Error() string {
	return e.Field + ": " + e.Msg
}

func validate(age int) error {
	if age < 0 {
		return &ValidationError{Field: "age", Msg: "must be non-negative"}
	}
	return nil
}

func main() {
	err := validate(-1)
	if err != nil {
		switch e := err.(type) {
		case *ValidationError:
			fmt.Println("field:", e.Field)
			fmt.Println("msg:", e.Msg)
		default:
			fmt.Println("unknown error:", e)
		}
	}
}
`,
      validate: (code: string) =>
        code.includes("*ValidationError") && code.includes(".(type)"),
      successMessage:
        "Type switching on errors lets you extract structured information from custom error types — a cleaner alternative to string matching on err.Error().",
    },
    {
      instruction:
        "Define a `Writer` interface with `Write([]byte) (int, error)`. Implement it on a `Buffer` struct that appends to an internal `[]byte`. Add a compile-time check `var _ Writer = (*Buffer)(nil)` to verify the implementation. Then use Buffer through the Writer interface.",
      starterCode: `package main

import "fmt"

type Writer interface {
	Write(data []byte) (int, error)
}

type Buffer struct {
	data []byte
}

// TODO: implement Write on *Buffer that appends data to b.data

// TODO: add compile-time interface assertion

func main() {
	var w Writer = &Buffer{}
	w.Write([]byte("hello"))
	w.Write([]byte(" world"))
	fmt.Println(string(w.(*Buffer).data))
}
`,
      hint: `package main

import "fmt"

type Writer interface {
	Write(data []byte) (int, error)
}

type Buffer struct {
	data []byte
}

func (b *Buffer) Write(data []byte) (int, error) {
	b.data = append(b.data, data...)
	return len(data), nil
}

// guards that *Buffer satisfies Writer at compile time, not at runtime
var _ Writer = (*Buffer)(nil)

func main() {
	var w Writer = &Buffer{}
	w.Write([]byte("hello"))
	w.Write([]byte(" world"))
	fmt.Println(string(w.(*Buffer).data))
}
`,
      validate: (code: string) =>
        code.includes("var _ Writer") && code.includes("(*Buffer)(nil)"),
      successMessage:
        "The blank identifier assertion `var _ Writer = (*Buffer)(nil)` is a zero-cost compile-time guard. If Buffer ever stops implementing Writer (say, a method signature changes), the build fails immediately rather than at runtime.",
    },
  ],
};
