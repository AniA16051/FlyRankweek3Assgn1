const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const app = express();
const PORT = 3000;

const Database = require('better-sqlite3');

// Initialize database
const db = new Database('tasks.db');

// Create tasks table if it doesn't exist
db.exec(`
  CREATE TABLE IF NOT EXISTS tasks (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done BOOLEAN NOT NULL DEFAULT 0
  );
`);

// Insert initial seed data if table is empty
const countRow = db.prepare('SELECT COUNT(*) as count FROM tasks').get();
if (countRow.count === 0) {
  const insert = db.prepare('INSERT INTO tasks (title, done) VALUES (?, ?)');
  insert.run('Do HackerRank', 0);
  insert.run('Finish DeathTroopers', 1);
  insert.run('Task3', 0);
}

// Middleware to parse incoming JSON bodies
app.use(express.json());

// Stage 5: Serve Swagger UI at /docs
const swaggerDocument = JSON.parse(fs.readFileSync('./openapi.json', 'utf8'));
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

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

// Stage 2: Read - Get the whole task list
app.get('/tasks', (req, res) => { 
  res.json(tasks); 
});

// Stage 2: Read - Get a single task by ID with 404 handling
app.get('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  res.json(task);
});

// Stage 3: Create a new task (POST)
app.post('/tasks', (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  const nextId = tasks.length > 0 ? tasks[tasks.length - 1].id + 1 : 1;

  const newTask = {
    id: nextId,
    title: title.trim(),
    done: false
  };

  tasks.push(newTask);
  res.status(201).json(newTask);
});

// Stage 4: Update an existing task (PUT)
app.put('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const task = tasks.find(t => t.id === taskId);

  if (!task) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  const { title, done } = req.body;

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "Request body must contain 'title' or 'done' to update" });
  }

  if (title !== undefined) {
    if (typeof title !== 'string' || title.trim() === "") {
      return res.status(400).json({ error: "Title cannot be empty" });
    }
    task.title = title.trim();
  }

  if (done !== undefined) {
    if (typeof done !== 'boolean') {
      return res.status(400).json({ error: "Field 'done' must be a boolean (true/false)" });
    }
    task.done = done;
  }

  res.json(task);
});

// Stage 4: Delete a task (DELETE)
app.delete('/tasks/:id', (req, res) => {
  const taskId = parseInt(req.params.id);
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ error: `Task ${taskId} not found` });
  }

  tasks.splice(taskIndex, 1);
  res.status(204).send();
});

// Start server once at the bottom
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});