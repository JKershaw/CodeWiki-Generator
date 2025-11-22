const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * WikiIndexAgent generates index.md files for wiki navigation
 */
class WikiIndexAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 2000;
  }

  /**
   * Generate an index page for the wiki
   * @param {Object} wikiData - Wiki structure and metadata
   * @param {string} wikiData.repositoryName - Name of the repository
   * @param {Object} wikiData.pages - Pages grouped by category
   * @returns {string} Generated markdown content for index.md
   */
  async generateIndex(wikiData) {
    const { repositoryName, pages } = wikiData;

    // Format wiki structure for the prompt
    const wikiStructure = this._formatWikiStructure(pages);

    // Render prompt template
    const prompt = this.promptManager.render('wiki-index', {
      repositoryName,
      wikiStructure
    });

    // Call Claude to generate the index
    const indexContent = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    return this._cleanMarkdown(indexContent);
  }

  /**
   * Format wiki structure for prompt
   * @private
   */
  _formatWikiStructure(pages) {
    const lines = [];

    // Group pages by category
    const concepts = pages.filter(p => p.category === 'concept');
    const components = pages.filter(p => p.category === 'component' || p.category === 'components');
    const guides = pages.filter(p => p.category === 'guide' || p.category === 'guides');

    if (concepts.length > 0) {
      lines.push('Concepts:');
      concepts.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    if (components.length > 0) {
      lines.push('Components:');
      components.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    if (guides.length > 0) {
      lines.push('Guides:');
      guides.forEach(page => {
        lines.push(`- ${page.title} (${page.path})`);
      });
      lines.push('');
    }

    return lines.join('\n');
  }

  /**
   * Clean up generated markdown
   * @private
   */
  _cleanMarkdown(content) {
    // Remove any code block wrappers if present
    let cleaned = content.replace(/```markdown\n/g, '').replace(/\n```$/g, '');

    // Remove any frontmatter if accidentally included
    cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n/, '');

    // Ensure single trailing newline
    cleaned = cleaned.trim() + '\n';

    return cleaned;
  }
}

module.exports = WikiIndexAgent;
