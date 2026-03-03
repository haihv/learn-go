import type { WorkshopModule } from "../types";

export const jsonWorkshop: WorkshopModule = {
	type: "workshop",
	id: "28",
	slug: "json-workshop",
	title: "JSON Workshop",
	icon: "🔨",
	estimatedMinutes: 20,
	description:
		"Practice marshaling, unmarshaling, and working with JSON in Go.",
	steps: [
		{
			instruction:
				"Define a `Person` struct with fields `Name string \\`json:\"name\"\\``, `Age int \\`json:\"age\"\\``, and `Email string \\`json:\"email\"\\``. Create a Person value and marshal it to JSON. Print the resulting JSON string.",
			starterCode: `package main

import (
	"encoding/json"
	"fmt"
)

// TODO: define Person struct with json tags

func main() {
	// TODO: create a Person, marshal to JSON, and print the string
	fmt.Println("implement Person")
}
`,
			hint: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name  string \`json:"name"\`
	Age   int    \`json:"age"\`
	Email string \`json:"email"\`
}

func main() {
	p := Person{Name: "Alice", Age: 30, Email: "alice@example.com"}
	data, err := json.Marshal(p)
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))
}
`,
			validate: (code: string) =>
				code.includes('json:"name"') && code.includes("json.Marshal"),
			successMessage:
				"Struct tags tell the encoder what key names to use — without them, Go would use the capitalized field names verbatim.",
		},
		{
			instruction:
				"Unmarshal the JSON string `{\"name\":\"Alice\",\"age\":30,\"email\":\"alice@example.com\"}` back into a `Person` struct. Print each field individually to confirm the values were decoded correctly.",
			starterCode: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name  string \`json:"name"\`
	Age   int    \`json:"age"\`
	Email string \`json:"email"\`
}

func main() {
	raw := \`{"name":"Alice","age":30,"email":"alice@example.com"}\`
	// TODO: unmarshal raw into a Person and print its fields
	fmt.Println(raw)
}
`,
			hint: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name  string \`json:"name"\`
	Age   int    \`json:"age"\`
	Email string \`json:"email"\`
}

func main() {
	raw := \`{"name":"Alice","age":30,"email":"alice@example.com"}\`
	var p Person
	if err := json.Unmarshal([]byte(raw), &p); err != nil {
		panic(err)
	}
	fmt.Println(p.Name)
	fmt.Println(p.Age)
	fmt.Println(p.Email)
}
`,
			validate: (code: string) => code.includes("json.Unmarshal"),
			successMessage:
				"Unmarshal reads each JSON key and writes the value into the matching struct field — unknown keys in the JSON are silently ignored.",
		},
		{
			instruction:
				"Add a `Nickname string \\`json:\"nickname,omitempty\"\\`` field to `Person`. Create a Person with an empty Nickname, marshal it, and print the JSON. Observe that the `nickname` key is absent from the output.",
			starterCode: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name     string \`json:"name"\`
	Age      int    \`json:"age"\`
	Email    string \`json:"email"\`
	// TODO: add Nickname field with omitempty tag
}

func main() {
	// TODO: create Person with empty Nickname and print the marshaled JSON
	fmt.Println("implement omitempty")
}
`,
			hint: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name     string \`json:"name"\`
	Age      int    \`json:"age"\`
	Email    string \`json:"email"\`
	Nickname string \`json:"nickname,omitempty"\`
}

func main() {
	p := Person{Name: "Alice", Age: 30, Email: "alice@example.com"}
	data, _ := json.Marshal(p)
	fmt.Println(string(data))
	// nickname key is absent because Nickname is ""
}
`,
			validate: (code: string) => code.includes("omitempty"),
			successMessage:
				"omitempty keeps JSON payloads lean by skipping fields that carry no meaningful information.",
		},
		{
			instruction:
				"Create a `[]Person` slice with 3 different people and marshal the entire slice using `json.MarshalIndent` with two-space indentation. Print the pretty-printed JSON array.",
			starterCode: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name     string \`json:"name"\`
	Age      int    \`json:"age"\`
	Email    string \`json:"email"\`
	Nickname string \`json:"nickname,omitempty"\`
}

func main() {
	// TODO: create []Person with 3 people and print with MarshalIndent
	fmt.Println("implement slice marshal")
}
`,
			hint: `package main

import (
	"encoding/json"
	"fmt"
)

type Person struct {
	Name     string \`json:"name"\`
	Age      int    \`json:"age"\`
	Email    string \`json:"email"\`
	Nickname string \`json:"nickname,omitempty"\`
}

func main() {
	people := []Person{
		{Name: "Alice", Age: 30, Email: "alice@example.com"},
		{Name: "Bob", Age: 25, Email: "bob@example.com", Nickname: "Bobby"},
		{Name: "Carol", Age: 35, Email: "carol@example.com"},
	}
	data, _ := json.MarshalIndent(people, "", "  ")
	fmt.Println(string(data))
}
`,
			validate: (code: string) =>
				code.includes("json.MarshalIndent") && code.includes("[]Person"),
			successMessage:
				"MarshalIndent adds newlines and indentation — use it for logs and debugging, but prefer compact Marshal for network payloads.",
		},
		{
			instruction:
				'Unmarshal the JSON `{"name":"Bob","age":25,"extra":"ignored"}` into a `map[string]any`. Iterate over the map and print each key-value pair. Notice that the unknown `extra` field is captured without needing a struct.',
			starterCode: `package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	raw := \`{"name":"Bob","age":25,"extra":"ignored"}\`
	// TODO: unmarshal into map[string]any and print each key-value pair
	fmt.Println(raw)
}
`,
			hint: `package main

import (
	"encoding/json"
	"fmt"
)

func main() {
	raw := \`{"name":"Bob","age":25,"extra":"ignored"}\`
	var m map[string]any
	if err := json.Unmarshal([]byte(raw), &m); err != nil {
		panic(err)
	}
	for k, v := range m {
		fmt.Printf("%s: %v\\n", k, v)
	}
}
`,
			validate: (code: string) =>
				code.includes("map[string]any") && code.includes("json.Unmarshal"),
			successMessage:
				"map[string]any is the escape hatch for dynamic or unknown JSON shapes — useful for forwarding or inspecting data without defining a struct.",
		},
	],
};
