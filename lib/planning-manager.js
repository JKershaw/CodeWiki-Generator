const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

/**
 * PlanningManager handles task management and persistence for planning documentation work
 */
class PlanningManager {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
  }

  /**
   * Get the planning file path for a project
   * @private
   */
  _getPlanningFilePath(project) {
    return path.join(this.wikisBasePath, project, 'planning.json');
  }

  /**
   * Load tasks from file
   * @param {string} project - Project name
   * @returns {Array} Array of tasks
   */
  async getTasks(project) {
    try {
      const filePath = this._getPlanningFilePath(project);
      const content = await fs.readFile(filePath, 'utf-8');
      const data = JSON.parse(content);

      // Validate loaded data
      if (!Array.isArray(data.tasks)) {
        throw new Error('Invalid planning data: tasks must be an array');
      }

      return data.tasks;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return empty array
        return [];
      }

      // Re-throw validation errors or JSON parse errors
      throw error;
    }
  }

  /**
   * Save tasks to file
   * @param {string} project - Project name
   * @param {Array} tasks - Array of tasks
   * @private
   */
  async _saveTasks(project, tasks) {
    const filePath = this._getPlanningFilePath(project);

    // Ensure directory exists
    const dir = path.dirname(filePath);
    await fs.mkdir(dir, { recursive: true });

    // Save to file
    const data = {
      project,
      lastUpdated: new Date().toISOString(),
      tasks
    };

    const content = JSON.stringify(data, null, 2);
    await fs.writeFile(filePath, content, 'utf-8');
  }

  /**
   * Create a new task
   * @param {string} project - Project name
   * @param {Object} taskData - Task data
   * @returns {Object} Created task
   */
  async createTask(project, taskData) {
    // Validate task data
    this._validateTask(taskData, false);

    // Load existing tasks
    const tasks = await this.getTasks(project);

    // Generate unique ID
    const id = crypto.randomBytes(8).toString('hex');

    // Create task with defaults
    const task = {
      id,
      title: taskData.title,
      description: taskData.description || '',
      priority: taskData.priority || 'medium',
      status: taskData.status || 'todo',
      assignedPages: taskData.assignedPages || [],
      createdAt: new Date().toISOString(),
      completedAt: null,
      notes: taskData.notes || ''
    };

    // Add to tasks array
    tasks.push(task);

    // Save
    await this._saveTasks(project, tasks);

    return task;
  }

  /**
   * Update an existing task
   * @param {string} project - Project name
   * @param {string} id - Task ID
   * @param {Object} updates - Fields to update
   * @returns {Object} Updated task
   */
  async updateTask(project, id, updates) {
    // Load existing tasks
    const tasks = await this.getTasks(project);

    // Find task
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${id}`);
    }

    // Merge updates
    const updatedTask = {
      ...tasks[taskIndex],
      ...updates
    };

    // Set completedAt when status changes to done
    if (updates.status === 'done' && tasks[taskIndex].status !== 'done') {
      updatedTask.completedAt = new Date().toISOString();
    }

    // Clear completedAt when status changes from done
    if (tasks[taskIndex].status === 'done' && updates.status && updates.status !== 'done') {
      updatedTask.completedAt = null;
    }

    // Validate updated task
    this._validateTask(updatedTask, true);

    // Update in array
    tasks[taskIndex] = updatedTask;

    // Save
    await this._saveTasks(project, tasks);

    return updatedTask;
  }

  /**
   * Delete a task
   * @param {string} project - Project name
   * @param {string} id - Task ID
   * @returns {boolean} Success
   */
  async deleteTask(project, id) {
    // Load existing tasks
    const tasks = await this.getTasks(project);

    // Find task
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
      throw new Error(`Task not found: ${id}`);
    }

    // Remove from array
    tasks.splice(taskIndex, 1);

    // Save
    await this._saveTasks(project, tasks);

    return true;
  }

  /**
   * Get tasks by status
   * @param {string} project - Project name
   * @param {string} status - Status to filter by
   * @returns {Array} Filtered tasks
   */
  async getTasksByStatus(project, status) {
    const tasks = await this.getTasks(project);
    return tasks.filter(task => task.status === status);
  }

  /**
   * Get tasks by priority
   * @param {string} project - Project name
   * @param {string} priority - Priority to filter by
   * @returns {Array} Filtered tasks
   */
  async getTasksByPriority(project, priority) {
    const tasks = await this.getTasks(project);
    return tasks.filter(task => task.priority === priority);
  }

  /**
   * Get statistics for tasks
   * @param {string} project - Project name
   * @returns {Object} Statistics
   */
  async getStatistics(project) {
    const tasks = await this.getTasks(project);

    const total = tasks.length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const inProgress = tasks.filter(t => t.status === 'in-progress').length;
    const todo = tasks.filter(t => t.status === 'todo').length;

    const byPriority = {
      high: tasks.filter(t => t.priority === 'high').length,
      medium: tasks.filter(t => t.priority === 'medium').length,
      low: tasks.filter(t => t.priority === 'low').length
    };

    const completedPercentage = total > 0 ? Math.round((completed / total) * 100) : 0;

    return {
      total,
      completed,
      inProgress,
      todo,
      byPriority,
      completedPercentage
    };
  }

  /**
   * Validate task data
   * @private
   */
  _validateTask(task, isUpdate = false) {
    // Check required fields
    const requiredFields = ['title'];
    for (const field of requiredFields) {
      if (!(field in task)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate types
    if (typeof task.title !== 'string' || task.title.trim() === '') {
      throw new Error('title must be a non-empty string');
    }

    if ('description' in task && typeof task.description !== 'string') {
      throw new Error('description must be a string');
    }

    if ('notes' in task && typeof task.notes !== 'string') {
      throw new Error('notes must be a string');
    }

    // Validate priority
    if ('priority' in task) {
      const validPriorities = ['high', 'medium', 'low'];
      if (!validPriorities.includes(task.priority)) {
        throw new Error(`Invalid priority: ${task.priority}. Must be one of: ${validPriorities.join(', ')}`);
      }
    }

    // Validate status
    if ('status' in task) {
      const validStatuses = ['todo', 'in-progress', 'done'];
      if (!validStatuses.includes(task.status)) {
        throw new Error(`Invalid status: ${task.status}. Must be one of: ${validStatuses.join(', ')}`);
      }
    }

    // Validate assignedPages
    if ('assignedPages' in task) {
      if (!Array.isArray(task.assignedPages)) {
        throw new Error('assignedPages must be an array');
      }

      for (const page of task.assignedPages) {
        if (typeof page !== 'string') {
          throw new Error('assignedPages must contain strings');
        }
      }
    }

    // Validate ID on updates
    if (isUpdate && (!task.id || typeof task.id !== 'string')) {
      throw new Error('id is required for updates and must be a string');
    }
  }
}

module.exports = PlanningManager;
