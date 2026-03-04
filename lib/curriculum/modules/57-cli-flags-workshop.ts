import type { WorkshopModule } from "../types";

export const cliFlagsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "57",
  slug: "cli-flags-workshop",
  title: "CLI Flags Workshop",
  icon: "🚩",
  estimatedMinutes: 20,
  description: "Define flags, read environment variables, combine them into a Config struct, and build a sub-command CLI.",
  steps: [
    {
      instruction:
        "Define a `--port` flag (int, default 8080) and a `--verbose` flag (bool, default false). Call `flag.Parse()`, then print the values. Since the Playground can't receive real CLI args, your code just needs to demonstrate the correct flag definitions and a Print that shows the defaults.",
      starterCode: `package main

import (
	"flag"
	"fmt"
)

func main() {
	// TODO: define --port (int, default 8080) and --verbose (bool, default false) flags
	// TODO: call flag.Parse()
	// TODO: print port and verbose values
	_ = flag.Int
	_ = flag.Bool
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"flag"
	"fmt"
)

func main() {
	port    := flag.Int("port", 8080, "port to listen on")
	verbose := flag.Bool("verbose", false, "enable verbose output")
	flag.Parse()

	fmt.Println("port:", *port)
	fmt.Println("verbose:", *verbose)
}
`,
      validate: (code: string) =>
        code.includes('flag.Int("port"') &&
        code.includes('flag.Bool("verbose"') &&
        code.includes("flag.Parse()"),
      successMessage:
        "flag.Int and flag.Bool register named flags with defaults. The pointer is only valid after flag.Parse() — reading *port before Parse() would give you the default, not the parsed value.",
    },
    {
      instruction:
        'Read `DATABASE_URL` with `os.LookupEnv`. If the variable is not set, print a warning and use `\"postgres://localhost/dev\"` as the default. If it is set, print the value. Use `os.LookupEnv` (not `os.Getenv`) so you can distinguish missing from empty.',
      starterCode: `package main

import (
	"fmt"
	"os"
)

func main() {
	// TODO: use os.LookupEnv("DATABASE_URL")
	// If not set: print "DATABASE_URL not set, using default: postgres://localhost/dev"
	// If set: print "DATABASE_URL:", value
	_ = os.LookupEnv
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"os"
)

func main() {
	val, ok := os.LookupEnv("DATABASE_URL")
	if !ok {
		fmt.Println("DATABASE_URL not set, using default: postgres://localhost/dev")
		val = "postgres://localhost/dev"
	} else {
		fmt.Println("DATABASE_URL:", val)
	}
	_ = val
}
`,
      validate: (code: string) =>
        code.includes("os.LookupEnv") &&
        code.includes("DATABASE_URL"),
      successMessage:
        "os.LookupEnv returns (string, bool) — the bool tells you whether the variable exists at all. os.Getenv can't distinguish between a missing variable and one explicitly set to empty string.",
    },
    {
      instruction:
        "Build a `Config` struct populated from flags, with environment variables overriding when set. Define `Config` with `Port int` and `Host string`. Populate from `--port` and `--host` flags, then override `Port` from `PORT` env var if set. Print the final config.",
      starterCode: `package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	// TODO: Port int and Host string fields
}

func main() {
	// TODO: define --port (default 8080) and --host (default "localhost") flags
	// TODO: flag.Parse()
	// TODO: build Config from flag values
	// TODO: if PORT env var is set, override cfg.Port
	// TODO: print cfg.Port and cfg.Host
	_ = flag.Int
	_ = flag.String
	_ = os.LookupEnv
	_ = strconv.Atoi
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"flag"
	"fmt"
	"os"
	"strconv"
)

type Config struct {
	Port int
	Host string
}

func main() {
	port := flag.Int("port", 8080, "port to listen on")
	host := flag.String("host", "localhost", "server host")
	flag.Parse()

	cfg := Config{Port: *port, Host: *host}

	if envPort, ok := os.LookupEnv("PORT"); ok {
		if p, err := strconv.Atoi(envPort); err == nil {
			cfg.Port = p
		}
	}

	fmt.Println("port:", cfg.Port)
	fmt.Println("host:", cfg.Host)
}
`,
      validate: (code: string) =>
        code.includes("type Config struct") &&
        code.includes("os.LookupEnv") &&
        code.includes("flag.Parse()"),
      successMessage:
        "The 12-factor pattern: flags set developer-friendly defaults, env vars override them in production. This lets a Docker container inject PORT without changing the binary.",
    },
    {
      instruction:
        "Build a two-sub-command CLI using `flag.NewFlagSet`. Support `serve` (with `--port` flag) and `migrate` (with `--dsn` flag). Switch on `os.Args[1]` to choose which FlagSet to parse. Since the Playground has no real args, hardcode `os.Args` with a test slice to demonstrate the routing.",
      starterCode: `package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	// Simulate: os.Args = ["myapp", "serve", "--port=9000"]
	os.Args = []string{"myapp", "serve", "--port=9000"}

	// TODO: create serveCmd FlagSet with a --port flag (default 8080)
	// TODO: create migrateCmd FlagSet with a --dsn flag (default "")
	// TODO: switch on os.Args[1] and parse the right FlagSet
	// TODO: print the parsed flag value for the chosen sub-command
	_ = flag.NewFlagSet
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"flag"
	"fmt"
	"os"
)

func main() {
	os.Args = []string{"myapp", "serve", "--port=9000"}

	serveCmd  := flag.NewFlagSet("serve", flag.ExitOnError)
	servePort := serveCmd.Int("port", 8080, "port to listen on")

	migrateCmd := flag.NewFlagSet("migrate", flag.ExitOnError)
	migrateDSN := migrateCmd.String("dsn", "", "database DSN")

	if len(os.Args) < 2 {
		fmt.Println("usage: myapp <serve|migrate>")
		return
	}

	switch os.Args[1] {
	case "serve":
		serveCmd.Parse(os.Args[2:])
		fmt.Println("serving on port", *servePort)
	case "migrate":
		migrateCmd.Parse(os.Args[2:])
		fmt.Println("migrating with dsn:", *migrateDSN)
	default:
		fmt.Println("unknown command:", os.Args[1])
	}
}
`,
      validate: (code: string) =>
        code.includes("flag.NewFlagSet") &&
        (code.includes('"serve"') || code.includes("'serve'")) &&
        (code.includes('"migrate"') || code.includes("'migrate'")),
      successMessage:
        "flag.NewFlagSet gives each sub-command its own independent set of flags. Each FlagSet.Parse() only sees the arguments after the sub-command name, so --port for serve doesn't conflict with --port for migrate.",
    },
  ],
};
