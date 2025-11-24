/**
 * Simple performance timer for debugging and optimization
 */
class PerfTimer {
  constructor(enabled = true) {
    this.enabled = enabled;
    this.timings = new Map(); // operation -> { count, total, min, max }
    this.activeTimers = new Map(); // operation -> start time
  }

  /**
   * Start timing an operation
   * @param {string} operation - Operation name
   */
  start(operation) {
    if (!this.enabled) return;
    this.activeTimers.set(operation, Date.now());
  }

  /**
   * End timing an operation and record the duration
   * @param {string} operation - Operation name
   * @returns {number} Duration in milliseconds
   */
  end(operation) {
    if (!this.enabled) return 0;

    const startTime = this.activeTimers.get(operation);
    if (!startTime) {
      console.warn(`PerfTimer: No start time for operation: ${operation}`);
      return 0;
    }

    const duration = Date.now() - startTime;
    this.activeTimers.delete(operation);

    // Update statistics
    if (!this.timings.has(operation)) {
      this.timings.set(operation, {
        count: 0,
        total: 0,
        min: Infinity,
        max: 0
      });
    }

    const stats = this.timings.get(operation);
    stats.count++;
    stats.total += duration;
    stats.min = Math.min(stats.min, duration);
    stats.max = Math.max(stats.max, duration);

    return duration;
  }

  /**
   * Time an async function
   * @param {string} operation - Operation name
   * @param {Function} fn - Async function to time
   * @returns {Promise<any>} Result of the function
   */
  async timeAsync(operation, fn) {
    if (!this.enabled) return await fn();

    this.start(operation);
    try {
      return await fn();
    } finally {
      const duration = this.end(operation);
      if (duration > 1000) {
        console.log(`⏱️  ${operation}: ${(duration / 1000).toFixed(2)}s`);
      }
    }
  }

  /**
   * Get statistics for an operation
   * @param {string} operation - Operation name
   * @returns {Object|null} Statistics or null if not found
   */
  getStats(operation) {
    const stats = this.timings.get(operation);
    if (!stats) return null;

    return {
      count: stats.count,
      total: stats.total,
      avg: stats.total / stats.count,
      min: stats.min,
      max: stats.max
    };
  }

  /**
   * Get all statistics
   * @returns {Object} Map of operation -> statistics
   */
  getAllStats() {
    const result = {};
    for (const [operation, stats] of this.timings) {
      result[operation] = {
        count: stats.count,
        total: stats.total,
        avg: stats.total / stats.count,
        min: stats.min,
        max: stats.max
      };
    }
    return result;
  }

  /**
   * Print summary report
   */
  printSummary() {
    if (!this.enabled) return;

    console.log('\n' + '='.repeat(80));
    console.log('Performance Summary');
    console.log('='.repeat(80));

    // Sort by total time (descending)
    const sorted = Array.from(this.timings.entries())
      .sort((a, b) => b[1].total - a[1].total);

    for (const [operation, stats] of sorted) {
      const avg = stats.total / stats.count;
      console.log(`${operation}:`);
      console.log(`  Count: ${stats.count}`);
      console.log(`  Total: ${(stats.total / 1000).toFixed(2)}s`);
      console.log(`  Avg:   ${(avg / 1000).toFixed(3)}s`);
      console.log(`  Min:   ${(stats.min / 1000).toFixed(3)}s`);
      console.log(`  Max:   ${(stats.max / 1000).toFixed(3)}s`);
      console.log('');
    }

    console.log('='.repeat(80) + '\n');
  }

  /**
   * Reset all timings
   */
  reset() {
    this.timings.clear();
    this.activeTimers.clear();
  }
}

module.exports = PerfTimer;
