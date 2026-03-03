import type { WorkshopModule } from "../types";

export const interfacesWorkshop: WorkshopModule = {
  type: "workshop",
  id: "21",
  slug: "interfaces-workshop",
  title: "Interfaces Workshop",
  icon: "🔌",
  estimatedMinutes: 25,
  description: "Build a multi-destination logger using Go interfaces.",
  steps: [
    {
      instruction:
        "Define a `Logger` interface with a single method `Log(level, msg string)`. Implement a `ConsoleLogger` struct whose `Log` method prints `\"[level] msg\"` to stdout. Create one and call `Log`.",
      starterCode: `package main

import "fmt"

// TODO: define Logger interface here

// TODO: implement ConsoleLogger struct here

func main() {
	// TODO: create a ConsoleLogger and call Log
	fmt.Println("implement Logger")
}
`,
      hint: `package main

import "fmt"

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

func main() {
	var l Logger = ConsoleLogger{}
	l.Log("INFO", "server started")
}
`,
      validate: (code: string) =>
        code.includes("Logger") &&
        code.includes("Log(") &&
        code.includes("ConsoleLogger"),
      successMessage:
        "Any type with a matching Log method satisfies Logger — no explicit declaration needed.",
    },
    {
      instruction:
        "Implement a `FileLogger` struct that contains a `strings.Builder` field named `buf`. Its `Log` method should write `\"[level] msg\\n\"` to the builder. After logging a few messages, print the builder's accumulated contents.",
      starterCode: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

// TODO: implement FileLogger with a strings.Builder field

func main() {
	var l Logger = ConsoleLogger{}
	l.Log("INFO", "server started")

	// TODO: create a FileLogger, log a couple of messages, print builder contents
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

func main() {
	var l Logger = ConsoleLogger{}
	l.Log("INFO", "server started")

	fl := &FileLogger{}
	fl.Log("WARN", "disk almost full")
	fl.Log("ERROR", "connection refused")
	fmt.Print(fl.buf.String())
}
`,
      validate: (code: string) =>
        code.includes("FileLogger") &&
        code.includes("strings.Builder"),
      successMessage:
        "strings.Builder accumulates writes efficiently — use it wherever you need to build a string incrementally.",
    },
    {
      instruction:
        "Implement a `MultiLogger` struct with a field `loggers []Logger`. Its `Log` method should call `Log` on every logger in the slice, forwarding the same level and msg. Create a MultiLogger combining ConsoleLogger and FileLogger.",
      starterCode: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

// TODO: implement MultiLogger here

func main() {
	fl := &FileLogger{}
	// TODO: create a MultiLogger with ConsoleLogger and fl, then call Log
	_ = fl
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

type MultiLogger struct {
	loggers []Logger
}

func (m *MultiLogger) Log(level, msg string) {
	for _, l := range m.loggers {
		l.Log(level, msg)
	}
}

func main() {
	fl := &FileLogger{}
	ml := &MultiLogger{loggers: []Logger{ConsoleLogger{}, fl}}
	ml.Log("INFO", "app started")
	fmt.Print(fl.buf.String())
}
`,
      validate: (code: string) =>
        code.includes("MultiLogger") &&
        code.includes("[]Logger"),
      successMessage:
        "MultiLogger satisfies Logger too — you can nest it inside another MultiLogger if needed.",
    },
    {
      instruction:
        "Write a top-level function `logAll(l Logger, messages []string)` that calls `l.Log(\"INFO\", msg)` for every message in the slice. Pass a ConsoleLogger and a slice of three messages to it.",
      starterCode: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

type MultiLogger struct {
	loggers []Logger
}

func (m *MultiLogger) Log(level, msg string) {
	for _, l := range m.loggers {
		l.Log(level, msg)
	}
}

// TODO: write logAll function here

func main() {
	// TODO: call logAll with a ConsoleLogger and three messages
	fmt.Println("implement logAll")
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

type MultiLogger struct {
	loggers []Logger
}

func (m *MultiLogger) Log(level, msg string) {
	for _, l := range m.loggers {
		l.Log(level, msg)
	}
}

func logAll(l Logger, messages []string) {
	for _, msg := range messages {
		l.Log("INFO", msg)
	}
}

func main() {
	logAll(ConsoleLogger{}, []string{"startup", "ready", "shutdown"})
}
`,
      validate: (code: string) =>
        code.includes("func logAll") &&
        code.includes("Logger"),
      successMessage:
        "Accepting a Logger interface instead of a concrete type makes logAll work with any logger — current or future.",
    },
    {
      instruction:
        "Demonstrate runtime polymorphism: create a `[]Logger` slice containing a `ConsoleLogger` and a `*FileLogger`. Iterate over the slice and call `Log` on each element through the interface.",
      starterCode: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

type MultiLogger struct {
	loggers []Logger
}

func (m *MultiLogger) Log(level, msg string) {
	for _, l := range m.loggers {
		l.Log(level, msg)
	}
}

func logAll(l Logger, messages []string) {
	for _, msg := range messages {
		l.Log("INFO", msg)
	}
}

func main() {
	// TODO: create a []Logger with a ConsoleLogger and FileLogger,
	// iterate and call Log("DEBUG", "hello") on each
	fmt.Println("implement polymorphism")
}
`,
      hint: `package main

import (
	"fmt"
	"strings"
)

type Logger interface {
	Log(level, msg string)
}

type ConsoleLogger struct{}

func (c ConsoleLogger) Log(level, msg string) {
	fmt.Printf("[%s] %s\n", level, msg)
}

type FileLogger struct {
	buf strings.Builder
}

func (f *FileLogger) Log(level, msg string) {
	fmt.Fprintf(&f.buf, "[%s] %s\n", level, msg)
}

type MultiLogger struct {
	loggers []Logger
}

func (m *MultiLogger) Log(level, msg string) {
	for _, l := range m.loggers {
		l.Log(level, msg)
	}
}

func logAll(l Logger, messages []string) {
	for _, msg := range messages {
		l.Log("INFO", msg)
	}
}

func main() {
	fl := &FileLogger{}
	loggers := []Logger{ConsoleLogger{}, fl}
	for _, l := range loggers {
		l.Log("DEBUG", "hello")
	}
	fmt.Print(fl.buf.String())
}
`,
      validate: (code: string) =>
        code.includes("[]Logger{") || code.includes("[]Logger {"),
      successMessage:
        "Go dispatches the right Log implementation at runtime based on the concrete type stored in each interface value.",
    },
  ],
};
