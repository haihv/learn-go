import type { WorkshopModule } from "../types";

export const deferPanicRecoverWorkshop: WorkshopModule = {
  type: "workshop",
  id: "27",
  slug: "defer-panic-recover-workshop",
  title: "Defer, Panic & Recover Workshop",
  icon: "🛟",
  estimatedMinutes: 20,
  description: "Practice defer ordering, resource cleanup, and recover().",
  steps: [
    {
      instruction:
        "Write a function `countdown()` that defers printing \"3\", \"2\", \"1\" (using 3 separate defer statements) then prints \"Go!\". Show that defers run LIFO — output will be: Go! then 1 2 3 on separate lines.",
      starterCode: `package main

import "fmt"

// TODO: write countdown() using 3 defer statements then fmt.Println("Go!")

func main() {
	countdown()
}
`,
      hint: `package main

import "fmt"

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func main() {
	countdown()
}
`,
      validate: (code: string) =>
        code.includes("defer") && code.includes("countdown"),
      successMessage:
        "Multiple defers run in LIFO order — last deferred runs first.",
    },
    {
      instruction:
        "Write `openFile(name string)` that prints \"Opening <name>\", defers printing \"Closing <name>\", then prints \"Reading <name>\". Show defer ensures cleanup runs even before return.",
      starterCode: `package main

import "fmt"

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

// TODO: write openFile(name string) with deferred close

func main() {
	countdown()
	openFile("data.txt")
}
`,
      hint: `package main

import "fmt"

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

func main() {
	countdown()
	openFile("data.txt")
}
`,
      validate: (code: string) =>
        code.includes("defer") && code.includes("func openFile"),
      successMessage:
        "defer f.Close() right after opening ensures cleanup never gets forgotten.",
    },
    {
      instruction:
        "Write `safeDiv(a, b int) (result int, err error)` that uses a deferred recover() to catch a divide-by-zero panic and return it as an error instead of crashing.",
      starterCode: `package main

import (
	"fmt"
)

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

// TODO: write safeDiv(a, b int) (result int, err error) with deferred recover()

func main() {
	countdown()
	openFile("data.txt")

	result, err := safeDiv(10, 0)
	fmt.Println(result, err)
}
`,
      hint: `package main

import (
	"fmt"
)

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

func safeDiv(a, b int) (result int, err error) {
	// recover() in a deferred closure catches panics and converts them to errors
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	result = a / b
	return result, nil
}

func main() {
	countdown()
	openFile("data.txt")

	result, err := safeDiv(10, 0)
	fmt.Println(result, err)
}
`,
      validate: (code: string) =>
        code.includes("recover()") && code.includes("safeDiv"),
      successMessage:
        "recover() in a deferred closure converts panics to errors at package boundaries.",
    },
    {
      instruction:
        "Write `mustPositive(n int) int` that panics with a message if n <= 0, otherwise returns n. Wrap a call to it with a recover in main so the program doesn't crash.",
      starterCode: `package main

import (
	"fmt"
)

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

func safeDiv(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	result = a / b
	return result, nil
}

// TODO: write mustPositive(n int) int that panics if n <= 0

func main() {
	countdown()
	openFile("data.txt")

	result, err := safeDiv(10, 0)
	fmt.Println(result, err)

	// TODO: call mustPositive(-1) safely using a deferred recover in a wrapper
}
`,
      hint: `package main

import (
	"fmt"
)

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

func safeDiv(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	result = a / b
	return result, nil
}

func mustPositive(n int) int {
	if n <= 0 {
		panic(fmt.Sprintf("mustPositive: got %d, want > 0", n))
	}
	return n
}

func safeCall(n int) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("recovered:", r)
		}
	}()
	fmt.Println(mustPositive(n))
}

func main() {
	countdown()
	openFile("data.txt")

	result, err := safeDiv(10, 0)
	fmt.Println(result, err)

	safeCall(5)
	safeCall(-1)
}
`,
      validate: (code: string) =>
        code.includes("panic(") && code.includes("mustPositive"),
      successMessage:
        "panic is for programmer mistakes — recover at the boundary converts them to errors.",
    },
    {
      instruction:
        "Demonstrate argument evaluation timing: create `deferTiming()` where you set `x := 1`, defer `fmt.Println(x)` (captures x=1 at defer time), then change `x = 99`. Show the deferred println prints 1, not 99.",
      starterCode: `package main

import (
	"fmt"
)

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

func safeDiv(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	result = a / b
	return result, nil
}

func mustPositive(n int) int {
	if n <= 0 {
		panic(fmt.Sprintf("mustPositive: got %d, want > 0", n))
	}
	return n
}

func safeCall(n int) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("recovered:", r)
		}
	}()
	fmt.Println(mustPositive(n))
}

// TODO: write deferTiming() that demonstrates defer argument evaluation

func main() {
	countdown()
	openFile("data.txt")

	result, err := safeDiv(10, 0)
	fmt.Println(result, err)

	safeCall(5)
	safeCall(-1)

	deferTiming()
}
`,
      hint: `package main

import (
	"fmt"
)

func countdown() {
	defer fmt.Println("1")
	defer fmt.Println("2")
	defer fmt.Println("3")
	fmt.Println("Go!")
}

func openFile(name string) {
	fmt.Println("Opening", name)
	defer fmt.Println("Closing", name)
	fmt.Println("Reading", name)
}

func safeDiv(a, b int) (result int, err error) {
	defer func() {
		if r := recover(); r != nil {
			err = fmt.Errorf("panic: %v", r)
		}
	}()
	result = a / b
	return result, nil
}

func mustPositive(n int) int {
	if n <= 0 {
		panic(fmt.Sprintf("mustPositive: got %d, want > 0", n))
	}
	return n
}

func safeCall(n int) {
	defer func() {
		if r := recover(); r != nil {
			fmt.Println("recovered:", r)
		}
	}()
	fmt.Println(mustPositive(n))
}

func deferTiming() {
	x := 1
	// x is evaluated now (= 1), not when defer actually runs
	defer fmt.Println(x)
	x = 99
	fmt.Println("x is now", x)
}

func main() {
	countdown()
	openFile("data.txt")

	result, err := safeDiv(10, 0)
	fmt.Println(result, err)

	safeCall(5)
	safeCall(-1)

	deferTiming()
}
`,
      validate: (code: string) =>
        code.includes("defer") &&
        (code.includes("deferTiming") || code.includes("defer fmt.Println")),
      successMessage:
        "Defer arguments are evaluated immediately — only execution is delayed.",
    },
  ],
};
