const StateManager = require('../../lib/state-manager');
const fs = require('fs').promises;
const path = require('path');

describe('StateManager', () => {
  let stateManager;
  let testStateFile;

  beforeEach(() => {
    testStateFile = path.join(__dirname, '../fixtures/test-state.json');
    stateManager = new StateManager(testStateFile);
  });

  afterEach(async () => {
    // Clean up test state file
    try {
      await fs.unlink(testStateFile);
    } catch (error) {
      // Ignore if doesn't exist
    }
  });

  describe('loadState', () => {
    it('should return default state for non-existent file', async () => {
      const state = await stateManager.loadState();

      expect(state).toBeDefined();
      expect(state.repoUrl).toBe('');
      expect(state.currentCommit).toBe(0);
      expect(state.totalCommits).toBe(0);
      expect(state.status).toBe('stopped');
    });

    it('should load existing state from file', async () => {
      const testState = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 25,
        totalCommits: 100,
        status: 'paused',
        processedFiles: 50,
        costEstimate: 2.5
      };

      await fs.writeFile(testStateFile, JSON.stringify(testState), 'utf-8');

      const state = await stateManager.loadState();

      expect(state.repoUrl).toBe('https://github.com/test/repo');
      expect(state.currentCommit).toBe(25);
      expect(state.totalCommits).toBe(100);
      expect(state.status).toBe('paused');
    });

    it('should validate loaded state and reject invalid data', async () => {
      const invalidState = {
        repoUrl: 'not a url',
        currentCommit: -5, // Invalid: negative
        totalCommits: 'not a number', // Invalid: wrong type
        status: 'invalid-status' // Invalid: unknown status
      };

      await fs.writeFile(testStateFile, JSON.stringify(invalidState), 'utf-8');

      await expect(stateManager.loadState()).rejects.toThrow();
    });

    it('should handle corrupted JSON gracefully', async () => {
      await fs.writeFile(testStateFile, 'not valid json {{{', 'utf-8');

      await expect(stateManager.loadState()).rejects.toThrow();
    });
  });

  describe('saveState', () => {
    it('should save state to JSON file', async () => {
      const state = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 10,
        totalCommits: 50,
        status: 'running',
        processedFiles: 25,
        costEstimate: 1.5
      };

      await stateManager.saveState(state);

      const savedContent = await fs.readFile(testStateFile, 'utf-8');
      const savedState = JSON.parse(savedContent);

      expect(savedState.repoUrl).toBe('https://github.com/test/repo');
      expect(savedState.currentCommit).toBe(10);
    });

    it('should validate state before saving', async () => {
      const invalidState = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: -10, // Invalid
        totalCommits: 50,
        status: 'running'
      };

      await expect(stateManager.saveState(invalidState)).rejects.toThrow();
    });

    it('should create directory if it does not exist', async () => {
      const nestedPath = path.join(__dirname, '../fixtures/nested/deep/state.json');
      const nestedManager = new StateManager(nestedPath);

      const state = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 0,
        totalCommits: 10,
        status: 'stopped'
      };

      await nestedManager.saveState(state);

      const exists = await fs.access(nestedPath).then(() => true).catch(() => false);
      expect(exists).toBe(true);

      // Cleanup
      await fs.rm(path.join(__dirname, '../fixtures/nested'), { recursive: true, force: true });
    });
  });

  describe('updateState', () => {
    beforeEach(async () => {
      const initialState = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 10,
        totalCommits: 50,
        status: 'paused',
        processedFiles: 20,
        costEstimate: 1.0
      };

      await stateManager.saveState(initialState);
    });

    it('should update only specified fields', async () => {
      await stateManager.updateState({ currentCommit: 15, processedFiles: 25 });

      const state = await stateManager.loadState();

      expect(state.currentCommit).toBe(15);
      expect(state.processedFiles).toBe(25);
      expect(state.repoUrl).toBe('https://github.com/test/repo'); // Unchanged
      expect(state.status).toBe('paused'); // Unchanged
    });

    it('should validate updates before applying', async () => {
      await expect(
        stateManager.updateState({ currentCommit: -5 })
      ).rejects.toThrow();
    });

    it('should handle updating non-existent state', async () => {
      const newManager = new StateManager(path.join(__dirname, '../fixtures/new-state.json'));

      await newManager.updateState({ currentCommit: 5, totalCommits: 10 });

      const state = await newManager.loadState();
      expect(state.currentCommit).toBe(5);
      expect(state.totalCommits).toBe(10);

      // Cleanup
      await fs.unlink(path.join(__dirname, '../fixtures/new-state.json'));
    });
  });

  describe('getState', () => {
    it('should return current in-memory state without loading from disk', async () => {
      const initialState = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 5,
        totalCommits: 20,
        status: 'running'
      };

      await stateManager.saveState(initialState);

      // Modify in-memory state
      await stateManager.updateState({ currentCommit: 7 });

      const state = stateManager.getState();
      expect(state.currentCommit).toBe(7);
    });
  });

  describe('resetState', () => {
    it('should reset to default state', async () => {
      const state = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 25,
        totalCommits: 100,
        status: 'paused'
      };

      await stateManager.saveState(state);
      await stateManager.resetState();

      const resetState = await stateManager.loadState();

      expect(resetState.currentCommit).toBe(0);
      expect(resetState.repoUrl).toBe('');
    });
  });

  describe('state validation', () => {
    it('should accept valid status values', async () => {
      for (const status of ['stopped', 'running', 'paused']) {
        const state = {
          repoUrl: 'https://github.com/test/repo',
          currentCommit: 0,
          totalCommits: 10,
          status
        };

        await expect(stateManager.saveState(state)).resolves.not.toThrow();
      }
    });

    it('should reject invalid status values', async () => {
      const state = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 0,
        totalCommits: 10,
        status: 'invalid'
      };

      await expect(stateManager.saveState(state)).rejects.toThrow();
    });

    it('should reject negative commit numbers', async () => {
      const state = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: -5,
        totalCommits: 10,
        status: 'stopped'
      };

      await expect(stateManager.saveState(state)).rejects.toThrow();
    });

    it('should reject currentCommit greater than totalCommits', async () => {
      const state = {
        repoUrl: 'https://github.com/test/repo',
        currentCommit: 100,
        totalCommits: 50,
        status: 'running'
      };

      await expect(stateManager.saveState(state)).rejects.toThrow();
    });
  });
});
