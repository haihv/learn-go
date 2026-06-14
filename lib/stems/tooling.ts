import type { Stem } from "./types";

export const toolingStem: Stem = {
  id: "S8",
  slug: "stem-tooling",
  domainId: "tooling",
  title: "Testing & Tooling",
  icon: "🔧",
  oneLiner:
    "Go's tooling ships with the compiler — table tests, benchmarks, the race detector, and pprof make 'is it correct and fast?' one command away.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the tooling vocabulary",
      lead: "Twelve words that turn 'go test' into a full loop for proving code correct, fast, and safe.",
      terms: [
        { term: "table-driven test", reveal: "A []struct of cases looped over with one assertion body. Adding a case is one line, and every case runs the same checks." },
        { term: "t.Run (subtests)", reveal: "t.Run(name, func(t *testing.T){...}) names each case so a failure says which one broke, and you can run just it with -run." },
        { term: "testing.T", reveal: "The handle passed to every TestXxx. t.Errorf records a failure and continues; t.Fatalf records and stops the test." },
        { term: "testing.B / b.N", reveal: "The benchmark handle. The framework sets b.N — the iteration count — and you loop exactly that many times so it can compute ns/op." },
        { term: "b.ResetTimer", reveal: "Zeroes the clock after expensive setup so the measured region is only the loop, not the fixture you built before it." },
        { term: "go test -race", reveal: "Instruments memory access and flags any unsynchronized read/write across goroutines at runtime. Slower, but deterministic about data races." },
        { term: "go test -cover", reveal: "Reports the percent of statements executed by the tests; -coverprofile writes a profile go tool cover can render line-by-line." },
        { term: "go vet", reveal: "A static checker for real bugs the compiler allows: bad Printf verbs, lost struct tags, copied locks, unreachable code." },
        { term: "pprof", reveal: "Sampling profiler for CPU and heap. -cpuprofile / -memprofile (or net/http/pprof) emit profiles you read with go tool pprof." },
        { term: "t.Parallel", reveal: "Marks a test to run concurrently with other parallel tests, surfacing shared-state bugs and shortening the suite. Pair it with -race." },
        { term: "golden file", reveal: "Expected output stored in testdata/ and compared byte-for-byte; a -update flag rewrites it so large fixtures aren't inlined in code." },
        { term: "t.Helper()", reveal: "Marks a function as a test helper so failures report the calling line, not the line inside the helper — assertions point where you'd look." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a benchmark run",
      lead: "Tap each step to see how the framework turns a loop into a stable ns/op number.",
      stages: [
        { label: "func BenchmarkX(b *testing.B)", why: "You write the work once. The signature tells go test this is a benchmark, not a test — it's run only under -bench." },
        { label: "the framework chooses b.N", why: "The runner calls your function repeatedly with a growing b.N (1, then more) until the run lasts long enough to time reliably." },
        { label: "for i := 0; i < b.N; i++ { work() }", why: "You loop exactly b.N times. The framework divides total elapsed time by b.N to get per-operation cost — that's the contract." },
        { label: "reports ns/op (+ allocs/op with -benchmem)", why: "Output is time per operation; -benchmem adds bytes and allocations per op, the numbers that usually drive optimization." },
        { label: "compare runs with benchstat", why: "Run -count=10 before and after, then benchstat old.txt new.txt prints the delta with a p-value so you trust the change, not noise." },
      ],
      takeaway: "Never hardcode iteration counts — write the loop against b.N and let the framework scale it until the timing is stable.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put the tooling to work",
      lead: "A checklist for the test files and CI you'll touch this week.",
      checklist: [
        "Write table-driven tests with a t.Run per case so a failure names itself instead of pointing at a shared assertion line.",
        "Run -race in CI on every build — data races are nondeterministic, so a passing un-raced run proves nothing.",
        "Measure before optimizing: go test -bench=. -benchmem gives you the baseline you'll have to beat.",
        "Run go vet on every commit; it catches Printf-verb and copied-lock bugs the compiler happily accepts.",
        "Put t.Helper() at the top of assertion helpers so the failure points at the caller, not the helper's internals.",
      ],
      codePeek: `func TestAbs(t *testing.T) {
    cases := []struct {
        name string
        in   int
        want int
    }{
        {"positive", 3, 3},
        {"negative", -3, 3},
        {"zero", 0, 0},
    }
    for _, c := range cases {
        t.Run(c.name, func(t *testing.T) {
            if got := Abs(c.in); got != c.want {
                t.Errorf("Abs(%d) = %d, want %d", c.in, got, c.want)
            }
        })
    }
}`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Unit test or integration test?",
      lead: "Both prove behavior. Slide to see the tradeoff, then settle the toggle.",
      slider: {
        leftLabel: "Unit test (fast, isolated)",
        rightLabel: "Integration test (real deps, slow)",
        stops: [
          { at: 0, note: "Unit test: no network, no DB, runs in milliseconds. Pins one function's logic so a failure points at one place — but a passing unit suite can't catch a wrong SQL query or a mismatched API contract." },
          { at: 50, note: "The axis is fidelity vs. speed and isolation. Unit tests are the fast inner loop; integration tests are the slower confidence that the wired-up system actually works. Most suites want a wide base of units and a thin layer of integration." },
          { at: 100, note: "Integration test: real database, real HTTP, sometimes a container. Catches the bugs between components that units can't see — but it's slow, flakier, and a failure could be in any of the parts it exercises." },
        ],
      },
      toggle: {
        question: "You suspect an intermittent CI failure in concurrent code. Reach for…",
        optionA: "run the tests under -race",
        optionB: "add logging and rerun until it fails",
        answer: "A",
        why: "The race detector instruments memory access and deterministically flags the unsynchronized read/write in a single run, pointing at both goroutines. Logging changes the timing of the goroutines and can hide the race entirely — a classic heisenbug where the fix is the diagnostic.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Judge the optimized-away benchmark",
      lead: "Read the benchmark, then judge the risk. It compiles and runs — which is exactly the problem.",
      prompt: "func BenchmarkFib(b *testing.B) { for i := 0; i < b.N; i++ { fib(20) } } — what's the risk?",
      options: [
        {
          text: "The result is unused, so the compiler may eliminate the call and report a fake-fast time; assign to a package-level sink to keep it honest.",
          correct: true,
          reveal: "✓ fib(20) has no observable effect, so the compiler is free to optimize the call away — leaving you timing an empty loop. Assign to a package-level var sink = fib(20) inside the loop so the result is observed and the work survives.",
        },
        {
          text: "None, it's correct — it loops b.N times, which is exactly what a benchmark should do.",
          correct: false,
          reveal: "✗ The loop shape is right, but a pure function whose result is discarded can be eliminated as dead code, making the measured time meaningless.",
        },
        {
          text: "b.N is always 1, so the benchmark only measures a single call and the number is unreliable.",
          correct: false,
          reveal: "✗ b.N is not fixed at 1 — the framework grows it until the run is long enough to time. The real risk is the unused result, not the iteration count.",
        },
        {
          text: "fib must be exported (Fib) before it can be benchmarked.",
          correct: false,
          reveal: "✗ A benchmark lives in the same package's _test.go file and can call unexported functions freely. Export has nothing to do with it.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a tested, benchmarked, profiled package",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "style", label: "Test style", options: ["table-driven + subtests", "property-based"] },
        { id: "gate", label: "Performance gate", options: ["a benchmark", "benchmark + -race in CI"] },
        { id: "profile", label: "Profiling", options: ["CPU pprof", "heap pprof", "both"] },
      ],
      specTemplate: "A small package tested with {style}, gated by {gate}, and profiled with {profile} to justify one optimization.",
      buildCard: {
        title: "Tested & profiled package",
        deliverable:
          "A small package with table-driven tests, a benchmark, and a pprof profile that justifies exactly one optimization.",
        acceptance: [
          "Table-driven tests with subtests cover the edge cases, and each case fails with its own name.",
          "The tests pass under -race, proving no unsynchronized access on any path the suite exercises.",
          "A benchmark run with -benchmem establishes a baseline in ns/op and allocs/op.",
          "A pprof CPU or heap profile points at the hot spot, and one change is justified by a before/after benchmark (benchstat).",
        ],
      },
    },
  ],
};
