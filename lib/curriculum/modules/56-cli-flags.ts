import type { LessonModule } from "../types";

export const cliFlags: LessonModule = {
  type: "lesson",
  id: "56",
  slug: "cli-flags",
  title: "CLI Flags & Env Vars",
  icon: "🚩",
  estimatedMinutes: 12,
  content: `## CLI Flags & Env Vars

Almost every real Go program needs to read configuration: a port number, a database URL, a debug toggle. Go provides two complementary mechanisms: the \`flag\` package for command-line flags, and \`os\` for environment variables.

### os.Args — raw command-line

\`os.Args\` is a \`[]string\` containing the program's arguments:

\`\`\`go
// ./myapp --port=8080 serve
os.Args[0]  // "./myapp"  (the binary name)
os.Args[1]  // "--port=8080"
os.Args[2]  // "serve"
\`\`\`

Parsing \`os.Args\` manually is error-prone. The \`flag\` package does it correctly.

### Defining flags

\`\`\`go
import "flag"

port    := flag.Int("port", 8080, "port to listen on")
verbose := flag.Bool("verbose", false, "enable verbose output")
host    := flag.String("host", "localhost", "server host")
\`\`\`

Each call registers a flag and returns a **pointer** to the value. The pointer is not populated until \`flag.Parse()\` is called.

### flag.Parse()

Call \`flag.Parse()\` once, early in \`main\`, before reading any flag value:

\`\`\`go
func main() {
    port := flag.Int("port", 8080, "port to listen on")
    flag.Parse()

    fmt.Println("listening on port", *port)  // dereference the pointer
}
\`\`\`

After \`flag.Parse()\`, dereference the pointers to get the actual values.

### Positional arguments

Arguments that aren't flags (don't start with \`-\`) are available via \`flag.Args()\`:

\`\`\`bash
./myapp --port=9000 file1.txt file2.txt
\`\`\`

\`\`\`go
flag.Parse()
files := flag.Args()  // []string{"file1.txt", "file2.txt"}
\`\`\`

### flag.NewFlagSet — sub-commands

Real CLIs often have sub-commands (\`git commit\`, \`git push\`). Each sub-command gets its own \`FlagSet\`:

\`\`\`go
serveCmd  := flag.NewFlagSet("serve", flag.ExitOnError)
servePort := serveCmd.Int("port", 8080, "port")

migrateCmd := flag.NewFlagSet("migrate", flag.ExitOnError)
migrateDB  := migrateCmd.String("dsn", "", "database URL")

switch os.Args[1] {
case "serve":
    serveCmd.Parse(os.Args[2:])
    fmt.Println("serving on port", *servePort)
case "migrate":
    migrateCmd.Parse(os.Args[2:])
    fmt.Println("migrating", *migrateDB)
}
\`\`\`

### Reading environment variables

\`\`\`go
val := os.Getenv("DATABASE_URL")
// returns "" if the variable is not set
\`\`\`

When you need to distinguish between "variable is missing" and "variable is set to empty string", use \`os.LookupEnv\`:

\`\`\`go
val, ok := os.LookupEnv("DATABASE_URL")
if !ok {
    fmt.Println("DATABASE_URL not set, using default")
    val = "postgres://localhost/dev"
}
\`\`\`

### The 12-factor convention

The [12-factor app](https://12factor.net/config) pattern: flags carry **development defaults**, environment variables **override** them in production. A common pattern:

\`\`\`go
port := flag.Int("port", 8080, "port (overridden by PORT env var)")
flag.Parse()

if envPort := os.Getenv("PORT"); envPort != "" {
    p, _ := strconv.Atoi(envPort)
    port = &p
}
\`\`\`

This lets developers run \`./myapp\` with sensible defaults while deployment systems (Docker, Kubernetes) inject configuration via environment variables without touching the binary.

### Why flag functions return pointers

Flags are registered before \`flag.Parse()\` is called, so the value isn't known at registration time. Returning a pointer lets the \`flag\` package write the parsed value into the same memory location after parsing, and the caller always holds a reference to the final value.
`,
  quiz: [
    {
      question: "When must flag.Parse() be called relative to reading flag values?",
      options: [
        "Before reading any flag value — flag values are only populated after Parse()",
        "After reading flag values — Parse() finalises the values",
        "It can be called at any time; the order does not matter",
        "It is called automatically; you never need to call it manually",
      ],
      correctIndex: 0,
    },
    {
      question: "What is the difference between os.Getenv and os.LookupEnv?",
      options: [
        "os.Getenv is faster; os.LookupEnv is more accurate",
        "os.Getenv returns a string (empty if unset); os.LookupEnv returns (string, bool) so you can tell whether the variable exists",
        "os.LookupEnv reads from .env files; os.Getenv reads from the process environment",
        "There is no difference — they are aliases",
      ],
      correctIndex: 1,
    },
    {
      question: "Why do flag.String, flag.Int, and flag.Bool return pointers?",
      options: [
        "To allow the caller to change the flag's value after parsing",
        "Because Go always returns pointers from standard library functions",
        "The flag value isn't known at registration time; a pointer lets the flag package write the parsed value into the same memory after Parse() is called",
        "To avoid copying large strings",
      ],
      correctIndex: 2,
    },
  ],
};
