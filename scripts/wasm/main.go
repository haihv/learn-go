//go:build js && wasm

// In-browser Go runtime for learn-go. Wraps the Yaegi interpreter in a
// js-callable entry point; the TypeScript side (lib/wasm/) talks to it from a
// Web Worker so a runaway program can be killed by terminating the worker.
package main

import (
	"fmt"
	"syscall/js"
	"time"

	"github.com/traefik/yaegi/interp"
	"github.com/traefik/yaegi/stdlib"
	"github.com/traefik/yaegi/stdlib/unsafe"
)

// A fresh interpreter per run: a learner's globals and goroutines must not
// leak into the next program. Yaegi evaluating a `package main` file runs
// main() itself — no second Eval needed.
//
// Output is deliberately NOT redirected through interp.Options: that only
// patches fmt/log/println, while json.NewEncoder(os.Stdout), slog handlers and
// bufio writers keep writing to the real fds. Everything goes to fd 1/2 and
// the worker captures those at the wasm_exec fs shim, in order.
func run(code string) (err error) {
	i := interp.New(interp.Options{})
	if e := i.Use(stdlib.Symbols); e != nil {
		return e
	}
	if e := i.Use(unsafe.Symbols); e != nil {
		return e
	}
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	_, err = i.Eval(code)
	return err
}

func main() {
	// __goRun(code, cb): cb(errorMessage, elapsedMs)
	js.Global().Set("__goRun", js.FuncOf(func(this js.Value, args []js.Value) any {
		code := args[0].String()
		cb := args[1]
		go func() {
			start := time.Now()
			msg := ""
			if err := run(code); err != nil {
				msg = err.Error()
			}
			cb.Invoke(msg, time.Since(start).Milliseconds())
		}()
		return nil
	}))
	select {}
}
