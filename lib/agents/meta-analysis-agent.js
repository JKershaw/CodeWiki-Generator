const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * MetaAnalysisAgent identifies patterns across multiple commits
 * and suggests documentation improvements
 */
class MetaAnalysisAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration from spec
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 2000;
    this.frequency = 5; // Run every 5 commits by default
  }

  /**
   * Analyze documentation progress across multiple commits
   * @param {string[]} concepts - List of concepts identified so far
   * @param {string[]} pageList - List of pages created/updated
   * @returns {Object} Analysis with themes, suggestions, gaps, reorganization
   */
  async analyzeProgress(concepts, pageList) {
    // Format concepts as a readable list
    const conceptsText = concepts.length > 0
      ? concepts.join('\n- ')
      : 'None yet';

    // Format page list as readable list
    const pageListText = pageList.length > 0
      ? pageList.join('\n- ')
      : 'None yet';

    // Render prompt template
    const prompt = this.promptManager.render('meta-analysis', {
      concepts: conceptsText,
      pageList: pageListText
    });

    // Call Claude
    const response = await this.claudeClient.sendMessageJSON(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Validate and normalize response
    return this._validateResponse(response);
  }

  /**
   * Determine if meta-analysis should run at this commit
   * @param {number} currentCommit - Current commit number (1-based)
   * @param {number} lastAnalysis - Commit number of last analysis
   * @returns {boolean} Whether to run analysis
   */
  shouldRunMetaAnalysis(currentCommit, lastAnalysis) {
    // Don't run if we just analyzed at this commit
    if (currentCommit === lastAnalysis) {
      return false;
    }

    // Run at frequency intervals (e.g., every 5 commits)
    return currentCommit % this.frequency === 0;
  }

  /**
   * Validate and normalize meta-analysis response
   * Ensures all required fields exist as arrays
   * @param {Object} response - Raw response from Claude
   * @returns {Object} Validated response
   */
  _validateResponse(response) {
    return {
      themes: Array.isArray(response.themes) ? response.themes : [],
      newPagesNeeded: Array.isArray(response.newPagesNeeded) ? response.newPagesNeeded : [],
      gaps: Array.isArray(response.gaps) ? response.gaps : [],
      reorganization: Array.isArray(response.reorganization) ? response.reorganization : []
    };
  }
}

module.exports = MetaAnalysisAgent;
