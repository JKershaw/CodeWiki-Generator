const PlanningManager = require('../../lib/planning-manager');
const fs = require('fs').promises;
const path = require('path');

// Mock fs promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn()
  }
}));

describe('PlanningManager', () => {
  let planningManager;
  const testProject = 'test-project';

  beforeEach(() => {
    planningManager = new PlanningManager('./wikis');
    jest.clearAllMocks();
  });

  describe('getTasks', () => {
    it('should load tasks from file', async () => {
      const mockTasks = [
        {
          id: 'task1',
          title: 'Test Task',
          description: 'Test description',
          priority: 'high',
          status: 'todo',
          assignedPages: ['page1.md'],
          createdAt: '2024-01-01',
          completedAt: null,
          notes: ''
        }
      ];

      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks: mockTasks
      }));

      const tasks = await planningManager.getTasks(testProject);

      expect(tasks).toEqual(mockTasks);
      expect(fs.readFile).toHaveBeenCalledWith(
        path.join('./wikis', testProject, 'planning.json'),
        'utf-8'
      );
    });

    it('should return empty array if file does not exist', async () => {
      const error = new Error('File not found');
      error.code = 'ENOENT';
      fs.readFile.mockRejectedValue(error);

      const tasks = await planningManager.getTasks(testProject);

      expect(tasks).toEqual([]);
    });

    it('should throw error for invalid JSON', async () => {
      fs.readFile.mockResolvedValue('invalid json');

      await expect(planningManager.getTasks(testProject))
        .rejects.toThrow();
    });

    it('should throw error if tasks is not an array', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks: 'not-an-array'
      }));

      await expect(planningManager.getTasks(testProject))
        .rejects.toThrow('Invalid planning data: tasks must be an array');
    });
  });

  describe('createTask', () => {
    beforeEach(() => {
      fs.readFile.mockRejectedValue({ code: 'ENOENT' }); // No existing tasks
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();
    });

    it('should create a new task with defaults', async () => {
      const taskData = {
        title: 'New Task',
        description: 'Task description',
        priority: 'medium'
      };

      const task = await planningManager.createTask(testProject, taskData);

      expect(task).toMatchObject({
        title: 'New Task',
        description: 'Task description',
        priority: 'medium',
        status: 'todo',
        assignedPages: [],
        notes: ''
      });
      expect(task.id).toBeDefined();
      expect(task.createdAt).toBeDefined();
      expect(task.completedAt).toBeNull();
    });

    it('should apply default values for missing fields', async () => {
      const taskData = {
        title: 'Minimal Task'
      };

      const task = await planningManager.createTask(testProject, taskData);

      expect(task.description).toBe('');
      expect(task.priority).toBe('medium');
      expect(task.status).toBe('todo');
      expect(task.assignedPages).toEqual([]);
      expect(task.notes).toBe('');
    });

    it('should save task to file', async () => {
      const taskData = {
        title: 'Test Task'
      };

      await planningManager.createTask(testProject, taskData);

      expect(fs.writeFile).toHaveBeenCalled();
      const writeCall = fs.writeFile.mock.calls[0];
      const savedData = JSON.parse(writeCall[1]);

      expect(savedData.project).toBe(testProject);
      expect(savedData.tasks).toHaveLength(1);
      expect(savedData.tasks[0].title).toBe('Test Task');
    });

    it('should throw error if title is missing', async () => {
      await expect(planningManager.createTask(testProject, {}))
        .rejects.toThrow('Missing required field: title');
    });

    it('should throw error for invalid priority', async () => {
      const taskData = {
        title: 'Test',
        priority: 'invalid'
      };

      await expect(planningManager.createTask(testProject, taskData))
        .rejects.toThrow('Invalid priority');
    });
  });

  describe('updateTask', () => {
    const existingTasks = [
      {
        id: 'task1',
        title: 'Original Title',
        description: 'Original description',
        priority: 'low',
        status: 'todo',
        assignedPages: [],
        createdAt: '2024-01-01',
        completedAt: null,
        notes: ''
      }
    ];

    beforeEach(() => {
      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks: existingTasks
      }));
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();
    });

    it('should update task fields', async () => {
      const updates = {
        title: 'Updated Title',
        priority: 'high'
      };

      const task = await planningManager.updateTask(testProject, 'task1', updates);

      expect(task.title).toBe('Updated Title');
      expect(task.priority).toBe('high');
      expect(task.description).toBe('Original description'); // Unchanged
    });

    it('should set completedAt when status changes to done', async () => {
      const updates = {
        status: 'done'
      };

      const task = await planningManager.updateTask(testProject, 'task1', updates);

      expect(task.status).toBe('done');
      expect(task.completedAt).toBeDefined();
      expect(task.completedAt).not.toBeNull();
    });

    it('should clear completedAt when status changes from done', async () => {
      // Setup task that is already done
      const doneTasks = [{
        ...existingTasks[0],
        status: 'done',
        completedAt: '2024-01-02'
      }];

      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks: doneTasks
      }));

      const updates = {
        status: 'in-progress'
      };

      const task = await planningManager.updateTask(testProject, 'task1', updates);

      expect(task.status).toBe('in-progress');
      expect(task.completedAt).toBeNull();
    });

    it('should throw error if task not found', async () => {
      await expect(planningManager.updateTask(testProject, 'nonexistent', { title: 'Test' }))
        .rejects.toThrow('Task not found: nonexistent');
    });

    it('should validate updated task', async () => {
      const updates = {
        priority: 'invalid'
      };

      await expect(planningManager.updateTask(testProject, 'task1', updates))
        .rejects.toThrow('Invalid priority');
    });
  });

  describe('deleteTask', () => {
    const existingTasks = [
      { id: 'task1', title: 'Task 1', priority: 'high', status: 'todo', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' },
      { id: 'task2', title: 'Task 2', priority: 'low', status: 'done', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' }
    ];

    beforeEach(() => {
      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks: existingTasks
      }));
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();
    });

    it('should delete task by id', async () => {
      const result = await planningManager.deleteTask(testProject, 'task1');

      expect(result).toBe(true);

      const writeCall = fs.writeFile.mock.calls[0];
      const savedData = JSON.parse(writeCall[1]);

      expect(savedData.tasks).toHaveLength(1);
      expect(savedData.tasks[0].id).toBe('task2');
    });

    it('should throw error if task not found', async () => {
      await expect(planningManager.deleteTask(testProject, 'nonexistent'))
        .rejects.toThrow('Task not found: nonexistent');
    });
  });

  describe('getStatistics', () => {
    it('should calculate statistics correctly', async () => {
      const tasks = [
        { id: '1', priority: 'high', status: 'todo', title: 'Task 1', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' },
        { id: '2', priority: 'high', status: 'done', title: 'Task 2', assignedPages: [], createdAt: '2024-01-01', completedAt: '2024-01-02', notes: '', description: '' },
        { id: '3', priority: 'medium', status: 'in-progress', title: 'Task 3', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' },
        { id: '4', priority: 'low', status: 'done', title: 'Task 4', assignedPages: [], createdAt: '2024-01-01', completedAt: '2024-01-02', notes: '', description: '' }
      ];

      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks
      }));

      const stats = await planningManager.getStatistics(testProject);

      expect(stats).toEqual({
        total: 4,
        completed: 2,
        inProgress: 1,
        todo: 1,
        byPriority: {
          high: 2,
          medium: 1,
          low: 1
        },
        completedPercentage: 50
      });
    });

    it('should handle empty task list', async () => {
      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks: []
      }));

      const stats = await planningManager.getStatistics(testProject);

      expect(stats).toEqual({
        total: 0,
        completed: 0,
        inProgress: 0,
        todo: 0,
        byPriority: {
          high: 0,
          medium: 0,
          low: 0
        },
        completedPercentage: 0
      });
    });
  });

  describe('getTasksByStatus', () => {
    it('should filter tasks by status', async () => {
      const tasks = [
        { id: '1', status: 'todo', title: 'Task 1', priority: 'high', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' },
        { id: '2', status: 'done', title: 'Task 2', priority: 'high', assignedPages: [], createdAt: '2024-01-01', completedAt: '2024-01-02', notes: '', description: '' },
        { id: '3', status: 'todo', title: 'Task 3', priority: 'medium', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' }
      ];

      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks
      }));

      const todoTasks = await planningManager.getTasksByStatus(testProject, 'todo');

      expect(todoTasks).toHaveLength(2);
      expect(todoTasks[0].id).toBe('1');
      expect(todoTasks[1].id).toBe('3');
    });
  });

  describe('getTasksByPriority', () => {
    it('should filter tasks by priority', async () => {
      const tasks = [
        { id: '1', priority: 'high', status: 'todo', title: 'Task 1', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' },
        { id: '2', priority: 'low', status: 'done', title: 'Task 2', assignedPages: [], createdAt: '2024-01-01', completedAt: '2024-01-02', notes: '', description: '' },
        { id: '3', priority: 'high', status: 'in-progress', title: 'Task 3', assignedPages: [], createdAt: '2024-01-01', completedAt: null, notes: '', description: '' }
      ];

      fs.readFile.mockResolvedValue(JSON.stringify({
        project: testProject,
        tasks
      }));

      const highPriorityTasks = await planningManager.getTasksByPriority(testProject, 'high');

      expect(highPriorityTasks).toHaveLength(2);
      expect(highPriorityTasks[0].id).toBe('1');
      expect(highPriorityTasks[1].id).toBe('3');
    });
  });
});
