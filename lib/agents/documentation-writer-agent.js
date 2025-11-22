const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * DocumentationWriterAgent generates wiki documentation using Claude
 */
class DocumentationWriterAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration from spec
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 3000;
  }

  /**
   * Generate documentation for a concept/component
   * @param {string} conceptName - Name of the concept/component
   * @param {Object} codeAnalysis - Analysis output from CodeAnalysisAgent
   * @param {string} existingContent - Existing documentation (optional)
   * @returns {string} Markdown documentation
   */
  async writeDocumentation(conceptName, codeAnalysis, existingContent = '') {
    // Convert code analysis to string
    const analysisText = typeof codeAnalysis === 'string'
      ? codeAnalysis
      : JSON.stringify(codeAnalysis, null, 2);

    // Format existing content
    const formattedExisting = existingContent
      ? existingContent
      : 'None (creating new documentation)';

    // Render prompt template
    const prompt = this.promptManager.render('documentation-writer', {
      conceptName,
      codeAnalysis: analysisText,
      existingContent: formattedExisting
    });

    // Call Claude
    const response = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Clean up response
    return this.sanitizeMarkdown(response);
  }

  /**
   * Clean up markdown response
   * - Remove code block wrappers if Claude wrapped the markdown
   * - Trim whitespace
   * @param {string} markdown - Raw markdown from Claude
   * @returns {string} Cleaned markdown
   */
  sanitizeMarkdown(markdown) {
    let cleaned = markdown.trim();

    // Remove outer markdown code block if present
    // Match: ```markdown\n...\n``` or ```\n...\n```
    const codeBlockMatch = cleaned.match(/^```(?:markdown)?\s*\n([\s\S]*?)\n```$/);
    if (codeBlockMatch) {
      cleaned = codeBlockMatch[1].trim();
    }

    return cleaned;
  }
}

module.exports = DocumentationWriterAgent;
