const { Pool } = require('pg');
const TaskRepository = require('./TaskRepository');

class PostgresTaskRepository extends TaskRepository {
  constructor(connectionString) {
    super();
    this.pool = new Pool({
      connectionString: connectionString || process.env.DATABASE_URL
    });
  }

  async getAll() {
    const res = await this.pool.query('SELECT id, title, done FROM tasks ORDER BY id ASC');
    return res.rows.map(row => ({
      id: row.id,
      title: row.title,
      done: Boolean(row.done)
    }));
  }

  async getById(id) {
    const res = await this.pool.query('SELECT id, title, done FROM tasks WHERE id = $1', [id]);
    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      title: row.title,
      done: Boolean(row.done)
    };
  }

  async create(title) {
    const res = await this.pool.query(
      'INSERT INTO tasks (title, done) VALUES ($1, $2) RETURNING id, title, done',
      [title, false]
    );
    const row = res.rows[0];
    return {
      id: row.id,
      title: row.title,
      done: Boolean(row.done)
    };
  }

  async update(id, data) {
    const existing = await this.getById(id);
    if (!existing) return null;

    const updatedTitle = data.title !== undefined ? data.title : existing.title;
    const updatedDone = data.done !== undefined ? Boolean(data.done) : existing.done;

    const res = await this.pool.query(
      'UPDATE tasks SET title = $1, done = $2 WHERE id = $3 RETURNING id, title, done',
      [updatedTitle, updatedDone, id]
    );

    if (res.rows.length === 0) return null;
    const row = res.rows[0];
    return {
      id: row.id,
      title: row.title,
      done: Boolean(row.done)
    };
  }

  async delete(id) {
    const res = await this.pool.query('DELETE FROM tasks WHERE id = $1', [id]);
    return res.rowCount > 0;
  }
}

module.exports = PostgresTaskRepository;
