import type { WorkshopModule } from "../types";

export const sortWorkshop: WorkshopModule = {
  type: "workshop",
  id: "81",
  slug: "sort-workshop",
  title: "sort Workshop",
  icon: "🔢",
  estimatedMinutes: 20,
  description:
    "Sort primitives, structs by field, implement sort.Interface, and use sort.Search.",
  steps: [
    {
      instruction:
        'Sort `[]int{5, 2, 8, 1, 9}` with `sort.Ints` and `[]string{"banana", "apple", "cherry"}` with `sort.Strings`. Print both sorted slices.',
      starterCode: `package main

import (
	"fmt"
	"sort"
)

func main() {
	nums  := []int{5, 2, 8, 1, 9}
	words := []string{"banana", "apple", "cherry"}

	// TODO: sort.Ints(nums) and sort.Strings(words)
	// TODO: print both
	_ = sort.Ints
	_ = sort.Strings
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"sort"
)

func main() {
	nums  := []int{5, 2, 8, 1, 9}
	words := []string{"banana", "apple", "cherry"}

	sort.Ints(nums)
	sort.Strings(words)

	fmt.Println(nums)
	fmt.Println(words)
}
`,
      validate: (code: string) =>
        code.includes("sort.Ints") && code.includes("sort.Strings"),
      successMessage:
        "sort.Ints and sort.Strings sort in-place — the original slice is modified. If you need the original order preserved, copy the slice first.",
    },
    {
      instruction:
        "Given a `Person` struct with `Name string` and `Age int`, sort a `[]Person` slice by Age ascending using `sort.Slice`. Then print each person.",
      starterCode: `package main

import (
	"fmt"
	"sort"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	people := []Person{
		{"Alice", 30}, {"Bob", 25}, {"Carol", 35}, {"Dave", 25},
	}

	// TODO: sort.Slice(people, func(i, j int) bool { return people[i].Age < people[j].Age })
	// TODO: print each person
	_ = sort.Slice
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"sort"
)

type Person struct {
	Name string
	Age  int
}

func main() {
	people := []Person{
		{"Alice", 30}, {"Bob", 25}, {"Carol", 35}, {"Dave", 25},
	}

	sort.Slice(people, func(i, j int) bool {
		return people[i].Age < people[j].Age
	})

	for _, p := range people {
		fmt.Println(p)
	}
}
`,
      validate: (code: string) =>
        code.includes("sort.Slice") &&
        code.includes("people[i].Age") &&
        code.includes("people[j].Age"),
      successMessage:
        "sort.Slice is the idiomatic way to sort a slice of structs. The less function captures the slice by closure — no boilerplate type definitions needed.",
    },
    {
      instruction:
        "Define a `ByLength []string` type that implements `sort.Interface` (Len, Less, Swap) to sort strings by length. Sort `[]string{\"banana\", \"kiwi\", \"fig\", \"mango\"}` and print the result.",
      starterCode: `package main

import (
	"fmt"
	"sort"
)

type ByLength []string

func (b ByLength) Len() int           { return len(b) }
func (b ByLength) Less(i, j int) bool {
	// TODO: return true if b[i] is shorter than b[j]
	return false
}
func (b ByLength) Swap(i, j int) {
	// TODO: swap b[i] and b[j]
}

func main() {
	words := ByLength{"banana", "kiwi", "fig", "mango"}
	sort.Sort(words)
	fmt.Println([]string(words))
}
`,
      hint: `package main

import (
	"fmt"
	"sort"
)

type ByLength []string

func (b ByLength) Len() int           { return len(b) }
func (b ByLength) Less(i, j int) bool { return len(b[i]) < len(b[j]) }
func (b ByLength) Swap(i, j int)      { b[i], b[j] = b[j], b[i] }

func main() {
	words := ByLength{"banana", "kiwi", "fig", "mango"}
	sort.Sort(words)
	fmt.Println([]string(words))
}
`,
      validate: (code: string) =>
        code.includes("sort.Interface") ||
        (code.includes("func (b ByLength) Len()") &&
          code.includes("func (b ByLength) Less(") &&
          code.includes("func (b ByLength) Swap(")),
      successMessage:
        "Implementing sort.Interface lets your type work with sort.Sort, sort.Stable, and sort.Search. Use it when a type always has the same natural sort order.",
    },
    {
      instruction:
        "Given a sorted `[]int{1, 3, 6, 10, 15, 21, 28}`, use `sort.Search` to find the index of value `15`. Print the index and confirm the value. Then search for a value not in the slice (`7`) and print the insertion point.",
      starterCode: `package main

import (
	"fmt"
	"sort"
)

func main() {
	nums := []int{1, 3, 6, 10, 15, 21, 28}

	// TODO: sort.Search for value 15 — find index where nums[i] >= 15
	// TODO: print index and nums[index]

	// TODO: sort.Search for value 7 — print where it would be inserted
	_ = sort.Search
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"sort"
)

func main() {
	nums := []int{1, 3, 6, 10, 15, 21, 28}

	i := sort.Search(len(nums), func(i int) bool { return nums[i] >= 15 })
	fmt.Println(i, nums[i]) // 4 15

	j := sort.Search(len(nums), func(i int) bool { return nums[i] >= 7 })
	fmt.Println(j) // 3 — would be inserted at index 3
}
`,
      validate: (code: string) =>
        code.includes("sort.Search") && code.includes("nums[i] >="),
      successMessage:
        "sort.Search runs in O(log n) — far faster than a linear scan for large sorted slices. The predicate must be monotone: all-false then all-true, which is satisfied by any >= comparison on a sorted slice.",
    },
  ],
};
