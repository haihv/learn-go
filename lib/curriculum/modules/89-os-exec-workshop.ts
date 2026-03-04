import type { WorkshopModule } from "../types";

export const osExecWorkshop: WorkshopModule = {
  type: "workshop",
  id: "89",
  slug: "os-exec-workshop",
  title: "os/exec Workshop",
  icon: "⚙️",
  estimatedMinutes: 22,
  description:
    "Run subprocesses, capture output, stream results, and cancel with context.",
  steps: [
    {
      instruction:
        "Use `exec.Command` to run `go version` and capture its output with `.Output()`. Print the output as a string. Handle any error with `log.Fatal`.",
      starterCode: `package main

import (
	"fmt"
	"log"
	"os/exec"
)

func main() {
	cmd := exec.Command("go", "version")
	// TODO: out, err := cmd.Output()
	// TODO: handle error with log.Fatal
	// TODO: fmt.Print(string(out))
	_ = cmd
	_ = fmt.Print
	_ = log.Fatal
}
`,
      hint: `out, err := cmd.Output(); if err != nil { log.Fatal(err) }; fmt.Print(string(out))`,
      validate: (code: string) =>
        code.includes("exec.Command") &&
        code.includes(".Output()") &&
        code.includes("string(out)"),
      successMessage:
        "cmd.Output() is the simplest way to run a command and get its stdout. The returned []byte includes everything the command wrote to stdout — convert to string for printing.",
    },
    {
      instruction:
        'Run `exec.Command("go", "build", "./nonexistent")` which will fail. Use `errors.As(err, &exitErr)` with `*exec.ExitError` to extract and print the exit code. Print `"exit code: N"` on failure.',
      starterCode: `package main

import (
	"errors"
	"fmt"
	"os/exec"
)

func main() {
	cmd := exec.Command("go", "build", "./nonexistent")
	err := cmd.Run()
	if err != nil {
		// TODO: errors.As(err, &exitErr) and print exitErr.ExitCode()
		var exitErr *exec.ExitError
		_ = exitErr
		fmt.Println("command failed:", err)
	}
}
`,
      hint: `if errors.As(err, &exitErr) { fmt.Println("exit code:", exitErr.ExitCode()) }`,
      validate: (code: string) =>
        code.includes("exec.ExitError") &&
        code.includes("errors.As") &&
        code.includes("ExitCode()"),
      successMessage:
        "exec.ExitError carries the exit code, stderr output, and process state. Always use errors.As rather than type-asserting directly — it handles wrapping.",
    },
    {
      instruction:
        'Run `exec.Command("cat")` (which echoes stdin to stdout). Pipe the string `"hello from Go\\n"` into it via `cmd.Stdin = strings.NewReader(...)`. Connect `cmd.Stdout = os.Stdout`. Call `cmd.Run()` and handle errors.',
      starterCode: `package main

import (
	"log"
	"os"
	"os/exec"
	"strings"
)

func main() {
	cmd := exec.Command("cat")
	// TODO: cmd.Stdin = strings.NewReader("hello from Go\\n")
	// TODO: cmd.Stdout = os.Stdout
	// TODO: cmd.Stderr = os.Stderr
	// TODO: cmd.Run() and log.Fatal on error
	_ = cmd
	_ = strings.NewReader
	_ = os.Stdout
	_ = log.Fatal
}
`,
      hint: `set Stdin, Stdout, Stderr then cmd.Run()`,
      validate: (code: string) =>
        code.includes("cmd.Stdin") &&
        code.includes("cmd.Stdout") &&
        code.includes("strings.NewReader"),
      successMessage:
        "Assigning io.Reader/Writer to cmd.Stdin/Stdout/Stderr wires the subprocess directly to Go's I/O system — no buffering overhead, and it works with any io.Reader source.",
    },
    {
      instruction:
        "Use `exec.CommandContext` with a 2-second timeout context to run `go version`. After the command finishes, print the output. Demonstrate the timeout by also showing what happens when a context is already cancelled (cancel immediately before running).",
      starterCode: `package main

import (
	"context"
	"fmt"
	"log"
	"os/exec"
	"time"
)

func main() {
	// Normal run with 2-second timeout
	ctx, cancel := context.WithTimeout(context.Background(), 2*time.Second)
	defer cancel()

	// TODO: exec.CommandContext(ctx, "go", "version")
	// TODO: cmd.Output() and print string(out)

	// Demonstrate cancellation: cancel immediately
	cancelCtx, cancelNow := context.WithCancel(context.Background())
	cancelNow() // cancel before running
	cmd2 := exec.CommandContext(cancelCtx, "go", "version")
	_, err2 := cmd2.Output()
	if err2 != nil {
		fmt.Println("cancelled:", err2)
	}

	_ = log.Fatal
}
`,
      hint: `cmd := exec.CommandContext(ctx, "go", "version"); out, err := cmd.Output(); ...`,
      validate: (code: string) =>
        code.includes("exec.CommandContext") &&
        code.includes("context.WithTimeout") &&
        code.includes("context.WithCancel"),
      successMessage:
        "exec.CommandContext sends SIGKILL to the subprocess when the context is cancelled. This prevents runaway processes from outliving HTTP requests or job queue tasks in server applications.",
    },
  ],
};
