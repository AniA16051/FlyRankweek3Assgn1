const TaskRepository = require('./TaskRepository');

class InMemoryTaskRepository extends TaskRepository {
  constructor() {
    super();
    this.tasks = [
      { id: 1, title: 'Do HackerRank', done: false },
      { id: 2, title: 'Finish DeathTroopers', done: true },
      { id: 3, title: 'Task3', done: false }
    ];
    this.nextId = 4;
  }

  async getAll() {
    return this.tasks.map(t => ({ ...t }));
  }

  async getById(id) {
    const task = this.tasks.find(t => t.id === id);
    return task ? { ...task } : null;
  }

  async create(title) {
    const newTask = { id: this.nextId++, title, done: false };
    this.tasks.push(newTask);
    return { ...newTask };
  }

  async update(id, data) {
    const task = this.tasks.find(t => t.id === id);
    if (!task) return null;

    if (data.title !== undefined) task.title = data.title;
    if (data.done !== undefined) task.done = Boolean(data.done);

    return { ...task };
  }

  async delete(id) {
    const index = this.tasks.findIndex(t => t.id === id);
    if (index === -1) return false;
    this.tasks.splice(index, 1);
    return true;
  }
}

module.exports = InMemoryTaskRepository;
