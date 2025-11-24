const WikiManager = require('./wiki-manager');
const path = require('path');

/**
 * WikiAnalytics provides statistical analysis and health metrics for wiki documentation
 */
class WikiAnalytics {
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
   * Analyze wiki and generate comprehensive statistics
   * @param {string} project - Project name
   * @returns {Object} Complete analytics data
   */
  async analyzeWiki(project) {
    const wikiManager = this.getProjectWikiManager(project);
    const allPages = await wikiManager.getAllPages();

    // Get detailed page data
    const pages = [];
    for (const pageInfo of allPages) {
      const page = await wikiManager.getPage(pageInfo.path);
      if (page) {
        pages.push({
          ...pageInfo,
          content: page.content,
          htmlContent: page.content
        });
      }
    }

    // Calculate all metrics
    const statistics = this.getStatistics(pages);
    const pageMetrics = this.getPageMetrics(pages);

    return {
      statistics,
      pageMetrics,
      pages: pages.map(p => ({
        path: p.path,
        metadata: p.metadata
      }))
    };
  }

  /**
   * Calculate aggregate statistics
   * @param {Array} pages - Array of page objects
   * @returns {Object} Statistics
   */
  getStatistics(pages) {
    // Category counts
    const categories = {};
    pages.forEach(page => {
      const category = page.metadata.category || 'uncategorized';
      categories[category] = (categories[category] || 0) + 1;
    });

    // Tag distribution
    const tags = {};
    pages.forEach(page => {
      const pageTags = page.metadata.tags || [];
      const tagArray = Array.isArray(pageTags) ? pageTags : [pageTags];
      tagArray.forEach(tag => {
        if (tag) {
          tags[tag] = (tags[tag] || 0) + 1;
        }
      });
    });

    // Calculate average page length
    const wordCounts = pages.map(p => this._countWords(p.content || ''));
    const avgPageLength = wordCounts.length > 0
      ? Math.round(wordCounts.reduce((a, b) => a + b, 0) / wordCounts.length)
      : 0;

    // Total links
    const totalLinks = pages.reduce((sum, page) => {
      return sum + this._countLinks(page.content || '');
    }, 0);

    // Link density (links per page)
    const linkDensity = pages.length > 0
      ? (totalLinks / pages.length).toFixed(2)
      : 0;

    // Update frequency by month
    const updatesByMonth = this._getUpdateFrequency(pages);

    // Orphaned pages (pages with no incoming links)
    const orphanedPages = this._findOrphanedPages(pages);

    // Dead links (links to non-existent pages)
    const deadLinks = this._findDeadLinks(pages);

    // Most/least linked pages
    const linkCounts = this._calculateLinkCounts(pages);
    const mostLinked = this._getTopLinked(linkCounts, 10);
    const leastLinked = this._getLeastLinked(pages, linkCounts, 10);

    return {
      totalPages: pages.length,
      categoryCount: Object.keys(categories).length,
      categories,
      avgPageLength,
      totalLinks,
      linkDensity: parseFloat(linkDensity),
      tags,
      tagCount: Object.keys(tags).length,
      updatesByMonth,
      orphanedPages,
      orphanedCount: orphanedPages.length,
      deadLinks,
      deadLinkCount: deadLinks.length,
      mostLinked,
      leastLinked
    };
  }

  /**
   * Get detailed metrics for individual pages
   * @param {Array} pages - Array of page objects
   * @returns {Array} Page metrics
   */
  getPageMetrics(pages) {
    return pages.map(page => {
      const wordCount = this._countWords(page.content || '');
      const linkCount = this._countLinks(page.content || '');
      const headingCount = this._countHeadings(page.content || '');

      return {
        path: page.path,
        title: page.metadata.title || 'Untitled',
        category: page.metadata.category || 'uncategorized',
        wordCount,
        linkCount,
        headingCount,
        created: page.metadata.created || 'unknown',
        updated: page.metadata.updated || 'unknown'
      };
    }).sort((a, b) => b.wordCount - a.wordCount); // Sort by word count descending
  }

  /**
   * Count words in content
   * @private
   */
  _countWords(content) {
    // Strip HTML tags and count words
    const text = content.replace(/<[^>]*>/g, ' ');
    const words = text.trim().split(/\s+/);
    return words.filter(w => w.length > 0).length;
  }

  /**
   * Count links in content
   * @private
   */
  _countLinks(content) {
    // Count markdown links [text](url) and HTML links <a href="">
    const mdLinks = (content.match(/\[([^\]]+)\]\(([^)]+)\)/g) || []).length;
    const htmlLinks = (content.match(/<a[^>]*href=["']([^"']*)["'][^>]*>/g) || []).length;
    return mdLinks + htmlLinks;
  }

  /**
   * Count headings in content
   * @private
   */
  _countHeadings(content) {
    // Count markdown headings (# ## ###) and HTML headings (<h1> <h2>)
    const mdHeadings = (content.match(/^#{1,6}\s+.+$/gm) || []).length;
    const htmlHeadings = (content.match(/<h[1-6][^>]*>/g) || []).length;
    return mdHeadings + htmlHeadings;
  }

  /**
   * Get update frequency by month
   * @private
   */
  _getUpdateFrequency(pages) {
    const monthCounts = {};

    pages.forEach(page => {
      const updated = page.metadata.updated;
      if (updated && updated !== 'unknown') {
        // Extract year-month (e.g., "2025-01" from "2025-01-15")
        const yearMonth = updated.substring(0, 7);
        monthCounts[yearMonth] = (monthCounts[yearMonth] || 0) + 1;
      }
    });

    // Sort by date
    return Object.entries(monthCounts)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([month, count]) => ({ month, count }));
  }

  /**
   * Find orphaned pages (pages with no incoming links)
   * @private
   */
  _findOrphanedPages(pages) {
    const allPagePaths = new Set(pages.map(p => p.path));
    const linkedPages = new Set();

    // Find all pages that are linked to
    pages.forEach(page => {
      const content = page.content || '';
      const links = this._extractLinks(content);

      links.forEach(link => {
        // Normalize link to match page path
        const normalizedLink = this._normalizeLink(link);
        if (allPagePaths.has(normalizedLink)) {
          linkedPages.add(normalizedLink);
        }
      });
    });

    // Pages that exist but aren't linked to (excluding index.md)
    const orphaned = pages
      .filter(p => !linkedPages.has(p.path) && !p.path.includes('index.md'))
      .map(p => ({
        path: p.path,
        title: p.metadata.title || 'Untitled'
      }));

    return orphaned;
  }

  /**
   * Find dead links (links to non-existent pages)
   * @private
   */
  _findDeadLinks(pages) {
    const allPagePaths = new Set(pages.map(p => p.path));
    const deadLinks = [];

    pages.forEach(page => {
      const content = page.content || '';
      const links = this._extractLinks(content);

      links.forEach(link => {
        const normalizedLink = this._normalizeLink(link);

        // Check if it's an internal wiki link that doesn't exist
        if (this._isInternalLink(link) && !allPagePaths.has(normalizedLink)) {
          deadLinks.push({
            sourcePage: page.path,
            sourceTitle: page.metadata.title || 'Untitled',
            deadLink: link,
            normalizedLink
          });
        }
      });
    });

    return deadLinks;
  }

  /**
   * Calculate incoming link counts for each page
   * @private
   */
  _calculateLinkCounts(pages) {
    const linkCounts = {};

    // Initialize all pages with 0 links
    pages.forEach(page => {
      linkCounts[page.path] = 0;
    });

    // Count incoming links
    pages.forEach(page => {
      const content = page.content || '';
      const links = this._extractLinks(content);

      links.forEach(link => {
        const normalizedLink = this._normalizeLink(link);
        if (linkCounts.hasOwnProperty(normalizedLink)) {
          linkCounts[normalizedLink]++;
        }
      });
    });

    return linkCounts;
  }

  /**
   * Get top N most linked pages
   * @private
   */
  _getTopLinked(linkCounts, n = 10) {
    return Object.entries(linkCounts)
      .sort(([, a], [, b]) => b - a)
      .slice(0, n)
      .map(([path, count]) => ({ path, linkCount: count }));
  }

  /**
   * Get pages with least links (excluding orphans)
   * @private
   */
  _getLeastLinked(pages, linkCounts, n = 10) {
    return Object.entries(linkCounts)
      .filter(([path, count]) => count > 0 && !path.includes('index.md'))
      .sort(([, a], [, b]) => a - b)
      .slice(0, n)
      .map(([path, count]) => {
        const page = pages.find(p => p.path === path);
        return {
          path,
          title: page?.metadata?.title || 'Untitled',
          linkCount: count
        };
      });
  }

  /**
   * Extract all links from content
   * @private
   */
  _extractLinks(content) {
    const links = [];

    // Extract markdown links [text](url)
    const mdLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let match;
    while ((match = mdLinkRegex.exec(content)) !== null) {
      links.push(match[2]);
    }

    // Extract HTML links <a href="url">
    const htmlLinkRegex = /<a[^>]*href=["']([^"']*)["'][^>]*>/g;
    while ((match = htmlLinkRegex.exec(content)) !== null) {
      links.push(match[1]);
    }

    return links;
  }

  /**
   * Normalize link to match page path format
   * @private
   */
  _normalizeLink(link) {
    // Remove leading slash
    let normalized = link.startsWith('/') ? link.substring(1) : link;

    // Remove /wiki/ prefix if present
    normalized = normalized.replace(/^wiki\/[^/]+\//, '');

    // Add .md extension if not present and not an external link
    if (!normalized.includes('http') && !normalized.endsWith('.md')) {
      normalized = normalized + '.md';
    }

    return normalized;
  }

  /**
   * Check if link is internal to the wiki
   * @private
   */
  _isInternalLink(link) {
    // External links contain http:// or https://
    if (link.includes('http://') || link.includes('https://')) {
      return false;
    }

    // Anchors only
    if (link.startsWith('#')) {
      return false;
    }

    return true;
  }
}

module.exports = WikiAnalytics;
