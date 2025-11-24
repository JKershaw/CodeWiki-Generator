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
   * @returns {Object} - { title, summary, keyThemes, relatedPages, mentionedConcepts, content }
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

    // Call Claude
    const response = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Parse JSON response
    const result = this._parseJSON(response);

    return result;
  }

  /**
   * Parse JSON from Claude response with progressive repair
   * @private
   */
  _parseJSON(response) {
    // Try direct parse first
    try {
      return JSON.parse(response);
    } catch (e) {
      // Progressive repair
      let cleaned = response.trim();

      // Remove markdown code blocks
      cleaned = cleaned.replace(/^```(?:json)?\s*\n/i, '');
      cleaned = cleaned.replace(/\n```\s*$/, '');

      // Remove any leading/trailing text
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleaned = jsonMatch[0];
      }

      try {
        return JSON.parse(cleaned);
      } catch (e2) {
        console.error('Failed to parse JSON from Claude:', e2.message);
        console.error('Response:', response);
        throw new Error(`Invalid JSON from Claude: ${e2.message}`);
      }
    }
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

  /**
   * Generate frontmatter for the wiki page
   * @param {Object} result - Result from ingestDocument
   * @param {string} sourceFile - Original source file name
   * @param {string} category - Category (meta/history/quality)
   * @returns {Object} Frontmatter object
   */
  generateFrontmatter(result, sourceFile, category) {
    const now = new Date().toISOString().split('T')[0];

    return {
      title: result.title,
      category: category,
      layer: this._categoryToLayer(category),
      sourceFile: sourceFile,
      sourceType: 'imported',
      created: now,
      updated: now,
      related: result.relatedPages || [],
      themes: result.keyThemes || [],
      mentions: result.mentionedConcepts || []
    };
  }

  /**
   * Map category to layer
   * @private
   */
  _categoryToLayer(category) {
    const mapping = {
      'meta': 'meta',
      'history': 'history',
      'quality': 'quality',
      'concepts': 'code',
      'components': 'code',
      'guides': 'code'
    };
    return mapping[category] || 'code';
  }
}

module.exports = MetaDocumentIngestionAgent;
