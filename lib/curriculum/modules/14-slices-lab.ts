import type { LabModule } from "../types";

export const slicesLab: LabModule = {
  type: "lab",
  id: "14",
  slug: "slices-lab",
  title: "Functional Pipeline Lab",
  icon: "🔗",
  estimatedMinutes: 25,
  description: "Implement filter, mapInts, and reduce, then chain them into a pipeline.",
  instructions: `## Functional Pipeline Lab

In this lab, you will implement three higher-order functions and chain them together into a pipeline.

### Your Task

Implement these three functions:

**1. \`filter(nums []int, keep func(int) bool) []int\`**
- Returns a new slice containing only elements where \`keep(element)\` returns \`true\`

**2. \`mapInts(nums []int, fn func(int) int) []int\`**
- Returns a new slice with \`fn\` applied to each element

**3. \`reduce(nums []int, init int, fn func(int, int) int) int\`**
- Folds the slice into a single value, starting with \`init\`

Then in \`main\`, apply the pipeline to \`[]int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}\`:
1. Filter even numbers → print the filtered slice
2. Double each number with mapInts → print the doubled slice
3. Sum with reduce → print the final sum

### Expected Output

\`\`\`
Filtered: [2 4 6 8 10]
Doubled: [4 8 12 16 20]
Sum: 60
\`\`\`
`,
  starterCode: `package main

import "fmt"

func filter(nums []int, keep func(int) bool) []int {
	// TODO: return a new slice containing only elements where keep(element) is true
	return nil
}

func mapInts(nums []int, fn func(int) int) []int {
	// TODO: return a new slice with fn applied to every element
	return nil
}

func reduce(nums []int, init int, fn func(int, int) int) int {
	// TODO: fold nums into a single value starting from init
	return init
}

func main() {
	nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

	// TODO: filter even numbers and print the result
	// Expected: Filtered: [2 4 6 8 10]

	// TODO: double each number with mapInts and print the result
	// Expected: Doubled: [4 8 12 16 20]

	// TODO: sum the doubled slice with reduce and print the result
	// Expected: Sum: 60

	_ = nums
	fmt.Println("Implement the functions above!")
}
`,
  solutionCode: `package main

import "fmt"

func filter(nums []int, keep func(int) bool) []int {
	result := []int{}
	for _, n := range nums {
		if keep(n) {
			result = append(result, n)
		}
	}
	return result
}

func mapInts(nums []int, fn func(int) int) []int {
	result := make([]int, len(nums))
	for i, n := range nums {
		result[i] = fn(n)
	}
	return result
}

func reduce(nums []int, init int, fn func(int, int) int) int {
	acc := init
	for _, n := range nums {
		acc = fn(acc, n)
	}
	return acc
}

func main() {
	nums := []int{1, 2, 3, 4, 5, 6, 7, 8, 9, 10}

	evens := filter(nums, func(n int) bool { return n%2 == 0 })
	fmt.Println("Filtered:", evens)

	doubled := mapInts(evens, func(n int) int { return n * 2 })
	fmt.Println("Doubled:", doubled)

	sum := reduce(doubled, 0, func(acc, n int) int { return acc + n })
	fmt.Println("Sum:", sum)
}
`,
  tests: [
    {
      name: "filter function exists",
      description: "Your code must define a function named filter.",
      validate: (code: string, _stdout: string) => code.includes("func filter"),
    },
    {
      name: "mapInts function exists",
      description: "Your code must define a function named mapInts.",
      validate: (code: string, _stdout: string) => code.includes("func mapInts"),
    },
    {
      name: "reduce function exists",
      description: "Your code must define a function named reduce.",
      validate: (code: string, _stdout: string) => code.includes("func reduce"),
    },
    {
      name: "Filtered slice is printed",
      description: "Your output must include the filtered even numbers: [2 4 6 8 10].",
      validate: (_code: string, stdout: string) => stdout.includes("[2 4 6 8 10]"),
    },
    {
      name: "Final sum is 60",
      description: "The sum of the doubled even numbers must be 60.",
      validate: (_code: string, stdout: string) => stdout.includes("60"),
    },
  ],
};
