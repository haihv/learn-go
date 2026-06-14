import type { Stem } from "./types";

export const interfacesStem: Stem = {
  id: "S2",
  slug: "stem-interfaces",
  domainId: "interfaces",
  title: "Interfaces & Composition",
  icon: "🧩",
  oneLiner:
    "An interface is a set of method signatures; any type with those methods satisfies it — no 'implements' keyword, ever.",
  estimatedMinutes: 35,
  levels: [
    {
      level: 1,
      verb: "recall",
      title: "Recall the interface vocabulary",
      lead: "Ten words that turn interfaces from 'Go's abstract classes' into the composition tool they actually are.",
      terms: [
        { term: "interface", reveal: "A set of method signatures. A variable of interface type can hold any concrete type that has those methods." },
        { term: "implicit satisfaction", reveal: "A type satisfies an interface just by having its methods — there is no 'implements' keyword. Satisfaction is structural." },
        { term: "any (interface{})", reveal: "The empty interface has zero methods, so every type satisfies it. Powerful but information-free — keep it at the edges." },
        { term: "method set", reveal: "The methods callable on a type. T's set has its value-receiver methods; *T's set has both value- and pointer-receiver methods." },
        { term: "interface value", reveal: "A two-word pair: a dynamic type and a value. A nil interface has neither — which is why a typed nil pointer is not a nil interface." },
        { term: "type assertion", reveal: "v, ok := x.(T) pulls the concrete type back out of an interface — the comma-ok form never panics." },
        { term: "type switch", reveal: "switch v := x.(type) branches on the dynamic type currently stored in an interface value." },
        { term: "embedding", reveal: "Putting one type inside another to promote its methods or fields. Composition, not inheritance — the embedded type doesn't know it's embedded." },
        { term: "accept interfaces, return structs", reveal: "Take the smallest interface you need as a parameter; return concrete types so callers keep full information." },
        { term: "io.Reader / io.Writer", reveal: "The canonical small interfaces — one method each (Read, Write). Half the standard library composes around them." },
      ],
    },
    {
      level: 2,
      verb: "explain",
      title: "Trace a call through an interface",
      lead: "Tap each step to see how an interface value carries its type and dispatches a call.",
      stages: [
        { label: "var w io.Writer", why: "Declares an interface variable. Its zero value is nil — no dynamic type, no value." },
        { label: "w = os.Stdout", why: "Stores (type=*os.File, value=the file). *os.File satisfies io.Writer because it has a Write method — no declaration needed." },
        { label: "w.Write(p)", why: "Go looks up Write on the stored dynamic type and calls it. Dynamic dispatch, resolved at runtime." },
        { label: "w = &bytes.Buffer{}", why: "Reassign to a different concrete type. The same w now writes to memory; the calling code never changes." },
      ],
      takeaway: "An interface value carries its concrete type with it; the method is resolved on that type at runtime.",
    },
    {
      level: 3,
      verb: "use",
      title: "Put interfaces to work",
      lead: "A checklist for designing seams you'll actually want to test and extend this week.",
      checklist: [
        "Define interfaces in the package that consumes them, not where the concrete type lives. Keep them one or two methods wide.",
        "Accept the narrowest interface a function needs (io.Reader, not *os.File) so any source works and tests can pass a fake.",
        "Probe for optional behavior with a type assertion: if c, ok := w.(io.Closer); ok { c.Close() }.",
        "Compose interfaces by embedding: io.ReadWriter is literally { io.Reader; io.Writer }.",
        "Return concrete types, not interfaces — returning an interface hides fields and methods the caller may need.",
      ],
      codePeek: `// Accept the smallest interface; any io.Reader works — file, socket, or test string.
func CountBytes(r io.Reader) (int64, error) {
    return io.Copy(io.Discard, r)
}

n, _ := CountBytes(strings.NewReader("hi")) // a fake source, no file needed
fmt.Println(n)                              // 2`,
    },
    {
      level: 4,
      verb: "compare",
      title: "Narrow interface or wide one?",
      lead: "Width is a real cost. Slide to feel it, then settle the toggle.",
      slider: {
        leftLabel: "One-method interface",
        rightLabel: "Fat interface",
        stops: [
          { at: 0, note: "A one-method interface (io.Writer) is trivial to implement and to fake. Almost anything can satisfy it, so it composes everywhere." },
          { at: 50, note: "Each method you add narrows the set of types that qualify and lengthens every test fake. Width buys expressiveness with implementability." },
          { at: 100, note: "A dozen-method interface mirroring one struct is that struct in disguise — only one type implements it and every fake is a chore. A sign the abstraction is wrong." },
        ],
      },
      toggle: {
        question: "You need to unit-test a function that currently takes *sql.DB. The cleanest seam is to…",
        optionA: "define a 1–2 method interface for just what it calls",
        optionB: "implement a full *sql.DB-shaped interface",
        answer: "A",
        why: "Depend on behavior, not whole types. Extract the one or two methods the function actually calls into a small interface it accepts; the real *sql.DB satisfies it for free and the test fake is a few lines.",
      },
    },
    {
      level: 5,
      verb: "judge",
      title: "Bust the typed-nil myth",
      lead: "Read the snippet, then judge the print. This one bites experienced Go programmers.",
      prompt: "type E struct{}; func (e *E) Error() string { return \"x\" }; func do() error { var e *E = nil; return e }; fmt.Println(do() == nil)",
      options: [
        {
          text: "true",
          correct: false,
          reveal: "✗ The tempting answer: you returned a nil pointer, so surely it's nil? But it's returned through an interface, which now holds (type=*E, value=nil).",
        },
        {
          text: "false",
          correct: true,
          reveal: "✓ A typed nil pointer returned through an interface is a non-nil interface — it carries the type *E. Return a literal nil instead, or don't pre-type the variable.",
        },
        {
          text: "panic: nil dereference",
          correct: false,
          reveal: "✗ Nothing dereferences e and Error() is never called. The surprise is purely in the == comparison.",
        },
        {
          text: "compile error",
          correct: false,
          reveal: "✗ It compiles — *E satisfies error, so returning e is legal. That legality is what makes the trap so easy to hit.",
        },
      ],
    },
    {
      level: 6,
      verb: "build",
      title: "Build a pluggable Notifier",
      lead: "Compose your spec, then commit to the build card.",
      choices: [
        { id: "iface", label: "Interface width", options: ["one method: Notify(ctx, msg)", "Notify + Name"] },
        { id: "impls", label: "Real implementations", options: ["email + SMS", "email + SMS + Slack"] },
        { id: "test", label: "For tests, add a", options: ["fake that records calls", "fake that can return errors", "both"] },
      ],
      specTemplate: "A Notifier interface ({iface}) with {impls} implementations, plus a {test}.",
      buildCard: {
        title: "Pluggable Notifier",
        deliverable:
          "A Notifier interface with a single Notify(ctx, message) error method, satisfied by an email sender and an SMS sender chosen at runtime, with a recording fake used to test the calling code.",
        acceptance: [
          "Notifier is defined in the consumer package and is one method wide.",
          "Email and SMS types satisfy it implicitly — the word 'implements' appears nowhere.",
          "The caller depends only on Notifier, never on a concrete sender.",
          "A fake Notifier records messages so a test asserts what would have been sent, with no real I/O.",
        ],
      },
    },
  ],
};
