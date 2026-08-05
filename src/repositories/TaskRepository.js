/**
 * Interface definition for TaskRepository
 */
class TaskRepository {
  async getAll() {
    throw new Error('Method getAll() must be implemented');
  }

  async getById(id) {
    throw new Error('Method getById(id) must be implemented');
  }

  async create(title) {
    throw new Error('Method create(title) must be implemented');
  }

  async update(id, data) {
    throw new Error('Method update(id, data) must be implemented');
  }

  async delete(id) {
    throw new Error('Method delete(id) must be implemented');
  }
}

module.exports = TaskRepository;
