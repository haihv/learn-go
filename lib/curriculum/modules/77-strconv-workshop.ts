import type { WorkshopModule } from "../types";

export const strconvWorkshop: WorkshopModule = {
  type: "workshop",
  id: "77",
  slug: "strconv-workshop",
  title: "strconv Workshop",
  icon: "🔄",
  estimatedMinutes: 18,
  description: "Practice Atoi/Itoa, ParseFloat/FormatFloat, ParseInt with bases, and structured error handling.",
  steps: [
    {
      instruction:
        'Use `strconv.Atoi` to parse `"42"` and `"not-a-number"`. Print the result or the error. Then use `strconv.Itoa` to convert `100` back to a string and print it.',
      starterCode: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	// TODO: strconv.Atoi("42") — print result
	// TODO: strconv.Atoi("not-a-number") — print error
	// TODO: strconv.Itoa(100) — print result
	_ = strconv.Atoi
	_ = strconv.Itoa
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	n, err := strconv.Atoi("42")
	fmt.Println(n, err)

	n, err = strconv.Atoi("not-a-number")
	fmt.Println(n, err)

	s := strconv.Itoa(100)
	fmt.Println(s)
}
`,
      validate: (code: string) =>
        code.includes("strconv.Atoi") && code.includes("strconv.Itoa"),
      successMessage:
        "Atoi and Itoa are the workhorses of Go string conversion. Always check the error from Atoi — user input is unreliable.",
    },
    {
      instruction:
        'Parse `"3.14159"` with `strconv.ParseFloat(s, 64)`. Then format the result back to a string with 2 decimal places using `strconv.FormatFloat(f, \'f\', 2, 64)`. Print both the parsed value and the formatted string.',
      starterCode: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	s := "3.14159"
	// TODO: strconv.ParseFloat(s, 64) and print
	// TODO: strconv.FormatFloat(f, 'f', 2, 64) and print
	_ = strconv.ParseFloat
	_ = strconv.FormatFloat
	_ = fmt.Println
	_ = s
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	s := "3.14159"

	f, err := strconv.ParseFloat(s, 64)
	fmt.Println(f, err)

	formatted := strconv.FormatFloat(f, 'f', 2, 64)
	fmt.Println(formatted)
}
`,
      validate: (code: string) =>
        code.includes("strconv.ParseFloat") && code.includes("strconv.FormatFloat"),
      successMessage:
        "FormatFloat's precision argument (-1 for shortest, 2 for two decimals) gives you fine control over the output format — useful when generating CSV, JSON fields, or financial output.",
    },
    {
      instruction:
        'Parse three strings with different bases: `"ff"` (base 16), `"1010"` (base 2), and `"0777"` (base 0, octal inferred from prefix). Print the decimal value of each.',
      starterCode: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	// TODO: strconv.ParseInt("ff", 16, 64) — print result (should be 255)
	// TODO: strconv.ParseInt("1010", 2, 64) — print result (should be 10)
	// TODO: strconv.ParseInt("0777", 0, 64) — print result (should be 511)
	_ = strconv.ParseInt
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"strconv"
)

func main() {
	n, err := strconv.ParseInt("ff", 16, 64)
	fmt.Println(n, err) // 255

	n, err = strconv.ParseInt("1010", 2, 64)
	fmt.Println(n, err) // 10

	n, err = strconv.ParseInt("0777", 0, 64)
	fmt.Println(n, err) // 511
}
`,
      validate: (code: string) =>
        code.includes("strconv.ParseInt") &&
        code.includes("16") &&
        code.includes(", 2,"),
      successMessage:
        "Base 0 tells ParseInt to infer from the prefix (0x=hex, 0=octal, else decimal) — handy when parsing user-supplied numeric strings that might be in any base.",
    },
    {
      instruction:
        "Write a `parseAge(s string) (int, error)` function that uses `strconv.Atoi`. If the error is a `*strconv.NumError`, return a custom message including `numErr.Num`. Test with both valid and invalid input.",
      starterCode: `package main

import (
	"errors"
	"fmt"
	"strconv"
)

func parseAge(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		// TODO: use errors.As(err, &numErr) to unwrap *strconv.NumError
		// return 0, fmt.Errorf("invalid age %q: ...", numErr.Num)
		return 0, err
	}
	return n, nil
}

func main() {
	age, err := parseAge("25")
	fmt.Println(age, err)

	age, err = parseAge("abc")
	fmt.Println(age, err)

	_ = errors.As
}
`,
      hint: `package main

import (
	"errors"
	"fmt"
	"strconv"
)

func parseAge(s string) (int, error) {
	n, err := strconv.Atoi(s)
	if err != nil {
		var numErr *strconv.NumError
		if errors.As(err, &numErr) {
			return 0, fmt.Errorf("invalid age %q: not a valid integer", numErr.Num)
		}
		return 0, err
	}
	return n, nil
}

func main() {
	age, err := parseAge("25")
	fmt.Println(age, err)

	age, err = parseAge("abc")
	fmt.Println(age, err)
}
`,
      validate: (code: string) =>
        code.includes("strconv.NumError") && code.includes("errors.As"),
      successMessage:
        "*strconv.NumError carries the function name, the original input string, and the underlying error (ErrSyntax or ErrRange). Unwrapping it gives you structured error information instead of just a string.",
    },
  ],
};
