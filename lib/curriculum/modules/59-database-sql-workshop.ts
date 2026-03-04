import type { WorkshopModule } from "../types";

// The mock driver setup is included in each step's starter code so students
// can run the code in the Playground without a real database.
const mockDriverSetup = `// mockDriver is a minimal in-memory database driver for learning purposes.
// In a real project you would import a real driver like github.com/lib/pq.
import (
	"database/sql"
	"database/sql/driver"
	"io"
)

func init() {
	sql.Register("mock", &mockDriver{})
}

type mockDriver struct{}
type mockConn struct{ closed bool }
type mockStmt struct{}
type mockResult struct{}
type mockRows struct{ done bool }
type mockTx struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error) { return &mockConn{}, nil }
func (c *mockConn) Prepare(q string) (driver.Stmt, error) { return &mockStmt{}, nil }
func (c *mockConn) Close() error                          { c.closed = true; return nil }
func (c *mockConn) Begin() (driver.Tx, error)             { return &mockTx{}, nil }
func (s *mockStmt) Close() error                          { return nil }
func (s *mockStmt) NumInput() int                         { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error) {
	return &mockResult{}, nil
}
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error) {
	return &mockRows{}, nil
}
func (r *mockResult) LastInsertId() (int64, error) { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error) { return 1, nil }
func (r *mockRows) Columns() []string              { return []string{"id", "name"} }
func (r *mockRows) Close() error                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done {
		return io.EOF
	}
	r.done = true
	dest[0] = int64(1)
	dest[1] = "Alice"
	return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }`;

export const databaseSQLWorkshop: WorkshopModule = {
  type: "workshop",
  id: "59",
  slug: "database-sql-workshop",
  title: "database/sql Workshop",
  icon: "🗄️",
  estimatedMinutes: 25,
  description: "Open a DB, insert rows with prepared statements, query multiple rows, and wrap operations in a transaction.",
  steps: [
    {
      instruction:
        "Open a database using `sql.Open` with the `\"mock\"` driver and DSN `\"mock://\"`. Call `db.Ping()` and handle any error. Print `\"connected\"` on success. The starter code includes a mock driver so this runs in the Playground.",
      starterCode: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	// TODO: open the "mock" driver with DSN "mock://"
	// TODO: call db.Ping() and handle error
	// TODO: print "connected"
	_ = sql.Open
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, err := sql.Open("mock", "mock://")
	if err != nil {
		log.Fatal(err)
	}
	defer db.Close()

	if err := db.Ping(); err != nil {
		log.Fatal("cannot reach database:", err)
	}
	fmt.Println("connected")
}
`,
      validate: (code: string) =>
        code.includes("sql.Open") &&
        code.includes("db.Ping()"),
      successMessage:
        "sql.Open only validates the driver name and DSN — it doesn't connect. db.Ping() forces an actual connection attempt, so it's the right place to detect misconfiguration at startup.",
    },
    {
      instruction:
        "INSERT a row using a prepared statement. After opening the DB, call `db.Prepare` with an INSERT statement, then call `stmt.Exec` with the values `(1, \"Alice\")`. Print `\"inserted\"` on success. Don't forget `defer stmt.Close()`.",
      starterCode: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, _ := sql.Open("mock", "mock://")
	defer db.Close()

	// TODO: db.Prepare("INSERT INTO users (id, name) VALUES (?, ?)")
	// TODO: defer stmt.Close()
	// TODO: stmt.Exec(1, "Alice") and handle error
	// TODO: print "inserted"
	_ = fmt.Println
	_ = log.Fatal
}
`,
      hint: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, _ := sql.Open("mock", "mock://")
	defer db.Close()

	stmt, err := db.Prepare("INSERT INTO users (id, name) VALUES (?, ?)")
	if err != nil {
		log.Fatal(err)
	}
	defer stmt.Close()

	_, err = stmt.Exec(1, "Alice")
	if err != nil {
		log.Fatal(err)
	}
	fmt.Println("inserted")
}
`,
      validate: (code: string) =>
        code.includes("db.Prepare") &&
        code.includes("stmt.Exec") &&
        code.includes("stmt.Close()"),
      successMessage:
        "db.Prepare sends the query to the database once for parsing and planning. Subsequent stmt.Exec calls only send the parameter values — faster for repeated insertions and safe from SQL injection.",
    },
    {
      instruction:
        "SELECT multiple rows with `db.Query`. Iterate with `rows.Next()`, scan each row into variables, and print them. Remember `defer rows.Close()`. The mock driver returns one row: id=1, name=\"Alice\".",
      starterCode: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, _ := sql.Open("mock", "mock://")
	defer db.Close()

	// TODO: db.Query("SELECT id, name FROM users")
	// TODO: defer rows.Close()
	// TODO: for rows.Next() { rows.Scan(&id, &name); fmt.Println(id, name) }
	// TODO: check rows.Err()
	_ = log.Fatal
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, _ := sql.Open("mock", "mock://")
	defer db.Close()

	rows, err := db.Query("SELECT id, name FROM users")
	if err != nil {
		log.Fatal(err)
	}
	defer rows.Close()

	for rows.Next() {
		var id   int
		var name string
		if err := rows.Scan(&id, &name); err != nil {
			log.Fatal(err)
		}
		fmt.Println(id, name)
	}
	if err := rows.Err(); err != nil {
		log.Fatal(err)
	}
}
`,
      validate: (code: string) =>
        code.includes("db.Query") &&
        code.includes("rows.Next()") &&
        code.includes("rows.Scan") &&
        code.includes("rows.Close()"),
      successMessage:
        "The rows.Next() / rows.Scan() / defer rows.Close() triad is the canonical pattern for iterating query results in Go. Always check rows.Err() after the loop — it surfaces errors that occurred mid-iteration.",
    },
    {
      instruction:
        "Wrap two INSERT statements in a transaction. Use `db.Begin()`, execute two `tx.Exec` calls, then `tx.Commit()`. Place `defer tx.Rollback()` immediately after Begin so any early return automatically rolls back. Print `\"committed\"` on success.",
      starterCode: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, _ := sql.Open("mock", "mock://")
	defer db.Close()

	// TODO: tx, err := db.Begin(); handle error
	// TODO: defer tx.Rollback()
	// TODO: tx.Exec("INSERT INTO accounts (id, balance) VALUES (?, ?)", 1, 100)
	// TODO: tx.Exec("INSERT INTO accounts (id, balance) VALUES (?, ?)", 2, 200)
	// TODO: tx.Commit() and handle error
	// TODO: print "committed"
	_ = log.Fatal
	_ = fmt.Println
}
`,
      hint: `package main

import (
	"database/sql"
	"database/sql/driver"
	"fmt"
	"io"
	"log"
)

func init() { sql.Register("mock", &mockDriver{}) }

type mockDriver struct{}
type mockConn   struct{}
type mockStmt   struct{}
type mockResult struct{}
type mockRows   struct{ done bool }
type mockTx     struct{}

func (d *mockDriver) Open(_ string) (driver.Conn, error)          { return &mockConn{}, nil }
func (c *mockConn) Prepare(_ string) (driver.Stmt, error)         { return &mockStmt{}, nil }
func (c *mockConn) Close() error                                   { return nil }
func (c *mockConn) Begin() (driver.Tx, error)                      { return &mockTx{}, nil }
func (s *mockStmt) Close() error                                   { return nil }
func (s *mockStmt) NumInput() int                                  { return -1 }
func (s *mockStmt) Exec(_ []driver.Value) (driver.Result, error)   { return &mockResult{}, nil }
func (s *mockStmt) Query(_ []driver.Value) (driver.Rows, error)    { return &mockRows{}, nil }
func (r *mockResult) LastInsertId() (int64, error)                 { return 1, nil }
func (r *mockResult) RowsAffected() (int64, error)                 { return 1, nil }
func (r *mockRows) Columns() []string                              { return []string{"id", "name"} }
func (r *mockRows) Close() error                                   { return nil }
func (r *mockRows) Next(dest []driver.Value) error {
	if r.done { return io.EOF }
	r.done = true; dest[0] = int64(1); dest[1] = "Alice"; return nil
}
func (t *mockTx) Commit() error   { return nil }
func (t *mockTx) Rollback() error { return nil }

func main() {
	db, _ := sql.Open("mock", "mock://")
	defer db.Close()

	tx, err := db.Begin()
	if err != nil {
		log.Fatal(err)
	}
	defer tx.Rollback()

	if _, err = tx.Exec("INSERT INTO accounts (id, balance) VALUES (?, ?)", 1, 100); err != nil {
		log.Fatal(err)
	}
	if _, err = tx.Exec("INSERT INTO accounts (id, balance) VALUES (?, ?)", 2, 200); err != nil {
		log.Fatal(err)
	}

	if err = tx.Commit(); err != nil {
		log.Fatal(err)
	}
	fmt.Println("committed")
}
`,
      validate: (code: string) =>
        code.includes("db.Begin()") &&
        code.includes("tx.Rollback()") &&
        code.includes("tx.Commit()") &&
        code.includes("tx.Exec"),
      successMessage:
        "defer tx.Rollback() after db.Begin() is idiomatic Go: it's a no-op when Commit succeeds, but automatically undoes partial work if any step fails. This pattern keeps error paths clean.",
    },
  ],
};
