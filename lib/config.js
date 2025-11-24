/**
 * Configuration management
 * Loads from environment variables with defaults
 */

require('dotenv').config();

class Config {
  constructor() {
    // API Keys
    this.anthropicApiKey = process.env.ANTHROPIC_API_KEY || '';
    this.githubToken = process.env.GITHUB_TOKEN || '';

    // Claude Model Configuration
    this.claudeModel = process.env.CLAUDE_MODEL || 'claude-haiku-4-5-20251001';

    // Server
    this.port = parseInt(process.env.PORT || '3000', 10);

    // Storage
    this.wikiPath = process.env.WIKI_PATH || './wiki';

    // Cost Control
    this.maxDailyCost = parseFloat(process.env.MAX_DAILY_COST || '10');

    // Processing
    this.metaAnalysisFrequency = parseInt(process.env.META_ANALYSIS_FREQUENCY || '5', 10);

    // Agent Execution Frequencies (how often agents run, in commits)
    // Set to 1 to run every commit, higher numbers run less frequently
    // All agents ALWAYS run on the final commit regardless of frequency
    this.agentFrequencies = {
      // Core agents - run on every commit (essential for content generation)
      codeAnalysis: parseInt(process.env.CODE_ANALYSIS_FREQUENCY || '1', 10),
      documentationWriter: parseInt(process.env.DOCUMENTATION_WRITER_FREQUENCY || '1', 10),

      // Index and linking - run periodically (moderate cost)
      wikiIndex: parseInt(process.env.WIKI_INDEX_FREQUENCY || '5', 10),
      crossLinking: parseInt(process.env.CROSS_LINKING_FREQUENCY || '5', 10),

      // Overview agents - run less frequently (expensive, high-level analysis)
      architectureOverview: parseInt(process.env.ARCHITECTURE_OVERVIEW_FREQUENCY || '10', 10),
      guideGeneration: parseInt(process.env.GUIDE_GENERATION_FREQUENCY || '10', 10),

      // Meta-analysis runs periodically (already configurable)
      metaAnalysis: this.metaAnalysisFrequency
    };

    // Test Mode - if true, use mocks even if API keys are present
    this.testMode = process.env.TEST_MODE === 'true' || process.env.NODE_ENV === 'test';
  }

  /**
   * Check if we're in test mode
   */
  isTestMode() {
    return this.testMode;
  }

  /**
   * Check if real APIs should be used
   */
  shouldUseRealAPIs() {
    return !this.testMode && (this.anthropicApiKey !== '' || this.githubToken !== '');
  }

  /**
   * Check if an agent should run for a given commit
   * @param {string} agentName - Name of agent (matches key in agentFrequencies)
   * @param {number} commitIndex - Current commit index (0-based)
   * @param {number} totalCommits - Total number of commits
   * @returns {boolean} True if agent should run
   */
  shouldRunAgent(agentName, commitIndex, totalCommits) {
    const frequency = this.agentFrequencies[agentName];

    if (!frequency) {
      // Unknown agent, run it (safe default)
      return true;
    }

    // Always run on the last commit for completeness
    const isLastCommit = commitIndex === totalCommits - 1;
    if (isLastCommit) {
      return true;
    }

    // Run if commit number is a multiple of frequency
    // commitIndex is 0-based, so add 1 for human-readable commit numbers
    const commitNumber = commitIndex + 1;
    return commitNumber % frequency === 0;
  }

  /**
   * Validate configuration
   */
  validate() {
    const errors = [];

    if (!this.testMode) {
      if (!this.anthropicApiKey) {
        errors.push('ANTHROPIC_API_KEY is required for production use');
      }
    }

    if (this.port < 1 || this.port > 65535) {
      errors.push('PORT must be between 1 and 65535');
    }

    if (this.maxDailyCost < 0) {
      errors.push('MAX_DAILY_COST must be non-negative');
    }

    if (this.metaAnalysisFrequency < 1) {
      errors.push('META_ANALYSIS_FREQUENCY must be at least 1');
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }
}

// Export singleton instance
module.exports = new Config();
