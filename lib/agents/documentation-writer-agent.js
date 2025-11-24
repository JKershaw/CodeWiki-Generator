const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');
const LinkDiscoveryAgent = require('./link-discovery-agent');

/**
 * DocumentationWriterAgent generates wiki documentation using Claude
 */
class DocumentationWriterAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();
    this.linkDiscovery = new LinkDiscoveryAgent();

    // Configuration from spec
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 3000;
  }

  /**
   * Generate documentation for a concept/component
   * @param {string} conceptName - Name of the concept/component
   * @param {Object} codeAnalysis - Analysis output from CodeAnalysisAgent
   * @param {string} existingContent - Existing documentation (optional)
   * @param {Object} options - Additional options
   * @param {string} options.filePath - File path of the component
   * @param {string} options.codeExamples - Code examples from tests
   * @returns {string} Markdown documentation
   */
  async writeDocumentation(conceptName, codeAnalysis, existingContent = '', options = {}) {
    // Format code analysis as readable markdown
    const analysisText = this._formatCodeAnalysis(codeAnalysis);

    // Format existing content
    const formattedExisting = existingContent
      ? existingContent
      : 'None (creating new documentation)';

    // Format file path
    const filePath = options.filePath || 'Not specified';

    // Format code examples
    const codeExamples = options.codeExamples || 'None available from tests';

    // Format test coverage
    const testCoverage = options.testCoverage || 'No test coverage information available';

    // Render prompt template
    const prompt = this.promptManager.render('documentation-writer', {
      conceptName,
      filePath,
      codeAnalysis: analysisText,
      codeExamples,
      testCoverage,
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
   * Format code analysis as readable markdown for LLM
   * @private
   */
  _formatCodeAnalysis(codeAnalysis) {
    // Handle string input (legacy)
    if (typeof codeAnalysis === 'string') {
      return codeAnalysis;
    }

    // Format concepts array as markdown list
    if (codeAnalysis.concepts && Array.isArray(codeAnalysis.concepts)) {
      if (codeAnalysis.concepts.length === 0) {
        return 'No specific concepts identified in code analysis.';
      }

      const lines = ['Identified concepts from code analysis:\n'];
      codeAnalysis.concepts.forEach(concept => {
        lines.push(`**${concept.name}** (${concept.category})`);
        if (concept.reason) {
          lines.push(`  - ${concept.reason}`);
        }
        if (concept.sourceFile) {
          lines.push(`  - Source: ${concept.sourceFile}`);
        }
        lines.push('');
      });

      return lines.join('\n');
    }

    // Fallback to JSON if unexpected structure
    return JSON.stringify(codeAnalysis, null, 2);
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

  /**
   * Add cross-page hyperlinks to content
   * @param {string} content - Original markdown content
   * @param {string} currentPagePath - Path of current page (to avoid self-links)
   * @param {Array} allPages - All wiki pages with title and path
   * @returns {string} Content with hyperlinks added
   */
  addCrossLinks(content, currentPagePath, allPages) {
    if (!content || !allPages || allPages.length === 0) {
      return content;
    }

    // Find all mentions in the content
    const mentions = this.linkDiscovery.findMentions(content, allPages);

    // Filter out self-references and already-linked text
    const validMentions = mentions.filter(m =>
      m.targetPath !== currentPagePath &&
      !this._isAlreadyLinked(content, m.position)
    );

    // Replace mentions with links (reverse order to preserve positions)
    let linkedContent = content;
    validMentions.reverse().forEach(mention => {
      const replacement = this._createLink(mention);
      linkedContent =
        linkedContent.substring(0, mention.position) +
        replacement +
        linkedContent.substring(mention.position + mention.originalText.length);
    });

    return linkedContent;
  }

  /**
   * Create a markdown link from a mention
   * Preserves bold formatting: **Title** → **[Title](path)**
   * @private
   */
  _createLink(mention) {
    // **Title** → **[Title](../path)**
    if (mention.originalText.startsWith('**')) {
      return `**[${mention.titleText}](../${mention.targetPath})**`;
    }
    // Plain text → [Title](../path)
    else {
      return `[${mention.titleText}](../${mention.targetPath})`;
    }
  }

  /**
   * Check if a position is already part of a link
   * Looks for markdown link syntax: [...](...) before the position
   * @private
   */
  _isAlreadyLinked(content, position) {
    // Look backwards for link syntax
    const before = content.substring(Math.max(0, position - 100), position);
    const after = content.substring(position, position + 100);

    // Check if we're inside link text: [...]
    // If there's an unclosed [ before us and ]( after us, we're in a link
    const openBracket = before.lastIndexOf('[');
    const closeBracket = before.lastIndexOf(']');
    const openParen = after.indexOf('](');

    // We're in link text if: [ before us, no ] between [ and us, and ]( after us
    if (openBracket !== -1 && openBracket > closeBracket && openParen !== -1) {
      return true;
    }

    // Check if we're inside link path: (...)
    // If there's ]( before us and ) after us, we're in a link path
    const linkStart = before.lastIndexOf('](');
    const closeParen = after.indexOf(')');

    // We're in link path if: ]( before us and ) after us
    if (linkStart !== -1 && closeParen !== -1) {
      // Make sure there's no opening ( between ]( and our position
      // (to avoid false positives with multiple links)
      const betweenLinkStartAndPosition = before.substring(before.lastIndexOf('](') + 2);
      if (betweenLinkStartAndPosition.indexOf('(') === -1) {
        return true;
      }
    }

    return false;
  }
}

module.exports = DocumentationWriterAgent;
