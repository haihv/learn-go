import type { WorkshopModule } from "../types";

export const errorHandlingWorkshop: WorkshopModule = {
	type: "workshop",
	id: "24",
	slug: "error-handling-workshop",
	title: "Error Handling Workshop",
	icon: "🔧",
	estimatedMinutes: 25,
	description:
		"Build a layered error-handling system step by step — from basic error returns to sentinel errors, custom error types, and full error chain inspection.",
	steps: [
		{
			instruction:
				"Write `parseAge(s string) (int, error)` that converts a string to an integer using `strconv.Atoi`. If the conversion fails, return the error directly. In `main`, call `parseAge` with both a valid string (\"25\") and an invalid one (\"abc\") and print any error.",
			starterCode: `package main

import (
	"fmt"
	"strconv"
)

// TODO: implement parseAge using strconv.Atoi
// Return the integer and nil on success, or 0 and the error on failure.

func main() {
	age, err := parseAge("25")
	if err != nil {
		fmt.Println("error:", err)
	} else {
		fmt.Println("age:", age)
	}

	_, err = parseAge("abc")
	if err != nil {
		fmt.Println("error:", err)
	}
}
`,
			hint: `package main

import (
	"fmt"
	"strconv"
)

func parseAge(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, err
	}
	return n, nil
}

func main() {
	age, err := parseAge("25")
	if err != nil {
		fmt.Println("error:", err)
	} else {
		fmt.Println("age:", age) // age: 25
	}

	_, err = parseAge("abc")
	if err != nil {
		fmt.Println("error:", err) // error: strconv.Atoi: ...
	}
}
`,
			validate: (code: string) =>
				code.includes("parseAge") &&
				code.includes("strconv.Atoi") &&
				code.includes("error"),
			successMessage:
				"Returning errors directly lets the caller decide how to handle them.",
		},
		{
			instruction:
				"Improve `parseAge` to add context to the error using `fmt.Errorf` and the `%w` verb. The wrapped message should read: `\"parseAge: <original error>\"`. This makes error chains readable when errors propagate through multiple layers.",
			starterCode: `package main

import (
	"fmt"
	"strconv"
)

func parseAge(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		return 0, err // TODO: wrap the error with fmt.Errorf and %w
	}
	return n, nil
}

func main() {
	_, err := parseAge("abc")
	if err != nil {
		fmt.Println(err) // should print: parseAge: strconv.Atoi: ...
	}
}
`,
			hint: `package main

import (
	"fmt"
	"strconv"
)

func parseAge(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		// %w stores err inside the new error so errors.Is/As can inspect it later
		return 0, fmt.Errorf("parseAge: %w", err)
	}
	return n, nil
}

func main() {
	_, err := parseAge("abc")
	if err != nil {
		fmt.Println(err) // parseAge: strconv.Atoi: parsing "abc": invalid syntax
	}
}
`,
			validate: (code: string) =>
				code.includes("fmt.Errorf") && code.includes("%w"),
			successMessage:
				"Wrapping with %w builds a readable chain and keeps the original error accessible.",
		},
		{
			instruction:
				"Declare a sentinel error `var ErrNotFound = errors.New(\"not found\")` at the package level. Write `findUser(id int) (string, error)` that returns `ErrNotFound` for unknown IDs. In `main`, call `findUser` with an unknown ID and use `errors.Is` to check whether the error is `ErrNotFound`.",
			starterCode: `package main

import (
	"errors"
	"fmt"
)

// TODO: declare ErrNotFound as a package-level sentinel error

// TODO: implement findUser
// Return the user's name for id 1 ("Alice") and id 2 ("Bob").
// Return ErrNotFound for any other id.

func main() {
	_, err := findUser(99)
	if err != nil {
		// TODO: use errors.Is to check for ErrNotFound
		fmt.Println("error:", err)
	}
}
`,
			hint: `package main

import (
	"errors"
	"fmt"
)

var ErrNotFound = errors.New("not found")

func findUser(id int) (string, error) {
	users := map[int]string{1: "Alice", 2: "Bob"}
	name, ok := users[id]
	if !ok {
		return "", ErrNotFound
	}
	return name, nil
}

func main() {
	_, err := findUser(99)
	if errors.Is(err, ErrNotFound) {
		fmt.Println("user does not exist") // user does not exist
	}
}
`,
			validate: (code: string) =>
				code.includes("ErrNotFound") && code.includes("errors.Is"),
			successMessage:
				"Sentinel errors give callers a stable identity to check against, even through wrapping.",
		},
		{
			instruction:
				"Define a custom error type `type AppError struct { Code int; Message string }` with a method `func (e AppError) Error() string` that returns the message. Write `riskyOp() error` that returns an `AppError` wrapped in `fmt.Errorf`. In `main`, call `riskyOp` and print the error.",
			starterCode: `package main

import "fmt"

// TODO: define AppError struct with Code int and Message string fields

// TODO: implement Error() string method on AppError

// TODO: implement riskyOp() error
// Create an AppError{Code: 503, Message: "service unavailable"} and
// wrap it with fmt.Errorf("riskyOp: %w", ...) before returning.

func main() {
	err := riskyOp()
	if err != nil {
		fmt.Println(err)
	}
}
`,
			hint: `package main

import "fmt"

type AppError struct {
	Code    int
	Message string
}

func (e AppError) Error() string {
	return e.Message
}

func riskyOp() error {
	return fmt.Errorf("riskyOp: %w", AppError{Code: 503, Message: "service unavailable"})
}

func main() {
	err := riskyOp()
	if err != nil {
		fmt.Println(err) // riskyOp: service unavailable
	}
}
`,
			validate: (code: string) =>
				code.includes("AppError") &&
				code.includes("func (") &&
				code.includes("Error() string"),
			successMessage:
				"Custom error types let you attach structured data alongside the error message.",
		},
		{
			instruction:
				"Use `errors.As` to extract the `AppError` from the wrapped error returned by `riskyOp`. Once extracted, print its `Code` field. This shows how you can recover structured information even after wrapping.",
			starterCode: `package main

import (
	"errors"
	"fmt"
)

type AppError struct {
	Code    int
	Message string
}

func (e AppError) Error() string {
	return e.Message
}

func riskyOp() error {
	return fmt.Errorf("riskyOp: %w", AppError{Code: 503, Message: "service unavailable"})
}

func main() {
	err := riskyOp()

	// TODO: declare a var of type AppError
	// TODO: use errors.As to extract it from err
	// TODO: if successful, print the Code field
	fmt.Println(err)
}
`,
			hint: `package main

import (
	"errors"
	"fmt"
)

type AppError struct {
	Code    int
	Message string
}

func (e AppError) Error() string {
	return e.Message
}

func riskyOp() error {
	return fmt.Errorf("riskyOp: %w", AppError{Code: 503, Message: "service unavailable"})
}

func main() {
	err := riskyOp()

	var ae AppError
	// errors.As walks the chain and assigns the first AppError it finds into ae
	if errors.As(err, &ae) {
		fmt.Println("error code:", ae.Code)    // error code: 503
		fmt.Println("message:", ae.Message)    // message: service unavailable
	}
}
`,
			validate: (code: string) => code.includes("errors.As"),
			successMessage:
				"errors.As recovers typed errors from anywhere in the chain — no matter how many layers of wrapping exist.",
		},
	],
};
