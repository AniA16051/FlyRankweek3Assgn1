const express = require('express');
const app = express();
const PORT = 3000;
let tasks = [
  { id: 1, title: "Do HackerRank", done: false },
  { id: 2, title: "Finish DeathTroopers", done: true },
  { id: 3, title: "Task3", done: false }
];
// Middleware to parse incoming JSON bodies

app.use(express.json());
//stage2
app.get('/tasks', (req, res) => { res.json(tasks);});
//stage2tasklist
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  res.json(task);
});

// Stage 3: Create a new task
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  // Validate input: title must exist and not be empty
  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  // Generate the next free id (if list is empty, start at 1, otherwise increment max id)
  const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);

  // Return 201 Created with the new task
  res.status(201).json(newTask);
});
// Stage 0 & 1: Root endpoint describing your API
app.get('/', (req, res) => {
  res.json({
    name: "Task API",
    version: "1.0",
    endpoints: ["/tasks"]
  });
});

// Stage 1: Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: "ok" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});