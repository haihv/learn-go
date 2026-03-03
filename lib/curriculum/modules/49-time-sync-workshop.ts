import type { WorkshopModule } from "../types";

export const timeSyncWorkshop: WorkshopModule = {
  type: "workshop",
  id: "49",
  slug: "time-sync-workshop",
  title: "time & sync Workshop",
  icon: "⏱️",
  estimatedMinutes: 22,
  description: "Practice measuring elapsed time, tickers, sync.Once lazy init, and sync.RWMutex.",
  steps: [
    {
      instruction:
        "Measure elapsed time. Record `time.Now()` before calling a `doWork` function that sleeps 100 ms, then print the elapsed duration with `time.Since`.",
      starterCode: `package main

import (
	"fmt"
	"time"
)

func doWork() {
	time.Sleep(100 * time.Millisecond)
}

func main() {
	// TODO: record start time with time.Now()
	doWork()
	// TODO: compute elapsed with time.Since(start) and print it
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"time"
)

func doWork() {
	time.Sleep(100 * time.Millisecond)
}

func main() {
	start := time.Now()
	doWork()
	elapsed := time.Since(start)
	fmt.Printf("doWork took %v\\n", elapsed)
}
`,
      validate: (code: string) =>
        code.includes("time.Now()") &&
        code.includes("time.Since"),
      successMessage:
        "time.Since(start) is shorthand for time.Now().Sub(start) — it's the idiomatic one-liner for timing any block of code.",
    },
    {
      instruction:
        "Implement a rate limiter using `time.NewTicker`. Create a ticker that fires every 100 ms. Process 5 requests — each request should wait for a tick before proceeding. Print the time of each tick. Remember to call `ticker.Stop()` when done.",
      starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	requests := []string{"req-1", "req-2", "req-3", "req-4", "req-5"}

	// TODO: create a ticker that fires every 100ms
	// TODO: for each request, wait for a tick then print it with the tick time
	// TODO: stop the ticker when done
	_ = requests
	_ = time.NewTicker
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"time"
)

func main() {
	requests := []string{"req-1", "req-2", "req-3", "req-4", "req-5"}

	ticker := time.NewTicker(100 * time.Millisecond)
	defer ticker.Stop()

	for _, req := range requests {
		t := <-ticker.C
		fmt.Printf("%s processed at %s\\n", req, t.Format("15:04:05.000"))
	}
}
`,
      validate: (code: string) =>
        code.includes("time.NewTicker") &&
        code.includes("ticker.Stop()") &&
        code.includes("ticker.C"),
      successMessage:
        "A Ticker-based rate limiter is dead simple: each request must wait for the next tick before proceeding — the ticker naturally spaces out the work.",
    },
    {
      instruction:
        "Implement a thread-safe lazy cache with `sync.Once`. Define a `Config` struct with a `DSN` string. Use a package-level `sync.Once` and `*Config` pointer. The `getConfig()` function should initialise the config exactly once (printing \"initialising config\") and return the same pointer on every subsequent call. Call `getConfig()` from 3 goroutines simultaneously and verify the init message prints only once.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

type Config struct {
	DSN string
}

var (
	cfg  *Config
	once sync.Once
)

func getConfig() *Config {
	// TODO: use once.Do to initialise cfg exactly once
	// print "initialising config" inside the Do function
	return cfg
}

func main() {
	var wg sync.WaitGroup
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			c := getConfig()
			fmt.Printf("goroutine %d got DSN: %s\\n", id, c.DSN)
		}(i)
	}
	wg.Wait()
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
)

type Config struct {
	DSN string
}

var (
	cfg  *Config
	once sync.Once
)

func getConfig() *Config {
	once.Do(func() {
		fmt.Println("initialising config")
		cfg = &Config{DSN: "postgres://localhost/mydb"}
	})
	return cfg
}

func main() {
	var wg sync.WaitGroup
	for i := 0; i < 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			c := getConfig()
			fmt.Printf("goroutine %d got DSN: %s\\n", id, c.DSN)
		}(i)
	}
	wg.Wait()
}
`,
      validate: (code: string) =>
        code.includes("sync.Once") &&
        code.includes("once.Do"),
      successMessage:
        "sync.Once guarantees the function runs exactly once even under concurrent load — no manual mutex or flag check required.",
    },
    {
      instruction:
        "Use `sync.RWMutex` for a concurrent read/write counter. Implement a `SafeMap` with `Get(key string) int` and `Set(key string, value int)` methods. Use `RLock`/`RUnlock` in `Get` and `Lock`/`Unlock` in `Set`. Launch 10 goroutines that each call `Set` once and 20 goroutines that each call `Get` — verify no data race occurs.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

type SafeMap struct {
	mu   sync.RWMutex
	data map[string]int
}

func NewSafeMap() *SafeMap {
	return &SafeMap{data: make(map[string]int)}
}

func (m *SafeMap) Get(key string) int {
	// TODO: acquire read lock, return data[key], release read lock
	return 0
}

func (m *SafeMap) Set(key string, value int) {
	// TODO: acquire write lock, set data[key] = value, release write lock
}

func main() {
	m := NewSafeMap()
	var wg sync.WaitGroup

	// 10 writers
	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			m.Set("counter", n)
		}(i)
	}

	// 20 readers
	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			_ = m.Get("counter")
		}()
	}

	wg.Wait()
	fmt.Println("final counter:", m.Get("counter"))
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
)

type SafeMap struct {
	mu   sync.RWMutex
	data map[string]int
}

func NewSafeMap() *SafeMap {
	return &SafeMap{data: make(map[string]int)}
}

func (m *SafeMap) Get(key string) int {
	m.mu.RLock()
	defer m.mu.RUnlock()
	return m.data[key]
}

func (m *SafeMap) Set(key string, value int) {
	m.mu.Lock()
	defer m.mu.Unlock()
	m.data[key] = value
}

func main() {
	m := NewSafeMap()
	var wg sync.WaitGroup

	for i := 0; i < 10; i++ {
		wg.Add(1)
		go func(n int) {
			defer wg.Done()
			m.Set("counter", n)
		}(i)
	}

	for i := 0; i < 20; i++ {
		wg.Add(1)
		go func() {
			defer wg.Done()
			_ = m.Get("counter")
		}()
	}

	wg.Wait()
	fmt.Println("final counter:", m.Get("counter"))
}
`,
      validate: (code: string) =>
        code.includes("sync.RWMutex") &&
        code.includes("RLock") &&
        code.includes("RUnlock"),
      successMessage:
        "RLock lets multiple goroutines read the map simultaneously — only writes require exclusive access, giving much better throughput for read-heavy workloads.",
    },
  ],
};
