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

    // Server
    this.port = parseInt(process.env.PORT || '3000', 10);

    // Storage
    this.wikiPath = process.env.WIKI_PATH || './wiki';

    // Cost Control
    this.maxDailyCost = parseFloat(process.env.MAX_DAILY_COST || '10');

    // Processing
    this.metaAnalysisFrequency = parseInt(process.env.META_ANALYSIS_FREQUENCY || '5', 10);

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
