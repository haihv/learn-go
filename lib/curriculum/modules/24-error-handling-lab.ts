import type { LabModule } from "../types";

export const errorHandlingLab: LabModule = {
	type: "lab",
	id: "24",
	slug: "error-handling-lab",
	title: "Input Validator Lab",
	icon: "🛡️",
	estimatedMinutes: 30,
	description:
		"Build a reusable input validator that collects structured errors across multiple fields using a custom error type.",
	instructions: `## Input Validator Lab

In this lab you will build an input validation system that uses a custom error type to carry structured field-level error information.

### Your Task

**1. Define \`ValidationError\`**

\`\`\`go
type ValidationError struct {
	Field  string
	Reason string
}
\`\`\`

Implement \`Error() string\` so it returns:

\`\`\`
field <Field>: <Reason>
\`\`\`

For example: \`field email: must contain @\`

---

**2. Implement \`validateEmail(s string) error\`**

- The email must contain \`@\`
- There must be at least one \`.\` after the \`@\`
- Return a \`ValidationError\` with \`Field: "email"\` if either check fails
- Return \`nil\` if the email is valid

---

**3. Implement \`validatePassword(s string) error\`**

- The password must be at least 8 characters long
- The password must contain at least one digit (0–9)
- Return a \`ValidationError\` with \`Field: "password"\` if either check fails
- Return \`nil\` if the password is valid

---

**4. Implement \`validateAge(n int) error\`**

- The age must be greater than 0 and less than 150
- Return a \`ValidationError\` with \`Field: "age"\` if the check fails
- Return \`nil\` if the age is valid

---

**5. Implement \`ValidateAll(email, password string, age int) []error\`**

- Run all three validators
- Collect every non-nil error into a \`[]error\` slice
- Return the slice (it may be empty if all inputs are valid)

---

### Expected Behavior

\`\`\`
// valid inputs — no output
// invalid inputs:
field email: must contain @
field password: must be at least 8 characters
field age: must be between 1 and 149
\`\`\`

> Hint: use \`strings.Contains\` to check for \`@\` and \`.\`, and a loop over the password rune-by-rune (or with \`strings.ContainsAny\`) to detect digits.
`,
	starterCode: `package main

import (
	"fmt"
	"strings"
)

// TODO: define ValidationError with Field and Reason fields
// TODO: implement Error() string returning "field <Field>: <Reason>"

// TODO: implement validateEmail(s string) error
// Must contain @ and a . after the @

// TODO: implement validatePassword(s string) error
// Min 8 chars, must contain at least one digit

// TODO: implement validateAge(n int) error
// Must be > 0 and < 150

// TODO: implement ValidateAll(email, password string, age int) []error
// Runs all validators and collects non-nil errors

func main() {
	// Valid inputs
	errs := ValidateAll("user@example.com", "secret123", 30)
	if len(errs) == 0 {
		fmt.Println("all inputs valid")
	}

	// Invalid inputs
	errs = ValidateAll("notanemail", "short", 200)
	for _, err := range errs {
		fmt.Println(err)
	}

	_ = strings.Contains // remove this line once you use the strings package
}
`,
	solutionCode: `package main

import (
	"fmt"
	"strings"
	"unicode"
)

type ValidationError struct {
	Field  string
	Reason string
}

func (e ValidationError) Error() string {
	return fmt.Sprintf("field %s: %s", e.Field, e.Reason)
}

func validateEmail(s string) error {
	atIdx := strings.Index(s, "@")
	if atIdx < 0 {
		return ValidationError{Field: "email", Reason: "must contain @"}
	}
	// ensure there is a dot somewhere after the @
	if !strings.Contains(s[atIdx:], ".") {
		return ValidationError{Field: "email", Reason: "must contain a . after @"}
	}
	return nil
}

func validatePassword(s string) error {
	if len(s) < 8 {
		return ValidationError{Field: "password", Reason: "must be at least 8 characters"}
	}
	hasDigit := false
	for _, ch := range s {
		if unicode.IsDigit(ch) {
			hasDigit = true
			break
		}
	}
	if !hasDigit {
		return ValidationError{Field: "password", Reason: "must contain at least one digit"}
	}
	return nil
}

func validateAge(n int) error {
	if n <= 0 || n >= 150 {
		return ValidationError{Field: "age", Reason: "must be between 1 and 149"}
	}
	return nil
}

func ValidateAll(email, password string, age int) []error {
	var errs []error
	if err := validateEmail(email); err != nil {
		errs = append(errs, err)
	}
	if err := validatePassword(password); err != nil {
		errs = append(errs, err)
	}
	if err := validateAge(age); err != nil {
		errs = append(errs, err)
	}
	return errs
}

func main() {
	errs := ValidateAll("user@example.com", "secret123", 30)
	if len(errs) == 0 {
		fmt.Println("all inputs valid")
	}

	errs = ValidateAll("notanemail", "short", 200)
	for _, err := range errs {
		fmt.Println(err)
	}
}
`,
	tests: [
		{
			name: "ValidationError struct defined",
			description:
				"Your code must define a ValidationError struct to carry field-level error information.",
			validate: (code: string, _stdout: string) =>
				code.includes("type ValidationError struct") ||
				code.includes("ValidationError"),
		},
		{
			name: "validateEmail function defined",
			description:
				"Your code must implement validateEmail(s string) error.",
			validate: (code: string, _stdout: string) =>
				code.includes("func validateEmail"),
		},
		{
			name: "validatePassword function defined",
			description:
				"Your code must implement validatePassword(s string) error.",
			validate: (code: string, _stdout: string) =>
				code.includes("func validatePassword"),
		},
		{
			name: "validateAge function defined",
			description:
				"Your code must implement validateAge(n int) error.",
			validate: (code: string, _stdout: string) =>
				code.includes("func validateAge"),
		},
		{
			name: "Invalid email detected",
			description:
				'Running ValidateAll with an invalid email must produce output containing "email".',
			validate: (_code: string, stdout: string) =>
				stdout.includes("email") || stdout.includes("Email"),
		},
		{
			name: "ValidateAll returns []error",
			description:
				"ValidateAll must collect all errors into a []error slice.",
			validate: (code: string, _stdout: string) =>
				code.includes("[]error") && code.includes("ValidateAll"),
		},
	],
};
