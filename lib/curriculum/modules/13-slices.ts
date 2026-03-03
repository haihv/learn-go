import { WorkshopModule } from "../types";

export const slices: WorkshopModule = {
  type: "workshop",
  id: "13",
  slug: "slices",
  title: "Slices",
  icon: "🍕",
  estimatedMinutes: 15,
  description: "Master Go slices — the dynamic array you'll use everywhere.",
  steps: [
    {
      instruction:
        "Declare a slice of integers named `nums` containing the values 10, 20, 30, 40, 50. Print it with fmt.Println.",
      hint: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	fmt.Println(nums)
}`,
      starterCode: `package main

import "fmt"

func main() {
	// Declare a slice literal: []Type{values}
	// e.g. nums := []int{...}
	fmt.Println()
}`,
      validate: (code: string) =>
        code.includes("[]int{") && code.includes("nums"),
      successMessage:
        "A slice literal uses []Type{values}. No fixed length needed!",
    },
    {
      instruction:
        "Starting with the `nums` slice from step 1, use `append` to add the value 60. Assign the result back to `nums` and print it.",
      hint: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	nums = append(nums, 60)
	fmt.Println(nums)
}`,
      starterCode: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	// Use append to add 60 to nums and assign the result back
	fmt.Println(nums)
}`,
      validate: (code: string) =>
        code.includes("append(") && code.includes("nums"),
      successMessage:
        "append always returns a new slice — always assign it back!",
    },
    {
      instruction:
        "Create a new slice `middle` by slicing `nums` to get only the elements at index 1, 2, and 3 (values 20, 30, 40). Print `middle`.",
      hint: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	nums = append(nums, 60)
	middle := nums[1:4]
	fmt.Println(middle)
}`,
      starterCode: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	nums = append(nums, 60)
	// Slice syntax: slice[low:high] — high is exclusive
	// e.g. middle := nums[low:high]
	fmt.Println()
}`,
      validate: (code: string) =>
        code.includes("middle") &&
        (code.includes("[1:4]") ||
          code.includes("[1:3]") ||
          code.match(/\[\d:\d\]/) !== null),
      successMessage:
        "slice[low:high] is exclusive of high — nums[1:4] gives indices 1, 2, 3.",
    },
    {
      instruction:
        "Use a `for range` loop to print each element of `nums` with its index, like: `index 0: 10`",
      hint: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	nums = append(nums, 60)
	for i, v := range nums {
		fmt.Printf("index %d: %d\n", i, v)
	}
}`,
      starterCode: `package main

import "fmt"

func main() {
	nums := []int{10, 20, 30, 40, 50}
	nums = append(nums, 60)
	// Use for range to iterate with index and value
	// fmt.Printf("index %d: %d\n", i, v)
}`,
      validate: (code: string) =>
        code.includes("range") &&
        code.includes("nums") &&
        (code.includes("Printf") || code.includes("Println")),
      successMessage:
        "range gives you both the index and value — use _ to discard either one.",
    },
    {
      instruction:
        "Declare a nil slice with `var s []int` (no initializer). Print `s` and then print `s == nil` to see that an uninitialized slice is nil.",
      hint: `package main

import "fmt"

func main() {
	var s []int
	fmt.Println(s, s == nil)
}`,
      starterCode: `package main

import "fmt"

func main() {
	// var declaration without an initializer gives a nil slice
	// A nil slice has length 0 and can still be appended to
	fmt.Println()
}`,
      // check that the student used var declaration and referenced nil
      validate: (code: string) =>
        code.includes("var s") && code.includes("nil"),
      successMessage:
        "A nil slice is the zero value for slices — len 0, cap 0, and safe to append to.",
    },
    {
      instruction:
        "Use `make([]int, 5)` to create a pre-allocated slice of length 5 (all zeros). Print the slice and its length with `len()`.",
      hint: `package main

import "fmt"

func main() {
	s := make([]int, 5)
	fmt.Println(s, len(s))
}`,
      starterCode: `package main

import "fmt"

func main() {
	// make([]T, length) allocates a slice with all elements set to zero
	// This avoids repeated re-allocation when you know the size upfront
	s := make([]int, 5)
	fmt.Println(s, len())
}`,
      // verify the student called make and len
      validate: (code: string) =>
        code.includes("make(") && code.includes("len("),
      successMessage:
        "make allocates the underlying array once — more efficient than building up with append.",
    },
    {
      instruction:
        "Create `s := make([]int, 3, 10)`. Print `len(s)` and `cap(s)`. Then append three more values and print the new `len(s)` and `cap(s)`. Notice cap doesn't change because the appends fit within the existing capacity.",
      hint: `package main

import "fmt"

func main() {
	s := make([]int, 3, 10)
	fmt.Println("len:", len(s), "cap:", cap(s))
	s = append(s, 1, 2, 3)
	fmt.Println("len:", len(s), "cap:", cap(s))
}`,
      starterCode: `package main

import "fmt"

func main() {
	// make([]T, length, capacity) — capacity sets the underlying array size
	// append reuses the backing array as long as len stays within cap
	s := make([]int, 3, 10)
	fmt.Println("len:", len(s), "cap:", cap(s))
	// append three more elements, then print len and cap again
}`,
      // ensure both cap and len are present; the student must compare them
      validate: (code: string) =>
        code.includes("cap(") && code.includes("len("),
      successMessage:
        "len is how many elements you have; cap is how many fit before a new backing array is needed.",
    },
    {
      instruction:
        "Create `orig := []int{1, 2, 3, 4, 5}`, then `view := orig[1:3]`. Set `view[0] = 99` and print both `view` and `orig`. Notice that `orig[1]` also changed — slices share the backing array.",
      hint: `package main

import "fmt"

func main() {
	orig := []int{1, 2, 3, 4, 5}
	view := orig[1:3]
	view[0] = 99
	fmt.Println("view:", view)
	fmt.Println("orig:", orig)
}`,
      starterCode: `package main

import "fmt"

func main() {
	orig := []int{1, 2, 3, 4, 5}
	// Slicing creates a view, not a copy — both slices point at the same memory
	view := orig[1:3]
	// Mutate through view and observe the effect on orig
	fmt.Println("view:", view)
	fmt.Println("orig:", orig)
}`,
      // the student must slice orig and write through view
      validate: (code: string) =>
        (code.includes("orig[1:") || code.includes("orig[1 :")) &&
        code.includes("view[0]"),
      successMessage:
        "Slices are views — mutations through one slice affect every slice sharing the same backing array.",
    },
  ],
};
