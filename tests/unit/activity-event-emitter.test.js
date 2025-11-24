const ActivityEventEmitter = require('../../lib/activity-event-emitter');

describe('ActivityEventEmitter', () => {
  let emitter;

  beforeEach(() => {
    emitter = new ActivityEventEmitter(10); // Small history for testing
  });

  describe('constructor', () => {
    it('should initialize with default history size', () => {
      const defaultEmitter = new ActivityEventEmitter();
      expect(defaultEmitter.maxHistorySize).toBe(100);
      expect(defaultEmitter.eventHistory).toEqual([]);
      expect(defaultEmitter.eventId).toBe(0);
    });

    it('should initialize with custom history size', () => {
      expect(emitter.maxHistorySize).toBe(10);
    });
  });

  describe('emitActivity', () => {
    it('should emit activity event with correct structure', (done) => {
      emitter.on('activity', (event) => {
        expect(event).toHaveProperty('id');
        expect(event).toHaveProperty('type');
        expect(event).toHaveProperty('timestamp');
        expect(event.type).toBe('TEST_EVENT');
        expect(event.testData).toBe('test value');
        done();
      });

      emitter.emitActivity('TEST_EVENT', { testData: 'test value' });
    });

    it('should increment event ID', () => {
      const event1 = emitter.emitActivity('TEST1', {});
      const event2 = emitter.emitActivity('TEST2', {});

      expect(event1.id).toBe(1);
      expect(event2.id).toBe(2);
    });

    it('should add event to history', () => {
      emitter.emitActivity('TEST_EVENT', { data: 'test' });

      expect(emitter.eventHistory.length).toBe(1);
      expect(emitter.eventHistory[0].type).toBe('TEST_EVENT');
    });

    it('should limit history size', () => {
      // Emit more events than max size
      for (let i = 0; i < 15; i++) {
        emitter.emitActivity('TEST_EVENT', { index: i });
      }

      expect(emitter.eventHistory.length).toBe(10);
      // Should have the latest 10 events
      expect(emitter.eventHistory[0].index).toBe(5);
      expect(emitter.eventHistory[9].index).toBe(14);
    });
  });

  describe('emitCommitStart', () => {
    it('should emit COMMIT_START event', (done) => {
      emitter.on('activity', (event) => {
        expect(event.type).toBe('COMMIT_START');
        expect(event.commitSha).toBe('abc123');
        expect(event.commitMessage).toBe('Test commit');
        done();
      });

      emitter.emitCommitStart('abc123', 'Test commit');
    });
  });

  describe('emitFileAnalysis', () => {
    it('should emit FILE_ANALYSIS event', (done) => {
      emitter.on('activity', (event) => {
        expect(event.type).toBe('FILE_ANALYSIS');
        expect(event.fileName).toBe('test.js');
        expect(event.status).toBe('completed');
        done();
      });

      emitter.emitFileAnalysis('test.js', 'completed');
    });
  });

  describe('emitWikiUpdate', () => {
    it('should emit WIKI_UPDATE event', (done) => {
      emitter.on('activity', (event) => {
        expect(event.type).toBe('WIKI_UPDATE');
        expect(event.pagePath).toBe('concepts/test.md');
        expect(event.action).toBe('created');
        done();
      });

      emitter.emitWikiUpdate('concepts/test.md', 'created');
    });
  });

  describe('emitError', () => {
    it('should emit ERROR event with Error object', (done) => {
      const error = new Error('Test error');

      emitter.on('activity', (event) => {
        expect(event.type).toBe('ERROR');
        expect(event.error).toBe('Test error');
        expect(event.context).toBe('test context');
        done();
      });

      emitter.emitError(error, 'test context');
    });

    it('should emit ERROR event with string message', (done) => {
      emitter.on('activity', (event) => {
        expect(event.type).toBe('ERROR');
        expect(event.error).toBe('String error');
        expect(event.context).toBe('test context');
        done();
      });

      emitter.emitError('String error', 'test context');
    });
  });

  describe('emitCompletion', () => {
    it('should emit COMPLETION event', (done) => {
      const summary = {
        filesProcessed: 10,
        pagesCreated: 5,
        pagesUpdated: 3
      };

      emitter.on('activity', (event) => {
        expect(event.type).toBe('COMPLETION');
        expect(event.summary).toEqual(summary);
        done();
      });

      emitter.emitCompletion(summary);
    });
  });

  describe('getHistory', () => {
    beforeEach(() => {
      // Add some events
      for (let i = 0; i < 5; i++) {
        emitter.emitActivity('TEST_EVENT', { index: i });
      }
    });

    it('should return history in reverse order (most recent first)', () => {
      const history = emitter.getHistory();

      expect(history.length).toBe(5);
      expect(history[0].index).toBe(4); // Most recent
      expect(history[4].index).toBe(0); // Oldest
    });

    it('should respect limit parameter', () => {
      const history = emitter.getHistory(3);

      expect(history.length).toBe(3);
      expect(history[0].index).toBe(4);
      expect(history[2].index).toBe(2);
    });

    it('should return all events if limit exceeds history size', () => {
      const history = emitter.getHistory(100);

      expect(history.length).toBe(5);
    });
  });

  describe('clearHistory', () => {
    it('should clear all events and reset ID', () => {
      emitter.emitActivity('TEST1', {});
      emitter.emitActivity('TEST2', {});

      expect(emitter.eventHistory.length).toBe(2);
      expect(emitter.eventId).toBe(2);

      emitter.clearHistory();

      expect(emitter.eventHistory.length).toBe(0);
      expect(emitter.eventId).toBe(0);
    });
  });

  describe('getStatistics', () => {
    it('should return statistics with event counts by type', () => {
      emitter.emitCommitStart('sha1', 'msg1');
      emitter.emitCommitStart('sha2', 'msg2');
      emitter.emitFileAnalysis('file1.js', 'completed');
      emitter.emitWikiUpdate('page.md', 'created');
      emitter.emitError('error', 'context');

      const stats = emitter.getStatistics();

      expect(stats.total).toBe(5);
      expect(stats.byType['COMMIT_START']).toBe(2);
      expect(stats.byType['FILE_ANALYSIS']).toBe(1);
      expect(stats.byType['WIKI_UPDATE']).toBe(1);
      expect(stats.byType['ERROR']).toBe(1);
    });

    it('should return empty statistics for no events', () => {
      const stats = emitter.getStatistics();

      expect(stats.total).toBe(0);
      expect(stats.byType).toEqual({});
    });
  });

  describe('event timestamps', () => {
    it('should add ISO timestamp to events', () => {
      const before = new Date().toISOString();
      const event = emitter.emitActivity('TEST_EVENT', {});
      const after = new Date().toISOString();

      expect(event.timestamp).toBeDefined();
      expect(event.timestamp).toMatch(/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/);
      expect(event.timestamp >= before).toBe(true);
      expect(event.timestamp <= after).toBe(true);
    });
  });
});
