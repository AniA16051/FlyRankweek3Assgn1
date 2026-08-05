# Task CRUD API with PostgreSQL & Docker

A lightweight CRUD REST API for managing a to-do list built with **Node.js**, **Express**, and **PostgreSQL**, running fully containerized with **Docker Compose**. Developed as part of the FlyRank Internship Backend Track (Week 3, Assignment A1).

---

## Architecture & Repository Pattern

The application leverages the **Repository Pattern** to separate database access from HTTP routing and service logic:
- **`TaskRepository`** (`src/repositories/TaskRepository.js`): Abstract interface declaring required CRUD operations (`getAll`, `getById`, `create`, `update`, `delete`).
- **`InMemoryTaskRepository`** (`src/repositories/InMemoryTaskRepository.js`): In-memory array implementation.
- **`PostgresTaskRepository`** (`src/repositories/PostgresTaskRepository.js`): PostgreSQL database implementation using the `pg` connection pool.

### Architectural Proof (Service & Routes Unchanged)
When swapping from the in-memory/SQLite implementation to `PostgresTaskRepository` in `index.js`, **zero lines of route handler code or response contracts were modified**. The Express routes only consume the abstract `taskRepo` methods, demonstrating clean separation of concerns and loose coupling.

---

## Environment Variables & `.env`

- **`.env.example`** (committed): Template providing default variable placeholders (`DATABASE_URL`, `PORT`).
- **`.env`** (gitignored): Local configuration file holding actual credentials.

---

## Database Storage & Initialization (`init.sql`)

PostgreSQL runs inside Docker with a named Docker volume (`postgres_data`) mapped to `/var/lib/postgresql/data` for data persistence.

Upon initial startup, `init.sql` automatically initializes the schema and default seed data:
```sql
CREATE TABLE IF NOT EXISTS tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  done BOOLEAN NOT NULL DEFAULT FALSE
);
```

---

## How to Start the Stack with Docker Compose

1. **Ensure Docker Desktop is running on your machine.**

2. **Clone the repository and switch to branch `w3Docker`**:
   ```bash
   git clone https://github.com/AniA16051/FlyRankweek3Assgn1.git
   cd FlyRankweek3Assgn1
   git checkout w3Docker
   ```

3. **Start the whole stack**:
   ```bash
   docker compose up --build -d
   ```

4. **Access the API & Interactive Swagger Documentation**:
   - **Root Metadata**: `http://localhost:3000/`
   - **Health Check**: `http://localhost:3000/health`
   - **Swagger Docs**: `http://localhost:3000/docs`
   - **Tasks Endpoint**: `http://localhost:3000/tasks`

---

## How Persistence Was Proven

Data persistence across container restarts was verified using the following steps:

1. **Boot Stack**:
   `docker compose up -d`
2. **Create New Row via POST Request**:
   ```bash
   curl -X POST http://localhost:3000/tasks \
     -H "Content-Type: application/json" \
     -d '{"title": "Persistence Test Task"}'
   ```
   *Response*: `201 Created` with ID (e.g. `id: 4`).
3. **Restart Containers & App**:
   ```bash
   docker compose down
   docker compose up -d
   ```
4. **Query GET Endpoint**:
   ```bash
   curl http://localhost:3000/tasks
   ```
   *Result*: Task `id: 4` ("Persistence Test Task") is still present in the task list because the PostgreSQL database files reside on the persistent `postgres_data` Docker volume.

---

## API Endpoints Summary

| HTTP Method | Endpoint | Description |
|---|---|---|
| `GET` | `/` | API Metadata |
| `GET` | `/health` | Server Health Status |
| `GET` | `/tasks` | Get all tasks from PostgreSQL |
| `GET` | `/tasks/:id` | Get single task by ID |
| `POST` | `/tasks` | Create task row in PostgreSQL (`201 Created`) |
| `PUT` | `/tasks/:id` | Update task row in PostgreSQL |
| `DELETE` | `/tasks/:id` | Delete task row from PostgreSQL (`204 No Content`) |