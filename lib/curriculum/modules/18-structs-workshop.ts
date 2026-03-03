import type { WorkshopModule } from "../types";

export const structsWorkshop: WorkshopModule = {
  type: "workshop",
  id: "18",
  slug: "structs-workshop",
  title: "Structs Workshop",
  icon: "🏦",
  estimatedMinutes: 25,
  description: "Build a BankAccount struct with methods for deposits, withdrawals, and transfers.",
  steps: [
    {
      instruction:
        "Define a `BankAccount` struct with two fields: `Owner string` and `Balance float64`. In `main`, create a BankAccount and print both fields.",
      starterCode: `package main

import "fmt"

// TODO: define BankAccount struct here

func main() {
	// TODO: create a BankAccount and print its fields
	fmt.Println("implement BankAccount")
}
`,
      hint: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	fmt.Println(acc.Owner, acc.Balance)
}
`,
      validate: (code: string) =>
        code.includes("BankAccount") &&
        code.includes("Owner") &&
        code.includes("Balance"),
      successMessage:
        "Structs group related fields together — the dot operator accesses each field by name.",
    },
    {
      instruction:
        "Add a pointer receiver method `Deposit(amount float64)` on `*BankAccount` that adds `amount` to `Balance`. In `main`, call `Deposit(100)` and print the updated Balance.",
      starterCode: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

// TODO: add Deposit method here

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	// TODO: call Deposit(100) and print acc.Balance
	fmt.Println(acc.Balance)
}
`,
      hint: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	acc.Deposit(100)
	fmt.Println(acc.Balance)
}
`,
      validate: (code: string) =>
        code.includes("func (") &&
        code.includes("Deposit") &&
        code.includes("Balance +="),
      successMessage:
        "Pointer receivers modify the original value — value receivers would operate on a copy and leave Balance unchanged.",
    },
    {
      instruction:
        "Add a pointer receiver method `Withdraw(amount float64) bool` on `*BankAccount`. It should return `false` without changing Balance if `amount` exceeds Balance. Otherwise deduct `amount` and return `true`.",
      starterCode: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

// TODO: add Withdraw method here

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	acc.Deposit(100)
	ok := acc.Withdraw(40)
	fmt.Println(ok, acc.Balance) // true 60
	ok = acc.Withdraw(200)
	fmt.Println(ok, acc.Balance) // false 60
}
`,
      hint: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

func (a *BankAccount) Withdraw(amount float64) bool {
	if amount > a.Balance {
		return false
	}
	a.Balance -= amount
	return true
}

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	acc.Deposit(100)
	ok := acc.Withdraw(40)
	fmt.Println(ok, acc.Balance)
	ok = acc.Withdraw(200)
	fmt.Println(ok, acc.Balance)
}
`,
      validate: (code: string) =>
        code.includes("func (") &&
        code.includes("Withdraw") &&
        code.includes("bool"),
      successMessage:
        "Returning a boolean sentinel instead of panicking keeps the caller in control of error handling.",
    },
    {
      instruction:
        "Implement the `fmt.Stringer` interface by adding a `String() string` method on `BankAccount` (value receiver is fine). It should return a string in the format `\"Owner: X, Balance: $Y.YY\"`. Print the account to verify.",
      starterCode: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

func (a *BankAccount) Withdraw(amount float64) bool {
	if amount > a.Balance {
		return false
	}
	a.Balance -= amount
	return true
}

// TODO: add String() method so fmt.Println prints nicely

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	acc.Deposit(100)
	acc.Withdraw(40)
	fmt.Println(acc)
}
`,
      hint: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

func (a *BankAccount) Withdraw(amount float64) bool {
	if amount > a.Balance {
		return false
	}
	a.Balance -= amount
	return true
}

func (a BankAccount) String() string {
	return fmt.Sprintf("Owner: %s, Balance: $%.2f", a.Owner, a.Balance)
}

func main() {
	acc := BankAccount{Owner: "Alice", Balance: 0}
	acc.Deposit(100)
	acc.Withdraw(40)
	fmt.Println(acc)
}
`,
      validate: (code: string) =>
        code.includes("func (") &&
        code.includes("String()") &&
        code.includes("string"),
      successMessage:
        "Implementing fmt.Stringer lets fmt.Println call your String() method automatically for clean output.",
    },
    {
      instruction:
        "Write a top-level function `Transfer(from, to *BankAccount, amount float64) bool` that calls `from.Withdraw(amount)` and, only if it succeeds, calls `to.Deposit(amount)` and returns `true`. Otherwise return `false`. Test it in main.",
      starterCode: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

func (a *BankAccount) Withdraw(amount float64) bool {
	if amount > a.Balance {
		return false
	}
	a.Balance -= amount
	return true
}

func (a BankAccount) String() string {
	return fmt.Sprintf("Owner: %s, Balance: $%.2f", a.Owner, a.Balance)
}

// TODO: write Transfer function here

func main() {
	alice := &BankAccount{Owner: "Alice", Balance: 200}
	bob := &BankAccount{Owner: "Bob", Balance: 50}
	ok := Transfer(alice, bob, 75)
	fmt.Println(ok)    // true
	fmt.Println(alice) // Owner: Alice, Balance: $125.00
	fmt.Println(bob)   // Owner: Bob, Balance: $125.00
}
`,
      hint: `package main

import "fmt"

type BankAccount struct {
	Owner   string
	Balance float64
}

func (a *BankAccount) Deposit(amount float64) {
	a.Balance += amount
}

func (a *BankAccount) Withdraw(amount float64) bool {
	if amount > a.Balance {
		return false
	}
	a.Balance -= amount
	return true
}

func (a BankAccount) String() string {
	return fmt.Sprintf("Owner: %s, Balance: $%.2f", a.Owner, a.Balance)
}

func Transfer(from, to *BankAccount, amount float64) bool {
	if !from.Withdraw(amount) {
		return false
	}
	to.Deposit(amount)
	return true
}

func main() {
	alice := &BankAccount{Owner: "Alice", Balance: 200}
	bob := &BankAccount{Owner: "Bob", Balance: 50}
	ok := Transfer(alice, bob, 75)
	fmt.Println(ok)
	fmt.Println(alice)
	fmt.Println(bob)
}
`,
      validate: (code: string) =>
        code.includes("func Transfer") &&
        code.includes("*BankAccount"),
      successMessage:
        "A free function that accepts pointers lets you transfer between any two accounts without coupling the logic to either struct.",
    },
  ],
};
