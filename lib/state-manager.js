const fs = require('fs').promises;
const path = require('path');

/**
 * StateManager handles persistence and validation of processing state
 */
class StateManager {
  constructor(stateFilePath = './state.json') {
    this.stateFilePath = stateFilePath;
    this.currentState = null;
  }

  /**
   * Load state from file
   * @returns {Object} The current state
   */
  async loadState() {
    try {
      const content = await fs.readFile(this.stateFilePath, 'utf-8');
      const state = JSON.parse(content);

      // Validate loaded state
      this._validateState(state);

      this.currentState = state;
      return state;
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist, return default state
        this.currentState = this._getDefaultState();
        return this.currentState;
      }

      // Re-throw validation errors or JSON parse errors
      throw error;
    }
  }

  /**
   * Save state to file
   * @param {Object} state - State to save
   */
  async saveState(state) {
    // Validate before saving
    this._validateState(state);

    // Ensure directory exists
    const dir = path.dirname(this.stateFilePath);
    await fs.mkdir(dir, { recursive: true });

    // Save to file
    const content = JSON.stringify(state, null, 2);
    await fs.writeFile(this.stateFilePath, content, 'utf-8');

    this.currentState = state;
  }

  /**
   * Update specific fields in state
   * @param {Object} updates - Fields to update
   */
  async updateState(updates) {
    // Load current state if not in memory
    if (!this.currentState) {
      await this.loadState();
    }

    // Merge updates
    const newState = {
      ...this.currentState,
      ...updates
    };

    // Validate and save
    await this.saveState(newState);
  }

  /**
   * Get current state from memory (without loading from disk)
   * @returns {Object} Current state
   */
  getState() {
    return this.currentState || this._getDefaultState();
  }

  /**
   * Reset state to default
   */
  async resetState() {
    const defaultState = this._getDefaultState();
    await this.saveState(defaultState);
  }

  /**
   * Get default state structure
   * @private
   */
  _getDefaultState() {
    return {
      repoUrl: '',
      currentCommit: 0,
      totalCommits: 0,
      processedFiles: 0,
      lastMetaAnalysis: 0,
      status: 'stopped',
      costEstimate: 0,
      errors: [],
      startTime: null,
      endTime: null
    };
  }

  /**
   * Validate state object
   * @private
   */
  _validateState(state) {
    // Check required fields
    const requiredFields = ['repoUrl', 'currentCommit', 'totalCommits', 'status'];
    for (const field of requiredFields) {
      if (!(field in state)) {
        throw new Error(`Missing required field: ${field}`);
      }
    }

    // Validate types
    if (typeof state.repoUrl !== 'string') {
      throw new Error('repoUrl must be a string');
    }

    if (typeof state.currentCommit !== 'number') {
      throw new Error('currentCommit must be a number');
    }

    if (typeof state.totalCommits !== 'number') {
      throw new Error('totalCommits must be a number');
    }

    if (typeof state.status !== 'string') {
      throw new Error('status must be a string');
    }

    // Validate values
    if (state.currentCommit < 0) {
      throw new Error('currentCommit cannot be negative');
    }

    if (state.totalCommits < 0) {
      throw new Error('totalCommits cannot be negative');
    }

    if (state.currentCommit > state.totalCommits) {
      throw new Error('currentCommit cannot exceed totalCommits');
    }

    // Validate status
    const validStatuses = ['stopped', 'running', 'paused'];
    if (!validStatuses.includes(state.status)) {
      throw new Error(`Invalid status: ${state.status}. Must be one of: ${validStatuses.join(', ')}`);
    }

    // Validate optional numeric fields if present
    if ('processedFiles' in state && (typeof state.processedFiles !== 'number' || state.processedFiles < 0)) {
      throw new Error('processedFiles must be a non-negative number');
    }

    if ('costEstimate' in state && (typeof state.costEstimate !== 'number' || state.costEstimate < 0)) {
      throw new Error('costEstimate must be a non-negative number');
    }

    if ('lastMetaAnalysis' in state && (typeof state.lastMetaAnalysis !== 'number' || state.lastMetaAnalysis < 0)) {
      throw new Error('lastMetaAnalysis must be a non-negative number');
    }
  }
}

module.exports = StateManager;
