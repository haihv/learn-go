import type { LabModule } from "../types";

export const databaseSQLLab: LabModule = {
  type: "lab",
  id: "60",
  slug: "database-sql-lab",
  title: "Task Store Lab",
  icon: "🗄️",
  estimatedMinutes: 35,
  description: "Build a task store using database/sql with a minimal in-memory mock driver.",
  instructions: `## Task Store Lab

Build a simple **task store** backed by \`database/sql\`. A minimal mock driver is provided in the starter code so your solution runs in the Go Playground without a real database.

### What to implement

1. **\`createTable(db *sql.DB)\`** — execute a \`CREATE TABLE IF NOT EXISTS\` statement for the \`tasks\` table:
   \`\`\`sql
   CREATE TABLE IF NOT EXISTS tasks (
       id    INTEGER PRIMARY KEY,
       title TEXT NOT NULL,
       done  INTEGER NOT NULL DEFAULT 0
   )
   \`\`\`

2. **\`insertTask(db *sql.DB, title string) int64\`** — insert a new task with the given title (done=0). Return the ID from \`result.LastInsertId()\`.

3. **\`listTasks(db *sql.DB) []Task\`** — query all rows, iterate with \`rows.Next()\`, scan each into a \`Task\`, and return the slice. Use \`defer rows.Close()\`.

4. **\`markDone(db *sql.DB, id int64)\`** — update the task's \`done\` column to 1.

### Task struct

\`\`\`go
type Task struct {
    ID    int64
    Title string
    Done  bool
}
\`\`\`

### main()

The \`main\` function should:
1. Open the mock DB with \`sql.Open("mock", "mock://")\`
2. Call \`createTable\`
3. Insert two tasks: \`"Buy groceries"\` and \`"Write tests"\`
4. List all tasks and print each one
5. Mark the first task done
6. List again and print updated results

### Expected output (approximate)

\`\`\`
1 Buy groceries false
2 Write tests false
1 Buy groceries true
2 Write tests false
\`\`\`

> The mock driver returns deterministic results — see the starter code. Your SQL strings are validated by pattern matching; the mock driver accepts any query.
`,
  starterCode: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

// ── Mock driver (do not modify) ────────────────────────────────────────────

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver  struct{}
type mockConn    struct{}
type mockStmt    struct{ q string }
type mockResult  struct{ id int64 }
type mockRows    struct {
	rows [][]driver.Value
	pos  int
}
type mockTx struct{}

var taskStore = [][]driver.Value{
	{int64(1), "Buy groceries", int64(0)},
	{int64(2), "Write tests",   int64(0)},
}
var nextID int64 = 3

func (d *mockDriver) Open(_ string) (driver.Conn, error) { return &mockConn{}, nil }
func (c *mockConn) Prepare(q string) (driver.Stmt, error) { return &mockStmt{q: q}, nil }
func (c *mockConn) Close() error                          { return nil }
func (c *mockConn) Begin() (driver.Tx, error)             { return &mockTx{}, nil }
func (s *mockStmt) Close() error                          { return nil }
func (s *mockStmt) NumInput() int                         { return -1 }
func (s *mockStmt) Exec(args []driver.Value) (driver.Result, error) {
	id := nextID
	nextID++
	if len(args) >= 1 {
		if title, ok := args[0].(string); ok {
			taskStore = append(taskStore, []driver.Value{id, title, int64(0)})
			return &mockResult{id: id}, nil
		}
		if idArg, ok := args[0].(int64); ok {
			for i, row := range taskStore {
				if row[0].(int64) == idArg {
					taskStore[i][2] = int64(1)
				}
			}
		}
	}
	return &mockResult{id: id}, nil
}
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error) {
	rows := make([][]driver.Value, len(taskStore))
	copy(rows, taskStore)
	return &mockRows{rows: rows}, nil
}
func (r *mockResult) LastInsertId() (int64, error) { return r.id, nil }
func (r *mockResult) RowsAffected() (int64, error) { return 1, nil }
func (r *mockRows) Columns() []string              { return []string{"id", "title", "done"} }
func (r *mockRows) Close() error                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.pos >= len(r.rows) { return io.EOF }
	copy(dest, r.rows[r.pos]); r.pos++; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

// ── Your code below ────────────────────────────────────────────────────────

type Task struct {
	ID    int64
	Title string
	Done  bool
}

func createTable(db *sql.DB) {
	// TODO: db.Exec("CREATE TABLE IF NOT EXISTS tasks (...)")
}

func insertTask(db *sql.DB, title string) int64 {
	// TODO: use a prepared statement to INSERT a task; return LastInsertId
	return 0
}

func listTasks(db *sql.DB) []Task {
	// TODO: db.Query("SELECT id, title, done FROM tasks")
	// TODO: iterate rows.Next(), rows.Scan(&t.ID, &t.Title, &done)
	// TODO: defer rows.Close()
	return nil
}

func markDone(db *sql.DB, id int64) {
	// TODO: db.Exec or prepared statement to set done=1 WHERE id=?
}

func main() {
	db, err := sql.Open("mock", "mock://")
	if err != nil { log.Fatal(err) }
	defer db.Close()

	// Reset mock store for deterministic output
	taskStore = taskStore[:0]
	nextID = 1

	createTable(db)

	insertTask(db, "Buy groceries")
	insertTask(db, "Write tests")

	for _, t := range listTasks(db) {
		fmt.Println(t.ID, t.Title, t.Done)
	}

	markDone(db, 1)

	for _, t := range listTasks(db) {
		fmt.Println(t.ID, t.Title, t.Done)
	}
}
`,
  solutionCode: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver  struct{}
type mockConn    struct{}
type mockStmt    struct{ q string }
type mockResult  struct{ id int64 }
type mockRows    struct {
	rows [][]driver.Value
	pos  int
}
type mockTx struct{}

var taskStore = [][]driver.Value{
	{int64(1), "Buy groceries", int64(0)},
	{int64(2), "Write tests",   int64(0)},
}
var nextID int64 = 3

func (d *mockDriver) Open(_ string) (driver.Conn, error) { return &mockConn{}, nil }
func (c *mockConn) Prepare(q string) (driver.Stmt, error) { return &mockStmt{q: q}, nil }
func (c *mockConn) Close() error                          { return nil }
func (c *mockConn) Begin() (driver.Tx, error)             { return &mockTx{}, nil }
func (s *mockStmt) Close() error                          { return nil }
func (s *mockStmt) NumInput() int                         { return -1 }
func (s *mockStmt) Exec(args []driver.Value) (driver.Result, error) {
	id := nextID; nextID++
	if len(args) >= 1 {
		if title, ok := args[0].(string); ok {
			taskStore = append(taskStore, []driver.Value{id, title, int64(0)})
			return &mockResult{id: id}, nil
		}
		if idArg, ok := args[0].(int64); ok {
			for i, row := range taskStore {
				if row[0].(int64) == idArg { taskStore[i][2] = int64(1) }
			}
		}
	}
	return &mockResult{id: id}, nil
}
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error) {
	rows := make([][]driver.Value, len(taskStore))
	copy(rows, taskStore)
	return &mockRows{rows: rows}, nil
}
func (r *mockResult) LastInsertId() (int64, error) { return r.id, nil }
func (r *mockResult) RowsAffected() (int64, error) { return 1, nil }
func (r *mockRows) Columns() []string              { return []string{"id", "title", "done"} }
func (r *mockRows) Close() error                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.pos >= len(r.rows) { return io.EOF }
	copy(dest, r.rows[r.pos]); r.pos++; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

type Task struct {
	ID    int64
	Title string
	Done  bool
}

func createTable(db *sql.DB) {
	_, err := db.Exec(\`CREATE TABLE IF NOT EXISTS tasks (
		id    INTEGER PRIMARY KEY,
		title TEXT NOT NULL,
		done  INTEGER NOT NULL DEFAULT 0
	)\`)
	if err != nil { log.Fatal(err) }
}

func insertTask(db *sql.DB, title string) int64 {
	stmt, err := db.Prepare("INSERT INTO tasks (title, done) VALUES (?, 0)")
	if err != nil { log.Fatal(err) }
	defer stmt.Close()

	result, err := stmt.Exec(title)
	if err != nil { log.Fatal(err) }

	id, _ := result.LastInsertId()
	return id
}

func listTasks(db *sql.DB) []Task {
	rows, err := db.Query("SELECT id, title, done FROM tasks")
	if err != nil { log.Fatal(err) }
	defer rows.Close()

	var tasks []Task
	for rows.Next() {
		var t Task
		var done int64
		if err := rows.Scan(&t.ID, &t.Title, &done); err != nil { log.Fatal(err) }
		t.Done = done == 1
		tasks = append(tasks, t)
	}
	return tasks
}

func markDone(db *sql.DB, id int64) {
	stmt, err := db.Prepare("UPDATE tasks SET done=1 WHERE id=?")
	if err != nil { log.Fatal(err) }
	defer stmt.Close()
	if _, err = stmt.Exec(id); err != nil { log.Fatal(err) }
}

func main() {
	db, err := sql.Open("mock", "mock://")
	if err != nil { log.Fatal(err) }
	defer db.Close()

	taskStore = taskStore[:0]
	nextID = 1

	createTable(db)
	insertTask(db, "Buy groceries")
	insertTask(db, "Write tests")

	for _, t := range listTasks(db) {
		fmt.Println(t.ID, t.Title, t.Done)
	}

	markDone(db, 1)

	for _, t := range listTasks(db) {
		fmt.Println(t.ID, t.Title, t.Done)
	}
}
`,
  tests: [
    {
      name: "Defines Task struct",
      description: "Task struct with ID, Title, and Done fields.",
      validate: (code: string, _stdout: string) =>
        code.includes("type Task struct") &&
        code.includes("ID") &&
        code.includes("Title") &&
        code.includes("Done"),
    },
    {
      name: "Uses db.Exec or prepared statement for mutations",
      description: "createTable, insertTask, and markDone use db.Exec or db.Prepare + stmt.Exec.",
      validate: (code: string, _stdout: string) =>
        (code.includes("db.Exec") || code.includes("db.Prepare")) &&
        code.includes("stmt.Exec"),
    },
    {
      name: "Uses rows.Scan to populate Task structs",
      description: "listTasks iterates with rows.Next() and scans each row into a Task.",
      validate: (code: string, _stdout: string) =>
        code.includes("rows.Scan") &&
        code.includes("rows.Next()"),
    },
    {
      name: "Prints task titles to stdout",
      description: "Output includes task titles.",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Buy groceries") ||
        stdout.includes("Write tests"),
    },
    {
      name: "Uses defer rows.Close()",
      description: "listTasks defers rows.Close() to release the connection.",
      validate: (code: string, _stdout: string) =>
        code.includes("defer rows.Close()") ||
        code.includes("defer rows.Close"),
    },
  ],
};
