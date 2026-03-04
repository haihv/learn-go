import type { WorkshopModule } from "../types";

export const errorWrappingWorkshop: WorkshopModule = {
  type: "workshop",
  id: "87",
  slug: "error-wrapping-workshop",
  title: "Error Wrapping Workshop",
  icon: "🎁",
  estimatedMinutes: 20,
  description:
    "Practice fmt.Errorf %w, sentinel errors, errors.Is/As, and custom Unwrap.",
  steps: [
    {
      instruction:
        "Write a `readFile(path string) error` function that simulates a file-not-found error using `errors.New(\"no such file\")` and wraps it with `fmt.Errorf(\"readFile %s: %w\", path, err)`. In main, call it, print the full error message, and use `errors.Is` to check if the underlying error is `errNotFound`.",
      starterCode: `package main

import (
\t"errors"
\t"fmt"
)

var errNotFound = errors.New("no such file")

func readFile(path string) error {
\t// Simulate a not-found condition
\terr := errNotFound
\t// TODO: return fmt.Errorf("readFile %s: %w", path, err)
\treturn err
}

func main() {
\terr := readFile("/etc/config.yaml")
\tfmt.Println(err)
\t// TODO: errors.Is(err, errNotFound) and print result
}
`,
      hint: `package main

import (
\t"errors"
\t"fmt"
)

var errNotFound = errors.New("no such file")

func readFile(path string) error {
\terr := errNotFound
\treturn fmt.Errorf("readFile %s: %w", path, err)
}

func main() {
\terr := readFile("/etc/config.yaml")
\tfmt.Println(err)
\tfmt.Println("is errNotFound:", errors.Is(err, errNotFound))
}
`,
      validate: (code: string) =>
        code.includes("fmt.Errorf") &&
        code.includes("%w") &&
        code.includes("errors.Is"),
      successMessage:
        "fmt.Errorf with %w creates a wrapped error whose message includes context (the path) while keeping the original error accessible for errors.Is / errors.As inspection.",
    },
    {
      instruction:
        "Define three sentinel errors: `ErrNotFound`, `ErrForbidden`, `ErrTimeout` using `errors.New`. Write a `fetch(code int) error` function that returns the matching sentinel for codes 404, 403, 408, or nil for 200. In main, test each code and check with `errors.Is`.",
      starterCode: `package main

import (
\t"errors"
\t"fmt"
)

var (
\tErrNotFound  = errors.New("not found")
\tErrForbidden = errors.New("forbidden")
\tErrTimeout   = errors.New("timeout")
)

func fetch(code int) error {
\t// TODO: switch on code, return matching sentinel or nil
\treturn nil
}

func main() {
\tfor _, code := range []int{200, 404, 403, 408} {
\t\terr := fetch(code)
\t\tswitch {
\t\tcase err == nil:
\t\t\tfmt.Println(code, "ok")
\t\tcase errors.Is(err, ErrNotFound):
\t\t\tfmt.Println(code, "not found")
\t\tcase errors.Is(err, ErrForbidden):
\t\t\tfmt.Println(code, "forbidden")
\t\tcase errors.Is(err, ErrTimeout):
\t\t\tfmt.Println(code, "timeout")
\t\t}
\t}
}
`,
      hint: `package main

import (
\t"errors"
\t"fmt"
)

var (
\tErrNotFound  = errors.New("not found")
\tErrForbidden = errors.New("forbidden")
\tErrTimeout   = errors.New("timeout")
)

func fetch(code int) error {
\tswitch code {
\tcase 404:
\t\treturn ErrNotFound
\tcase 403:
\t\treturn ErrForbidden
\tcase 408:
\t\treturn ErrTimeout
\t}
\treturn nil
}

func main() {
\tfor _, code := range []int{200, 404, 403, 408} {
\t\terr := fetch(code)
\t\tswitch {
\t\tcase err == nil:
\t\t\tfmt.Println(code, "ok")
\t\tcase errors.Is(err, ErrNotFound):
\t\t\tfmt.Println(code, "not found")
\t\tcase errors.Is(err, ErrForbidden):
\t\t\tfmt.Println(code, "forbidden")
\t\tcase errors.Is(err, ErrTimeout):
\t\t\tfmt.Println(code, "timeout")
\t\t}
\t}
}
`,
      validate: (code: string) =>
        code.includes("errors.New") &&
        code.includes("ErrNotFound") &&
        code.includes("errors.Is"),
      successMessage:
        "Sentinel errors are the idiomatic Go API contract for expected error conditions. They're declared at package level so callers can compare without depending on error message strings.",
    },
    {
      instruction:
        "Define a `DBError` struct with `Code int` and `Message string` that implements the `error` interface. Write a `query() error` function that returns a wrapped `*DBError`. In main, use `errors.As` to extract the `*DBError` and print its `Code` and `Message`.",
      starterCode: `package main

import (
\t"errors"
\t"fmt"
)

type DBError struct {
\tCode    int
\tMessage string
}

func (e *DBError) Error() string {
\treturn fmt.Sprintf("db error %d: %s", e.Code, e.Message)
}

func query() error {
\terr := &DBError{Code: 1045, Message: "access denied"}
\t// TODO: wrap with fmt.Errorf("query users: %w", err)
\treturn err
}

func main() {
\terr := query()

\tvar dbErr *DBError
\t// TODO: errors.As(err, &dbErr) and print dbErr.Code and dbErr.Message
\t_ = errors.As
\t_ = fmt.Println
\t_ = dbErr
}
`,
      hint: `package main

import (
\t"errors"
\t"fmt"
)

type DBError struct {
\tCode    int
\tMessage string
}

func (e *DBError) Error() string {
\treturn fmt.Sprintf("db error %d: %s", e.Code, e.Message)
}

func query() error {
\terr := &DBError{Code: 1045, Message: "access denied"}
\treturn fmt.Errorf("query users: %w", err)
}

func main() {
\terr := query()

\tvar dbErr *DBError
\tif errors.As(err, &dbErr) {
\t\tfmt.Println("code:", dbErr.Code)
\t\tfmt.Println("message:", dbErr.Message)
\t}
}
`,
      validate: (code: string) =>
        code.includes("errors.As") &&
        code.includes("*DBError") &&
        code.includes("dbErr.Code"),
      successMessage:
        "errors.As traverses the chain and type-asserts at each level. This gives you structured access to the original error type — code, path, offset — without relying on string parsing.",
    },
    {
      instruction:
        "Define a `ServiceError` wrapping an inner error via `Unwrap() error`. In `process() error`, return a `*ServiceError` that wraps `io.ErrUnexpectedEOF`. In main, use `errors.Is(err, io.ErrUnexpectedEOF)` to confirm the chain is traversable.",
      starterCode: `package main

import (
\t"errors"
\t"fmt"
\t"io"
)

type ServiceError struct {
\tOp  string
\tErr error
}

func (e *ServiceError) Error() string {
\treturn fmt.Sprintf("service %s: %v", e.Op, e.Err)
}

func (e *ServiceError) Unwrap() error {
\t// TODO: return e.Err
\treturn nil
}

func process() error {
\treturn &ServiceError{Op: "read", Err: io.ErrUnexpectedEOF}
}

func main() {
\terr := process()
\tfmt.Println(err)
\tfmt.Println("is ErrUnexpectedEOF:", errors.Is(err, io.ErrUnexpectedEOF))
}
`,
      hint: `package main

import (
\t"errors"
\t"fmt"
\t"io"
)

type ServiceError struct {
\tOp  string
\tErr error
}

func (e *ServiceError) Error() string {
\treturn fmt.Sprintf("service %s: %v", e.Op, e.Err)
}

func (e *ServiceError) Unwrap() error {
\treturn e.Err
}

func process() error {
\treturn &ServiceError{Op: "read", Err: io.ErrUnexpectedEOF}
}

func main() {
\terr := process()
\tfmt.Println(err)
\tfmt.Println("is ErrUnexpectedEOF:", errors.Is(err, io.ErrUnexpectedEOF))
}
`,
      validate: (code: string) =>
        code.includes("Unwrap()") &&
        code.includes("errors.Is") &&
        code.includes("io.ErrUnexpectedEOF"),
      successMessage:
        "Implementing Unwrap() error is the contract that lets errors.Is and errors.As recurse into your custom type. Without it, errors.Is would stop at ServiceError and never find the wrapped io.ErrUnexpectedEOF.",
    },
  ],
};
