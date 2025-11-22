const fs = require('fs').promises;
const path = require('path');

/**
 * WikiManager handles reading and writing wiki markdown files
 */
class WikiManager {
  constructor(wikiPath = './wiki') {
    this.wikiPath = wikiPath;
  }

  /**
   * Read a wiki page and parse frontmatter
   * @param {string} filePath - Relative path to markdown file
   * @returns {Object|null} Page object with metadata and content, or null if not found
   */
  async getPage(filePath) {
    try {
      const fullPath = path.join(this.wikiPath, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');

      const { metadata, content: pageContent } = this._parseFrontmatter(content);

      return {
        path: filePath,
        metadata,
        content: pageContent
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get all markdown pages in the wiki
   * @returns {Array} Array of page objects with path and metadata
   */
  async getAllPages() {
    try {
      const pages = [];
      await this._collectPages(this.wikiPath, '', pages);
      return pages;
    } catch (error) {
      if (error.code === 'ENOENT') {
        return [];
      }
      throw error;
    }
  }

  /**
   * Search pages for keyword in content or title
   * @param {string} keywords - Search terms
   * @returns {Array} Array of matching pages with snippets
   */
  async searchPages(keywords) {
    const allPages = await this.getAllPages();
    const searchTerm = keywords.toLowerCase();
    const results = [];

    for (const pageInfo of allPages) {
      const page = await this.getPage(pageInfo.path);
      if (!page) continue;

      const titleMatch = page.metadata.title?.toLowerCase().includes(searchTerm);
      const contentMatch = page.content.toLowerCase().includes(searchTerm);

      if (titleMatch || contentMatch) {
        // Extract snippet around match
        const snippet = this._extractSnippet(page.content, searchTerm);
        results.push({
          path: page.path,
          metadata: page.metadata,
          matches: snippet
        });
      }
    }

    return results;
  }

  /**
   * Get related pages for a given page (max 3)
   * @param {string} filePath - Path to the page
   * @returns {Array} Array of related page paths
   */
  async getRelatedPages(filePath) {
    const page = await this.getPage(filePath);
    if (!page || !page.metadata.related) {
      return [];
    }

    const related = Array.isArray(page.metadata.related)
      ? page.metadata.related
      : [page.metadata.related];

    return related.slice(0, 3);
  }

  /**
   * Parse frontmatter from markdown content
   * @private
   */
  _parseFrontmatter(content) {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/;
    const match = content.match(frontmatterRegex);

    if (!match) {
      return { metadata: {}, content };
    }

    const [, frontmatterText, pageContent] = match;
    const metadata = this._parseFrontmatterYaml(frontmatterText);

    return { metadata, content: pageContent };
  }

  /**
   * Parse YAML-like frontmatter into object
   * @private
   */
  _parseFrontmatterYaml(text) {
    const metadata = {};
    const lines = text.split('\n');

    for (const line of lines) {
      const match = line.match(/^(\w+):\s*(.+)$/);
      if (match) {
        const [, key, value] = match;

        // Handle arrays [item1, item2]
        if (value.startsWith('[') && value.endsWith(']')) {
          const items = value.slice(1, -1).split(',').map(s => s.trim());
          metadata[key] = items;
        } else {
          metadata[key] = value;
        }
      }
    }

    return metadata;
  }

  /**
   * Recursively collect all markdown files
   * @private
   */
  async _collectPages(dir, relativePath, pages) {
    try {
      const entries = await fs.readdir(dir, { withFileTypes: true });

      for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        const relPath = path.join(relativePath, entry.name);

        if (entry.isDirectory()) {
          await this._collectPages(fullPath, relPath, pages);
        } else if (entry.isFile() && entry.name.endsWith('.md')) {
          const content = await fs.readFile(fullPath, 'utf-8');
          const { metadata } = this._parseFrontmatter(content);
          pages.push({
            path: relPath,
            metadata
          });
        }
      }
    } catch (error) {
      // Ignore errors for individual files
      if (error.code !== 'ENOENT') {
        console.warn(`Warning: Could not read directory ${dir}:`, error.message);
      }
    }
  }

  /**
   * Extract a snippet of content around the search term
   * @private
   */
  _extractSnippet(content, searchTerm, contextLength = 100) {
    const lowerContent = content.toLowerCase();
    const index = lowerContent.indexOf(searchTerm);

    if (index === -1) {
      return content.substring(0, contextLength) + '...';
    }

    const start = Math.max(0, index - contextLength / 2);
    const end = Math.min(content.length, index + searchTerm.length + contextLength / 2);

    let snippet = content.substring(start, end);
    if (start > 0) snippet = '...' + snippet;
    if (end < content.length) snippet = snippet + '...';

    return snippet;
  }
}

module.exports = WikiManager;
