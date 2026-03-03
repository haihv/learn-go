import type { WorkshopModule } from "../types";

export const concurrencyPatternsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "51",
  slug: "concurrency-patterns-workshop",
  title: "Concurrency Patterns Workshop",
  icon: "🔀",
  estimatedMinutes: 30,
  description: "Build pipelines, fan-out, worker pools, and practice errgroup error propagation.",
  steps: [
    {
      instruction:
        "Build a 2-stage pipeline. Write a `generate` function that sends the integers 2, 3, 4, 5 on a channel and closes it, and a `square` function that reads integers, squares them, and sends them on a new channel. In main, wire them together and print all squared values.",
      starterCode: `package main

import "fmt"

// generate sends the given numbers on a new channel, then closes it
func generate(nums ...int) <-chan int {
	out := make(chan int)
	// TODO: launch a goroutine that sends each num and closes the channel
	return out
}

// square reads from in, squares each value, sends on a new channel
func square(in <-chan int) <-chan int {
	out := make(chan int)
	// TODO: launch a goroutine that squares each value and closes when done
	return out
}

func main() {
	// TODO: wire generate -> square -> print
	_ = fmt.Println
}
`,
      hint: `package main

import "fmt"

func generate(nums ...int) <-chan int {
	out := make(chan int)
	go func() {
		for _, n := range nums {
			out <- n
		}
		close(out)
	}()
	return out
}

func square(in <-chan int) <-chan int {
	out := make(chan int)
	go func() {
		for n := range in {
			out <- n * n
		}
		close(out)
	}()
	return out
}

func main() {
	nums := generate(2, 3, 4, 5)
	squares := square(nums)
	for v := range squares {
		fmt.Println(v)
	}
}
`,
      validate: (code: string) =>
        code.includes("func generate") &&
        code.includes("func square") &&
        code.includes("<-chan int"),
      successMessage:
        "Pipeline stages are composable because each returns a channel — you can chain as many stages as you need without any stage knowing about the others.",
    },
    {
      instruction:
        "Fan-out work to N workers. Create a `jobs` channel with integers 1–12. Launch 3 worker goroutines — each reads jobs from the channel and prints `worker W processed job J`. Use a WaitGroup. Send all 12 jobs, close the channel, then wait.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

func main() {
	jobs := make(chan int, 12)
	var wg sync.WaitGroup

	// TODO: launch 3 worker goroutines that range over jobs and print each job

	// TODO: send jobs 1-12 to the channel and close it

	wg.Wait()
	fmt.Println("all jobs done")
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
)

func main() {
	jobs := make(chan int, 12)
	var wg sync.WaitGroup

	for w := 1; w <= 3; w++ {
		wg.Add(1)
		go func(id int) {
			defer wg.Done()
			for j := range jobs {
				fmt.Printf("worker %d processed job %d\\n", id, j)
			}
		}(w)
	}

	for j := 1; j <= 12; j++ {
		jobs <- j
	}
	close(jobs)

	wg.Wait()
	fmt.Println("all jobs done")
}
`,
      validate: (code: string) =>
        code.includes("close(jobs)") &&
        code.includes("range jobs"),
      successMessage:
        "Fan-out via a shared channel lets Go's scheduler distribute work evenly — faster workers naturally pull more jobs without any explicit coordination.",
    },
    {
      instruction:
        "Implement a fixed worker pool with a results channel. Create a pool of 3 workers that each read from a `jobs` channel and send `job * job` on a `results` channel. Use a WaitGroup; when all workers finish, close `results`. In main, collect and print all results.",
      starterCode: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	// TODO: defer wg.Done(), range over jobs, send job*job on results
}

func main() {
	const numWorkers = 3
	jobs := make(chan int, 9)
	results := make(chan int, 9)
	var wg sync.WaitGroup

	// TODO: launch numWorkers workers
	// TODO: send jobs 1-9 and close jobs
	// TODO: launch a goroutine that calls wg.Wait() then closes results
	// TODO: range over results and print each

	_ = worker
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"sync"
)

func worker(id int, jobs <-chan int, results chan<- int, wg *sync.WaitGroup) {
	defer wg.Done()
	for j := range jobs {
		results <- j * j
		fmt.Printf("worker %d processed job %d\\n", id, j)
	}
}

func main() {
	const numWorkers = 3
	jobs := make(chan int, 9)
	results := make(chan int, 9)
	var wg sync.WaitGroup

	for w := 1; w <= numWorkers; w++ {
		wg.Add(1)
		go worker(w, jobs, results, &wg)
	}

	for j := 1; j <= 9; j++ {
		jobs <- j
	}
	close(jobs)

	go func() {
		wg.Wait()
		close(results)
	}()

	for r := range results {
		fmt.Println("result:", r)
	}
}
`,
      validate: (code: string) =>
        code.includes("func worker") &&
        code.includes("results <-") ||
        (code.includes("results chan<-") && code.includes("wg.Wait()")),
      successMessage:
        "The worker pool bounds concurrency — you control resource usage by setting numWorkers rather than spawning one goroutine per job.",
    },
    {
      instruction:
        "Use `errgroup` to run goroutines and propagate errors. Import `golang.org/x/sync/errgroup`. Write a `fetchURL` function that returns an error if the URL contains \"bad\". Use `g.Go` to launch 3 goroutines checking URLs `[\"good.com\", \"bad.com\", \"also-good.com\"]`. Print the error returned by `g.Wait()`.",
      starterCode: `package main

import (
	"errors"
	"fmt"
	"strings"

	"golang.org/x/sync/errgroup"
)

func fetchURL(url string) error {
	// TODO: return an error if url contains "bad", otherwise return nil
	_ = strings.Contains
	_ = errors.New
	return nil
}

func main() {
	urls := []string{"good.com", "bad.com", "also-good.com"}
	var g errgroup.Group

	for _, url := range urls {
		url := url // capture loop variable
		// TODO: g.Go(func() error { return fetchURL(url) })
		_ = url
	}

	if err := g.Wait(); err != nil {
		fmt.Println("error:", err)
	} else {
		fmt.Println("all succeeded")
	}
}
`,
      hint: `package main

import (
	"errors"
	"fmt"
	"strings"

	"golang.org/x/sync/errgroup"
)

func fetchURL(url string) error {
	if strings.Contains(url, "bad") {
		return errors.New("bad URL: " + url)
	}
	return nil
}

func main() {
	urls := []string{"good.com", "bad.com", "also-good.com"}
	var g errgroup.Group

	for _, url := range urls {
		url := url
		g.Go(func() error {
			return fetchURL(url)
		})
	}

	if err := g.Wait(); err != nil {
		fmt.Println("error:", err)
	} else {
		fmt.Println("all succeeded")
	}
}
`,
      validate: (code: string) =>
        code.includes("errgroup") &&
        code.includes("g.Go") &&
        code.includes("g.Wait()"),
      successMessage:
        "errgroup replaces the WaitGroup + error channel boilerplate — it waits for all goroutines and returns the first error, making concurrent error handling concise and correct.",
    },
  ],
};
