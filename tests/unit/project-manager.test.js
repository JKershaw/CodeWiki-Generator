const ProjectManager = require('../../lib/project-manager');
const fs = require('fs').promises;
const path = require('path');

// Mock fs promises
jest.mock('fs', () => ({
  promises: {
    readFile: jest.fn(),
    writeFile: jest.fn(),
    mkdir: jest.fn(),
    readdir: jest.fn(),
    access: jest.fn(),
    rm: jest.fn(),
    stat: jest.fn(),
    copyFile: jest.fn()
  }
}));

describe('ProjectManager', () => {
  let projectManager;
  const testWikisPath = './wikis';

  beforeEach(() => {
    projectManager = new ProjectManager(testWikisPath);
    jest.clearAllMocks();
  });

  describe('createProject', () => {
    it('should create a new project with metadata', async () => {
      const projectName = 'test-project';
      const metadata = {
        name: 'Test Project',
        description: 'A test project',
        repository: 'https://github.com/test/repo'
      };

      // Mock that project doesn't exist
      fs.access.mockRejectedValue({ code: 'ENOENT' });
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const result = await projectManager.createProject(projectName, metadata);

      expect(result.id).toBe('test-project');
      expect(result.name).toBe('Test Project');
      expect(result.description).toBe('A test project');
      expect(result.repository).toBe('https://github.com/test/repo');

      // Verify directories were created
      expect(fs.mkdir).toHaveBeenCalled();

      // Verify metadata file was written
      expect(fs.writeFile).toHaveBeenCalledWith(
        expect.stringContaining('_project.json'),
        expect.any(String)
      );
    });

    it('should throw error if project already exists', async () => {
      const projectName = 'existing-project';

      // Mock that project exists
      fs.access.mockResolvedValue();

      await expect(projectManager.createProject(projectName)).rejects.toThrow('already exists');
    });

    it('should sanitize project name', async () => {
      const projectName = 'Test Project With Spaces!';

      fs.access.mockRejectedValue({ code: 'ENOENT' });
      fs.mkdir.mockResolvedValue();
      fs.writeFile.mockResolvedValue();

      const result = await projectManager.createProject(projectName);

      expect(result.id).toBe('test-project-with-spaces-');
    });
  });

  describe('getProjectMetadata', () => {
    it('should load project metadata', async () => {
      const projectName = 'test-project';
      const mockMetadata = {
        name: 'Test Project',
        description: 'A test project',
        repository: 'https://github.com/test/repo',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        settings: {
          theme: 'default',
          maxPageSize: 5000
        }
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockMetadata));
      fs.readdir.mockResolvedValue([]);
      fs.stat.mockResolvedValue({ size: 0, mtime: new Date() });

      const result = await projectManager.getProjectMetadata(projectName);

      expect(result.id).toBe(projectName);
      expect(result.name).toBe('Test Project');
      expect(result.stats).toBeDefined();
    });

    it('should throw error if project not found', async () => {
      const projectName = 'nonexistent';

      fs.access.mockRejectedValue({ code: 'ENOENT' });

      await expect(projectManager.getProjectMetadata(projectName)).rejects.toThrow('not found');
    });
  });

  describe('getAllProjects', () => {
    it('should return all projects with metadata', async () => {
      const mockProjects = [
        { name: 'project1', isDirectory: () => true },
        { name: 'project2', isDirectory: () => true }
      ];

      const mockMetadata1 = {
        name: 'Project 1',
        description: 'First project',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        settings: { theme: 'default', maxPageSize: 5000 }
      };

      const mockMetadata2 = {
        name: 'Project 2',
        description: 'Second project',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-03T00:00:00.000Z',
        settings: { theme: 'dark', maxPageSize: 5000 }
      };

      fs.access.mockResolvedValue();
      fs.readdir.mockResolvedValue(mockProjects);
      fs.readFile
        .mockResolvedValueOnce(JSON.stringify(mockMetadata1))
        .mockResolvedValueOnce(JSON.stringify(mockMetadata2));
      fs.stat.mockResolvedValue({ size: 0, mtime: new Date() });

      const results = await projectManager.getAllProjects();

      expect(results).toHaveLength(2);
      expect(results[0].name).toBe('Project 2'); // Sorted by updatedAt (newest first)
      expect(results[1].name).toBe('Project 1');
    });

    it('should return empty array if wikis directory does not exist', async () => {
      fs.access.mockRejectedValue({ code: 'ENOENT' });
      fs.mkdir.mockResolvedValue();

      const results = await projectManager.getAllProjects();

      expect(results).toEqual([]);
      expect(fs.mkdir).toHaveBeenCalled();
    });
  });

  describe('deleteProject', () => {
    it('should delete project directory', async () => {
      const projectName = 'test-project';

      fs.access.mockResolvedValue();
      fs.rm.mockResolvedValue();

      await projectManager.deleteProject(projectName);

      expect(fs.rm).toHaveBeenCalledWith(
        path.join(testWikisPath, projectName),
        { recursive: true, force: true }
      );
    });

    it('should throw error if project not found', async () => {
      const projectName = 'nonexistent';

      fs.access.mockRejectedValue({ code: 'ENOENT' });

      await expect(projectManager.deleteProject(projectName)).rejects.toThrow('not found');
    });
  });

  describe('updateProjectSettings', () => {
    it('should update project settings', async () => {
      const projectName = 'test-project';
      const mockMetadata = {
        name: 'Test Project',
        description: 'A test project',
        createdAt: '2024-01-01T00:00:00.000Z',
        updatedAt: '2024-01-02T00:00:00.000Z',
        settings: {
          theme: 'default',
          maxPageSize: 5000
        }
      };

      const newSettings = {
        theme: 'dark',
        maxPageSize: 10000
      };

      fs.access.mockResolvedValue();
      fs.readFile.mockResolvedValue(JSON.stringify(mockMetadata));
      fs.writeFile.mockResolvedValue();
      fs.readdir.mockResolvedValue([]);
      fs.stat.mockResolvedValue({ size: 0, mtime: new Date() });

      const result = await projectManager.updateProjectSettings(projectName, newSettings);

      expect(result.theme).toBe('dark');
      expect(result.maxPageSize).toBe(10000);
      expect(fs.writeFile).toHaveBeenCalled();
    });
  });

  describe('importProject', () => {
    it('should import project from source directory', async () => {
      const sourcePath = '/path/to/source';
      const projectName = 'imported-project';

      fs.stat.mockResolvedValue({ isDirectory: () => true });
      fs.access.mockRejectedValueOnce({ code: 'ENOENT' }); // For project existence check
      fs.mkdir.mockResolvedValue();
      fs.readdir.mockResolvedValue([]);
      fs.writeFile.mockResolvedValue();

      const result = await projectManager.importProject(sourcePath, projectName);

      expect(result.id).toBe('imported-project');
      expect(fs.mkdir).toHaveBeenCalled();
    });

    it('should throw error if source path does not exist', async () => {
      const sourcePath = '/nonexistent/path';
      const projectName = 'test';

      fs.stat.mockRejectedValue({ code: 'ENOENT' });

      await expect(projectManager.importProject(sourcePath, projectName))
        .rejects.toThrow('Source path does not exist');
    });

    it('should throw error if project already exists', async () => {
      const sourcePath = '/path/to/source';
      const projectName = 'existing-project';

      fs.stat.mockResolvedValue({ isDirectory: () => true });
      fs.access.mockResolvedValue(); // Project exists

      await expect(projectManager.importProject(sourcePath, projectName))
        .rejects.toThrow('already exists');
    });
  });
});
