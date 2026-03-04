import type { LessonModule } from "../types";

export const sortModule: LessonModule = {
  type: "lesson",
  id: "80",
  slug: "sort",
  title: "Sorting with the sort Package",
  icon: "🔢",
  estimatedMinutes: 12,
  content: `## Sorting with the sort Package

Go's \`sort\` package provides in-place sorting for slices of primitives, a flexible closure-based API for structs, an interface for custom types, and a binary search primitive — all in the standard library.

### Sorting primitives

\`\`\`go
nums := []int{5, 2, 8, 1, 9}
sort.Ints(nums)       // [1 2 5 8 9] — ascending, in-place
fmt.Println(nums)

words := []string{"banana", "apple", "cherry"}
sort.Strings(words)   // [apple banana cherry]

floats := []float64{3.2, 1.1, 2.5}
sort.Float64s(floats) // [1.1 2.5 3.2]
\`\`\`

All three functions sort in-place and in ascending order. If you need to preserve the original, copy the slice first.

### sort.Slice — sorting structs by any field

The most-used function in the package:

\`\`\`go
type Person struct {
    Name string
    Age  int
}

people := []Person{
    {"Alice", 30}, {"Bob", 25}, {"Carol", 35},
}

// sort by Age ascending
sort.Slice(people, func(i, j int) bool {
    return people[i].Age < people[j].Age
})
// [{Bob 25} {Alice 30} {Carol 35}]
\`\`\`

The less function receives indices i and j; return true if element i should come before j.

### sort.SliceStable — preserve original order of equal elements

\`\`\`go
sort.SliceStable(people, func(i, j int) bool {
    return people[i].Age < people[j].Age
})
\`\`\`

Use \`SliceStable\` when equal elements have meaningful relative order (e.g., sort by department then preserve original name order within each department).

### Multi-key sort

Chain comparisons in the less function:

\`\`\`go
// sort by Age, then by Name for ties
sort.Slice(people, func(i, j int) bool {
    if people[i].Age != people[j].Age {
        return people[i].Age < people[j].Age
    }
    return people[i].Name < people[j].Name
})
\`\`\`

### sort.Interface — custom types

Implement three methods to make any type sortable with \`sort.Sort\`:

\`\`\`go
type ByLength []string

func (b ByLength) Len() int           { return len(b) }
func (b ByLength) Less(i, j int) bool { return len(b[i]) < len(b[j]) }
func (b ByLength) Swap(i, j int)      { b[i], b[j] = b[j], b[i] }

words := ByLength{"banana", "kiwi", "fig"}
sort.Sort(words) // [fig kiwi banana]
\`\`\`

Prefer \`sort.Slice\` for one-off sorts; implement \`sort.Interface\` when the type is always sorted the same way or needs to be passed to functions expecting \`sort.Interface\`.

### sort.Search — binary search

\`\`\`go
nums := []int{1, 3, 6, 10, 15, 21}
// find smallest index where nums[i] >= 6
i := sort.Search(len(nums), func(i int) bool { return nums[i] >= 6 })
fmt.Println(i, nums[i]) // 2 6
\`\`\`

\`sort.Search\` runs binary search in O(log n). The slice must be sorted. The function must be monotone: false for indices before the answer, true from the answer onwards.

### sort.Reverse

\`\`\`go
sort.Sort(sort.Reverse(sort.IntSlice(nums)))  // descending
// Or with Slice:
sort.Slice(nums, func(i, j int) bool { return nums[i] > nums[j] })
\`\`\`

### Checking if sorted

\`\`\`go
sorted := sort.IntsAreSorted(nums)
sorted  = sort.SliceIsSorted(people, func(i, j int) bool {
    return people[i].Age < people[j].Age
})
\`\`\`
`,
  quiz: [
    {
      question:
        "What does the less function passed to sort.Slice(s, less) return?",
      options: [
        "true if element at index i equals element at index j",
        "true if element at index i should come before element at index j in the sorted result",
        "the comparison result as -1, 0, or 1",
        "true if the slice is already sorted",
      ],
      correctIndex: 1,
    },
    {
      question:
        "When should you use sort.SliceStable instead of sort.Slice?",
      options: [
        "When sorting large slices for better performance",
        "When you need to preserve the relative order of elements that compare as equal",
        "SliceStable only works on slices of structs; Slice works on any type",
        "When the less function has side effects",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What must be true about the slice passed to sort.Search?",
      options: [
        "It must be a []int",
        "It must be sorted so the predicate function is monotone (false then true)",
        "It must have at least 2 elements",
        "It must not contain duplicates",
      ],
      correctIndex: 1,
    },
  ],
};
