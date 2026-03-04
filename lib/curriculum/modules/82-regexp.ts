import type { LessonModule } from "../types";

export const regexpModule: LessonModule = {
  type: "lesson",
  id: "82",
  slug: "regexp",
  title: "Regular Expressions",
  icon: "🔎",
  estimatedMinutes: 13,
  content: `## Regular Expressions

Go's \`regexp\` package provides RE2-syntax regular expressions — compiled patterns that match strings, extract groups, and perform substitutions.

### Compiling a pattern

Always compile patterns at package level with \`regexp.MustCompile\` — panics at startup if the pattern is invalid, which is the right trade-off for a literal pattern:

\`\`\`go
var emailRe = regexp.MustCompile(\`^[a-zA-Z0-9._%+\\-]+@[a-zA-Z0-9.\\-]+\\.[a-zA-Z]{2,}$\`)
\`\`\`

Use \`regexp.Compile\` (returns error) when the pattern comes from user input:

\`\`\`go
re, err := regexp.Compile(userPattern)
if err != nil {
    return fmt.Errorf("invalid pattern: %w", err)
}
\`\`\`

Compiled \`*regexp.Regexp\` values are safe for concurrent use.

### Matching

\`\`\`go
re := regexp.MustCompile(\`\\d{3}-\\d{4}\`)

re.MatchString("555-1234")     // true
re.MatchString("hello")        // false
\`\`\`

### Finding matches

\`\`\`go
re := regexp.MustCompile(\`\\d+\`)

re.FindString("order 42 qty 7")         // "42" — first match
re.FindAllString("order 42 qty 7", -1)  // ["42", "7"] — all matches (-1 = unlimited)
re.FindStringIndex("order 42")          // [6 8] — byte offsets of first match
\`\`\`

### Capture groups

\`\`\`go
re := regexp.MustCompile(\`(\\w+)@(\\w+)\\.(\\w+)\`)
match := re.FindStringSubmatch("user@example.com")
// match[0] = "user@example.com" (whole match)
// match[1] = "user"   (group 1)
// match[2] = "example" (group 2)
// match[3] = "com"    (group 3)
\`\`\`

\`FindAllStringSubmatch\` returns all matches, each as a \`[]string\`.

### Named groups

\`\`\`go
re := regexp.MustCompile(\`(?P<user>\\w+)@(?P<domain>[\\w.]+)\`)
match := re.FindStringSubmatch("alice@example.com")

// map group name to its index
names := re.SubexpNames()
result := map[string]string{}
for i, name := range names {
    if name != "" && i < len(match) {
        result[name] = match[i]
    }
}
// result["user"] = "alice", result["domain"] = "example.com"
\`\`\`

### Replace

\`\`\`go
re := regexp.MustCompile(\`\\b\\d+\\b\`)

// replace all numbers with "N"
out := re.ReplaceAllString("buy 3 apples and 12 oranges", "N")
// "buy N apples and N oranges"

// replace with a function
out = re.ReplaceAllStringFunc("buy 3 apples", func(s string) string {
    n, _ := strconv.Atoi(s)
    return strconv.Itoa(n * 2)
})
// "buy 6 apples"
\`\`\`

### Split

\`\`\`go
re := regexp.MustCompile(\`\\s+\`)
parts := re.Split("one  two\\tthree", -1)
// ["one", "two", "three"]
\`\`\`

### Performance tips

- **Compile once, reuse**: \`*regexp.Regexp\` is goroutine-safe after compilation. Never compile inside a loop or hot path.
- **Use \`strings\` for simple cases**: \`strings.Contains\`, \`strings.HasPrefix\`, \`strings.TrimSpace\` are 10–100× faster than regex for fixed strings.
- **POSIX vs RE2**: Go's \`regexp\` package uses RE2 syntax (no lookaheads/lookbehinds) — all matches run in linear time, preventing catastrophic backtracking.
`,
  quiz: [
    {
      question:
        "When should you use regexp.MustCompile instead of regexp.Compile?",
      options: [
        "Always — MustCompile is faster at runtime",
        "For literal patterns embedded in source code — it panics at startup if invalid, catching mistakes immediately; use Compile when the pattern comes from user input",
        "MustCompile is for multi-line patterns; Compile is for single-line",
        "They are identical — MustCompile just wraps Compile",
      ],
      correctIndex: 1,
    },
    {
      question:
        "What does FindStringSubmatch return for a pattern with capture groups?",
      options: [
        "Only the captured groups, excluding the full match",
        "A []string where index 0 is the full match and subsequent indices are the captured groups in order",
        "A map from group name to matched string",
        "A [][]string with one entry per capture group",
      ],
      correctIndex: 1,
    },
    {
      question:
        "Why does Go's regexp package not support lookaheads or lookbehinds?",
      options: [
        "They were accidentally omitted in the standard library",
        "Go uses the RE2 engine which guarantees linear-time matching — lookaheads can cause exponential backtracking which RE2 avoids",
        "Lookaheads are only available in the x/regexp package",
        "They are supported via the (?= ) syntax",
      ],
      correctIndex: 1,
    },
  ],
};
