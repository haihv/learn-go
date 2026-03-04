import type { WorkshopModule } from "../types";

export const raceDetectorWorkshop: WorkshopModule = {
  type: "workshop",
  id: "85",
  slug: "race-detector-workshop",
  title: "Race Detector Workshop",
  icon: "🏁",
  estimatedMinutes: 18,
  description:
    "Identify data races, fix them with mutex and atomic, and write race-safe concurrent code.",
  steps: [
    {
      instruction:
        "The code below has a data race on `counter`. Run it mentally — two goroutines write without synchronisation. Fix it by wrapping the increment with a `sync.Mutex`. Use `mu.Lock()` / `mu.Unlock()` (or `defer mu.Unlock()`). Print the final value after `wg.Wait()`.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var counter int
	var wg sync.WaitGroup

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			counter++ // DATA RACE — concurrent write without synchronisation
		}()
	}

	wg.Wait()
	fmt.Println(counter)
}
`,
      hint: "add `var mu sync.Mutex` and wrap `counter++` with `mu.Lock(); counter++; mu.Unlock()`",
      validate: (code: string) =>
        code.includes("sync.Mutex") &&
        (code.includes("mu.Lock()") || code.includes(".Lock()")),
      successMessage:
        "Adding a mutex makes counter++ atomic from the perspective of concurrent goroutines. Run with `go test -race` or `go run -race` to confirm the detector no longer reports a race.",
    },
    {
      instruction:
        "Replace the mutex-protected counter from step 1 with an `atomic.Int64`. Use `counter.Add(1)` inside the goroutine instead of `counter++`. Print `counter.Load()` after `wg.Wait()`.",
      starterCode: `package main

import (
	"fmt"
	"sync"
	"sync/atomic"
)

func main() {
	var counter atomic.Int64
	var wg sync.WaitGroup

	for i := 0; i < 1000; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			// TODO: counter.Add(1)
		}()
	}

	wg.Wait()
	fmt.Println(counter.Load())
	_ = atomic.Int64{}
}
`,
      hint: "`counter.Add(1)` in the goroutine",
      validate: (code: string) =>
        code.includes("atomic.Int64") &&
        code.includes("counter.Add(1)") &&
        code.includes("counter.Load()"),
      successMessage:
        "atomic.Int64 is the idiomatic fix for a single shared counter — no lock acquisition overhead, and the race detector accepts it as correctly synchronised.",
    },
    {
      instruction:
        "The code below writes to a shared map from multiple goroutines — a race that can cause a runtime panic. Fix it by protecting the map with a `sync.RWMutex`: use `mu.Lock()` for writes and `mu.RLock()` for reads.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	results := make(map[int]int)
	var wg sync.WaitGroup

	for i := 0; i < 10; i++ {
		wg.Add(1)
		n := i
		go func() {
			defer wg.Done()
			results[n] = n * n // DATA RACE — concurrent map write
		}()
	}

	wg.Wait()
	fmt.Println(len(results))
}
`,
      hint: "add `var mu sync.RWMutex`, wrap the map write with `mu.Lock()` / `mu.Unlock()`",
      validate: (code: string) =>
        code.includes("sync.RWMutex") || code.includes("sync.Mutex"),
      successMessage:
        "Go's built-in map is not safe for concurrent writes. A RWMutex lets multiple readers proceed in parallel while serialising writers — the right default for read-heavy maps.",
    },
    {
      instruction:
        "Implement a `Cache` struct with a `map[string]string` and a `sync.RWMutex`. Add `Set(key, value string)` (uses `Lock`) and `Get(key string) (string, bool)` (uses `RLock`). Test with 5 concurrent Sets and 5 concurrent Gets using a WaitGroup.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

type Cache struct {
	mu   sync.RWMutex
	data map[string]string
}

func NewCache() *Cache {
	return &Cache{data: make(map[string]string)}
}

func (c *Cache) Set(key, value string) {
	// TODO: c.mu.Lock() / defer c.mu.Unlock()
	// TODO: c.data[key] = value
}

func (c *Cache) Get(key string) (string, bool) {
	// TODO: c.mu.RLock() / defer c.mu.RUnlock()
	// TODO: return c.data[key]
	return "", false
}

func main() {
	cache := NewCache()
	var wg sync.WaitGroup

	for i := 0; i < 5; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			cache.Set(fmt.Sprintf("key%d", n), fmt.Sprintf("val%d", n))
		}(i)
	}
	wg.Wait()

	for i := 0; i < 5; i++ {
		if v, ok := cache.Get(fmt.Sprintf("key%d", i)); ok {
			fmt.Println(v)
		}
	}
}
`,
      hint: "implement Set with Lock/Unlock and Get with RLock/RUnlock",
      validate: (code: string) =>
        code.includes("sync.RWMutex") &&
        code.includes("mu.Lock()") &&
        code.includes("mu.RLock()"),
      successMessage:
        "This Cache pattern appears in nearly every Go service. RWMutex is the right choice over Mutex when reads dominate — multiple goroutines can hold RLock simultaneously, serialising only at write time.",
    },
  ],
};
