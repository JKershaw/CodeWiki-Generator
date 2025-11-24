const fs = require('fs').promises;
const path = require('path');
const WikiManager = require('./wiki-manager');

/**
 * SuggestionEngine analyzes wiki documentation and suggests improvements
 */
class SuggestionEngine {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
    this.wikiManagers = {};
  }

  /**
   * Get WikiManager for a specific project
   * @private
   */
  getProjectWikiManager(project) {
    if (!this.wikiManagers[project]) {
      const projectPath = path.join(this.wikisBasePath, project);
      this.wikiManagers[project] = new WikiManager(projectPath);
    }
    return this.wikiManagers[project];
  }

  /**
   * Get suggestions file path for a project
   * @private
   */
  getSuggestionsFilePath(project) {
    return path.join(this.wikisBasePath, project, 'suggestions.json');
  }

  /**
   * Generate suggestions for a project
   * @param {string} project - Project name
   * @returns {Object} Generated suggestions and statistics
   */
  async generateSuggestions(project) {
    const wikiManager = this.getProjectWikiManager(project);
    const allPages = await wikiManager.getAllPages();

    const suggestions = [];
    let suggestionId = 1;

    // Analyze each page
    for (const pageInfo of allPages) {
      const page = await wikiManager.getPage(pageInfo.path);
      if (!page) continue;

      // Remove HTML tags to count words
      const plainContent = page.content.replace(/<[^>]*>/g, ' ');
      const wordCount = plainContent.split(/\s+/).filter(w => w.length > 0).length;

      // Check for short pages (<200 words)
      if (wordCount < 200) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'short-page',
          title: 'Short Page Detected',
          description: `The page "${page.metadata.title || pageInfo.path}" has only ${wordCount} words. Consider expanding with more details, examples, or explanations.`,
          affectedPages: [pageInfo.path],
          priority: wordCount < 100 ? 'high' : 'medium',
          status: 'pending',
          createdAt: new Date().toISOString(),
          metadata: {
            wordCount,
            pageTitle: page.metadata.title || pageInfo.path
          }
        });
      }

      // Check for pages without related pages
      if (!page.metadata.related || page.metadata.related.length === 0) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'missing-related',
          title: 'Missing Related Pages',
          description: `The page "${page.metadata.title || pageInfo.path}" has no related pages defined. Adding related pages improves navigation and discoverability.`,
          affectedPages: [pageInfo.path],
          priority: 'low',
          status: 'pending',
          createdAt: new Date().toISOString(),
          metadata: {
            pageTitle: page.metadata.title || pageInfo.path
          }
        });
      }
    }

    // Check for orphaned pages (pages with no incoming links)
    const orphanedPages = await this.findOrphanedPages(allPages, wikiManager);
    for (const orphan of orphanedPages) {
      const page = await wikiManager.getPage(orphan.path);
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        type: 'orphaned-page',
        title: 'Orphaned Page Detected',
        description: `The page "${page.metadata.title || orphan.path}" has no incoming links from other pages. Consider linking it from relevant pages or the index.`,
        affectedPages: [orphan.path],
        priority: 'medium',
        status: 'pending',
        createdAt: new Date().toISOString(),
        metadata: {
          pageTitle: page.metadata.title || orphan.path
        }
      });
    }

    // Check for broken cross-references
    const brokenLinks = await this.findBrokenLinks(allPages, wikiManager);
    for (const broken of brokenLinks) {
      suggestions.push({
        id: `suggestion-${suggestionId++}`,
        type: 'broken-reference',
        title: 'Broken Cross-Reference',
        description: `The page "${broken.sourcePage}" contains a broken link to "${broken.targetPath}". Update or remove this link.`,
        affectedPages: [broken.sourcePage],
        priority: 'high',
        status: 'pending',
        createdAt: new Date().toISOString(),
        metadata: {
          sourcePage: broken.sourcePage,
          targetPath: broken.targetPath,
          linkText: broken.linkText
        }
      });
    }

    // Check for pages without tags
    for (const pageInfo of allPages) {
      const page = await wikiManager.getPage(pageInfo.path);
      if (!page) continue;

      if (!page.metadata.tags || page.metadata.tags.length === 0) {
        suggestions.push({
          id: `suggestion-${suggestionId++}`,
          type: 'missing-tags',
          title: 'Missing Tags',
          description: `The page "${page.metadata.title || pageInfo.path}" has no tags. Adding tags improves categorization and searchability.`,
          affectedPages: [pageInfo.path],
          priority: 'low',
          status: 'pending',
          createdAt: new Date().toISOString(),
          metadata: {
            pageTitle: page.metadata.title || pageInfo.path
          }
        });
      }
    }

    // Save suggestions
    await this.saveSuggestions(project, suggestions);

    return {
      suggestions,
      statistics: this.calculateStatistics(suggestions)
    };
  }

  /**
   * Get suggestions for a project
   * @param {string} project - Project name
   * @returns {Object} Suggestions and statistics
   */
  async getSuggestions(project) {
    try {
      const filePath = this.getSuggestionsFilePath(project);
      const content = await fs.readFile(filePath, 'utf-8');
      const suggestions = JSON.parse(content);

      return {
        suggestions,
        statistics: this.calculateStatistics(suggestions)
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return {
          suggestions: [],
          statistics: this.calculateStatistics([])
        };
      }
      throw error;
    }
  }

  /**
   * Apply a suggestion (mark as applied)
   * @param {string} project - Project name
   * @param {string} id - Suggestion ID
   * @returns {Object} Updated suggestion
   */
  async applySuggestion(project, id) {
    const { suggestions } = await this.getSuggestions(project);
    const suggestion = suggestions.find(s => s.id === id);

    if (!suggestion) {
      throw new Error(`Suggestion ${id} not found`);
    }

    suggestion.status = 'applied';
    suggestion.appliedAt = new Date().toISOString();

    await this.saveSuggestions(project, suggestions);

    return suggestion;
  }

  /**
   * Dismiss a suggestion
   * @param {string} project - Project name
   * @param {string} id - Suggestion ID
   * @returns {Object} Updated suggestion
   */
  async dismissSuggestion(project, id) {
    const { suggestions } = await this.getSuggestions(project);
    const suggestion = suggestions.find(s => s.id === id);

    if (!suggestion) {
      throw new Error(`Suggestion ${id} not found`);
    }

    suggestion.status = 'dismissed';
    suggestion.dismissedAt = new Date().toISOString();

    await this.saveSuggestions(project, suggestions);

    return suggestion;
  }

  /**
   * Save suggestions to file
   * @private
   */
  async saveSuggestions(project, suggestions) {
    const filePath = this.getSuggestionsFilePath(project);
    await fs.mkdir(path.dirname(filePath), { recursive: true });
    await fs.writeFile(filePath, JSON.stringify(suggestions, null, 2), 'utf-8');
  }

  /**
   * Calculate statistics for suggestions
   * @private
   */
  calculateStatistics(suggestions) {
    const total = suggestions.length;
    const byStatus = {
      pending: suggestions.filter(s => s.status === 'pending').length,
      applied: suggestions.filter(s => s.status === 'applied').length,
      dismissed: suggestions.filter(s => s.status === 'dismissed').length
    };
    const byType = {};
    const byPriority = {
      high: 0,
      medium: 0,
      low: 0
    };

    for (const suggestion of suggestions) {
      byType[suggestion.type] = (byType[suggestion.type] || 0) + 1;
      byPriority[suggestion.priority] = (byPriority[suggestion.priority] || 0) + 1;
    }

    return {
      total,
      byStatus,
      byType,
      byPriority
    };
  }

  /**
   * Find orphaned pages (pages with no incoming links)
   * @private
   */
  async findOrphanedPages(allPages, wikiManager) {
    const pagePaths = new Set(allPages.map(p => p.path));
    const linkedPages = new Set();

    // Collect all linked pages
    for (const pageInfo of allPages) {
      const page = await wikiManager.getPage(pageInfo.path);
      if (!page) continue;

      // Find markdown links [text](path)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(page.content)) !== null) {
        const linkedPath = match[2];
        // Normalize path
        const normalizedPath = linkedPath.endsWith('.md') ? linkedPath : `${linkedPath}.md`;
        linkedPages.add(normalizedPath);
      }

      // Add related pages
      if (page.metadata.related) {
        for (const related of page.metadata.related) {
          const normalizedRelated = related.endsWith('.md') ? related : `${related}.md`;
          linkedPages.add(normalizedRelated);
        }
      }
    }

    // Find orphans (excluding index.md which is the entry point)
    const orphans = [];
    for (const pageInfo of allPages) {
      if (pageInfo.path === 'index.md') continue;
      if (!linkedPages.has(pageInfo.path)) {
        orphans.push(pageInfo);
      }
    }

    return orphans;
  }

  /**
   * Find broken links in wiki pages
   * @private
   */
  async findBrokenLinks(allPages, wikiManager) {
    const pagePaths = new Set(allPages.map(p => p.path));
    const brokenLinks = [];

    for (const pageInfo of allPages) {
      const page = await wikiManager.getPage(pageInfo.path);
      if (!page) continue;

      // Find markdown links [text](path)
      const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
      let match;
      while ((match = linkRegex.exec(page.content)) !== null) {
        const linkText = match[1];
        const linkedPath = match[2];

        // Skip external links
        if (linkedPath.startsWith('http://') || linkedPath.startsWith('https://')) {
          continue;
        }

        // Normalize path
        const normalizedPath = linkedPath.endsWith('.md') ? linkedPath : `${linkedPath}.md`;

        // Check if target exists
        if (!pagePaths.has(normalizedPath)) {
          brokenLinks.push({
            sourcePage: pageInfo.path,
            targetPath: linkedPath,
            linkText
          });
        }
      }
    }

    return brokenLinks;
  }
}

module.exports = SuggestionEngine;
