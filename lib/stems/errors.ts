import type { Stem } from "./types";

export const errorsStem: Stem = {
  id: "S3",
  slug: "stem-errors",
  domainId: "errors",
  title: "Errors as Values",
  icon: "🛡️",
  oneLiner:
    "Errors are ordinary values you return, inspect, and wrap — control flow stays visible because there are no exceptions.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the error vocabulary",
      lead: "Ten words that turn 'check err != nil' into a real strategy for handling failure.",
      terms: [
        { term: "error", reveal: "A built-in interface with one method: Error() string. Any type with that method is an error — nothing special about it." },
        { term: "sentinel error", reveal: "A predefined error value (io.EOF, sql.ErrNoRows) compared with errors.Is. Stable identity, carries no extra data." },
        { term: "wrapping (%w)", reveal: "fmt.Errorf(\"...: %w\", err) wraps err, adding context while preserving the original so it can be unwrapped later." },
        { term: "errors.Is", reveal: "Walks the wrap chain looking for a target sentinel: errors.Is(err, io.EOF). The correct comparison — not ==." },
        { term: "errors.As", reveal: "Walks the chain for a target type and extracts it: errors.As(err, &pathErr). For typed errors that carry data." },
        { term: "typed error", reveal: "A struct implementing error that carries fields (an *os.PathError has Op and Path). Inspected with errors.As." },
        { term: "errors.Unwrap", reveal: "Returns the next error in the chain, or nil. errors.Is and errors.As use it under the hood." },
        { term: "panic / recover", reveal: "panic unwinds the stack; recover inside a deferred func stops it. For unrecoverable bugs — not ordinary errors." },
        { term: "error string style", reveal: "Lowercase, no trailing punctuation — because errors get wrapped: \"open file: permission denied\" reads cleanly at every layer." },
        { term: "errors are values", reveal: "An error is data you can store, compare, and pass around. No hidden control flow, no try/catch — the check is always visible." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace an error up the stack",
      lead: "Tap each step to watch context get added on the way up, then inspected at the top.",
      stages: [
        { label: "os.Open(path) → *PathError", why: "The syscall returns a typed error carrying Op, Path, and the underlying errno — data, not a thrown exception." },
        { label: "return fmt.Errorf(\"load config: %w\", err)", why: "The caller adds context and wraps with %w, keeping the original *PathError in the chain." },
        { label: "return fmt.Errorf(\"startup: %w\", err)", why: "Each layer wraps again. The message reads top-down: \"startup: load config: open ...: permission denied\"." },
        { label: "errors.Is(err, fs.ErrPermission)", why: "At the top, walk the chain to test the root cause. True — even three wraps deep — because %w preserved it." },
      ],
      takeaway: "Wrap to add context on the way up; unwrap with errors.Is/As to inspect the cause at the top.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put error handling to work",
      lead: "A checklist for the failure paths you'll write this week.",
      checklist: [
        "Add context where you have it and wrap with %w: fmt.Errorf(\"parse %s: %w\", name, err).",
        "Compare with errors.Is, never == — a wrapped sentinel will not match ==.",
        "Need fields off the error? Define a typed error and pull it out with errors.As.",
        "Break the chain on purpose with %v (or a fresh error) when the caller shouldn't see the cause.",
        "Reserve panic for impossible states and programmer bugs; return an error for anything a caller could handle.",
      ],
      codePeek: `var ErrNotFound = errors.New("not found")

func Lookup(id string) (User, error) {
    u, ok := db[id]
    if !ok {
        return User{}, fmt.Errorf("lookup %s: %w", id, ErrNotFound)
    }
    return u, nil
}

_, err := Lookup("x")
fmt.Println(errors.Is(err, ErrNotFound)) // true — even though it's wrapped`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Sentinel error or typed error?",
      lead: "Both signal failure. Slide to see what each gives the caller, then settle the toggle.",
      slider: {
        leftLabel: "Sentinel error",
        rightLabel: "Typed error",
        stops: [
          { at: 0, note: "Sentinel (var ErrFoo = errors.New(...)): one stable value, compared with errors.Is. Zero ceremony when the caller only needs to know which error." },
          { at: 50, note: "The axis is how much the caller needs. Sentinels answer 'which error?'; typed errors also answer 'with what data?' — at the cost of a struct and errors.As." },
          { at: 100, note: "Typed error (a struct with fields): carries the offending path, line, or code so the caller can act on specifics. More to define, but the only option when the error has payload." },
        ],
      },
      toggle: {
        question: "Callers only need to detect 'this key was missing' and nothing more. Reach for…",
        optionA: "a sentinel error",
        optionB: "a typed error struct",
        answer: "A",
        why: "When the only question is 'which error happened?', a sentinel compared with errors.Is is the lightest tool. Promote to a typed error once callers need data from it — a field, a code, a path.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Spot the comparison flaw",
      lead: "Read the two checks, then judge what prints. One of these comparisons is a bug.",
      prompt: "err := fmt.Errorf(\"read: %w\", io.EOF); fmt.Println(err == io.EOF, errors.Is(err, io.EOF))",
      options: [
        {
          text: "true true",
          correct: false,
          reveal: "✗ Tempting — but == compares the wrapper value to io.EOF directly, and the wrapper is a new *fmt.wrapError, not io.EOF itself.",
        },
        {
          text: "false true",
          correct: true,
          reveal: "✓ == fails because err is a wrapper; errors.Is walks the chain and finds io.EOF. Always use errors.Is for wrapped sentinels.",
        },
        {
          text: "false false",
          correct: false,
          reveal: "✗ errors.Is unwraps %w-wrapped errors, so it does find io.EOF. Only the == check fails.",
        },
        {
          text: "true false",
          correct: false,
          reveal: "✗ Backwards: the direct == is the one that fails on a wrapped error; errors.Is is the one that succeeds.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build an inspectable error chain",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "sentinel", label: "Bottom of the chain", options: ["a sentinel ErrNotFound", "a typed NotFoundError{Key}"] },
        { id: "wrap", label: "Each layer", options: ["wraps with %w + context", "returns the error unchanged"] },
        { id: "inspect", label: "Top layer inspects with", options: ["errors.Is", "errors.As", "both"] },
      ],
      specTemplate: "A repository whose store returns {sentinel}, where each layer {wrap}, inspected at the top with {inspect}.",
      buildCard: {
        title: "Inspectable error chain",
        deliverable:
          "A small store → service → handler stack where a missing record produces a sentinel error wrapped with context at each layer; the handler maps it to a 404 with errors.Is, and a typed validation error is extracted with errors.As for a 400.",
        acceptance: [
          "The store returns a sentinel ErrNotFound; the service wraps it with %w and operation context.",
          "The handler uses errors.Is(err, ErrNotFound) to choose a 404 — never ==.",
          "A typed ValidationError carries the bad field and is pulled out with errors.As for a 400.",
          "Table tests assert both the wrapped message and that errors.Is / errors.As find the cause.",
        ],
      },
    },
  ],
};
