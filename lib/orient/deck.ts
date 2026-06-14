import type { DeckCard } from "./types";

// The Recall Deck — one durable fact per card, spanning all eight domains.
// Front is a question you should be able to answer at a whiteboard; back is the
// terse, reusable answer. The scheduler (store: deckSchedule / reviewCard)
// decides when each card is due.
export const deck: DeckCard[] = [
  // The Type System & Values
  { id: "d-zero-map", domainId: "type-system", front: "What is the zero value of a map, and what can you do with it?", back: "nil. Reads return the zero value with ok=false; writing to it panics — make the map before the first write." },
  { id: "d-value-pointer", domainId: "type-system", front: "Value vs. pointer receiver — which can mutate the caller's value?", back: "The pointer receiver. A value receiver operates on a copy, so it can't change the original." },
  { id: "d-range-copy", domainId: "type-system", front: "Does `for _, v := range structs { v.x = … }` mutate the slice?", back: "No — range copies each element into v. Index it (s[i].x = …) to mutate in place." },
  { id: "d-three-index", domainId: "type-system", front: "What does the three-index slice s[a:b:c] set?", back: "len = b-a and cap = c-a. Capping forces the next append to reallocate instead of clobbering shared tail elements." },

  // Interfaces & Composition
  { id: "d-implicit", domainId: "interfaces", front: "How does a type satisfy an interface in Go?", back: "Implicitly — it just needs the methods. There is no 'implements' keyword." },
  { id: "d-typed-nil", domainId: "interfaces", front: "Is a nil *T returned through an interface == nil?", back: "No. The interface carries the type *T, so it is non-nil even though the pointer is nil." },
  { id: "d-accept-return", domainId: "interfaces", front: "The 'accept interfaces, return structs' rule?", back: "Take the smallest interface you need as a parameter; return concrete types so callers keep full information." },
  { id: "d-any", domainId: "interfaces", front: "What operations are legal on a value of constraint/interface `any`?", back: "Only assignment. any (interface{}) has no methods, so you can't use +, <, or == on it without narrowing first." },

  // Errors as Values
  { id: "d-errors-is", domainId: "errors", front: "How do you compare against a wrapped sentinel error?", back: "errors.Is(err, ErrX) — it walks the %w chain. Plain == fails on a wrapped error." },
  { id: "d-errors-as", domainId: "errors", front: "How do you pull a typed error out of a chain?", back: "errors.As(err, &target) — it finds the first error in the chain assignable to target and fills it." },
  { id: "d-wrap", domainId: "errors", front: "How do you wrap an error with context but keep it inspectable?", back: "fmt.Errorf(\"doing X: %w\", err). %w preserves the original so errors.Is/As can still find it." },

  // Slices & Maps
  { id: "d-append-cap", domainId: "data-structures", front: "What does append do within cap vs. beyond cap?", back: "Within cap: writes in place (aliases see it). Beyond cap: allocates a bigger array and copies — old aliases go stale. Always reassign s = append(s, …)." },
  { id: "d-prealloc", domainId: "data-structures", front: "How do you preallocate a slice you'll append n items to?", back: "make([]T, 0, n) then append — one allocation instead of log n regrowths." },
  { id: "d-map-order", domainId: "data-structures", front: "How do you get deterministic output from a map?", back: "Collect the keys, sort them, then range the sorted slice. Map iteration order is deliberately randomized." },
  { id: "d-comma-ok", domainId: "data-structures", front: "How do you tell a missing map key from a stored zero value?", back: "The comma-ok form: v, ok := m[k]. ok is false only when the key is absent." },

  // Goroutines & Channels
  { id: "d-who-closes", domainId: "concurrency", front: "Who closes a channel, and what happens if you send on a closed one?", back: "The sender closes, never the receiver. Sending on a closed channel panics; closing broadcasts 'no more values'." },
  { id: "d-unbuffered", domainId: "concurrency", front: "When does a send on an unbuffered channel unblock?", back: "When a receiver is ready — it's a rendezvous. Completing the send proves the value was taken." },
  { id: "d-closed-recv", domainId: "concurrency", front: "How do you detect a closed, drained channel on receive?", back: "v, ok := <-ch — ok is false once it's closed and empty. (range over the channel exits then too.)" },
  { id: "d-context", domainId: "concurrency", front: "What is context.Context for?", back: "Carrying cancellation and deadlines across call boundaries. Select on <-ctx.Done() to stop work." },

  // Synchronization & the Memory Model
  { id: "d-race", domainId: "synchronization", front: "What does `go test -race` detect?", back: "Unsynchronized concurrent access to the same memory where at least one is a write — a data race — and prints both stacks." },
  { id: "d-counter", domainId: "synchronization", front: "Make `counter++` from many goroutines safe — two ways?", back: "A sync.Mutex around the increment, or atomic.AddInt64(&counter, 1) for a single word." },
  { id: "d-waitgroup", domainId: "synchronization", front: "The idiomatic way to wait for goroutines to finish?", back: "sync.WaitGroup: Add(n), each goroutine defers Done(), then Wait() blocks until the count hits zero." },

  // Generics & Constraints
  { id: "d-ordered", domainId: "generics", front: "Which constraint allows <, >, <=, >= on a type parameter?", back: "cmp.Ordered (Go 1.21+) — integers, floats, and strings. Use comparable for == and map keys." },
  { id: "d-tilde", domainId: "generics", front: "What does ~int mean in a constraint?", back: "Any type whose underlying type is int — so `type Celsius float64` satisfies ~float64. Without ~, only the exact type matches." },

  // Testing & Tooling
  { id: "d-bn", domainId: "tooling", front: "What is b.N in a benchmark?", back: "The iteration count the framework scales until timing is stable. Loop exactly b.N times; never hardcode it." },
  { id: "d-sink", domainId: "tooling", front: "How do you stop the compiler optimizing a benchmark's work away?", back: "Assign the result to a package-level sink var so it's observed — otherwise dead-code elimination times an empty loop." },
  { id: "d-slog", domainId: "tooling", front: "What does the stdlib give you for structured logging?", back: "log/slog (Go 1.21+) — leveled key/value logging with pluggable handlers. No third-party logger needed by default." },
];
