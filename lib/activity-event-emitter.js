const EventEmitter = require('events');

/**
 * ActivityEventEmitter - Manages processing events for real-time activity feed
 *
 * Event Types:
 * - COMMIT_START: { type, commitSha, commitMessage, timestamp }
 * - FILE_ANALYSIS: { type, fileName, status, timestamp }
 * - WIKI_UPDATE: { type, pagePath, action, timestamp }
 * - ERROR: { type, error, context, timestamp }
 * - COMPLETION: { type, summary, timestamp }
 */
class ActivityEventEmitter extends EventEmitter {
  constructor(maxHistorySize = 100) {
    super();
    this.maxHistorySize = maxHistorySize;
    this.eventHistory = [];
    this.eventId = 0;
  }

  /**
   * Emit an activity event and store in history
   * @param {string} type - Event type (COMMIT_START, FILE_ANALYSIS, etc.)
   * @param {Object} data - Event data
   */
  emitActivity(type, data) {
    const event = {
      id: ++this.eventId,
      type,
      timestamp: new Date().toISOString(),
      ...data
    };

    // Add to history
    this.eventHistory.push(event);

    // Trim history if exceeds max size
    if (this.eventHistory.length > this.maxHistorySize) {
      this.eventHistory.shift();
    }

    // Emit to listeners
    this.emit('activity', event);

    return event;
  }

  /**
   * Emit COMMIT_START event
   * @param {string} commitSha - Commit SHA
   * @param {string} commitMessage - Commit message
   */
  emitCommitStart(commitSha, commitMessage) {
    return this.emitActivity('COMMIT_START', {
      commitSha,
      commitMessage
    });
  }

  /**
   * Emit FILE_ANALYSIS event
   * @param {string} fileName - File being analyzed
   * @param {string} status - Status (processing, completed, skipped)
   */
  emitFileAnalysis(fileName, status) {
    return this.emitActivity('FILE_ANALYSIS', {
      fileName,
      status
    });
  }

  /**
   * Emit WIKI_UPDATE event
   * @param {string} pagePath - Wiki page path
   * @param {string} action - Action (created, updated)
   */
  emitWikiUpdate(pagePath, action) {
    return this.emitActivity('WIKI_UPDATE', {
      pagePath,
      action
    });
  }

  /**
   * Emit ERROR event
   * @param {Error|string} error - Error object or message
   * @param {string} context - Context where error occurred
   */
  emitError(error, context) {
    return this.emitActivity('ERROR', {
      error: error.message || error,
      context
    });
  }

  /**
   * Emit COMPLETION event
   * @param {Object} summary - Processing summary
   */
  emitCompletion(summary) {
    return this.emitActivity('COMPLETION', {
      summary
    });
  }

  /**
   * Get event history
   * @param {number} limit - Maximum number of events to return
   * @returns {Array} Event history (most recent first)
   */
  getHistory(limit = this.maxHistorySize) {
    return this.eventHistory
      .slice(-limit)
      .reverse();
  }

  /**
   * Clear event history
   */
  clearHistory() {
    this.eventHistory = [];
    this.eventId = 0;
  }

  /**
   * Get statistics about events
   * @returns {Object} Event statistics
   */
  getStatistics() {
    const stats = {
      total: this.eventHistory.length,
      byType: {}
    };

    for (const event of this.eventHistory) {
      stats.byType[event.type] = (stats.byType[event.type] || 0) + 1;
    }

    return stats;
  }
}

module.exports = ActivityEventEmitter;
