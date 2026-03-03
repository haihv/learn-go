import { WorkshopModule } from "../types";

export const slices: WorkshopModule = {
  type: "workshop",
  id: "12",
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
  ],
};
