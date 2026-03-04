import type { WorkshopModule } from "../types";

export const regexpWorkshop: WorkshopModule = {
  type: "workshop",
  id: "83",
  slug: "regexp-workshop",
  title: "regexp Workshop",
  icon: "🔎",
  estimatedMinutes: 20,
  description:
    "Compile patterns, extract capture groups, use named groups, and replace with functions.",
  steps: [
    {
      instruction:
        "Compile the pattern `\\d+` with `regexp.MustCompile`. Use `MatchString` to check if `\"order 42\"` contains digits. Then use `FindAllString` with -1 to extract all numbers from `\"buy 3 apples and 12 oranges\"`. Print both results.",
      starterCode: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(\`\\d+\`)

	// TODO: re.MatchString("order 42") and print result
	// TODO: re.FindAllString("buy 3 apples and 12 oranges", -1) and print result
	_ = re
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(\`\\d+\`)

	fmt.Println(re.MatchString("order 42"))
	fmt.Println(re.FindAllString("buy 3 apples and 12 oranges", -1))
}
`,
      validate: (code: string) =>
        code.includes("regexp.MustCompile") &&
        code.includes("MatchString") &&
        code.includes("FindAllString"),
      successMessage:
        "FindAllString with -1 returns all non-overlapping matches. Pass a positive integer to limit the number of matches returned.",
    },
    {
      instruction:
        "Parse a log line `\"2024-01-15 ERROR database connection failed\"` using a pattern with three capture groups: date (`\\d{4}-\\d{2}-\\d{2}`), level (`\\w+`), and message (`.+`). Print each captured group by index.",
      starterCode: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	line := "2024-01-15 ERROR database connection failed"
	re := regexp.MustCompile(\`(\\d{4}-\\d{2}-\\d{2}) (\\w+) (.+)\`)

	// TODO: re.FindStringSubmatch(line)
	// TODO: print match[1] (date), match[2] (level), match[3] (message)
	_ = re
	_ = fmt.Println
	_ = line
}
`,
      hint: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	line := "2024-01-15 ERROR database connection failed"
	re := regexp.MustCompile(\`(\\d{4}-\\d{2}-\\d{2}) (\\w+) (.+)\`)

	match := re.FindStringSubmatch(line)
	if len(match) > 0 {
		fmt.Println("date:", match[1])
		fmt.Println("level:", match[2])
		fmt.Println("message:", match[3])
	}
}
`,
      validate: (code: string) =>
        code.includes("FindStringSubmatch") &&
        code.includes("match[1]") &&
        code.includes("match[2]"),
      successMessage:
        "match[0] is always the full match. Capture groups start at index 1. Check len(match) > 0 before indexing to handle lines that don't match.",
    },
    {
      instruction:
        "Use named groups `(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})` to parse a date string `\"2024-01-15\"`. Build a `map[string]string` from group names to matched values using `re.SubexpNames()`. Print the map.",
      starterCode: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(\`(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})\`)
	match := re.FindStringSubmatch("2024-01-15")

	result := map[string]string{}
	// TODO: iterate re.SubexpNames() with index and name
	// skip empty names (index 0 is the full match with name "")
	// result[name] = match[i]

	fmt.Println(result)
}
`,
      hint: `package main

import (
	"fmt"
	"regexp"
)

func main() {
	re := regexp.MustCompile(\`(?P<year>\\d{4})-(?P<month>\\d{2})-(?P<day>\\d{2})\`)
	match := re.FindStringSubmatch("2024-01-15")

	result := map[string]string{}
	for i, name := range re.SubexpNames() {
		if name != "" && i < len(match) {
			result[name] = match[i]
		}
	}

	fmt.Println(result)
}
`,
      validate: (code: string) =>
        code.includes("SubexpNames") && code.includes("(?P<"),
      successMessage:
        "Named groups make patterns self-documenting and let you extract fields by name rather than counting parentheses. SubexpNames returns the group names in order, parallel to the FindStringSubmatch result.",
    },
    {
      instruction:
        "Use `ReplaceAllStringFunc` to double every number in the string `\"buy 3 apples and 12 oranges\"`. The replacement function should parse the matched string with `strconv.Atoi`, multiply by 2, and return `strconv.Itoa` of the result. Print the output.",
      starterCode: `package main

import (
	"fmt"
	"regexp"
	"strconv"
)

func main() {
	re := regexp.MustCompile(\`\\d+\`)
	input := "buy 3 apples and 12 oranges"

	// TODO: re.ReplaceAllStringFunc(input, func(s string) string { ... })
	// TODO: parse s with strconv.Atoi, multiply by 2, return strconv.Itoa
	// TODO: print result
	_ = re
	_ = strconv.Atoi
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"regexp"
	"strconv"
)

func main() {
	re := regexp.MustCompile(\`\\d+\`)
	input := "buy 3 apples and 12 oranges"

	result := re.ReplaceAllStringFunc(input, func(s string) string {
		n, _ := strconv.Atoi(s)
		return strconv.Itoa(n * 2)
	})

	fmt.Println(result)
}
`,
      validate: (code: string) =>
        code.includes("ReplaceAllStringFunc") &&
        code.includes("strconv.Atoi") &&
        code.includes("strconv.Itoa"),
      successMessage:
        "ReplaceAllStringFunc is powerful for transformations where the replacement depends on the matched content — redacting PII, normalising formats, or performing arithmetic on matched numbers.",
    },
  ],
};
