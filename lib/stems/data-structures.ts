import type { Stem } from "./types";

export const dataStructuresStem: Stem = {
  id: "S4",
  slug: "stem-data-structures",
  domainId: "data-structures",
  title: "Slices & Maps",
  icon: "📦",
  oneLiner:
    "A slice is a window onto a backing array — len, cap, and aliasing all follow from that; a map is an unordered hash table with a nil trap.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the slice & map vocabulary",
      lead: "Eleven words that turn '[]T is a list and map[K]V is a dict' into a precise model of what's really under the hood.",
      terms: [
        { term: "slice header", reveal: "A small struct of three words — pointer to the backing array, len, and cap. Passing a slice copies the header, not the elements." },
        { term: "backing array", reveal: "The contiguous block of memory a slice points into. Many slices can view different windows of the same array." },
        { term: "len vs cap", reveal: "len is how many elements you can index; cap is how many fit before the backing array must grow. cap >= len, always." },
        { term: "append", reveal: "Adds to the end and returns a (possibly new) slice. If cap is exhausted it allocates a bigger array and copies — so always reassign: s = append(s, x)." },
        { term: "aliasing", reveal: "Two slices sharing one backing array. Writing through one is visible through the other — until an append reallocates and silently breaks the link." },
        { term: "three-index slice s[a:b:c]", reveal: "Sets len = b-a and cap = c-a. Capping the slice forces the next append to reallocate instead of clobbering shared tail elements." },
        { term: "nil slice vs empty slice", reveal: "var s []int is nil (len 0, cap 0, no array); []int{} is non-nil but empty. Both append fine and range fine — the difference rarely matters except == nil." },
        { term: "map", reveal: "An unordered hash table, map[K]V, built with make or a literal. Keys must be comparable; lookup, insert, and delete are average O(1)." },
        { term: "nil map", reveal: "The zero value of a map. Reads return the zero V and ok=false; writing to it panics. Always make a map before writing." },
        { term: "randomized iteration order", reveal: "range over a map visits keys in a deliberately random order each run — Go enforces it so you never depend on order. Sort keys for deterministic output." },
        { term: "comma-ok", reveal: "v, ok := m[k] tells presence apart from a stored zero value: ok is false only when the key is absent." },
        { term: "copy()", reveal: "copy(dst, src) copies min(len(dst), len(src)) elements between slices. The way to duplicate data instead of aliasing it." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace append growing a slice",
      lead: "Tap each step to watch when append writes in place and when it abandons the old array.",
      stages: [
        { label: "s := make([]int, 0, 2)", why: "len 0, cap 2: an empty window onto a freshly allocated 2-element backing array. Room for two appends before any growth." },
        { label: "s = append(s, 1)", why: "cap has room, so append writes into the existing array and bumps len to 1. Same backing array — any alias sees the new element." },
        { label: "s = append(s, 2)", why: "Still within cap. len becomes 2, the array is now full, and nothing has reallocated yet." },
        { label: "s = append(s, 3)", why: "cap is exhausted. append allocates a bigger array, copies the two old elements over, writes 3, and returns a slice pointing at the new array." },
        { label: "old aliases now stale", why: "Any slice still pointing at the original 2-element array no longer shares storage with s — they have silently diverged." },
      ],
      takeaway: "append may or may not reallocate — never assume the backing array stays shared after it. Always reassign the result.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put slices & maps to work",
      lead: "A checklist for the containers you'll reach for this week.",
      checklist: [
        "Know the final size? Preallocate with make([]T, 0, n) and append — one allocation instead of log n regrowths.",
        "Delete from a slice with slices.Delete(s, i, i+1), or the classic append(s[:i], s[i+1:]...) — both shift the tail down.",
        "Test map presence with v, ok := m[k]; never infer absence from a zero value, which a real entry could also hold.",
        "make a map before the first write: m := make(map[K]V) — writing to a nil map panics at runtime.",
        "Need stable output? Collect the keys, sort them, then range the sorted slice — map iteration order is deliberately random.",
      ],
      codePeek: `a := []int{1, 2, 3, 4}
b := a[:2]            // shares a's backing array, cap 4
b = append(b, 99)     // spare cap, so this writes into a[2]
fmt.Println(a)        // [1 2 99 4] — a was mutated through b
// Want isolation? cap the slice: b := a[:2:2] forces a copy on append.`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Linear scan or hash lookup?",
      lead: "Both answer 'is this id in the set?'. Slide to see where each wins, then settle the toggle.",
      slider: {
        leftLabel: "Linear scan (slice)",
        rightLabel: "Hash lookup (map)",
        stops: [
          { at: 0, note: "Linear scan: walk the slice comparing each element — O(n). For a handful of items it beats a map: no hashing, contiguous memory, cache-friendly, zero allocation." },
          { at: 50, note: "The axis is set size and lookup frequency. A scan is fine for tiny or one-off checks; a map's O(1) lookup pulls ahead as n grows or the same set is queried in a loop." },
          { at: 100, note: "Hash lookup: map[T]struct{} gives average O(1) membership regardless of size. The struct{} value costs zero bytes, so it's a pure set. Build cost is amortized over many queries." },
        ],
      },
      toggle: {
        question: "You test membership against ~10,000 ids inside a hot loop. Reach for…",
        optionA: "a map[T]struct{}",
        optionB: "scan a slice",
        answer: "A",
        why: "At 10,000 ids in a hot loop, each linear scan is O(n) and the loop multiplies the pain; a map turns every check into an O(1) hash lookup. For a tiny fixed set (a few elements, checked rarely) the slice scan can win — no hashing and better cache behavior.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the aliasing flaw",
      lead: "b is a window onto a, then it grows. Judge what a prints. The obvious answer is the wrong one.",
      prompt: "a := []int{1, 2, 3, 4}; b := a[:2]; b = append(b, 99); fmt.Println(a)",
      options: [
        {
          text: "[1 2 99 4]",
          correct: true,
          reveal: "✓ b is a[:2] — len 2 but cap 4, so it still has spare room. append writes 99 into a[2] of the shared backing array, mutating a. Cap with a[:2:2] to force a copy instead.",
        },
        {
          text: "[1 2 3 4]",
          correct: false,
          reveal: "✗ The intuitive-but-wrong answer. Because b kept cap 4, append did not reallocate — it overwrote a[2] in place. a is not left untouched.",
        },
        {
          text: "[1 2 99]",
          correct: false,
          reveal: "✗ That's what b holds, not a. a still has four elements; append never shortens the original slice.",
        },
        {
          text: "runtime panic",
          correct: false,
          reveal: "✗ Nothing here panics — appending within cap is perfectly legal. The danger is silent mutation, not a crash.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a word-frequency pipeline",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "input", label: "Read input from", options: ["an io.Reader via bufio.Scanner", "a preloaded []string", "stdin"] },
        { id: "counter", label: "Count occurrences in", options: ["a map[string]int", "a sorted slice of pairs"] },
        { id: "topN", label: "Produce top-N by", options: ["copying entries to a slice and sorting with slices.SortFunc", "a heap"] },
      ],
      specTemplate: "A pipeline that reads {input}, counts words in {counter}, and emits the top-N by {topN}.",
      buildCard: {
        title: "Word-frequency pipeline",
        deliverable:
          "A program that tokenizes input, counts each word in a map[string]int, then emits the top-N words by copying the entries to a slice and sorting it.",
        acceptance: [
          "Tokenize input with bufio.Scanner set to bufio.ScanWords (word split).",
          "Count occurrences in a map[string]int, incrementing per word.",
          "Produce top-N by copying entries into a []struct{Word string; Count int} and ordering with slices.SortFunc (count desc, word asc to break ties deterministically).",
          "A benchmark compares a preallocated result slice (make([]pair, 0, len(m))) against a zero-cap one, run with -benchmem to show the allocation difference.",
        ],
      },
    },
  ],
};
