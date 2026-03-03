import type { WorkshopModule } from "../types";

export const goroutinesWorkshop: WorkshopModule = {
	type: "workshop",
	id: "31",
	slug: "goroutines-workshop",
	title: "Goroutines Workshop",
	icon: "⚡",
	estimatedMinutes: 25,
	description: "Practice goroutines, channels, WaitGroups, and the select statement.",
	steps: [
		{
			instruction:
				"Launch 5 goroutines using `sync.WaitGroup`. Each goroutine should print its ID (1–5). The main goroutine must wait for all of them to finish before exiting.",
			starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup

	for i := 1; i <= 5; i++ {
		// TODO: call wg.Add(1), then launch a goroutine that prints i and calls wg.Done()
	}

	// TODO: wait for all goroutines to finish
	fmt.Println("all done")
}
`,
			hint: `package main

import (
	"fmt"
	"sync"
)

func main() {
	var wg sync.WaitGroup

	for i := 1; i <= 5; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			fmt.Println("goroutine", id)
		}(i)
	}

	wg.Wait()
	fmt.Println("all done")
}
`,
			validate: (code: string) =>
				code.includes("sync.WaitGroup") &&
				code.includes("wg.Add") &&
				code.includes("wg.Done"),
			successMessage:
				"WaitGroup is the idiomatic way to wait for a dynamic number of goroutines — always call Add before launching, and Done with defer so it fires even if the goroutine panics.",
		},
		{
			instruction:
				"Producer/consumer: launch a goroutine that sends the integers 0–9 on a **buffered** channel of capacity 10, then closes it. In main, receive all values and print each one.",
			starterCode: `package main

import "fmt"

func main() {
	ch := make(chan int, 10)

	// TODO: launch a goroutine that sends 0-9 on ch, then closes ch

	// TODO: receive all values from ch and print them
	_ = ch
	fmt.Println("done")
}
`,
			hint: `package main

import "fmt"

func main() {
	ch := make(chan int, 10)

	go func() {
		for i := 0; i < 10; i++ {
			ch <- i
		}
		close(ch)
	}()

	for v := range ch {
		fmt.Println(v)
	}
}
`,
			validate: (code: string) =>
				code.includes("make(chan") &&
				code.includes("go func"),
			successMessage:
				"Closing a channel after the last send lets a range loop terminate cleanly — the receiver sees all values and then exits the loop automatically.",
		},
		{
			instruction:
				"Fan-out: create a `jobs` buffered channel with capacity 20, send the integers 1–20 into it, then close it. Launch 4 worker goroutines; each reads from `jobs` with range and prints the job it processed. Use a WaitGroup to wait for all workers.",
			starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	jobs := make(chan int, 20)
	var wg sync.WaitGroup

	// TODO: launch 4 worker goroutines that range over jobs and print each job

	// TODO: send jobs 1-20 into the channel and close it

	wg.Wait()
	fmt.Println("all jobs processed")
}
`,
			hint: `package main

import (
	"fmt"
	"sync"
)

func main() {
	jobs := make(chan int, 20)
	var wg sync.WaitGroup

	for w := 1; w <= 4; w++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for j := range jobs {
				fmt.Printf("worker %d processed job %d\n", id, j)
			}
		}(w)
	}

	for j := 1; j <= 20; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	fmt.Println("all jobs processed")
}
`,
			validate: (code: string) =>
				code.includes("jobs") &&
				code.includes("for") &&
				code.includes("go func"),
			successMessage:
				"Fan-out distributes work across workers by having them all read from the same channel — Go's scheduler decides which worker gets each job.",
		},
		{
			instruction:
				"Timeout with select: launch a goroutine that sleeps 200 ms then sends on a `result` channel. In main, use `select` with a `time.After(100 * time.Millisecond)` case to detect that the operation timed out and print \"timed out\".",
			starterCode: `package main

import (
	"fmt"
	"time"
)

func main() {
	result := make(chan string, 1)

	go func() {
		time.Sleep(200 * time.Millisecond)
		result <- "finished"
	}()

	// TODO: use select to either receive from result or time out after 100ms
	fmt.Println("done")
}
`,
			hint: `package main

import (
	"fmt"
	"time"
)

func main() {
	result := make(chan string, 1)

	go func() {
		time.Sleep(200 * time.Millisecond)
		result <- "finished"
	}()

	select {
	case msg := <-result:
		fmt.Println("received:", msg)
	case <-time.After(100 * time.Millisecond):
		fmt.Println("timed out")
	}
}
`,
			validate: (code: string) =>
				code.includes("time.After") &&
				code.includes("select"),
			successMessage:
				"time.After returns a channel that receives after the duration — combining it with select gives you a deadline without any extra goroutine bookkeeping.",
		},
		{
			instruction:
				"Broadcast stop: create a `done` channel. Launch 3 worker goroutines; each loops using `select` — on a `<-done` case it prints \"worker N stopping\" and returns. In main, sleep 50 ms, then call `close(done)` to signal all workers simultaneously. Use a WaitGroup to wait for them.",
			starterCode: `package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	done := make(chan struct{})
	var wg sync.WaitGroup

	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for {
				select {
				// TODO: handle <-done to stop this worker
				default:
					// worker is busy
					time.Sleep(10 * time.Millisecond)
				}
			}
		}(i)
	}

	time.Sleep(50 * time.Millisecond)
	// TODO: signal all workers to stop
	wg.Wait()
	fmt.Println("all workers stopped")
}
`,
			hint: `package main

import (
	"fmt"
	"sync"
	"time"
)

func main() {
	done := make(chan struct{})
	var wg sync.WaitGroup

	for i := 1; i <= 3; i++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for {
				select {
				case <-done:
					fmt.Printf("worker %d stopping\n", id)
					return
				default:
					time.Sleep(10 * time.Millisecond)
				}
			}
		}(i)
	}

	time.Sleep(50 * time.Millisecond)
	close(done)
	wg.Wait()
	fmt.Println("all workers stopped")
}
`,
			validate: (code: string) =>
				code.includes("close(done)") ||
				(code.includes("close(") && code.includes("done")),
			successMessage:
				"Closing a channel broadcasts to every goroutine blocked on it simultaneously — this is the idiomatic Go pattern for a cancellation signal that fans out to many receivers.",
		},
	],
};
