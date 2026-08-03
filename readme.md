# Task CRUD API

A simple, lightweight CRUD API managing a to-do list built with Node.js and Express. Developed as part of the FlyRank Internship Backend Track (Week 2, Assignment A1).

## Prerequisites
- Node.js (v14+ recommended)

## How to Install & Run

1. Clone the repository and navigate into the folder:
   ```bash
   git clone <your-repository-url>
   cd <repository-folder>
Install dependencies:Bashnpm install
Start the server:Bashnode index.js
The server will start locally on http://localhost:3000.  API Endpoints TableHTTP MethodEndpointDescriptionGET/Returns API metadata and root details  GET/healthHealth check endpoint returning server status  GET/tasksRetrieves the full list of tasks  GET/tasks/:idRetrieves a single task by its ID (returns 404 if not found)  POST/tasksCreates a new task with a title (validates for missing/empty titles, returns 201)  PUT/tasks/:idReplaces/updates a task's title or completion status (returns 404/400 on error)  DELETE/tasks/:idRemoves a task by ID (returns 204 No Content)  Example curl -i OutputBash$ curl -i http://localhost:3000/health
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 15
ETag: W/"f-sdnJ/hgi+N02Uio2a29n0l3QoUA"
Date: Mon, 03 Aug 2026 00:00:00 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"status":"ok"}