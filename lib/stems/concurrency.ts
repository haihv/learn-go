import type { Stem } from "./types";

export const concurrencyStem: Stem = {
  id: "S5",
  slug: "stem-concurrency",
  domainId: "concurrency",
  title: "Goroutines & Channels",
  icon: "⚡",
  oneLiner:
    "Don't communicate by sharing memory; share memory by communicating — goroutines pass values over channels, and select waits on many.",
  estimatedMinutes: 40,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the concurrency vocabulary",
      lead: "Eleven words that turn 'just add a goroutine' into a model of how work and signals move between them.",
      terms: [
        { term: "goroutine", reveal: "A function running concurrently, started with go f(). Cheap (a few KB of stack), scheduled onto OS threads by the runtime — you can spawn thousands." },
        { term: "channel", reveal: "A typed conduit for passing values between goroutines: chan T. The pipe through which one goroutine hands a value to another, synchronized by the runtime." },
        { term: "unbuffered channel", reveal: "make(chan T): send and receive rendezvous — the send blocks until another goroutine is ready to receive. A synchronous handoff, not a queue." },
        { term: "buffered channel", reveal: "make(chan T, n): holds up to n values. A send blocks only when the buffer is full; a receive blocks only when it's empty. Decouples sender from receiver." },
        { term: "send / receive", reveal: "ch <- v sends v into the channel; v := <-ch receives the next value. The arrow always points in the direction the value flows." },
        { term: "close + range", reveal: "close(ch) marks a channel as done; for v := range ch reads every value until it's drained and closed, then the loop exits cleanly." },
        { term: "select", reveal: "Waits on multiple channel operations and proceeds with whichever is ready first. A default case makes it non-blocking; it's how one goroutine multiplexes many." },
        { term: "context.Context", reveal: "Carries cancellation and deadlines across call boundaries. <-ctx.Done() fires when the caller cancels or a timeout elapses — the standard stop signal." },
        { term: "deadlock", reveal: "When every goroutine is blocked waiting on a channel and none can proceed, the runtime detects it: 'fatal error: all goroutines are asleep - deadlock!'." },
        { term: "comma-ok receive", reveal: "v, ok := <-ch sets ok to false once the channel is closed and drained. The way to tell 'real value' from 'channel is finished'." },
        { term: "the sender closes", reveal: "Only the sending side closes a channel, never the receiver — sending on a closed channel panics. Closing broadcasts 'no more values' to every receiver." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a worker pool",
      lead: "Tap each stage to watch jobs flow in, fan out to workers, and results flow back.",
      stages: [
        { label: "for w := 0; w < N; w++ { go worker(jobs, results) }", why: "Spawn N goroutines up front. Each blocks on range jobs, idle until work arrives — a fixed pool, not one goroutine per job." },
        { label: "for _, j := range tasks { jobs <- j }", why: "Feed work into the jobs channel. The runtime hands each value to whichever worker is free; concurrency is naturally bounded to N." },
        { label: "close(jobs)", why: "No more work coming. Closing broadcasts that signal to every worker at once — you don't have to message each goroutine individually." },
        { label: "for j := range jobs { ... }  // in each worker", why: "Each worker's range loop drains the remaining jobs, then sees the channel is closed and empty and returns — the goroutines retire on their own." },
        { label: "for i := 0; i < len(tasks); i++ { <-results }", why: "Collect on the results channel. Receiving exactly len(tasks) values means every job finished before main moves on." },
      ],
      takeaway: "Close a channel to broadcast 'no more values'; a range over a channel ends when it is drained and closed.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put goroutines and channels to work",
      lead: "A checklist for the concurrent code you'll write this week.",
      checklist: [
        "The sender closes, never the receiver — closing signals 'done', and a send on a closed channel panics.",
        "Reach for context.Context to cancel work and enforce timeouts; pass ctx as the first argument and select on <-ctx.Done().",
        "Buffer a channel only when you can name the capacity (number of workers, expected results) — not as a guess to 'speed it up'.",
        "A nil channel blocks forever on send and receive — assign a case's channel to nil to disable that case in a select.",
        "Every send needs a guaranteed receiver, or the sending goroutine blocks forever and leaks — wire the receive (or a ctx) before you spawn.",
      ],
      codePeek: `func fetch(ctx context.Context, urls <-chan string, out chan<- string) {
    for u := range urls { // ends when urls is drained and closed
        select {
        case <-ctx.Done(): // caller cancelled or timed out
            return
        case out <- process(u): // only send if someone can receive
        }
    }
}`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Unbuffered or buffered channel?",
      lead: "Both move values between goroutines. Slide to see what each guarantees, then settle the toggle.",
      slider: {
        leftLabel: "Unbuffered channel",
        rightLabel: "Buffered channel",
        stops: [
          { at: 0, note: "Unbuffered (make(chan T)): a rendezvous. The send blocks until a receiver takes the value, so completing a send proves the other goroutine has it — tight synchronization." },
          { at: 50, note: "The axis is coupling vs. throughput. Unbuffered guarantees handoff but forces both sides to meet; buffering lets the sender run ahead by n values, smoothing bursts at the cost of that guarantee." },
          { at: 100, note: "Buffered (make(chan T, n)): a bounded queue. The sender keeps going until the buffer fills, decoupling timing — but a successful send no longer means anyone has received the value yet." },
        ],
      },
      toggle: {
        question: "You need a guarantee that the receiver actually took the value — a synchronous handoff. Reach for…",
        optionA: "an unbuffered channel",
        optionB: "a buffered channel (cap 1)",
        answer: "A",
        why: "An unbuffered channel is a rendezvous: the send blocks until the receive happens, so completing the send proves the value was taken. Even a cap-1 buffer breaks that — the send returns as soon as the slot is filled, before anyone receives.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the deadlock",
      lead: "Read the two lines on a single goroutine, then judge what happens. The obvious answer is the wrong one.",
      prompt: "ch := make(chan int); ch <- 1; fmt.Println(<-ch)",
      options: [
        {
          text: "1",
          correct: false,
          reveal: "✗ The intuitive-but-wrong answer. The receive that would print 1 never runs — the goroutine is already blocked on the send above it.",
        },
        {
          text: "deadlock (fatal error)",
          correct: true,
          reveal: "✓ The unbuffered send blocks waiting for a receiver, but the receive is on the same goroutine after the send, so nothing can proceed. Fix: make the channel buffered (make(chan int, 1)) or receive in a separate goroutine.",
        },
        {
          text: "0",
          correct: false,
          reveal: "✗ A receive never returns a zero here — execution never reaches it, because the send on the line before blocks the only goroutine first.",
        },
        {
          text: "prints nothing and exits",
          correct: false,
          reveal: "✗ It doesn't exit cleanly; the runtime detects that the sole goroutine is stuck and aborts with 'fatal error: all goroutines are asleep - deadlock!'.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a concurrent URL fetcher",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "limit", label: "Bound concurrency with", options: ["a fixed worker pool", "a semaphore channel", "unbounded goroutines"] },
        { id: "cancel", label: "Cancel work via", options: ["context with timeout", "a done channel"] },
        { id: "collect", label: "Collect results through", options: ["a results channel", "a mutex-guarded slice"] },
      ],
      specTemplate: "A URL fetcher that bounds concurrency with {limit}, cancels via {cancel}, and collects results through {collect}.",
      buildCard: {
        title: "Concurrent URL fetcher",
        deliverable:
          "Fetch a list of URLs concurrently with a bounded worker pool and context cancellation, returning each URL's result or error.",
        acceptance: [
          "Concurrency is bounded by a worker pool (or semaphore channel) — never one unbounded goroutine per URL.",
          "A context.Context cancels in-flight requests on the first failure or when the timeout elapses.",
          "Results are collected without a data race — over a channel, or behind a mutex.",
          "Passes go test -race with both a success path and a cancellation/timeout path covered.",
        ],
      },
    },
  ],
};
