import type { Stem } from "./types";

export const typeSystemStem: Stem = {
  id: "S1",
  slug: "stem-type-system",
  domainId: "type-system",
  title: "The Type System & Values",
  icon: "🧬",
  oneLiner:
    "A variable holds a value, not a reference — pointers are how you opt into sharing, and every type has a useful zero value.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the value vocabulary",
      lead: "Nine words that turn 'Go has structs and pointers' into a precise model of how values move.",
      terms: [
        { term: "zero value", reveal: "Every type has a default: 0 for numbers, \"\" for strings, false for bools, nil for pointers/slices/maps/channels. A declared variable is never uninitialized." },
        { term: "value semantics", reveal: "Assigning or passing a value copies it. Structs and arrays are copied whole; mutating the copy never touches the original." },
        { term: "pointer", reveal: "A value holding the address of another value. *T is 'pointer to T', &x takes x's address, *p reads through it." },
        { term: "struct", reveal: "A typed collection of named fields laid out contiguously in memory — the workhorse aggregate type in Go." },
        { term: "composite literal", reveal: "Construct a value inline: T{...}, []T{...}, map[K]V{...}. The idiomatic way to build structs and containers." },
        { term: "pointer receiver", reveal: "A method on *T can mutate the receiver and avoids copying it; a value receiver gets a copy and cannot mutate the caller's value." },
        { term: "comparable", reveal: "Usable with ==: bools, numbers, strings, pointers, and structs/arrays of comparable fields. Slices, maps, and funcs are not comparable." },
        { term: "nil", reveal: "The zero value for pointers, slices, maps, channels, funcs, and interfaces. Some nils are usable (append to a nil slice); writing to a nil map panics." },
        { term: "new vs make", reveal: "new(T) returns a *T pointing at a zeroed T; make builds and initializes the runtime header of a slice, map, or channel — only those three." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a struct through a function call",
      lead: "Tap each step to see exactly when Go copies and when it shares.",
      stages: [
        { label: "p := Point{1, 2}", why: "A composite literal builds a Point value; p names that value. It lives on the stack unless it escapes." },
        { label: "move(p)", why: "Go passes arguments by value — move receives a copy of p, not p itself." },
        { label: "func move(pt Point) { pt.X++ }", why: "pt.X++ mutates the copy's field. The caller's p is untouched — value semantics in action." },
        { label: "moveP(&p)", why: "Pass the address instead. Now the function receives a pointer to the original p." },
        { label: "func moveP(pt *Point) { pt.X++ }", why: "Writing through the pointer reaches back to the caller's p and mutates it." },
      ],
      takeaway: "Go copies on assignment and on call; a pointer is how you opt into sharing the original.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put values and pointers to work",
      lead: "A checklist for the decisions you'll make every time you declare a type this week.",
      checklist: [
        "Method must mutate the receiver, or the struct is large? Use a pointer receiver — and keep all of that type's methods consistent.",
        "Design for the zero value: make T{} usable so callers need no constructor (like bytes.Buffer and sync.Mutex).",
        "Construct with named fields: User{Name: \"Ada\", Age: 36}. Positional literals silently break when a field is added.",
        "Compare with == only when every field is comparable; otherwise write an Equals method.",
        "You can't take the address of a map element (&m[k] won't compile) — map values aren't addressable; pull it out, mutate, put it back.",
      ],
      codePeek: `type Point struct{ X, Y int }

// pointer receiver: mutates the caller's value
func (p *Point) Shift(dx, dy int) { p.X += dx; p.Y += dy }

func main() {
    p := Point{1, 2}  // composite literal, value on the stack
    p.Shift(3, 4)     // Go auto-takes &p for the pointer-receiver call
    fmt.Println(p)    // {4 6}
}`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Value receiver or pointer receiver?",
      lead: "Both are methods on your type. Slide to see the shift, then settle the toggle.",
      slider: {
        leftLabel: "Value receiver",
        rightLabel: "Pointer receiver",
        stops: [
          { at: 0, note: "Value receiver: the method gets a copy. It can't mutate the caller, stays cheap for small structs, and even works on non-addressable values like map elements." },
          { at: 50, note: "The axis is mutation and size. Value receivers can't change the original; pointer receivers can and skip the copy — but then the value type alone may not satisfy an interface (only *T does)." },
          { at: 100, note: "Pointer receiver: mutate in place, no copy of a big struct. But callers need an addressable value, and a nil receiver becomes a real risk inside the method." },
        ],
      },
      toggle: {
        question: "Your type is a small, 4-field config struct whose methods only read it. Default to…",
        optionA: "value receivers",
        optionB: "pointer receivers",
        answer: "A",
        why: "Small read-only methods read clearest with value receivers, and plain values still satisfy interfaces. Switch to pointer receivers the moment a method must mutate — or when the struct is big enough that copying it shows up in a profile.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the value-copy flaw",
      lead: "Read the loop, then judge the output. The intuitive answer is the wrong one.",
      prompt: "type T struct{ n int }; ts := []T{{1}, {2}, {3}}; for _, t := range ts { t.n *= 10 }; fmt.Println(ts)",
      options: [
        {
          text: "[{10} {20} {30}]",
          correct: false,
          reveal: "✗ The intuitive-but-wrong answer. range copies each element into t; multiplying t.n changes the copy, not the slice.",
        },
        {
          text: "[{1} {2} {3}]",
          correct: true,
          reveal: "✓ range gives you a copy of each element, so the original slice is untouched. To mutate in place, index it: ts[i].n *= 10.",
        },
        {
          text: "[{0} {0} {0}]",
          correct: false,
          reveal: "✗ Nothing zeroes the elements; they keep their original values.",
        },
        {
          text: "Compile error",
          correct: false,
          reveal: "✗ It compiles fine — t is a valid copy. The bug is silent, which is exactly what makes value-copy mistakes dangerous.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build an immutable Money type",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "unit", label: "Store the amount as", options: ["int64 minor units + currency", "int64 cents", "big.Int"] },
        { id: "mutation", label: "Operations return", options: ["a new Money (immutable)", "a mutated receiver"] },
        { id: "equality", label: "Compare with", options: ["an Equals method", "== on the struct", "both"] },
      ],
      specTemplate: "A Money value type storing {unit}, where operations return {mutation}, compared with {equality}.",
      buildCard: {
        title: "Money value type",
        deliverable:
          "An immutable Money struct holding an integer minor-unit amount and a currency code, with Add/Sub returning new Money values and an Equals method that also checks currency.",
        acceptance: [
          "Money is a value type with value-receiver methods; no operation mutates its receiver.",
          "Add and Sub return a new Money plus an error on mismatched currencies.",
          "Equals compares both amount and currency; the zero Money is a valid zero amount.",
          "A table-driven test covers same-currency arithmetic, currency mismatch, and equality.",
        ],
      },
    },
  ],
};
