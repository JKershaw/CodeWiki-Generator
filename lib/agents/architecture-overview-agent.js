const ClaudeClient = require('../claude');
const PromptManager = require('../prompts');

/**
 * ArchitectureOverviewAgent generates high-level system architecture documentation
 * by synthesizing all existing concepts, components, and guides into a comprehensive overview
 */
class ArchitectureOverviewAgent {
  constructor() {
    this.claudeClient = new ClaudeClient();
    this.promptManager = new PromptManager();

    // Architecture overview needs more tokens for comprehensive content
    this.model = 'claude-sonnet-4-20250514';
    this.maxTokens = 4000;
  }

  /**
   * Generate architecture overview from wiki data
   * @param {Object} wikiData - Repository and wiki information
   * @param {string} wikiData.repositoryName - Name of the repository
   * @param {Array} wikiData.concepts - Concept pages
   * @param {Array} wikiData.components - Component pages
   * @param {Array} wikiData.guides - Guide pages
   * @returns {string} Markdown content for architecture.md
   */
  async generateArchitectureOverview(wikiData) {
    const { repositoryName, concepts, components, guides } = wikiData;

    // Format wiki structure for prompt
    const conceptsList = this._formatConcepts(concepts);
    const componentsList = this._formatComponents(components);
    const guidesList = this._formatGuides(guides);

    // Render prompt template
    const prompt = this.promptManager.render('architecture-overview', {
      repositoryName,
      concepts: conceptsList,
      components: componentsList,
      guides: guidesList
    });

    // Call Claude
    const response = await this.claudeClient.sendMessage(prompt, {
      model: this.model,
      maxTokens: this.maxTokens
    });

    // Clean and return markdown
    return this._cleanMarkdown(response);
  }

  /**
   * Format concepts for prompt
   * @private
   */
  _formatConcepts(concepts) {
    if (!concepts || concepts.length === 0) {
      return 'No high-level concepts documented yet';
    }

    return concepts.map(concept => {
      const title = concept.title || concept.metadata?.title || 'Untitled';
      return `- ${title}`;
    }).join('\n');
  }

  /**
   * Format components for prompt
   * @private
   */
  _formatComponents(components) {
    if (!components || components.length === 0) {
      return 'No components documented yet';
    }

    return components.map(component => {
      const title = component.title || component.metadata?.title || 'Untitled';
      return `- ${title}`;
    }).join('\n');
  }

  /**
   * Format guides for prompt
   * @private
   */
  _formatGuides(guides) {
    if (!guides || guides.length === 0) {
      return 'No guides documented yet';
    }

    return guides.map(guide => {
      const title = guide.title || guide.metadata?.title || 'Untitled';
      return `- ${title}`;
    }).join('\n');
  }

  /**
   * Clean markdown output (remove code blocks, frontmatter)
   * @private
   */
  _cleanMarkdown(content) {
    let cleaned = content.trim();

    // Remove markdown code blocks
    if (cleaned.startsWith('```markdown')) {
      cleaned = cleaned.replace(/^```markdown\s*\n/, '').replace(/\s*\n```\s*$/, '');
    } else if (cleaned.startsWith('```')) {
      cleaned = cleaned.replace(/^```\s*\n/, '').replace(/\s*\n```\s*$/, '');
    }

    // Remove frontmatter if present
    cleaned = cleaned.replace(/^---\n[\s\S]*?\n---\n/, '');

    return cleaned.trim() + '\n';
  }
}

module.exports = ArchitectureOverviewAgent;
