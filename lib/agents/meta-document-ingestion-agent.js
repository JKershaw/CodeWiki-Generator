const fs = require('fs').promises;
const path = require('path');
const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * MetaDocumentIngestionAgent transforms root markdown files into wiki pages
 * Handles philosophy docs (Idea.md), specs (Specification.md), progress reports, etc.
 */
class MetaDocumentIngestionAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Configuration
    this.maxTokens = 8000; // Increased for large documents
  }

  /**
   * Ingest a meta-document and transform it into a wiki page
   * @param {string} sourceFilePath - Path to the source markdown file (e.g., 'Idea.md')
   * @param {string} category - Target category (meta/history/quality)
   * @param {string} documentType - Type of document (philosophy/specification/progress/testing)
   * @param {Array} existingPages - List of existing wiki pages for cross-referencing
   * @returns {string} - Markdown content for the wiki page
   */
  async ingestDocument(sourceFilePath, category, documentType, existingPages = []) {
    // Read source file
    const content = await fs.readFile(sourceFilePath, 'utf-8');

    // Truncate if too long (to stay within token limits)
    const truncatedContent = this._truncateContent(content, 15000);

    // Format existing pages list for prompt
    const existingPagesText = existingPages.length > 0
      ? existingPages.map(p => `- ${p.title} (${p.path})`).join('\n')
      : 'No existing pages yet';

    // Render prompt template
    const prompt = this.promptManager.render('meta-document-ingestion', {
      sourceFile: path.basename(sourceFilePath),
      documentType,
      category,
      content: truncatedContent,
      existingPages: existingPagesText
    });

    // Call Claude - returns markdown directly
    const markdownContent = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Clean any markdown code fences if present
    return this._cleanMarkdown(markdownContent);
  }

  /**
   * Clean markdown response from Claude (remove code fences if present)
   * @private
   */
  _cleanMarkdown(response) {
    let cleaned = response.trim();

    // Remove markdown code blocks if LLM wrapped the output
    if (cleaned.startsWith('```markdown') || cleaned.startsWith('```md')) {
      cleaned = cleaned.replace(/^```(?:markdown|md)\s*\n/, '');
      cleaned = cleaned.replace(/\n```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*\n/, '');
      cleaned = cleaned.replace(/\n```\s*$/, '');
    }

    return cleaned.trim();
  }

  /**
   * Truncate content to stay within token limits
   * Preserves start and end, truncates middle if needed
   * @private
   */
  _truncateContent(content, maxChars) {
    if (content.length <= maxChars) {
      return content;
    }

    // Take first 60% and last 40%
    const firstPart = content.substring(0, Math.floor(maxChars * 0.6));
    const lastPart = content.substring(content.length - Math.floor(maxChars * 0.4));

    return firstPart + '\n\n[... content truncated ...]\n\n' + lastPart;
  }

}

module.exports = MetaDocumentIngestionAgent;
