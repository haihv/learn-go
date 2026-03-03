import { LessonModule } from "../types";

export const ioReader: LessonModule = {
  type: "lesson",
  id: "22b",
  slug: "io-reader",
  title: "io.Reader",
  icon: "📖",
  estimatedMinutes: 12,
  content: `# io.Reader

## The Most Fundamental Interface in Go

\`io.Reader\` is the cornerstone of Go's I/O model. Its definition is deceptively simple:

\`\`\`go
type Reader interface {
    Read(p []byte) (n int, err error)
}
\`\`\`

\`Read\` fills the byte slice \`p\` with up to \`len(p)\` bytes and returns how many bytes were actually read (\`n\`). When there is no more data, it returns \`0, io.EOF\`.

If you are coming from Python, think of \`io.Reader\` as the Go equivalent of a file object's \`read()\` method — except it works on any data source, not just files.

## Why It Matters

Every type in Go's standard library that produces bytes implements \`io.Reader\`:

| Type | What it reads from |
|------|--------------------|
| \`*os.File\` | disk files |
| \`http.Request.Body\` | incoming HTTP request bodies |
| \`net.Conn\` | network connections (TCP, UDP) |
| \`*bytes.Buffer\` | in-memory byte buffers |
| \`*strings.Reader\` | in-memory strings |
| \`gzip.Reader\` | compressed streams |

A function that accepts \`io.Reader\` works with **all** of these without any changes. This is Go's approach to polymorphism through interfaces — write once, works everywhere bytes flow.

\`\`\`go
// This function doesn't know or care where the bytes come from
func countBytes(r io.Reader) (int64, error) {
    buf := make([]byte, 4096)
    var total int64
    for {
        n, err := r.Read(buf)
        total += int64(n)
        if err == io.EOF {
            return total, nil
        }
        if err != nil {
            return total, err
        }
    }
}
\`\`\`

## strings.NewReader — Creating a Reader for Testing

The easiest way to get an \`io.Reader\` without touching the filesystem is \`strings.NewReader\`. It wraps a string as an \`io.Reader\` so you can pass it to any function that expects one:

\`\`\`go
package main

import (
    "fmt"
    "io"
    "strings"
)

func main() {
    r := strings.NewReader("Hello, Go!")

    buf := make([]byte, 4)
    for {
        n, err := r.Read(buf)
        fmt.Printf("n=%d data=%q\\n", n, buf[:n])
        if err == io.EOF {
            break
        }
    }
}
\`\`\`

Output:
\`\`\`
n=4 data="Hell"
n=4 data="o, G"
n=2 data="o!"
\`\`\`

The \`Read\` call fills the buffer as many times as needed, returning fewer bytes on the last chunk. This chunked behavior is fundamental — do not assume a single \`Read\` returns everything.

## Reading in Chunks

The \`Read\` contract has two rules you must always follow:

1. **Process \`n\` bytes, not \`len(buf)\`** — the slice may only be partially filled.
2. **Check \`err\` after processing \`n\` bytes** — \`io.EOF\` can arrive on the same call that returns the final bytes, so discarding \`n\` before checking \`err\` loses data.

\`\`\`go
buf := make([]byte, 512)
for {
    n, err := r.Read(buf)
    // Process buf[:n] FIRST — n bytes were read even if err is set
    process(buf[:n])
    if err == io.EOF {
        break
    }
    if err != nil {
        log.Fatal(err)
    }
}
\`\`\`

In Python you would write \`data = f.read(512)\` and check \`if not data\`. The Go pattern is more explicit because the same call that delivers the last bytes also delivers the \`io.EOF\` signal.

## io.ReadAll — Reading Everything at Once

When the entire content fits comfortably in memory, \`io.ReadAll\` is the convenient shortcut:

\`\`\`go
package main

import (
    "fmt"
    "io"
    "strings"
)

func main() {
    r := strings.NewReader("Hello, Go!")
    data, err := io.ReadAll(r)
    if err != nil {
        panic(err)
    }
    fmt.Println(string(data)) // Hello, Go!
}
\`\`\`

\`io.ReadAll\` is the right tool for small, bounded inputs (configuration files, test fixtures, API responses under a known size limit). Avoid it for unbounded streams — a misbehaving client could send gigabytes and exhaust memory.

## bufio.Scanner — Line-by-Line Reading

When input is text and you want one line at a time, \`bufio.Scanner\` is cleaner than manual chunk reads:

\`\`\`go
package main

import (
    "bufio"
    "fmt"
    "strings"
)

func main() {
    input := "first line\\nsecond line\\nthird line"
    scanner := bufio.NewScanner(strings.NewReader(input))

    for scanner.Scan() {
        fmt.Println(scanner.Text())
    }
    if err := scanner.Err(); err != nil {
        panic(err)
    }
}
\`\`\`

Output:
\`\`\`
first line
second line
third line
\`\`\`

\`scanner.Scan()\` advances to the next token (line by default) and returns \`false\` at EOF. Always check \`scanner.Err()\` after the loop — a \`false\` return from \`Scan\` could mean either clean EOF or an I/O error. This mirrors Python's \`for line in f:\` idiom but makes errors explicit.

## io.Reader Composition — The Real Power

Because \`io.Reader\` is an interface, it is trivially composable. The standard library ships several adapters that wrap one reader to produce a new one:

### io.LimitReader

Caps how many bytes can be read — essential for safely handling untrusted input:

\`\`\`go
// Read at most 1 MB, even if r is an infinite stream
limited := io.LimitReader(r, 1<<20)
data, err := io.ReadAll(limited)
\`\`\`

### io.TeeReader

Reads from one reader and simultaneously writes everything to a writer — useful for logging, checksumming, or caching while streaming:

\`\`\`go
package main

import (
    "fmt"
    "io"
    "strings"
)

func main() {
    src := strings.NewReader("intercepted data")
    var spy strings.Builder

    // Every byte read from tee is also written to spy
    tee := io.TeeReader(src, &spy)

    data, _ := io.ReadAll(tee)
    fmt.Println("read:    ", string(data))
    fmt.Println("captured:", spy.String())
}
\`\`\`

Output:
\`\`\`
read:     intercepted data
captured: intercepted data
\`\`\`

These adapters work because they all accept and return \`io.Reader\`. You can stack them freely:

\`\`\`go
// Limit a file to 5 MB AND capture a copy for logging
limited := io.LimitReader(file, 5<<20)
logged  := io.TeeReader(limited, logWriter)
\`\`\`

No inheritance, no framework — just interface composition. This is the design philosophy that makes Go's standard library feel small yet cover everything.
`,
  quiz: [
    {
      question:
        "What does the Read method return when it has reached the end of the data?",
      options: [
        "nil, nil",
        "0, io.EOF",
        "0, nil",
        "-1, io.EOF",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Which statement best describes what strings.NewReader returns?",
      options: [
        "A *string that can be iterated byte by byte",
        "A *strings.Reader value that satisfies io.Reader",
        "An io.Writer that accepts string input",
        "A []byte slice of the string's contents",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Why should a function accept io.Reader instead of *os.File when it only needs to read bytes?",
      options: [
        "io.Reader is faster than *os.File for disk reads",
        "*os.File does not implement the Read method",
        "Accepting io.Reader lets the function work with files, HTTP bodies, in-memory buffers, and any other byte source",
        "The Go compiler cannot infer the type of *os.File at compile time",
      ],
      correctIndex: 2,
    },
  ],
};
