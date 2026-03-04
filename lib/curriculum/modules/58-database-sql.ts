import type { LessonModule } from "../types";

export const databaseSQL: LessonModule = {
  type: "lesson",
  id: "58",
  slug: "database-sql",
  title: "database/sql",
  icon: "🗄️",
  estimatedMinutes: 15,
  content: `## database/sql

Go's \`database/sql\` package provides a **driver-agnostic** API for relational databases. The same code works for PostgreSQL, MySQL, SQLite, and any other database that has a Go driver — you just swap the driver import and the DSN string.

### Opening a connection

\`\`\`go
import (
    "database/sql"
    _ "github.com/lib/pq"  // side-effect import registers the postgres driver
)

db, err := sql.Open("postgres", "postgres://localhost/mydb?sslmode=disable")
if err != nil {
    log.Fatal(err)
}
defer db.Close()
\`\`\`

\`sql.Open\` **does not connect** — it only validates the arguments and creates the handle. Call \`db.Ping()\` to verify the database is reachable:

\`\`\`go
if err := db.Ping(); err != nil {
    log.Fatal("cannot reach database:", err)
}
\`\`\`

### Querying a single row

\`\`\`go
var name string
var age  int
err := db.QueryRow("SELECT name, age FROM users WHERE id = $1", userID).
    Scan(&name, &age)
if err == sql.ErrNoRows {
    fmt.Println("user not found")
} else if err != nil {
    log.Fatal(err)
}
\`\`\`

\`QueryRow\` always returns a \`*Row\`. The error (if any) is deferred until \`Scan\`.

### Querying multiple rows

\`\`\`go
rows, err := db.Query("SELECT id, name FROM users WHERE active = $1", true)
if err != nil {
    log.Fatal(err)
}
defer rows.Close()  // always defer rows.Close()

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
\`\`\`

**Always \`defer rows.Close()\`** — an unclosed \`Rows\` holds a connection from the pool until the function returns.

### Executing mutations

\`\`\`go
result, err := db.Exec(
    "INSERT INTO users (name, email) VALUES ($1, $2)",
    "Alice", "alice@example.com",
)
id, _  := result.LastInsertId()   // works on mysql/sqlite; not postgres
n, _   := result.RowsAffected()
\`\`\`

### Prepared statements

Prepared statements are parsed once on the server, then executed many times with different parameters:

\`\`\`go
stmt, err := db.Prepare("INSERT INTO events (kind, data) VALUES ($1, $2)")
if err != nil {
    log.Fatal(err)
}
defer stmt.Close()

for _, ev := range events {
    _, err = stmt.Exec(ev.Kind, ev.Data)
    // ...
}
\`\`\`

Beyond performance, prepared statements **prevent SQL injection**: user input is always treated as a parameter value, never as part of the query string.

### Transactions

\`\`\`go
tx, err := db.Begin()
if err != nil {
    log.Fatal(err)
}
defer tx.Rollback()  // no-op if Commit was already called

_, err = tx.Exec("UPDATE accounts SET balance = balance - $1 WHERE id = $2", amount, from)
if err != nil {
    return err  // Rollback fires via defer
}
_, err = tx.Exec("UPDATE accounts SET balance = balance + $1 WHERE id = $2", amount, to)
if err != nil {
    return err
}
return tx.Commit()
\`\`\`

The \`defer tx.Rollback()\` pattern is idiomatic: if \`Commit\` succeeds, the subsequent \`Rollback\` is a no-op. If anything goes wrong before \`Commit\`, the deferred \`Rollback\` cleans up automatically.

### Connection pool settings

\`sql.DB\` maintains a pool of connections. Tune it for your workload:

\`\`\`go
db.SetMaxOpenConns(25)                 // max simultaneous connections
db.SetMaxIdleConns(5)                  // idle connections kept open
db.SetConnMaxLifetime(5 * time.Minute) // recycle connections to avoid stale TCP
\`\`\`

Too few open connections → throughput bottleneck. Too many → database server overloaded. Typical starting point: \`MaxOpenConns = 4 × CPU cores\`.
`,
  quiz: [
    {
      question: "Why must you always `defer rows.Close()` after db.Query?",
      options: [
        "It flushes the query result to disk",
        "An unclosed Rows holds a connection from the pool, starving other goroutines of connections",
        "It commits any pending transaction",
        "rows.Close() is optional — the garbage collector closes rows automatically",
      ],
      correctIndex: 1,
    },
    {
      question: "How do prepared statements prevent SQL injection?",
      options: [
        "They encrypt the query before sending it to the database",
        "They sanitise user input by removing special characters",
        "User input is passed as parameter values separate from the query string, so it can never be interpreted as SQL",
        "They run in a sandboxed transaction that is automatically rolled back",
      ],
      correctIndex: 2,
    },
    {
      question: "What is the purpose of `defer tx.Rollback()` when combined with an explicit `tx.Commit()` call?",
      options: [
        "It rolls back the transaction in every case, even after a successful Commit",
        "It is a safety net: if the function returns before reaching Commit (due to an error), the deferred Rollback cleans up the transaction automatically",
        "It retries the transaction if Commit fails",
        "It prevents other goroutines from reading the uncommitted changes",
      ],
      correctIndex: 1,
    },
  ],
};
