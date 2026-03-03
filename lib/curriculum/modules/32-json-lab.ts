import type { LabModule } from "../types";

export const jsonLab: LabModule = {
	type: "lab",
	id: "32",
	slug: "json-lab",
	title: "Product Catalog Lab",
	icon: "🗃️",
	estimatedMinutes: 30,
	description:
		"Build a product catalog serializer using encoding/json with struct tags, MarshalIndent, Unmarshal, and a price-filter function.",
	instructions: `## Product Catalog Lab

In this lab you will build a product catalog serializer that marshals structured Go data to JSON, unmarshals it back, and filters products by price.

### Data Types

\`\`\`go
type Product struct {
	ID      string  \`json:"id"\`
	Name    string  \`json:"name"\`
	Price   float64 \`json:"price"\`
	InStock bool    \`json:"in_stock,omitempty"\`
}

type Catalog struct {
	Products []Product \`json:"products"\`
	Version  string    \`json:"version"\`
}
\`\`\`

\`InStock\` uses \`omitempty\` so products that are out of stock (false) are omitted from the JSON output, keeping the payload lean.

### Steps

**1. Create a catalog**

Populate a \`Catalog\` with three products:

| ID | Name | Price | InStock |
|----|------|-------|---------|
| p1 | Widget | 9.99 | true |
| p2 | Gadget | 24.99 | true |
| p3 | Doohickey | 4.99 | false |

Set \`Version\` to \`"1.0"\`.

**2. Marshal to indented JSON and print**

Use \`json.MarshalIndent\` with two-space indentation. Convert the result to a string and print it. The output should contain the \`"products"\` key.

**3. Unmarshal back and print count**

Unmarshal the JSON bytes back into a new \`Catalog\` value. Print the number of products using \`fmt.Printf\`.

**4. Implement FindByPrice**

\`\`\`go
func FindByPrice(catalog Catalog, maxPrice float64) []Product
\`\`\`

Return all products whose \`Price\` is less than or equal to \`maxPrice\`. The function must be pure — no side effects, no modifications to the input catalog.

Call \`FindByPrice\` with a \`maxPrice\` of 10.0 and print each matching product's name.

### Expected output (order may vary for the map iteration)

\`\`\`
{
  "products": [
    ...
  ],
  "version": "1.0"
}
Products: 3
Widget
Doohickey
\`\`\`
`,
	starterCode: `package main

import (
	"encoding/json"
	"fmt"
)

type Product struct {
	ID      string  \`json:"id"\`
	Name    string  \`json:"name"\`
	Price   float64 \`json:"price"\`
	InStock bool    \`json:"in_stock,omitempty"\`
}

type Catalog struct {
	Products []Product \`json:"products"\`
	Version  string    \`json:"version"\`
}

func FindByPrice(catalog Catalog, maxPrice float64) []Product {
	// TODO: return products with Price <= maxPrice
	return nil
}

func main() {
	catalog := Catalog{
		Version: "1.0",
		Products: []Product{
			// TODO: add three products
		},
	}

	// TODO: marshal catalog to indented JSON and print it

	// TODO: unmarshal JSON back into a new Catalog and print product count

	// TODO: call FindByPrice(catalog, 10.0) and print each matching product name
}
`,
	solutionCode: `package main

import (
	"encoding/json"
	"fmt"
)

type Product struct {
	ID      string  \`json:"id"\`
	Name    string  \`json:"name"\`
	Price   float64 \`json:"price"\`
	InStock bool    \`json:"in_stock,omitempty"\`
}

type Catalog struct {
	Products []Product \`json:"products"\`
	Version  string    \`json:"version"\`
}

func FindByPrice(catalog Catalog, maxPrice float64) []Product {
	var result []Product
	for _, p := range catalog.Products {
		if p.Price <= maxPrice {
			result = append(result, p)
		}
	}
	return result
}

func main() {
	catalog := Catalog{
		Version: "1.0",
		Products: []Product{
			{ID: "p1", Name: "Widget", Price: 9.99, InStock: true},
			{ID: "p2", Name: "Gadget", Price: 24.99, InStock: true},
			{ID: "p3", Name: "Doohickey", Price: 4.99},
		},
	}

	data, err := json.MarshalIndent(catalog, "", "  ")
	if err != nil {
		panic(err)
	}
	fmt.Println(string(data))

	var decoded Catalog
	if err := json.Unmarshal(data, &decoded); err != nil {
		panic(err)
	}
	fmt.Printf("Products: %d\\n", len(decoded.Products))

	affordable := FindByPrice(catalog, 10.0)
	for _, p := range affordable {
		fmt.Println(p.Name)
	}
}
`,
	tests: [
		{
			name: "Product type with json tags",
			description: "Define a Product struct with json struct tags.",
			validate: (code: string, _stdout: string) =>
				code.includes("type Product struct") && code.includes('json:"'),
		},
		{
			name: "Catalog type defined",
			description: "Define a Catalog struct that contains a Products slice.",
			validate: (code: string, _stdout: string) =>
				code.includes("type Catalog struct"),
		},
		{
			name: "json.MarshalIndent or json.Marshal used",
			description: "Marshal the catalog to JSON.",
			validate: (code: string, _stdout: string) =>
				code.includes("json.MarshalIndent") || code.includes("json.Marshal"),
		},
		{
			name: 'JSON output contains "products" key',
			description: 'The printed JSON must contain the "products" key.',
			validate: (_code: string, stdout: string) =>
				stdout.includes('"products"') || stdout.includes("products"),
		},
		{
			name: "FindByPrice function implemented",
			description:
				"Implement a FindByPrice function that filters products by maximum price.",
			validate: (code: string, _stdout: string) =>
				code.includes("func FindByPrice") || code.includes("FindByPrice"),
		},
		{
			name: "json.Unmarshal used",
			description: "Unmarshal the JSON back into a Catalog value.",
			validate: (code: string, _stdout: string) =>
				code.includes("json.Unmarshal"),
		},
	],
};
