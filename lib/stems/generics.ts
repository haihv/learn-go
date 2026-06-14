import type { Stem } from "./types";

export const genericsStem: Stem = {
  id: "S7",
  slug: "stem-generics",
  domainId: "generics",
  title: "Generics & Constraints",
  icon: "🧮",
  oneLiner:
    "Type parameters let one function work over many types with compile-time safety — reach for them when interfaces lose the type and any loses everything.",
  estimatedMinutes: 30,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the generics vocabulary",
      lead: "Ten words that turn 'Go has generics now' into a working model of type parameters and constraints.",
      terms: [
        { term: "type parameter ([T any])", reveal: "A named placeholder for a type, declared in brackets after the function or type name: func F[T any](x T). T stands in for a concrete type chosen per call." },
        { term: "constraint", reveal: "An interface used as a bound on a type parameter — it says which types T may be, and therefore which operations are legal on a T." },
        { term: "comparable", reveal: "A built-in constraint for types usable with == and !=. Required for map keys and any T you compare directly; excludes slices, maps, and funcs." },
        { term: "cmp.Ordered", reveal: "The constraint from the cmp package (Go 1.21+) for types that support <, <=, >, >=: integers, floats, and strings. Use it for min/max/sort." },
        { term: "type inference", reveal: "The compiler deduces type arguments from the call's value arguments, so you write Map(xs, f) instead of Map[int, string](xs, f)." },
        { term: "type set", reveal: "A constraint is a set of types. any is the set of all types; comparable is the comparable ones; ~int | ~string is exactly those two underlying types." },
        { term: "instantiation", reveal: "Binding a generic to concrete type arguments — Stack[int] or Map[int, string] — produces a real, monomorphized type or function the compiler can check." },
        { term: "any vs a real constraint", reveal: "any (alias for interface{}) permits every type but no operations beyond assignment. A real constraint narrows the set so +, <, or == become legal on a T." },
        { term: "generic type", reveal: "A type with its own type parameters: type Stack[T any] struct{ items []T }. Its methods may use T but cannot introduce new type parameters of their own." },
        { term: "the ~ token", reveal: "~int means 'any type whose underlying type is int' — so a named type type Celsius float64 still satisfies ~float64. Without ~, only the exact type matches." },
        { term: "method constraints", reveal: "A constraint can be an interface with methods: [T interface{ String() string }]. T must then have those methods — operations and method sets can be mixed in one constraint." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a generic Map through a call",
      lead: "Tap each step to watch the type parameters get filled in and checked, all before the program runs.",
      stages: [
        { label: "func Map[T, U any](s []T, f func(T) U) []U", why: "Two type parameters: T for the input element, U for the output. The signature ties them together — f turns a T into a U, and you get back a []U." },
        { label: "Map(nums, strconv.Itoa)", why: "You pass values, not types. From []int and func(int) string the compiler infers T = int and U = string — no explicit [int, string] needed." },
        { label: "compiler instantiates Map[int, string]", why: "A concrete version is generated and type-checked: f(s[i]) must be a func(int) string, the result must be []string. Mismatches are compile errors, not runtime panics." },
        { label: "result is []string", why: "You get a fully typed []string back — no any, no type assertions, no reflection. The element type survived the whole round trip." },
      ],
      takeaway: "Generics give one implementation across many concrete types, checked at compile time — no any, no reflection.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put type parameters to work",
      lead: "A checklist for the day you're tempted to make something generic this week.",
      checklist: [
        "Write the concrete version first — Map over ints — and make it work before you parameterize it.",
        "Generalize only when you have two or more real types that need it; one caller is a sign you don't need generics yet.",
        "Pick the tightest constraint: cmp.Ordered for <,>; comparable for == and map keys; any only when you truly do nothing to the value.",
        "Let inference do the work — call Map(xs, f), not Map[int, string](xs, f); spell out type args only when inference can't see them.",
        "Don't reach for generics where a one-method interface reads clearer — io.Writer beats [T interface{ Write([]byte) }] every time.",
      ],
      codePeek: `import "cmp"

// One Filter over any slice; the predicate keeps it type-safe.
func Filter[T any](s []T, keep func(T) bool) []T {
    out := make([]T, 0, len(s))
    for _, v := range s {
        if keep(v) {
            out = append(out, v)
        }
    }
    return out
}

func main() {
    nums := []int{1, 2, 3, 4}
    even := Filter(nums, func(n int) bool { return n%2 == 0 })
    fmt.Println(even) // [2 4] — T inferred as int, result is []int
    _ = cmp.Compare(1, 2)
}`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Generic type or any + assertions?",
      lead: "Both let one container hold many types. Slide to see the difference, then settle the toggle.",
      slider: {
        leftLabel: "Generics (type-preserving)",
        rightLabel: "any + type assertions",
        stops: [
          { at: 0, note: "Stack[T]: the element type is part of the type. Push takes a T, Pop returns a T, and the compiler rejects a wrong-typed value — no casts, no runtime surprises." },
          { at: 50, note: "The axis is whether you keep the element type. Generics preserve it end to end; any erases it, so every read needs a v.(T) assertion that can panic if you're wrong." },
          { at: 100, note: "[]any: holds anything, but you've thrown the type away. Each Pop returns an any you must assert back, and a stray Push of the wrong type compiles fine and blows up later." },
        ],
      },
      toggle: {
        question: "You need a container that holds one element type chosen by the caller and must stay type-safe. Reach for…",
        optionA: "a generic type Stack[T]",
        optionB: "a []any with assertions",
        answer: "A",
        why: "When you want to preserve the caller's element type, a generic Stack[T] gives you a T back with no casts and rejects wrong types at compile time. An interface or any fits when you want shared behavior across types, not a type-preserving container — there the lost type is the point.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the 'any supports operators' myth",
      lead: "Read the function, then judge whether it compiles. The friendly-looking answer is the trap.",
      prompt: "func Sum[T any](xs []T) T { var s T; for _, x := range xs { s += x }; return s } — does this compile?",
      options: [
        {
          text: "No — any is the empty constraint, and + isn't defined for it; constrain T to a type set that supports + (e.g. ~int | ~float64).",
          correct: true,
          reveal: "✓ any permits every type but guarantees no operations, so s += x has no meaning the compiler can check. Narrow the constraint to a type set that supports +, like [T ~int | ~float64 | ~string].",
        },
        {
          text: "Yes — any supports +, so this sums any slice.",
          correct: false,
          reveal: "✗ This is the myth. any is interface{}; the only thing legal on a value of constraint any is assignment. + is not part of the empty constraint, so it won't compile.",
        },
        {
          text: "Yes, but only when T is instantiated as int.",
          correct: false,
          reveal: "✗ Constraint checking happens on the generic body, not per instantiation. Because the body uses + and any doesn't allow it, Sum is rejected before any int call exists.",
        },
        {
          text: "No — generics can't use range over a type parameter slice.",
          correct: false,
          reveal: "✗ range over a []T is perfectly legal. The real blocker is s += x: + isn't defined for the any constraint.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a generic slice toolkit",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "constraint", label: "Constraint per function", options: ["any for Map, comparable for Filter-by-set, cmp.Ordered for a Max helper", "any everywhere", "cmp.Ordered everywhere"] },
        { id: "api", label: "API surface", options: ["free functions Map/Filter/Reduce", "methods on a Stream[T]"] },
        { id: "reduce", label: "Reduce edge handling", options: ["takes an explicit seed value", "requires a non-empty slice"] },
      ],
      specTemplate: "A slice toolkit exposing {api}, with {constraint}, where Reduce {reduce}.",
      buildCard: {
        title: "Generic slice toolkit",
        deliverable:
          "Generic Map, Filter, and Reduce over any slice — type-safe and inference-friendly, so callers write Map(xs, f) and get a correctly typed slice back with no casts.",
        acceptance: [
          "Map[T, U any], Filter[T any], and Reduce[T, U any] have correct signatures: Map returns []U, Filter returns []T, Reduce folds []T into a U.",
          "Inference works at the call site — the common case needs no explicit type arguments.",
          "Reduce takes an explicit seed value so an empty slice has a well-defined result and never panics.",
          "Table-driven tests cover both ints and strings, exercising Map, Filter, and Reduce on each.",
        ],
      },
    },
  ],
};
