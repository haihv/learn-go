import { WorkshopModule } from "../types";

export const maps: WorkshopModule = {
  type: "workshop",
  id: "14",
  slug: "maps",
  title: "Maps",
  icon: "🗺️",
  estimatedMinutes: 15,
  description: "Learn Go maps — key-value stores with powerful built-in operations.",
  steps: [
    {
      instruction: "Create a map named `scores` that maps string names to integer scores using `make(map[string]int)`. Print it.",
      hint: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	fmt.Println(scores)
}`,
      starterCode: `package main

import "fmt"

func main() {
	// Create a map named scores that maps string to int using make
}`,
      validate: (code: string) =>
        code.includes("make(map[string]int)") && code.includes("scores"),
      successMessage: "Use make() to create an empty map ready to use.",
    },
    {
      instruction: 'Add three entries to `scores`: "Alice"→95, "Bob"→87, "Carol"→92. Print the map.',
      hint: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	fmt.Println(scores)
}`,
      starterCode: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	// Add Alice, Bob, and Carol with their scores
	fmt.Println(scores)
}`,
      validate: (code: string) =>
        code.includes('scores["Alice"]') || code.includes("scores[\"Alice\"]"),
      successMessage: "Map assignment is just map[key] = value.",
    },
    {
      instruction: 'Look up "Alice" in `scores` using the two-value assignment: `val, ok := scores["Alice"]`. Print both the value and whether the key was found.',
      hint: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	val, ok := scores["Alice"]
	fmt.Println(val, ok)
}`,
      starterCode: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	// Use comma-ok idiom to look up "Alice"
}`,
      validate: (code: string) =>
        code.includes(", ok") && (code.includes("ok :=") || code.includes(",ok")),
      successMessage: "The comma-ok idiom safely checks if a key exists — no panic on missing keys.",
    },
    {
      instruction: 'Remove "Bob" from `scores` using `delete`. Print the map to confirm.',
      hint: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	delete(scores, "Bob")
	fmt.Println(scores)
}`,
      starterCode: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	// Delete "Bob" from the map, then print it
}`,
      validate: (code: string) =>
        code.includes("delete(") && code.includes("scores"),
      successMessage: "delete(map, key) removes a key — it's a no-op if the key doesn't exist.",
    },
    {
      instruction: 'Use `for range` to iterate over `scores` and print each name and score, e.g. `Alice: 95`.',
      hint: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	for name, score := range scores {
		fmt.Printf("%s: %d\n", name, score)
	}
}`,
      starterCode: `package main

import "fmt"

func main() {
	scores := make(map[string]int)
	scores["Alice"] = 95
	scores["Bob"] = 87
	scores["Carol"] = 92
	// Range over scores and print each name and score
}`,
      validate: (code: string) =>
        code.includes("range scores") &&
        (code.includes("Printf") || code.includes("Println")),
      successMessage: "Ranging over a map gives key-value pairs. Order is random — that's intentional in Go!",
    },
  ],
};
