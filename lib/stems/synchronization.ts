import type { Stem } from "./types";

export const synchronizationStem: Stem = {
  id: "S6",
  slug: "stem-synchronization",
  domainId: "synchronization",
  title: "Synchronization & the Memory Model",
  icon: "🔒",
  oneLiner:
    "When goroutines share memory, you need a happens-before edge — a mutex, a channel, or an atomic — or the race detector will (rightly) scream.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the synchronization vocabulary",
      lead: "Ten words that turn 'just add a mutex' into a precise model of when shared memory is safe.",
      terms: [
        { term: "data race", reveal: "Two goroutines access the same memory, at least one writes, and there's no happens-before edge between them. Undefined behavior — not just a wrong value." },
        { term: "sync.Mutex", reveal: "A mutual-exclusion lock. Lock() blocks until it's free, Unlock() releases it. Only one goroutine holds it at a time — that's the critical section." },
        { term: "sync.RWMutex", reveal: "A reader/writer lock. Many RLock holders can read concurrently, but Lock for writing is exclusive. Worth it only when reads vastly outnumber writes." },
        { term: "sync.WaitGroup", reveal: "Counts outstanding goroutines: Add(n), each goroutine defers Done(), Wait() blocks until the count hits zero. The idiomatic 'join'." },
        { term: "sync.Once", reveal: "once.Do(f) runs f exactly once, no matter how many goroutines call it. For lazy, concurrency-safe initialization of a singleton or config." },
        { term: "sync/atomic", reveal: "Lock-free operations on a single word: atomic.AddInt64, atomic.LoadInt64, CompareAndSwap. atomic.Value stores a whole value atomically. No torn reads or lost updates." },
        { term: "happens-before", reveal: "The memory model's ordering guarantee: if A happens-before B, A's writes are visible to B. Mutexes, channels, and atomics all establish these edges." },
        { term: "the race detector", reveal: "go test -race (or go run -race) instruments memory access and reports any race it observes at runtime. Run it in CI — a race that doesn't fire today fires in production." },
        { term: "critical section", reveal: "The code between Lock and Unlock where shared state is touched. Keep it small: hold the lock only for the access, not for I/O or long work." },
        { term: "defer mu.Unlock()", reveal: "Unlock immediately after Lock so the lock is released on every return path — including a panic. The single most reliable way to avoid a leaked lock." },
        { term: "sync.Map", reveal: "A concurrent map tuned for caches where keys are written once and read many times, or where goroutines touch disjoint keys. For the general case, a plain map + RWMutex is faster and clearer." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a shared counter under load",
      lead: "Tap each stage to watch the same counter go from broken to safe three different ways.",
      stages: [
        { label: "N goroutines run c++", why: "c++ is read-modify-write: load c, add 1, store c. With no synchronization, two goroutines load the same value and one store overwrites the other — a lost update, and a data race." },
        { label: "go test -race flags it", why: "The detector sees concurrent unsynchronized access to c with at least one write and reports the exact goroutines and stacks. The bug is real even when the wrong answer is rare." },
        { label: "mu.Lock(); c++; mu.Unlock()", why: "The mutex serializes every increment: each goroutine holds the lock for its read-modify-write, establishing a happens-before edge with the next holder. No interleaving, no lost updates." },
        { label: "atomic.AddInt64(&c, 1)", why: "For a single word, an atomic increment is one indivisible operation — lock-free and faster than a mutex. The hardware guarantees no torn read or lost update." },
      ],
      takeaway: "Every read and write of shared state must use the same lock (or an atomic). A half-protected variable is still a race.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put synchronization to work",
      lead: "A checklist for the shared state you'll guard this week.",
      checklist: [
        "Guard every access — read and write — with the SAME mutex. One unguarded read is enough to make it a race.",
        "defer mu.Unlock() on the line right after mu.Lock(), so the lock is released on every return path, panic included.",
        "Reach for RWMutex only when reads vastly outnumber writes; under write-heavy load it's slower than a plain Mutex.",
        "Prefer a channel for handing off ownership of data between stages; prefer a mutex (or atomic) for guarding a field in place.",
        "Run go test -race in CI. A race that doesn't reproduce on your laptop will reproduce under production load.",
      ],
      codePeek: `type Counter struct {
    mu sync.Mutex
    m  map[string]int
}

func (c *Counter) Inc(key string) {
    c.mu.Lock()
    defer c.mu.Unlock() // released on every path, even a panic
    c.m[key]++          // every access is under the same lock
}

func (c *Counter) Get(key string) int {
    c.mu.Lock()
    defer c.mu.Unlock()
    return c.m[key] // the read is guarded too — a bare read is still a race
}`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Guard the state or transfer it?",
      lead: "Mutexes and channels both make concurrency safe. Slide to see what each is for, then settle the toggle.",
      slider: {
        leftLabel: "Mutex / atomic (guard state)",
        rightLabel: "Channel (transfer ownership)",
        stops: [
          { at: 0, note: "Mutex/atomic: protect a field that stays put while many goroutines touch it. Smallest overhead, clearest for a counter, a cache, or a shared map. The data never moves." },
          { at: 50, note: "The axis is whether the data stays or moves. Guard in place when goroutines share one value; hand off through a channel when a value flows from one owner to the next. 'Share memory by communicating' is the second style, not a rule against the first." },
          { at: 100, note: "Channel: pass ownership of a value between pipeline stages so only one goroutine holds it at a time. Great for work queues and fan-out/fan-in — heavier than a mutex for protecting a single variable." },
        ],
      },
      toggle: {
        question: "A single counter field is incremented from many goroutines and nothing else owns it. Reach for…",
        optionA: "a mutex (or atomic)",
        optionB: "a channel",
        answer: "A",
        why: "A mutex or atomic guards one in-place field with the least overhead. A channel shines when you transfer ownership of data between stages — routing every increment through a channel to one goroutine works but is far heavier than locking a single variable.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the lost-update myth",
      lead: "Read the setup, then judge the final value. The obvious answer assumes increments don't collide.",
      prompt: "Ten goroutines each run counter++ 1000 times with no lock (counter is a plain int). The final value is…",
      options: [
        {
          text: "exactly 10000",
          correct: false,
          reveal: "✗ The intuitive-but-wrong answer. counter++ is read-modify-write; concurrent increments interleave, so two goroutines read the same value and one store is lost. You'll rarely hit a clean 10000.",
        },
        {
          text: "≤ 10000, and nondeterministic",
          correct: true,
          reveal: "✓ Lost updates only ever subtract, so the total can't exceed 10000, and it varies run to run. go test -race flags it. Fix with a sync.Mutex around counter++ or atomic.AddInt64(&counter, 1).",
        },
        {
          text: "exactly 1000",
          correct: false,
          reveal: "✗ All ten goroutines write to the same counter, not their own — there's no per-goroutine total of 1000. Races lose increments; they don't divide the work.",
        },
        {
          text: "0",
          correct: false,
          reveal: "✗ Some increments do land; the loss isn't total. You get a nondeterministic value at or below 10000, not zero.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a concurrent-safe cache",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "granularity", label: "Lock granularity", options: ["a single RWMutex", "locks sharded by key hash"] },
        { id: "expiry", label: "Entry expiry", options: ["none", "per-entry TTL"] },
        { id: "reads", label: "Read optimization", options: ["RWMutex read lock", "atomic snapshot"] },
      ],
      specTemplate: "A map-backed cache using {granularity}, with {expiry}, optimizing reads via {reads}.",
      buildCard: {
        title: "Concurrent-safe cache",
        deliverable:
          "A map-backed cache safe for concurrent Get/Set, using locks sharded by key hash so unrelated keys don't contend on one lock.",
        acceptance: [
          "All map access is guarded by the matching shard's lock — every read and every write.",
          "Each shard uses an RWMutex so concurrent reads don't block each other.",
          "Keys are distributed across shards by a hash of the key, spreading contention.",
          "It passes go test -race under concurrent Get and Set from many goroutines.",
        ],
      },
    },
  ],
};
