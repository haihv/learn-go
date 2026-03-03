import type { LessonModule } from "../types";

export const jsonEncoding: LessonModule = {
	type: "lesson",
	id: "30",
	slug: "json-encoding",
	title: "JSON Encoding",
	icon: "📋",
	estimatedMinutes: 14,
	content: `# JSON Encoding

## encoding/json — No Third Party Needed

Go's standard library includes a complete JSON implementation in the \`encoding/json\` package. You do not need any external dependency to marshal structs to JSON or unmarshal JSON into Go types.

## Struct Tags

Struct tags are string literals in backticks that annotate fields with metadata. The \`encoding/json\` package reads the \`json\` key to control serialization:

\`\`\`go
type User struct {
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
	Age   int    \`json:"age"\`
}
\`\`\`

The tag maps the exported Go field name to the lowercase JSON key. Without a tag, Go uses the field name as-is, so \`Name\` would appear as \`"Name"\` in JSON.

**\`omitempty\`** — omits the field when its value is the zero value for its type (empty string, 0, false, nil):

\`\`\`go
type Profile struct {
	Username string \`json:"username"\`
	Bio      string \`json:"bio,omitempty"\`   // omitted when ""
	Score    int    \`json:"score,omitempty"\`  // omitted when 0
}
\`\`\`

**\`"-"\`** — always excludes the field from JSON, even if it has a value:

\`\`\`go
type Secret struct {
	Name     string \`json:"name"\`
	Password string \`json:"-"\` // never appears in JSON output
}
\`\`\`

## Marshaling: Go → JSON

\`json.Marshal\` converts a Go value to a JSON byte slice:

\`\`\`go
package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
	Age   int    \`json:"age"\`
}

func main() {
	u := User{Name: "Alice", Email: "alice@example.com", Age: 30}
	data, err := json.Marshal(u)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))
	// {"name":"Alice","email":"alice@example.com","age":30}
}
\`\`\`

For human-readable output, use \`json.MarshalIndent\`:

\`\`\`go
data, err := json.MarshalIndent(u, "", "  ")
fmt.Println(string(data))
// {
//   "name": "Alice",
//   "email": "alice@example.com",
//   "age": 30
// }
\`\`\`

**Unexported fields are silently omitted** — \`json.Marshal\` can only see exported (capitalized) fields.

## Unmarshaling: JSON → Go

\`json.Unmarshal\` parses a JSON byte slice into a Go value. Pass a pointer so the function can populate the struct:

\`\`\`go
package main

import (
	"encoding/json"
	"fmt"
)

type User struct {
	Name  string \`json:"name"\`
	Email string \`json:"email"\`
	Age   int    \`json:"age"\`
}

func main() {
	raw := \`{"name":"Bob","email":"bob@example.com","age":25}\`
	var u User
	if err := json.Unmarshal([]byte(raw), &u); err != nil {
		panic(err)
	}
	fmt.Println(u.Name, u.Age) // Bob 25
}
\`\`\`

Unknown JSON fields are silently ignored by default — the \`"extra"\` key in the JSON will not cause an error.

## Nested Structs and Slices

Struct fields can themselves be structs or slices — the JSON encoder handles nesting automatically:

\`\`\`go
package main

import (
	"encoding/json"
	"fmt"
)

type Address struct {
	City    string \`json:"city"\`
	Country string \`json:"country"\`
}

type Person struct {
	Name    string  \`json:"name"\`
	Address Address \`json:"address"\`
	Tags    []string \`json:"tags"\`
}

func main() {
	p := Person{
		Name:    "Carol",
		Address: Address{City: "Tokyo", Country: "Japan"},
		Tags:    []string{"developer", "gopher"},
	}
	data, _ := json.MarshalIndent(p, "", "  ")
	fmt.Println(string(data))
}
\`\`\`

## Embedded Structs

When a struct is embedded (without a field name), its fields are promoted to the top-level JSON object:

\`\`\`go
type Timestamps struct {
	CreatedAt string \`json:"created_at"\`
	UpdatedAt string \`json:"updated_at"\`
}

type Article struct {
	Timestamps               // promoted — no extra nesting in JSON
	Title string \`json:"title"\`
}
\`\`\`

Marshaling an \`Article\` produces \`{"created_at":...,"updated_at":...,"title":...}\` — the \`Timestamps\` fields appear at the top level.

## Streaming I/O with Encoder and Decoder

When reading from or writing to a network connection or file, avoid buffering the entire JSON in memory. Use \`json.NewEncoder\` and \`json.NewDecoder\` instead:

\`\`\`go
package main

import (
	"encoding/json"
	"os"
)

type Item struct {
	ID   int    \`json:"id"\`
	Name string \`json:"name"\`
}

func main() {
	// write JSON directly to stdout — no intermediate []byte
	enc := json.NewEncoder(os.Stdout)
	enc.SetIndent("", "  ")
	enc.Encode(Item{ID: 1, Name: "Widget"})
}
\`\`\`

\`json.NewEncoder(w).Encode(v)\` is idiomatic in HTTP handlers that write JSON responses to \`http.ResponseWriter\`.

## Dynamic JSON with map[string]any

When the JSON structure is unknown at compile time, unmarshal into \`map[string]any\`:

\`\`\`go
package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	raw := \`{"name":"Dave","score":99,"active":true}\`
	var m map[string]any
	json.Unmarshal([]byte(raw), &m)
	for k, v := range m {
		fmt.Printf("%s: %v (%T)\\n", k, v, v)
	}
}
\`\`\`

JSON numbers decode as \`float64\` by default. Use \`json.Decoder\` with \`UseNumber()\` if you need to distinguish integers from floats.
`,
	quiz: [
		{
			question:
				"What struct tag makes a JSON field optional (omitted when zero value)?",
			options: [
				'`json:"field,optional"`',
				'`json:"field,omitempty"`',
				'`json:"field,nullable"`',
				'`json:"field,zero"`',
			],
			correctIndex: 1,
		},
		{
			question:
				"What happens to unexported struct fields during json.Marshal?",
			options: [
				"They cause a compile error",
				"They are included with their field name",
				"They are silently omitted",
				"They trigger a runtime panic",
			],
			correctIndex: 2,
		},
		{
			question: "Which function is best for streaming JSON to an io.Writer?",
			options: [
				"json.Marshal + fmt.Fprintf",
				"json.NewEncoder(w).Encode(v)",
				"json.Sprintf",
				"json.Write(w, v)",
			],
			correctIndex: 1,
		},
	],
};
