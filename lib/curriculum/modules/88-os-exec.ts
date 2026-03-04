import type { LessonModule } from "../types";

export const osExec: LessonModule = {
  type: "lesson",
  id: "88",
  slug: "os-exec",
  title: "Running Subprocesses with os/exec",
  icon: "⚙️",
  estimatedMinutes: 13,
  content: `## Running Subprocesses with os/exec

### Why os/exec?

Go programs often need to shell out to external tools: \`git\`, \`ffmpeg\`, \`openssl\`, database CLI utilities. The \`os/exec\` package runs subprocesses safely — without a shell, without injection risks, and with full control over stdin/stdout/stderr.

### Running a command and capturing output

\`\`\`go
out, err := exec.Command("git", "rev-parse", "HEAD").Output()
if err != nil {
    log.Fatal(err)
}
fmt.Printf("commit: %s", out)
\`\`\`

\`Output()\` runs the command, waits for it to complete, and returns stdout as \`[]byte\`. If the command exits with a non-zero status, err is \`*exec.ExitError\`.

### CombinedOutput — stdout + stderr together

\`\`\`go
out, err := exec.Command("go", "build", "./...").CombinedOutput()
if err != nil {
    fmt.Fprintf(os.Stderr, "build failed:\\n%s\\n", out)
    os.Exit(1)
}
\`\`\`

Useful when you want the complete output regardless of which stream it came from.

### Checking exit codes

\`\`\`go
cmd := exec.Command("grep", "-q", "TODO", "main.go")
err := cmd.Run()
if err != nil {
    var exitErr *exec.ExitError
    if errors.As(err, &exitErr) {
        fmt.Println("exit code:", exitErr.ExitCode())
    }
}
\`\`\`

\`Run()\` runs the command and waits — use it when you don't need the output.

### Connecting stdin/stdout/stderr

\`\`\`go
cmd := exec.Command("cat")
cmd.Stdin  = strings.NewReader("hello from Go\\n")
cmd.Stdout = os.Stdout
cmd.Stderr = os.Stderr
cmd.Run()
\`\`\`

Assign \`io.Reader\`/\`io.Writer\` values to \`cmd.Stdin\`, \`cmd.Stdout\`, \`cmd.Stderr\` before calling \`Run()\`.

### Streaming output with pipes

\`\`\`go
cmd := exec.Command("ping", "-c", "3", "localhost")
stdout, err := cmd.StdoutPipe()
if err != nil {
    log.Fatal(err)
}
cmd.Start()

scanner := bufio.NewScanner(stdout)
for scanner.Scan() {
    fmt.Println("got:", scanner.Text())
}
cmd.Wait()
\`\`\`

Use \`StdoutPipe()\` + \`cmd.Start()\` + \`cmd.Wait()\` when you need to process output line by line while the command runs.

### Security: never use shell=true

**Do not** construct commands by concatenating user input into a shell string:

\`\`\`go
// DANGEROUS — shell injection
exec.Command("sh", "-c", "ls " + userInput)

// SAFE — pass args separately; no shell involved
exec.Command("ls", "-la", userInput)
\`\`\`

\`exec.Command\` takes the program name and each argument separately. No shell is invoked — special characters in arguments are passed literally.

### Setting environment and working directory

\`\`\`go
cmd := exec.Command("make", "build")
cmd.Dir = "/path/to/project"
cmd.Env = append(os.Environ(), "CGO_ENABLED=0", "GOOS=linux")
\`\`\`

\`cmd.Dir\` sets the working directory. \`cmd.Env\` replaces the entire environment — start from \`os.Environ()\` to inherit the current env, then append overrides.

### Context cancellation

\`\`\`go
ctx, cancel := context.WithTimeout(context.Background(), 30*time.Second)
defer cancel()

cmd := exec.CommandContext(ctx, "slow-tool", "--flag")
out, err := cmd.Output()
// If ctx times out, the process is killed and err wraps context.DeadlineExceeded
\`\`\`

\`exec.CommandContext\` kills the subprocess when the context is cancelled — essential for server-side use where runaway processes must not outlive their request.
`,
  quiz: [
    {
      question:
        'Why is exec.Command("sh", "-c", "ls "+userInput) dangerous?',
      options: [
        "It spawns too many goroutines",
        'Passing user input to a shell allows injection — a user could supply "; rm -rf /" and the shell would execute it. Pass each argument separately to avoid the shell entirely.',
        "os/exec does not support the sh command",
        "The sh binary is not available on all platforms",
      ],
      correctIndex: 1,
    },
    {
      question: "What is the difference between cmd.Output() and cmd.Run()?",
      options: [
        "Output() runs asynchronously; Run() blocks",
        "Output() captures and returns stdout as []byte; Run() simply runs the command and returns only the error",
        "Run() is for long-running daemons; Output() is for one-shot commands",
        "There is no difference — they are aliases",
      ],
      correctIndex: 1,
    },
    {
      question:
        "When should you use exec.CommandContext instead of exec.Command?",
      options: [
        "Always — CommandContext is the newer, preferred API",
        "When the subprocess must be killed if a context is cancelled or times out — essential for server-side use to prevent runaway processes",
        "Only when the command reads from stdin",
        "When the command is expected to run for less than one second",
      ],
      correctIndex: 1,
    },
  ],
};
