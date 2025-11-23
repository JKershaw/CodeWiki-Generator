const WikiManager = require('./wiki-manager');
const ClaudeClient = require('./claude');

/**
 * WikiResearcher gathers comprehensive context from multi-layer wiki
 * Searches across code, meta, history, and quality layers
 */
class WikiResearcher {
  constructor(wikiPath = './wiki') {
    this.wikiManager = new WikiManager(wikiPath);
    this.claudeClient = new ClaudeClient();

    // Layer definitions
    this.layers = {
      meta: ['meta/'],
      code: ['concepts/', 'components/', 'guides/'],
      history: ['history/'],
      quality: ['quality/']
    };
  }

  /**
   * Gather comprehensive context for a task description
   * @param {string} taskDescription - Description of what the user wants to do
   * @param {Object} options - Options for context gathering
   * @param {number} options.maxPagesPerLayer - Max pages to return per layer (default: 3)
   * @param {Array<string>} options.priorityLayers - Layers to prioritize (default: all)
   * @returns {Object} Structured context package
   */
  async gatherContext(taskDescription, options = {}) {
    const maxPagesPerLayer = options.maxPagesPerLayer || 3;
    const priorityLayers = options.priorityLayers || Object.keys(this.layers);

    // Step 1: Extract keywords from task description
    const keywords = await this.extractKeywords(taskDescription);

    // Step 2: Search all layers
    const layerResults = {};
    for (const [layerName, directories] of Object.entries(this.layers)) {
      if (priorityLayers.includes(layerName)) {
        layerResults[layerName] = await this.searchLayer(directories, keywords);
      }
    }

    // Step 3: Rank results by relevance
    const rankedResults = await this.rankByRelevance(taskDescription, layerResults);

    // Step 4: Assemble context package
    const context = {
      taskDescription,
      keywords,
      highLevelContext: rankedResults.meta?.slice(0, maxPagesPerLayer) || [],
      codeContext: [
        ...(rankedResults.code?.concepts || []).slice(0, maxPagesPerLayer),
        ...(rankedResults.code?.components || []).slice(0, maxPagesPerLayer)
      ],
      guides: (rankedResults.code?.guides || []).slice(0, maxPagesPerLayer),
      historicalContext: rankedResults.history?.slice(0, maxPagesPerLayer) || [],
      qualityContext: rankedResults.quality?.slice(0, maxPagesPerLayer) || [],
      relatedConcepts: (rankedResults.code?.concepts || []).slice(0, maxPagesPerLayer)
    };

    return context;
  }

  /**
   * Extract keywords from task description
   * @private
   */
  async extractKeywords(taskDescription) {
    // Simple keyword extraction (can be enhanced with Claude if needed)
    const words = taskDescription
      .toLowerCase()
      .split(/\s+/)
      .filter(w => w.length > 3)
      .filter(w => !['what', 'when', 'where', 'how', 'why', 'should', 'would', 'could', 'this', 'that', 'the', 'and', 'for', 'with'].includes(w));

    return [...new Set(words)]; // Unique keywords
  }

  /**
   * Search a specific layer (set of directories)
   * @private
   */
  async searchLayer(directories, keywords) {
    const allPages = await this.wikiManager.getAllPages();
    const results = [];

    for (const page of allPages) {
      // Check if page is in one of the directories for this layer
      const isInLayer = directories.some(dir => page.path.startsWith(dir));
      if (!isInLayer) continue;

      // Calculate relevance score
      const score = this.calculateRelevanceScore(page, keywords);
      if (score > 0) {
        results.push({
          ...page,
          relevanceScore: score
        });
      }
    }

    // Sort by relevance
    results.sort((a, b) => b.relevanceScore - a.relevanceScore);

    return results;
  }

  /**
   * Calculate relevance score based on keyword matches
   * @private
   */
  calculateRelevanceScore(page, keywords) {
    let score = 0;
    const title = (page.metadata?.title || '').toLowerCase();
    const path = page.path.toLowerCase();

    for (const keyword of keywords) {
      // Title match is worth more
      if (title.includes(keyword)) {
        score += 10;
      }
      // Path match
      if (path.includes(keyword)) {
        score += 5;
      }
      // Theme match
      if (page.metadata?.themes) {
        const themesText = page.metadata.themes.join(' ').toLowerCase();
        if (themesText.includes(keyword)) {
          score += 3;
        }
      }
    }

    return score;
  }

  /**
   * Rank results by relevance using Claude (for more intelligent ranking)
   * @private
   */
  async rankByRelevance(taskDescription, layerResults) {
    // For now, use simple scoring
    // Can be enhanced with Claude API call to re-rank based on content

    const ranked = {};

    for (const [layerName, results] of Object.entries(layerResults)) {
      if (layerName === 'code') {
        // Separate code layer by subdirectory
        ranked.code = {
          concepts: results.filter(r => r.path.startsWith('concepts/')),
          components: results.filter(r => r.path.startsWith('components/')),
          guides: results.filter(r => r.path.startsWith('guides/'))
        };
      } else {
        ranked[layerName] = results;
      }
    }

    return ranked;
  }

  /**
   * Format context for display/use
   * @param {Object} context - Context object from gatherContext
   * @returns {string} Formatted markdown report
   */
  formatContextReport(context) {
    let report = `# Context Report: ${context.taskDescription}\n\n`;
    report += `**Keywords**: ${context.keywords.join(', ')}\n\n`;
    report += `---\n\n`;

    if (context.highLevelContext.length > 0) {
      report += `## High-Level Context (Philosophy & Specifications)\n\n`;
      context.highLevelContext.forEach(page => {
        report += `### ${page.metadata?.title || page.path}\n`;
        report += `**Path**: \`${page.path}\`\n`;
        if (page.metadata?.summary) {
          report += `${page.metadata.summary}\n`;
        }
        report += `\n`;
      });
    }

    if (context.codeContext.length > 0) {
      report += `## Code Context (Components & Concepts)\n\n`;
      context.codeContext.slice(0, 5).forEach(page => {
        report += `### ${page.metadata?.title || page.path}\n`;
        report += `**Path**: \`${page.path}\`\n`;
        if (page.metadata?.category) {
          report += `**Category**: ${page.metadata.category}\n`;
        }
        report += `\n`;
      });
    }

    if (context.guides.length > 0) {
      report += `## Implementation Guides\n\n`;
      context.guides.forEach(page => {
        report += `### ${page.metadata?.title || page.path}\n`;
        report += `**Path**: \`${page.path}\`\n`;
        report += `\n`;
      });
    }

    if (context.historicalContext.length > 0) {
      report += `## Historical Context\n\n`;
      context.historicalContext.forEach(page => {
        report += `### ${page.metadata?.title || page.path}\n`;
        report += `**Path**: \`${page.path}\`\n`;
        if (page.metadata?.themes) {
          report += `**Themes**: ${page.metadata.themes.join(', ')}\n`;
        }
        report += `\n`;
      });
    }

    if (context.qualityContext.length > 0) {
      report += `## Quality & Testing Context\n\n`;
      context.qualityContext.forEach(page => {
        report += `### ${page.metadata?.title || page.path}\n`;
        report += `**Path**: \`${page.path}\`\n`;
        report += `\n`;
      });
    }

    report += `\n---\n\n`;
    report += `**Total pages found**: ${
      context.highLevelContext.length +
      context.codeContext.length +
      context.guides.length +
      context.historicalContext.length +
      context.qualityContext.length
    }\n`;

    return report;
  }

  /**
   * Get context optimized for specific task types
   * @param {string} taskType - Type of task (feature|bug|architectural|onboarding)
   * @param {string} description - Task description
   * @returns {Object} Optimized context
   */
  async getContextForTaskType(taskType, description) {
    const priorityConfig = {
      feature: {
        priorityLayers: ['meta', 'code', 'history'],
        maxPagesPerLayer: 3
      },
      bug: {
        priorityLayers: ['code', 'quality', 'history'],
        maxPagesPerLayer: 4
      },
      architectural: {
        priorityLayers: ['meta', 'code', 'history'],
        maxPagesPerLayer: 5
      },
      onboarding: {
        priorityLayers: ['meta', 'code'],
        maxPagesPerLayer: 3
      }
    };

    const config = priorityConfig[taskType] || priorityConfig.feature;
    return await this.gatherContext(description, config);
  }
}

module.exports = WikiResearcher;
