import type { WorkshopModule } from "../types";

export const gracefulShutdownWorkshop: WorkshopModule = {
  type: "workshop",
  id: "62",
  slug: "graceful-shutdown-workshop",
  title: "Graceful Shutdown Workshop",
  icon: "🛑",
  estimatedMinutes: 25,
  description: "Register OS signals, simulate shutdown, implement HTTP graceful shutdown, and clean up background workers.",
  steps: [
    {
      instruction:
        "Register `SIGINT` and `SIGTERM` with `signal.Notify`, then block on the quit channel. Since the Playground has no real OS signals, simulate a signal by sending on the quit channel from a goroutine after 10 ms. Print `\"received signal\"` when the send is received.",
      starterCode: `package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	quit := make(chan os.Signal, 1)
	// TODO: signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	// Simulate a signal after 10ms (no real OS signal in the Playground)
	go func() {
		time.Sleep(10 * time.Millisecond)
		// TODO: send syscall.SIGINT on quit to simulate the signal
	}()

	// TODO: block on <-quit and print "received signal"
	_ = signal.Notify
	_ = syscall.SIGINT
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"os"
	"os/signal"
	"syscall"
	"time"
)

func main() {
	quit := make(chan os.Signal, 1)
	signal.Notify(quit, syscall.SIGINT, syscall.SIGTERM)

	go func() {
		time.Sleep(10 * time.Millisecond)
		quit <- syscall.SIGINT
	}()

	<-quit
	fmt.Println("received signal")
}
`,
      validate: (code: string) =>
        code.includes("signal.Notify") &&
        code.includes("syscall.SIGINT") &&
        code.includes("syscall.SIGTERM"),
      successMessage:
        "signal.Notify requires a buffered channel (capacity 1) so the runtime doesn't drop a signal that arrives while the program is busy. The <-quit receive blocks until a signal is delivered.",
    },
    {
      instruction:
        "Simulate a shutdown sequence: a goroutine sends on the quit channel after 50 ms to represent an OS signal. When the signal arrives, print `\"shutting down\"`, wait another 20 ms to simulate cleanup, then print `\"shutdown complete\"`.",
      starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	quit := make(chan struct{}, 1)

	// Simulate OS signal after 50ms
	go func() {
		time.Sleep(50 * time.Millisecond)
		quit <- struct{}{}
	}()

	// TODO: block on quit channel
	// TODO: print "shutting down"
	// TODO: simulate cleanup (time.Sleep 20ms)
	// TODO: print "shutdown complete"
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"time"
)

func main() {
	quit := make(chan struct{}, 1)

	go func() {
		time.Sleep(50 * time.Millisecond)
		quit <- struct{}{}
	}()

	<-quit
	fmt.Println("shutting down")
	time.Sleep(20 * time.Millisecond)
	fmt.Println("shutdown complete")
}
`,
      validate: (code: string) =>
        code.includes("<-quit") &&
        code.includes(`"shutting down"`) &&
        code.includes(`"shutdown complete"`),
      successMessage:
        "The shutdown window between receiving the signal and exiting is where you flush buffers, close DB connections, and finish in-flight work. The OS (or container orchestrator) gives you a grace period before force-killing the process.",
    },
    {
      instruction:
        "Implement a full HTTP graceful shutdown. Start an `http.Server` in a goroutine, wait for a simulated quit signal (sent after 50 ms), then call `server.Shutdown` with a 5-second context. Print `\"server stopped cleanly\"` after successful shutdown.",
      starterCode: `package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	})

	srv := &http.Server{Addr: ":0", Handler: mux}  // :0 picks a free port

	// TODO: start srv.ListenAndServe() in a goroutine
	// (ignore http.ErrServerClosed — it's expected after Shutdown)

	// Simulate OS signal after 50ms
	quit := make(chan struct{}, 1)
	go func() {
		time.Sleep(50 * time.Millisecond)
		quit <- struct{}{}
	}()

	<-quit

	// TODO: create a 5-second context with context.WithTimeout
	// TODO: call srv.Shutdown(ctx) and handle error
	// TODO: print "server stopped cleanly"
	_ = context.WithTimeout
	_ = log.Println
}
`,
      hint: `package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"time"
)

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	})

	srv := &http.Server{Addr: ":0", Handler: mux}

	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	quit := make(chan struct{}, 1)
	go func() {
		time.Sleep(50 * time.Millisecond)
		quit <- struct{}{}
	}()

	<-quit

	ctx, cancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer cancel()

	if err := srv.Shutdown(ctx); err != nil {
		log.Fatal("shutdown error:", err)
	}
	fmt.Println("server stopped cleanly")
}
`,
      validate: (code: string) =>
        code.includes("srv.ListenAndServe()") &&
        code.includes("srv.Shutdown(") &&
        code.includes("http.ErrServerClosed") &&
        code.includes("context.WithTimeout"),
      successMessage:
        "srv.Shutdown waits for all active connections to complete. Checking err != http.ErrServerClosed prevents a false alarm — ErrServerClosed is the normal return value after a clean shutdown.",
    },
    {
      instruction:
        "Shut down a background worker cleanly alongside the HTTP server. The worker loops until `ctx.Done()` closes. Use `context.WithCancel` to create the context, a `sync.WaitGroup` to track the worker, and `cancel()` after receiving the quit signal. Print `\"worker stopped\"` from the worker and `\"server stopped cleanly\"` from main.",
      starterCode: `package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

func worker(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			// TODO: print "worker stopped" and return
		default:
			time.Sleep(10 * time.Millisecond) // simulate work
		}
	}
}

func main() {
	// TODO: create ctx, cancel with context.WithCancel
	// TODO: start worker in goroutine with wg
	// TODO: start http.Server on ":0" in goroutine

	// Simulate OS signal after 60ms
	quit := make(chan struct{}, 1)
	go func() {
		time.Sleep(60 * time.Millisecond)
		quit <- struct{}{}
	}()

	<-quit

	// TODO: cancel() to stop the worker
	// TODO: wg.Wait() to wait for it
	// TODO: srv.Shutdown with 5s context
	// TODO: print "server stopped cleanly"
	_ = context.WithCancel
	_ = log.Println
	_ = fmt.Println
	_ = worker
}
`,
      hint: `package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"sync"
	"time"
)

func worker(ctx context.Context, wg *sync.WaitGroup) {
	defer wg.Done()
	for {
		select {
		case <-ctx.Done():
			fmt.Println("worker stopped")
			return
		default:
			time.Sleep(10 * time.Millisecond)
		}
	}
}

func main() {
	ctx, cancel := context.WithCancel(context.Background())

	var wg sync.WaitGroup
	wg.Add(1)
	go worker(ctx, &wg)

	mux := http.NewServeMux()
	mux.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "hello")
	})
	srv := &http.Server{Addr: ":0", Handler: mux}
	go func() {
		if err := srv.ListenAndServe(); err != nil && err != http.ErrServerClosed {
			log.Fatal(err)
		}
	}()

	quit := make(chan struct{}, 1)
	go func() {
		time.Sleep(60 * time.Millisecond)
		quit <- struct{}{}
	}()

	<-quit

	cancel()
	wg.Wait()

	shutCtx, shutCancel := context.WithTimeout(context.Background(), 5*time.Second)
	defer shutCancel()
	if err := srv.Shutdown(shutCtx); err != nil {
		log.Fatal("shutdown error:", err)
	}
	fmt.Println("server stopped cleanly")
}
`,
      validate: (code: string) =>
        code.includes("context.WithCancel") &&
        code.includes("cancel()") &&
        code.includes("wg.Wait()") &&
        code.includes("ctx.Done()"),
      successMessage:
        "The full pattern: cancel() signals workers via context, wg.Wait() ensures they exit cleanly, then srv.Shutdown() drains the HTTP server. Order matters — cancel workers first so they don't start new DB queries during HTTP shutdown.",
    },
  ],
};
