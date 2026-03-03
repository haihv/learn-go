import type { LabModule } from "../types";

export const structsLab: LabModule = {
  type: "lab",
  id: "18",
  slug: "structs-lab",
  title: "Task Manager Lab",
  icon: "✅",
  estimatedMinutes: 30,
  description: "Build a Task struct and a TaskManager with Add, Complete, Remove, and Pending methods.",
  instructions: `## Task Manager Lab

In this lab you will build a simple in-memory task manager using structs and pointer receiver methods.

### Data types

\`\`\`go
type Task struct {
    ID       int
    Title    string
    Done     bool
    Priority int
}

type TaskManager struct {
    tasks  []Task
    nextID int
}
\`\`\`

### Methods to implement

**\`(m *TaskManager) Add(title string, priority int)\`**
- Create a new Task with \`ID\` set to \`m.nextID\`, then increment \`m.nextID\`
- Append the task to \`m.tasks\`

**\`(m *TaskManager) Complete(id int)\`**
- Find the task with the given ID and set its \`Done\` field to \`true\`

**\`(m *TaskManager) Remove(id int)\`**
- Remove the task with the given ID from \`m.tasks\`

**\`(m *TaskManager) Pending() []Task\`**
- Return a slice containing only tasks where \`Done == false\`

### In main

1. Create a \`TaskManager\` with \`nextID\` starting at 1
2. Add three tasks: \`"Write tests"\` (priority 1), \`"Fix bug"\` (priority 2), \`"Deploy"\` (priority 3)
3. Complete the task with ID 1
4. Remove the task with ID 2
5. Print each pending task's Title

### Expected output

\`\`\`
Deploy
\`\`\`
`,
  starterCode: `package main

import "fmt"

type Task struct {
	ID       int
	Title    string
	Done     bool
	Priority int
}

type TaskManager struct {
	tasks  []Task
	nextID int
}

func (m *TaskManager) Add(title string, priority int) {
	// TODO: create Task with m.nextID, append to m.tasks, increment m.nextID
}

func (m *TaskManager) Complete(id int) {
	// TODO: find the task with the given id and set Done = true
}

func (m *TaskManager) Remove(id int) {
	// TODO: remove the task with the given id from m.tasks
}

func (m *TaskManager) Pending() []Task {
	// TODO: return only tasks where Done == false
	return nil
}

func main() {
	tm := &TaskManager{nextID: 1}

	tm.Add("Write tests", 1)
	tm.Add("Fix bug", 2)
	tm.Add("Deploy", 3)

	tm.Complete(1)
	tm.Remove(2)

	for _, t := range tm.Pending() {
		fmt.Println(t.Title)
	}
}
`,
  solutionCode: `package main

import "fmt"

type Task struct {
	ID       int
	Title    string
	Done     bool
	Priority int
}

type TaskManager struct {
	tasks  []Task
	nextID int
}

func (m *TaskManager) Add(title string, priority int) {
	m.tasks = append(m.tasks, Task{
		ID:       m.nextID,
		Title:    title,
		Priority: priority,
	})
	m.nextID++
}

func (m *TaskManager) Complete(id int) {
	for i := range m.tasks {
		if m.tasks[i].ID == id {
			m.tasks[i].Done = true
			return
		}
	}
}

func (m *TaskManager) Remove(id int) {
	filtered := m.tasks[:0]
	for _, t := range m.tasks {
		if t.ID != id {
			filtered = append(filtered, t)
		}
	}
	m.tasks = filtered
}

func (m *TaskManager) Pending() []Task {
	var result []Task
	for _, t := range m.tasks {
		if !t.Done {
			result = append(result, t)
		}
	}
	return result
}

func main() {
	tm := &TaskManager{nextID: 1}

	tm.Add("Write tests", 1)
	tm.Add("Fix bug", 2)
	tm.Add("Deploy", 3)

	tm.Complete(1)
	tm.Remove(2)

	for _, t := range tm.Pending() {
		fmt.Println(t.Title)
	}
}
`,
  tests: [
    {
      name: "Task struct defined",
      description: "Your code must define a struct named Task.",
      validate: (code: string, _stdout: string) =>
        code.includes("type Task struct"),
    },
    {
      name: "TaskManager struct defined",
      description: "Your code must define a struct named TaskManager.",
      validate: (code: string, _stdout: string) =>
        code.includes("type TaskManager struct"),
    },
    {
      name: "Add method exists",
      description: "TaskManager must have an Add method.",
      validate: (code: string, _stdout: string) =>
        code.includes("func") && code.includes("Add("),
    },
    {
      name: "Complete method exists",
      description: "TaskManager must have a Complete method.",
      validate: (code: string, _stdout: string) =>
        code.includes("Complete"),
    },
    {
      name: "Remove method exists",
      description: "TaskManager must have a Remove method.",
      validate: (code: string, _stdout: string) =>
        code.includes("Remove"),
    },
    {
      name: "Pending output is correct",
      description: "After completing ID 1 and removing ID 2, the only pending task is \"Deploy\".",
      validate: (_code: string, stdout: string) =>
        stdout.includes("Deploy") &&
        !stdout.includes("Write tests") &&
        !stdout.includes("Fix bug"),
    },
  ],
};
