require('dotenv').config();
const express = require('express');
const swaggerUi = require('swagger-ui-express');
const fs = require('fs');

const PostgresTaskRepository = require('./src/repositories/PostgresTaskRepository');
// To swap back to InMemory repository:
// const InMemoryTaskRepository = require('./src/repositories/InMemoryTaskRepository');

const app = express();
const PORT = process.env.PORT || 3000;

// Initialize repository (Postgres repository swapped in)
const taskRepo = new PostgresTaskRepository(process.env.DATABASE_URL);

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
app.get('/tasks', async (req, res) => {
  try {
    const tasks = await taskRepo.getAll();
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch tasks" });
  }
});

// Stage 2: Read - Get a single task by ID with 404 handling
app.get('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    const task = await taskRepo.getById(taskId);
    if (!task) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }
    res.json(task);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch task" });
  }
});

// Stage 3: Create a new task (POST)
app.post('/tasks', async (req, res) => {
  const { title } = req.body;

  if (!title || title.trim() === "") {
    return res.status(400).json({ error: "Title is required and cannot be empty" });
  }

  try {
    const newTask = await taskRepo.create(title.trim());
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: "Failed to create task" });
  }
});

// Stage 4: Update an existing task (PUT)
app.put('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  const { title, done } = req.body;

  if (title === undefined && done === undefined) {
    return res.status(400).json({ error: "Request body must contain 'title' or 'done' to update" });
  }

  if (title !== undefined && (typeof title !== 'string' || title.trim() === "")) {
    return res.status(400).json({ error: "Title cannot be empty" });
  }

  if (done !== undefined && typeof done !== 'boolean') {
    return res.status(400).json({ error: "Field 'done' must be a boolean (true/false)" });
  }

  try {
    const updated = await taskRepo.update(taskId, {
      title: title !== undefined ? title.trim() : undefined,
      done
    });

    if (!updated) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }

    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: "Failed to update task" });
  }
});

// Stage 4: Delete a task (DELETE)
app.delete('/tasks/:id', async (req, res) => {
  const taskId = parseInt(req.params.id, 10);
  try {
    const deleted = await taskRepo.delete(taskId);
    if (!deleted) {
      return res.status(404).json({ error: `Task ${taskId} not found` });
    }
    res.status(204).send();
  } catch (err) {
    res.status(500).json({ error: "Failed to delete task" });
  }
});

// Start server once at the bottom
app.listen(PORT, () => {
  console.log(`Server started on http://localhost:${PORT}`);
});