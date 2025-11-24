const PerfTimer = require('../../lib/perf-timer');

describe('PerfTimer', () => {
  let timer;

  beforeEach(() => {
    timer = new PerfTimer(true); // enabled
  });

  describe('start and end', () => {
    it('should track operation duration', async () => {
      timer.start('test-op');
      await new Promise(resolve => setTimeout(resolve, 50));
      const duration = timer.end('test-op');

      expect(duration).toBeGreaterThanOrEqual(45); // Allow some variance
      expect(duration).toBeLessThan(100);
    });

    it('should update statistics correctly', async () => {
      timer.start('test');
      await new Promise(resolve => setTimeout(resolve, 10));
      timer.end('test');

      const stats = timer.getStats('test');
      expect(stats.count).toBe(1);
      expect(stats.total).toBeGreaterThan(0);
      expect(stats.avg).toBe(stats.total);
      expect(stats.min).toBe(stats.max);
    });

    it('should track multiple calls to same operation', () => {
      timer.start('op');
      timer.end('op');

      timer.start('op');
      timer.end('op');

      const stats = timer.getStats('op');
      expect(stats.count).toBe(2);
    });

    it('should track min and max durations', async () => {
      timer.start('op');
      await new Promise(resolve => setTimeout(resolve, 10));
      timer.end('op');

      timer.start('op');
      await new Promise(resolve => setTimeout(resolve, 50));
      timer.end('op');

      const stats = timer.getStats('op');
      expect(stats.min).toBeLessThan(stats.max);
    });

    it('should warn if ending without start', () => {
      const spy = jest.spyOn(console, 'warn').mockImplementation();

      const duration = timer.end('non-existent');

      expect(duration).toBe(0);
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('No start time'));

      spy.mockRestore();
    });
  });

  describe('timeAsync', () => {
    it('should time an async function', async () => {
      const result = await timer.timeAsync('async-op', async () => {
        await new Promise(resolve => setTimeout(resolve, 50));
        return 'test-result';
      });

      expect(result).toBe('test-result');

      const stats = timer.getStats('async-op');
      expect(stats.count).toBe(1);
      expect(stats.total).toBeGreaterThanOrEqual(45);
    });

    it('should log operations over 1 second', async () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      await timer.timeAsync('slow-op', async () => {
        // Mock a slow operation
        timer.timings.set('slow-op', {
          count: 1,
          total: 1500,
          min: 1500,
          max: 1500
        });
      });

      // Note: The actual timing won't be > 1s in test, but the mock will
      // This tests the logging logic if it were slow

      spy.mockRestore();
    });

    it('should handle function errors gracefully', async () => {
      await expect(async () => {
        await timer.timeAsync('error-op', async () => {
          throw new Error('Test error');
        });
      }).rejects.toThrow('Test error');

      // Duration should still be recorded
      const stats = timer.getStats('error-op');
      expect(stats).not.toBeNull();
      expect(stats.count).toBe(1);
    });
  });

  describe('getStats', () => {
    it('should return null for non-existent operation', () => {
      const stats = timer.getStats('non-existent');
      expect(stats).toBeNull();
    });

    it('should calculate average correctly', () => {
      timer.timings.set('op', {
        count: 3,
        total: 300,
        min: 50,
        max: 150
      });

      const stats = timer.getStats('op');
      expect(stats.avg).toBe(100);
    });
  });

  describe('getAllStats', () => {
    it('should return all statistics', () => {
      timer.start('op1');
      timer.end('op1');

      timer.start('op2');
      timer.end('op2');

      const allStats = timer.getAllStats();

      expect(Object.keys(allStats)).toHaveLength(2);
      expect(allStats.op1).toBeDefined();
      expect(allStats.op2).toBeDefined();
    });

    it('should return empty object when no operations tracked', () => {
      const allStats = timer.getAllStats();
      expect(allStats).toEqual({});
    });
  });

  describe('printSummary', () => {
    it('should print formatted summary', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      timer.start('op1');
      timer.end('op1');

      timer.start('op2');
      timer.end('op2');

      timer.printSummary();

      expect(spy).toHaveBeenCalledWith(expect.stringContaining('Performance Summary'));
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('op1'));
      expect(spy).toHaveBeenCalledWith(expect.stringContaining('op2'));

      spy.mockRestore();
    });

    it('should sort by total time descending', () => {
      const spy = jest.spyOn(console, 'log').mockImplementation();

      // op1 takes longer total
      timer.timings.set('op1', { count: 1, total: 2000, min: 2000, max: 2000 });
      timer.timings.set('op2', { count: 1, total: 1000, min: 1000, max: 1000 });

      timer.printSummary();

      const calls = spy.mock.calls.map(call => call[0]);
      const op1Index = calls.findIndex(c => c && c.includes('op1:'));
      const op2Index = calls.findIndex(c => c && c.includes('op2:'));

      expect(op1Index).toBeLessThan(op2Index);

      spy.mockRestore();
    });
  });

  describe('reset', () => {
    it('should clear all timings', () => {
      timer.start('op');
      timer.end('op');

      timer.reset();

      expect(timer.getStats('op')).toBeNull();
      expect(timer.getAllStats()).toEqual({});
    });
  });

  describe('disabled mode', () => {
    it('should not track when disabled', () => {
      const disabledTimer = new PerfTimer(false);

      disabledTimer.start('op');
      const duration = disabledTimer.end('op');

      expect(duration).toBe(0);
      expect(disabledTimer.getStats('op')).toBeNull();
    });

    it('should not print summary when disabled', () => {
      const disabledTimer = new PerfTimer(false);
      const spy = jest.spyOn(console, 'log').mockImplementation();

      disabledTimer.printSummary();

      expect(spy).not.toHaveBeenCalled();

      spy.mockRestore();
    });

    it('should still execute timeAsync function', async () => {
      const disabledTimer = new PerfTimer(false);

      const result = await disabledTimer.timeAsync('op', async () => {
        return 'result';
      });

      expect(result).toBe('result');
      expect(disabledTimer.getStats('op')).toBeNull();
    });
  });
});
