const WikiManager = require('./wiki-manager');

/**
 * WikiSearchService provides advanced search and navigation capabilities
 * for wiki pages including full-text search, table of contents extraction,
 * and related page discovery.
 */
class WikiSearchService {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
    this.wikiManagers = {};
  }

  /**
   * Get WikiManager for a specific project
   * @private
   */
  getWikiManager(projectName) {
    if (!this.wikiManagers[projectName]) {
      const path = require('path');
      const projectPath = path.join(this.wikisBasePath, projectName);
      this.wikiManagers[projectName] = new WikiManager(projectPath);
    }
    return this.wikiManagers[projectName];
  }

  /**
   * Search wiki pages with relevance scoring
   * @param {string} query - Search query
   * @param {string} projectName - Project name
   * @returns {Promise<Array>} Search results with relevance scores
   */
  async searchWiki(query, projectName) {
    const wikiManager = this.getWikiManager(projectName);
    const allPages = await wikiManager.getAllPages();
    const searchTerms = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

    const results = [];

    for (const pageInfo of allPages) {
      const page = await wikiManager.getPage(pageInfo.path);
      if (!page) continue;

      const score = this._calculateRelevanceScore(page, searchTerms);

      if (score > 0) {
        const snippet = this._extractBestSnippet(page, searchTerms);
        results.push({
          path: page.path,
          title: page.metadata.title || page.path,
          category: page.metadata.category || 'uncategorized',
          tags: page.metadata.tags || [],
          created: page.metadata.created,
          updated: page.metadata.updated,
          snippet,
          score,
          matchCount: this._countMatches(page, searchTerms)
        });
      }
    }

    // Sort by relevance score (descending)
    results.sort((a, b) => b.score - a.score);

    return results;
  }

  /**
   * Extract table of contents from a wiki page
   * @param {string} pagePath - Path to the wiki page
   * @param {string} projectName - Project name
   * @returns {Promise<Array>} Array of TOC entries with headings and anchors
   */
  async getTableOfContents(pagePath, projectName) {
    const wikiManager = this.getWikiManager(projectName);
    const page = await wikiManager.getPage(pagePath);

    if (!page) {
      return [];
    }

    const toc = [];
    const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi;
    let match;

    while ((match = headingRegex.exec(page.content)) !== null) {
      const level = parseInt(match[1]);
      const text = match[2].replace(/<[^>]*>/g, '').trim();
      const anchor = this._generateAnchor(text);

      toc.push({
        level,
        text,
        anchor
      });
    }

    return toc;
  }

  /**
   * Find related pages based on links, tags, and category
   * @param {string} pagePath - Path to the wiki page
   * @param {string} projectName - Project name
   * @returns {Promise<Array>} Array of related pages with relevance scores
   */
  async getRelatedPages(pagePath, projectName) {
    const wikiManager = this.getWikiManager(projectName);
    const page = await wikiManager.getPage(pagePath);

    if (!page) {
      return [];
    }

    const allPages = await wikiManager.getAllPages();
    const relatedPages = [];

    // Get explicitly related pages from metadata
    const explicitRelated = page.metadata.related || [];
    const explicitRelatedSet = new Set(
      Array.isArray(explicitRelated) ? explicitRelated : [explicitRelated]
    );

    for (const pageInfo of allPages) {
      // Skip the current page
      if (pageInfo.path === pagePath) continue;

      const otherPage = await wikiManager.getPage(pageInfo.path);
      if (!otherPage) continue;

      const score = this._calculateRelationScore(page, otherPage, explicitRelatedSet);

      if (score > 0) {
        relatedPages.push({
          path: otherPage.path,
          title: otherPage.metadata.title || otherPage.path,
          category: otherPage.metadata.category || 'uncategorized',
          tags: otherPage.metadata.tags || [],
          score,
          relationship: this._describeRelationship(page, otherPage, explicitRelatedSet)
        });
      }
    }

    // Sort by relevance score (descending) and take top 10
    relatedPages.sort((a, b) => b.score - a.score);
    return relatedPages.slice(0, 10);
  }

  /**
   * Calculate relevance score for search results
   * @private
   */
  _calculateRelevanceScore(page, searchTerms) {
    let score = 0;
    const title = (page.metadata.title || '').toLowerCase();
    const content = page.content.toLowerCase();
    const category = (page.metadata.category || '').toLowerCase();
    const tags = Array.isArray(page.metadata.tags)
      ? page.metadata.tags.join(' ').toLowerCase()
      : '';

    for (const term of searchTerms) {
      // Title matches are most important
      if (title.includes(term)) {
        score += 100;
      }

      // Category matches are important
      if (category.includes(term)) {
        score += 50;
      }

      // Tag matches are important
      if (tags.includes(term)) {
        score += 40;
      }

      // Content matches
      const contentMatches = (content.match(new RegExp(term, 'g')) || []).length;
      score += contentMatches * 5;
    }

    return score;
  }

  /**
   * Count total matches in page
   * @private
   */
  _countMatches(page, searchTerms) {
    let count = 0;
    const text = `${page.metadata.title || ''} ${page.content}`.toLowerCase();

    for (const term of searchTerms) {
      const matches = (text.match(new RegExp(term, 'g')) || []).length;
      count += matches;
    }

    return count;
  }

  /**
   * Extract best snippet showing search matches
   * @private
   */
  _extractBestSnippet(page, searchTerms) {
    // Remove HTML tags for snippet extraction
    const plainText = page.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ');
    const lowerText = plainText.toLowerCase();

    // Find the first occurrence of any search term
    let bestIndex = -1;
    let bestTerm = '';

    for (const term of searchTerms) {
      const index = lowerText.indexOf(term);
      if (index !== -1 && (bestIndex === -1 || index < bestIndex)) {
        bestIndex = index;
        bestTerm = term;
      }
    }

    if (bestIndex === -1) {
      // No match found, return beginning
      return plainText.substring(0, 200) + '...';
    }

    // Extract context around the match
    const contextLength = 150;
    const start = Math.max(0, bestIndex - contextLength / 2);
    const end = Math.min(plainText.length, bestIndex + bestTerm.length + contextLength / 2);

    let snippet = plainText.substring(start, end);

    // Clean up snippet
    if (start > 0) snippet = '...' + snippet;
    if (end < plainText.length) snippet = snippet + '...';

    // Highlight search terms
    for (const term of searchTerms) {
      const regex = new RegExp(`(${term})`, 'gi');
      snippet = snippet.replace(regex, '<mark>$1</mark>');
    }

    return snippet;
  }

  /**
   * Calculate relation score between two pages
   * @private
   */
  _calculateRelationScore(page1, page2, explicitRelatedSet) {
    let score = 0;

    // Explicit relation is strongest
    if (explicitRelatedSet.has(page2.path)) {
      score += 1000;
    }

    // Same category
    if (page1.metadata.category === page2.metadata.category && page1.metadata.category) {
      score += 100;
    }

    // Shared tags
    const tags1 = new Set(Array.isArray(page1.metadata.tags) ? page1.metadata.tags : []);
    const tags2 = new Set(Array.isArray(page2.metadata.tags) ? page2.metadata.tags : []);
    const sharedTags = [...tags1].filter(tag => tags2.has(tag));
    score += sharedTags.length * 50;

    // Check for links in content (simplified - checks for page title mentions)
    const title1 = page1.metadata.title || '';
    const title2 = page2.metadata.title || '';

    if (title1 && page2.content.toLowerCase().includes(title1.toLowerCase())) {
      score += 30;
    }
    if (title2 && page1.content.toLowerCase().includes(title2.toLowerCase())) {
      score += 30;
    }

    return score;
  }

  /**
   * Describe the relationship between two pages
   * @private
   */
  _describeRelationship(page1, page2, explicitRelatedSet) {
    const relationships = [];

    if (explicitRelatedSet.has(page2.path)) {
      relationships.push('explicitly related');
    }

    if (page1.metadata.category === page2.metadata.category && page1.metadata.category) {
      relationships.push(`same category (${page1.metadata.category})`);
    }

    const tags1 = new Set(Array.isArray(page1.metadata.tags) ? page1.metadata.tags : []);
    const tags2 = new Set(Array.isArray(page2.metadata.tags) ? page2.metadata.tags : []);
    const sharedTags = [...tags1].filter(tag => tags2.has(tag));

    if (sharedTags.length > 0) {
      relationships.push(`shared tags: ${sharedTags.join(', ')}`);
    }

    return relationships.join('; ') || 'related content';
  }

  /**
   * Generate URL-friendly anchor from heading text
   * @private
   */
  _generateAnchor(text) {
    return text
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/--+/g, '-')
      .trim();
  }
}

module.exports = WikiSearchService;
