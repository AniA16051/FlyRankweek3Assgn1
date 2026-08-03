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