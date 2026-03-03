import type { LessonModule } from "../types";

export const fileIO: LessonModule = {
  type: "lesson",
  id: "45",
  slug: "file-io",
  title: "File I/O",
  icon: "📂",
  estimatedMinutes: 14,
  content: `## File I/O

Go's standard library provides layered file I/O: simple whole-file helpers, low-level \`os\` file handles, and the composable \`io.Reader\`/\`io.Writer\` interfaces.

### Simple whole-file operations

For small files where the entire content fits comfortably in memory:

\`\`\`go
// Read entire file into []byte
data, err := os.ReadFile("config.txt")
if err != nil {
    log.Fatal(err)
}
fmt.Println(string(data))

// Write []byte to file (creates or truncates)
err = os.WriteFile("output.txt", []byte("hello\\n"), 0644)
\`\`\`

The permission bits \`0644\` grant the owner read+write and everyone else read-only.

### Opening and creating files

\`os.Open\` returns an \`*os.File\` for reading. \`os.Create\` creates (or truncates) a file for writing:

\`\`\`go
f, err := os.Open("data.txt")
if err != nil {
    log.Fatal(err)
}
defer f.Close() // always close when done
\`\`\`

Always \`defer f.Close()\` immediately after a successful open — it fires even if the function returns early or panics.

For more control over open flags and permissions, use \`os.OpenFile\`:

\`\`\`go
// append to existing file, creating it if necessary
f, err := os.OpenFile("log.txt", os.O_APPEND|os.O_CREATE|os.O_WRONLY, 0644)
defer f.Close()
\`\`\`

Common flag combinations:

| Flags | Use case |
|-------|----------|
| \`os.O_RDONLY\` | Read-only (default for \`os.Open\`) |
| \`os.O_WRONLY\` | Write-only |
| \`os.O_RDWR\` | Read and write |
| \`os.O_CREATE\` | Create if it doesn't exist |
| \`os.O_TRUNC\` | Truncate to zero (default for \`os.Create\`) |
| \`os.O_APPEND\` | Append; every write goes to end of file |

### Line-by-line reading with \`bufio.Scanner\`

\`bufio.Scanner\` is the idiomatic way to read line by line:

\`\`\`go
f, _ := os.Open("lines.txt")
defer f.Close()

scanner := bufio.NewScanner(f)
for scanner.Scan() {
    fmt.Println(scanner.Text()) // one line, no trailing newline
}
if err := scanner.Err(); err != nil {
    log.Fatal(err)
}
\`\`\`

### \`io.Writer\` — the complement to \`io.Reader\`

Just as \`io.Reader\` is the interface for reading, \`io.Writer\` is the interface for writing:

\`\`\`go
type Writer interface {
    Write(p []byte) (n int, err error)
}
\`\`\`

\`*os.File\`, \`bytes.Buffer\`, \`strings.Builder\`, and many more implement \`io.Writer\`. Write to any of them uniformly:

\`\`\`go
var buf bytes.Buffer
fmt.Fprintln(&buf, "hello") // writes to buf, not stdout
fmt.Println(buf.String())   // "hello\\n"
\`\`\`

### Streaming with \`io.Copy\`

\`io.Copy\` reads from a \`Reader\` and writes to a \`Writer\` in chunks — no need to load the whole file into memory:

\`\`\`go
src, _ := os.Open("big.txt")
defer src.Close()

dst, _ := os.Create("copy.txt")
defer dst.Close()

n, err := io.Copy(dst, src)
fmt.Printf("copied %d bytes\\n", n)
\`\`\`

### Path manipulation with \`path/filepath\`

\`path/filepath\` handles OS-specific path separators correctly (forward slash on Unix, backslash on Windows):

\`\`\`go
p := filepath.Join("home", "user", "file.txt") // "home/user/file.txt"
filepath.Dir(p)   // "home/user"
filepath.Base(p)  // "file.txt"
filepath.Ext(p)   // ".txt"

// find all .go files in a directory tree
matches, _ := filepath.Glob("src/**/*.go")
\`\`\`

### Temp files

\`os.CreateTemp\` creates a uniquely-named file for scratch data:

\`\`\`go
f, err := os.CreateTemp("", "prefix-*.txt") // "" = OS temp dir
defer os.Remove(f.Name())                    // clean up when done
defer f.Close()
fmt.Fprintln(f, "temporary data")
\`\`\`
`,
  quiz: [
    {
      question: "What is the idiomatic way to ensure a file is closed after opening it?",
      options: [
        "Call f.Close() at the end of the function",
        "Use defer f.Close() immediately after the successful os.Open call",
        "Wrap the file in a try/finally block",
        "Use os.ReadFile which closes automatically",
      ],
      correctIndex: 1,
    },
    {
      question: "Which os.OpenFile flag combination appends to an existing file without truncating it?",
      options: [
        "os.O_CREATE | os.O_TRUNC",
        "os.O_RDWR",
        "os.O_APPEND | os.O_WRONLY",
        "os.O_RDONLY | os.O_APPEND",
      ],
      correctIndex: 2,
    },
    {
      question: "What does io.Copy do?",
      options: [
        "Copies a file on disk to a new path",
        "Reads all bytes from a Reader into a []byte slice",
        "Streams data from a Reader to a Writer in chunks",
        "Duplicates an os.File handle",
      ],
      correctIndex: 2,
    },
  ],
};
