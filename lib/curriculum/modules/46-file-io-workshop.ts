import type { WorkshopModule } from "../types";

export const fileIOWorkshop: WorkshopModule = {
  type: "workshop",
  id: "46",
  slug: "file-io-workshop",
  title: "File I/O Workshop",
  icon: "📂",
  estimatedMinutes: 22,
  description: "Practice reading, writing, and streaming files using the os, bufio, and io packages.",
  steps: [
    {
      instruction:
        "Use `os.WriteFile` to write the string `\"Hello, file!\\n\"` to a file called `hello.txt`. Then use `os.ReadFile` to read it back and print the contents.",
      starterCode: `package main

import (
	"fmt"
	"os"
)

func main() {
	// TODO: write "Hello, file!\\n" to hello.txt using os.WriteFile
	// Hint: permission bits 0644 give owner read/write, others read-only

	// TODO: read the file back with os.ReadFile and print the contents
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"os"
)

func main() {
	err := os.WriteFile("hello.txt", []byte("Hello, file!\\n"), 0644)
	if err != nil {
		panic(err)
	}

	data, err := os.ReadFile("hello.txt")
	if err != nil {
		panic(err)
	}
	fmt.Print(string(data))
}
`,
      validate: (code: string) =>
        code.includes("os.WriteFile") &&
        code.includes("os.ReadFile"),
      successMessage:
        "os.WriteFile and os.ReadFile are the simplest whole-file operations — they handle open, read/write, and close in a single call.",
    },
    {
      instruction:
        "Open `hello.txt` for reading with `os.Open`, then use a `bufio.Scanner` to read and print each line. Remember to `defer f.Close()` immediately after opening.",
      starterCode: `package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	// First create the file so we have something to read
	os.WriteFile("hello.txt", []byte("line one\\nline two\\nline three\\n"), 0644)

	// TODO: open hello.txt with os.Open
	// TODO: defer f.Close()
	// TODO: create a bufio.Scanner and print each line with scanner.Scan()
	_ = bufio.NewScanner
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"bufio"
	"fmt"
	"os"
)

func main() {
	os.WriteFile("hello.txt", []byte("line one\\nline two\\nline three\\n"), 0644)

	f, err := os.Open("hello.txt")
	if err != nil {
		panic(err)
	}
	defer f.Close()

	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		fmt.Println(scanner.Text())
	}
}
`,
      validate: (code: string) =>
        code.includes("os.Open") &&
        code.includes("defer") &&
        code.includes("Close()") &&
        code.includes("bufio.NewScanner"),
      successMessage:
        "defer f.Close() immediately after os.Open is idiomatic — it keeps the close visually paired with the open and fires even if the function returns early.",
    },
    {
      instruction:
        "Append two more lines to `hello.txt` using `os.OpenFile` with the `os.O_APPEND|os.O_WRONLY` flags. Then read the file back with `os.ReadFile` and print the full contents.",
      starterCode: `package main

import (
	"fmt"
	"os"
)

func main() {
	// Ensure we start with a file that has content
	os.WriteFile("hello.txt", []byte("original line\\n"), 0644)

	// TODO: open hello.txt in append+write mode using os.OpenFile
	// Flags: os.O_APPEND | os.O_WRONLY, perm: 0644
	// TODO: write "appended line 1\\n" and "appended line 2\\n"
	// TODO: close the file
	// TODO: read the full file with os.ReadFile and print it
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"os"
)

func main() {
	os.WriteFile("hello.txt", []byte("original line\\n"), 0644)

	f, err := os.OpenFile("hello.txt", os.O_APPEND|os.O_WRONLY, 0644)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	f.WriteString("appended line 1\\n")
	f.WriteString("appended line 2\\n")

	data, err := os.ReadFile("hello.txt")
	if err != nil {
		panic(err)
	}
	fmt.Print(string(data))
}
`,
      validate: (code: string) =>
        code.includes("os.OpenFile") &&
        (code.includes("O_APPEND") || code.includes("os.O_APPEND")),
      successMessage:
        "os.O_APPEND ensures each write goes to the end of the file atomically — combine with os.O_WRONLY since you only need to write, not read.",
    },
    {
      instruction:
        "Use `io.Copy` to duplicate `hello.txt` into a new file `copy.txt`. Open the source with `os.Open`, create the destination with `os.Create`, and stream the bytes with `io.Copy(dst, src)`.",
      starterCode: `package main

import (
	"fmt"
	"io"
	"os"
)

func main() {
	os.WriteFile("hello.txt", []byte("copy me!\\n"), 0644)

	// TODO: open hello.txt as source
	// TODO: create copy.txt as destination
	// TODO: use io.Copy to stream from source to destination
	// TODO: read and print copy.txt to verify

	_ = io.Copy
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"fmt"
	"io"
	"os"
)

func main() {
	os.WriteFile("hello.txt", []byte("copy me!\\n"), 0644)

	src, err := os.Open("hello.txt")
	if err != nil {
		panic(err)
	}
	defer src.Close()

	dst, err := os.Create("copy.txt")
	if err != nil {
		panic(err)
	}
	defer dst.Close()

	if _, err := io.Copy(dst, src); err != nil {
		panic(err)
	}

	data, _ := os.ReadFile("copy.txt")
	fmt.Print(string(data))
}
`,
      validate: (code: string) =>
        code.includes("io.Copy") &&
        code.includes("os.Create"),
      successMessage:
        "io.Copy streams data in chunks without loading the whole file into memory — the right tool for large files or any Reader-to-Writer transfer.",
    },
  ],
};
