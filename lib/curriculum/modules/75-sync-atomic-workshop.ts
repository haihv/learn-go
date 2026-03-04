import type { WorkshopModule } from "../types";

export const syncAtomicWorkshop: WorkshopModule = {
  type: "workshop",
  id: "75",
  slug: "sync-atomic-workshop",
  title: "sync/atomic Workshop",
  icon: "⚛️",
  estimatedMinutes: 20,
  description:
    "Build atomic counters, bool flags, compare-and-swap, and a concurrent hit counter.",
  steps: [
    {
      instruction:
        "Declare an `atomic.Int64` counter. Start 5 goroutines, each calling `counter.Add(1)` 1000 times. Use a `sync.WaitGroup` to wait for all goroutines, then print `counter.Load()`. The result should be 5000.",
      starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var counter atomic.Int64
	var wg sync.WaitGroup

	// TODO: start 5 goroutines, each adding 1 to counter 1000 times
	// TODO: wg.Wait()
	// TODO: fmt.Println(counter.Load())
	_ = counter.Add
	_ = wg.Add
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var counter atomic.Int64
	var wg sync.WaitGroup

	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			for j := 0; j < 1000; j++ {
				counter.Add(1)
			}
		}()
	}

	wg.Wait()
	fmt.Println(counter.Load())
}
`,
      validate: (code: string) =>
        code.includes("atomic.Int64") &&
        code.includes("counter.Add(") &&
        code.includes("counter.Load()"),
      successMessage:
        "atomic.Int64 is safe for concurrent Add without a mutex — the CPU handles the atomicity at the hardware level, making it faster than a mutex-protected int for this workload.",
    },
    {
      instruction:
        "Use an `atomic.Bool` as a running flag. Start a goroutine that loops while `running.Load()` is true and prints 'working' with a 10ms sleep. After 50ms, set `running.Store(false)` from main to stop the goroutine. Use a WaitGroup to wait for it to exit.",
      starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

func main() {
	var running atomic.Bool
	var wg sync.WaitGroup

	running.Store(true)

	wg.Add(1)
	go func() {
		defer wg.Done()
		// TODO: loop while running.Load() is true
		// print "working" and sleep 10ms each iteration
	}()

	time.Sleep(50 * time.Millisecond)
	// TODO: running.Store(false) to signal the goroutine to stop

	wg.Wait()
	fmt.Println("done")
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
	"time"
)

func main() {
	var running atomic.Bool
	var wg sync.WaitGroup

	running.Store(true)

	wg.Add(1)
	go func() {
		defer wg.Done()
		for running.Load() {
			fmt.Println("working")
			time.Sleep(10 * time.Millisecond)
		}
	}()

	time.Sleep(50 * time.Millisecond)
	running.Store(false)

	wg.Wait()
	fmt.Println("done")
}
`,
      validate: (code: string) =>
        code.includes("atomic.Bool") &&
        code.includes("running.Load()") &&
        code.includes("running.Store("),
      successMessage:
        "atomic.Bool.Store and Load are safe across goroutines with no mutex. This is the cleanest way to implement a stop flag for a background loop.",
    },
    {
      instruction:
        "Use `CompareAndSwap` to implement a once-only initialisation. Declare an `atomic.Int64 state`. Start 10 goroutines, each trying to CAS from 0 to 1. Only the winner should print 'initialised'. Use a WaitGroup.",
      starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var state atomic.Int64
	var wg sync.WaitGroup

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			// TODO: if state.CompareAndSwap(0, 1) { fmt.Println("initialised") }
		}()
	}

	wg.Wait()
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var state atomic.Int64
	var wg sync.WaitGroup

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			if state.CompareAndSwap(0, 1) {
				fmt.Println("initialised")
			}
		}()
	}

	wg.Wait()
}
`,
      validate: (code: string) =>
        code.includes("CompareAndSwap") && code.includes("atomic.Int64"),
      successMessage:
        "CompareAndSwap is the lock-free equivalent of 'check then act'. Exactly one goroutine wins the 0→1 transition. This pattern underpins sync.Once and many concurrent algorithms.",
    },
    {
      instruction:
        "Simulate a web server hit counter. Declare `atomic.Uint64 hits`. Start 20 goroutines each calling `hits.Add(1)`. After all finish, print `fmt.Println(\"hits:\", hits.Load())`. The result should be 20.",
      starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

var hits atomic.Uint64

func recordHit() {
	// TODO: hits.Add(1)
}

func main() {
	var wg sync.WaitGroup

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			recordHit()
		}()
	}

	wg.Wait()
	fmt.Println("hits:", hits.Load())
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

var hits atomic.Uint64

func recordHit() {
	hits.Add(1)
}

func main() {
	var wg sync.WaitGroup

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			recordHit()
		}()
	}

	wg.Wait()
	fmt.Println("hits:", hits.Load())
}
`,
      validate: (code: string) =>
        code.includes("atomic.Uint64") &&
        code.includes("hits.Add(") &&
        code.includes("hits.Load()"),
      successMessage:
        "A package-level atomic.Uint64 is idiomatic for server-wide counters that many goroutines update simultaneously. No mutex means no contention overhead under high load.",
    },
  ],
};
