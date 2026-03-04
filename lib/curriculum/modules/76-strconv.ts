import type { LessonModule } from "../types";

export const strconvModule: LessonModule = {
  type: "lesson",
  id: "76",
  slug: "strconv",
  title: "strconv — String Conversions",
  icon: "🔄",
  estimatedMinutes: 11,
  content: `### Why strconv?

Real programs constantly convert between strings and numbers: parsing URL query parameters, reading environment variables, formatting IDs, serialising config. The \`strconv\` package is the standard library's dedicated module for these conversions — faster and more explicit than \`fmt.Sprintf\` / \`fmt.Sscanf\`.

### int ↔ string

\`\`\`go
// int → string
s := strconv.Itoa(42)          // "42"

// string → int (returns error)
n, err := strconv.Atoi("42")  // n = 42, err = nil
n, err  = strconv.Atoi("abc") // n = 0, err = *strconv.NumError
\`\`\`

\`Atoi\` = ASCII to integer. \`Itoa\` = integer to ASCII. These are the most common calls in real Go code.

### ParseInt — control base and bit size

\`\`\`go
// base 16 (hex), fit in int64
n, err := strconv.ParseInt("ff", 16, 64)  // n = 255

// base 2 (binary), fit in int32
n, err  = strconv.ParseInt("1010", 2, 32) // n = 10

// base 0 — infer from prefix (0x=hex, 0=octal, else decimal)
n, err  = strconv.ParseInt("0xff", 0, 64) // n = 255
\`\`\`

\`strconv.ParseUint\` and \`strconv.FormatInt(n, base)\` mirror this API.

### float64 ↔ string

\`\`\`go
// string → float64
f, err := strconv.ParseFloat("3.14", 64)

// float64 → string
s := strconv.FormatFloat(3.14159, 'f', 2, 64) // "3.14" (2 decimal places)
s  = strconv.FormatFloat(3.14159, 'e', 3, 64) // "3.142e+00"
s  = strconv.FormatFloat(3.14159, 'g', -1, 64) // shortest representation
\`\`\`

Format verbs: \`'f'\` = decimal, \`'e'\` = scientific, \`'g'\` = shortest of f/e.

### bool ↔ string

\`\`\`go
b, err := strconv.ParseBool("true")   // true, nil
b, err  = strconv.ParseBool("1")      // true, nil
b, err  = strconv.ParseBool("false")  // false, nil
b, err  = strconv.ParseBool("yes")    // false, error

s := strconv.FormatBool(true)  // "true"
\`\`\`

\`ParseBool\` accepts: "1", "t", "T", "TRUE", "true", "True", "0", "f", "F", "FALSE", "false", "False".

### Handling *strconv.NumError

When parsing fails, the error is a \`*strconv.NumError\` with structured fields:

\`\`\`go
n, err := strconv.Atoi("bad")
if err != nil {
    var numErr *strconv.NumError
    if errors.As(err, &numErr) {
        fmt.Println("func:", numErr.Func)  // "Atoi"
        fmt.Println("num:", numErr.Num)   // "bad"
        fmt.Println("err:", numErr.Err)   // strconv.ErrSyntax
    }
}
\`\`\`

### Quote and Unquote

\`\`\`go
s := strconv.Quote("hello\\nworld")    // \`"hello\\nworld"\` (Go-syntax string)
s  = strconv.Quote(\`tab\there\`)       // \`"tab\\there"\`

raw, err := strconv.Unquote(\`"hello\\nworld"\`) // "hello\\nworld"
\`\`\`

Useful for generating code, writing config parsers, and producing safe debug output.

### strconv vs fmt for performance

\`strconv.Itoa(n)\` is measurably faster than \`fmt.Sprintf("%d", n)\` because it avoids reflection and interface boxing. In hot paths (log lines, IDs, counters), prefer \`strconv\`.`,
  quiz: [
    {
      question: 'What does strconv.Atoi("abc") return?',
      options: [
        "0, nil",
        "0, *strconv.NumError with Err == strconv.ErrSyntax",
        "A panic with an invalid argument error",
        "The Unicode code point of 'a'",
      ],
      correctIndex: 1,
    },
    {
      question: "Which strconv.FormatFloat format verb produces the shortest decimal representation?",
      options: [
        "'f' (decimal notation)",
        "'e' (scientific notation)",
        "'g' (shortest of f or e)",
        "'s' (string notation)",
      ],
      correctIndex: 2,
    },
    {
      question: 'Why prefer strconv.Itoa over fmt.Sprintf("%d", n) in a hot path?',
      options: [
        "Itoa supports numbers larger than int64",
        "Itoa avoids reflection and interface boxing, making it measurably faster for number-to-string conversion",
        "fmt.Sprintf does not support integer formatting",
        "Itoa automatically handles negative numbers; Sprintf does not",
      ],
      correctIndex: 1,
    },
  ],
};
