const express = require('express');
const app = express();
const PORT = 3000;

// Middleware to parse incoming JSON bodies
app.use(express.json());

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