const fs = require('fs').promises;
const path = require('path');
const { marked } = require('marked');

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
   * @returns {Object|null} Page object with metadata and HTML content, or null if not found
   */
  async getPage(filePath) {
    try {
      const fullPath = path.join(this.wikiPath, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');

      const { metadata, content: pageContent } = this._parseFrontmatter(content);

      // Convert markdown to HTML
      const htmlContent = await marked.parse(pageContent);

      return {
        path: filePath,
        metadata,
        content: htmlContent
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        return null;
      }
      throw error;
    }
  }

  /**
   * Get raw markdown content of a page (not converted to HTML)
   * @param {string} filePath - Path to the markdown file
   * @returns {Object} Page object with raw markdown content
   */
  async getRawPage(filePath) {
    try {
      const fullPath = path.join(this.wikiPath, filePath);
      const content = await fs.readFile(fullPath, 'utf-8');

      const { metadata, content: pageContent } = this._parseFrontmatter(content);

      return {
        path: filePath,
        metadata,
        content: pageContent  // Raw markdown, not HTML
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
   * Create a new wiki page
   * @param {string} filePath - Relative path for the new file
   * @param {string} content - Page content
   * @param {Object} metadata - Page metadata
   */
  async createPage(filePath, content, metadata = {}) {
    const fullPath = path.join(this.wikiPath, filePath);

    // Check if file already exists
    try {
      await fs.access(fullPath);
      throw new Error(`File already exists: ${filePath}`);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
    }

    // Create directory if needed
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    // Add timestamps if not provided
    const now = new Date().toISOString().split('T')[0];
    if (!metadata.created) {
      metadata.created = now;
    }
    if (!metadata.updated) {
      metadata.updated = now;
    }

    // Write file with frontmatter
    const fileContent = this._serializePage(metadata, content);
    await fs.writeFile(fullPath, fileContent, 'utf-8');
  }

  /**
   * Update an existing wiki page
   * @param {string} filePath - Path to the file
   * @param {string} content - New content
   * @param {Object} newMetadata - Optional metadata updates
   * @param {Object} commitInfo - Optional commit info { sha, timestamp } for history tracking
   */
  async updatePage(filePath, content, newMetadata = {}, commitInfo = null) {
    const fullPath = path.join(this.wikiPath, filePath);

    // Archive existing version before updating (if file exists)
    try {
      await fs.access(fullPath);
      // File exists, archive it before overwriting
      await this._archivePageVersion(filePath, commitInfo);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, no need to archive
    }

    // Get existing metadata by reading raw file (not HTML)
    let existingMetadata = {};
    try {
      const rawContent = await fs.readFile(fullPath, 'utf-8');
      const parsed = this._parseFrontmatter(rawContent);
      existingMetadata = parsed.metadata;
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // File doesn't exist, use empty metadata
    }

    // Merge metadata
    const metadata = {
      ...existingMetadata,
      ...newMetadata,
      updated: new Date().toISOString().split('T')[0]
    };

    // Ensure directory exists
    const dir = path.dirname(fullPath);
    await fs.mkdir(dir, { recursive: true });

    // Write file with markdown content (not HTML)
    const fileContent = this._serializePage(metadata, content);
    await fs.writeFile(fullPath, fileContent, 'utf-8');
  }

  /**
   * Update only the metadata of a page
   * @param {string} filePath - Path to the file
   * @param {Object} newMetadata - Metadata to merge
   */
  async updateMetadata(filePath, newMetadata = {}) {
    const fullPath = path.join(this.wikiPath, filePath);

    // Read raw file content (not HTML)
    let rawContent;
    try {
      rawContent = await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error(`Page not found: ${filePath}`);
      }
      throw error;
    }

    // Parse frontmatter to get existing metadata and markdown content
    const { metadata: existingMetadata, content: markdownContent } = this._parseFrontmatter(rawContent);

    const metadata = {
      ...existingMetadata,
      ...newMetadata,
      updated: new Date().toISOString().split('T')[0]
    };

    // Write back with updated metadata and original markdown content
    const fileContent = this._serializePage(metadata, markdownContent);
    await fs.writeFile(fullPath, fileContent, 'utf-8');
  }

  /**
   * Delete a wiki page
   * @param {string} filePath - Path to the file
   */
  async deletePage(filePath) {
    const fullPath = path.join(this.wikiPath, filePath);
    try {
      await fs.unlink(fullPath);
    } catch (error) {
      if (error.code !== 'ENOENT') {
        throw error;
      }
      // Ignore if file doesn't exist
    }
  }

  /**
   * Load global metadata (_metadata.json)
   * @returns {Object} Global metadata object
   */
  async loadGlobalMetadata() {
    const metadataPath = path.join(this.wikiPath, '_metadata.json');
    try {
      const content = await fs.readFile(metadataPath, 'utf-8');
      return JSON.parse(content);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Return default structure if file doesn't exist
        return {
          generated: new Date().toISOString(),
          pages: {},
          statistics: {
            totalPages: 0,
            concepts: 0,
            components: 0,
            guides: 0,
            totalCommitsProcessed: 0,
            orphanedPages: []
          }
        };
      }
      throw error;
    }
  }

  /**
   * Save global metadata (_metadata.json)
   * @param {Object} metadata - Global metadata object
   */
  async saveGlobalMetadata(metadata) {
    const metadataPath = path.join(this.wikiPath, '_metadata.json');
    await fs.writeFile(metadataPath, JSON.stringify(metadata, null, 2), 'utf-8');
  }

  /**
   * Update metadata for a specific page
   * @param {string} pagePath - Path to the page
   * @param {Object} pageMetadata - Page metadata to store
   */
  async updatePageGlobalMetadata(pagePath, pageMetadata) {
    const globalMetadata = await this.loadGlobalMetadata();

    // Update or create page entry
    globalMetadata.pages[pagePath] = {
      ...globalMetadata.pages[pagePath],
      ...pageMetadata,
      updated: new Date().toISOString().split('T')[0]
    };

    // Update statistics
    const allPages = Object.values(globalMetadata.pages);
    globalMetadata.statistics.totalPages = allPages.length;
    globalMetadata.statistics.concepts = allPages.filter(p => p.category === 'concept').length;
    globalMetadata.statistics.components = allPages.filter(p => p.category === 'component' || p.category === 'components').length;
    globalMetadata.statistics.guides = allPages.filter(p => p.category === 'guide' || p.category === 'guides').length;

    await this.saveGlobalMetadata(globalMetadata);
  }

  /**
   * Get metadata for a specific page from global metadata
   * @param {string} pagePath - Path to the page
   * @returns {Object|null} Page metadata or null
   */
  async getPageGlobalMetadata(pagePath) {
    const globalMetadata = await this.loadGlobalMetadata();
    return globalMetadata.pages[pagePath] || null;
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

  /**
   * Serialize metadata and content into markdown with frontmatter
   * @private
   */
  _serializePage(metadata, content) {
    const frontmatterLines = [];

    for (const [key, value] of Object.entries(metadata)) {
      if (Array.isArray(value)) {
        frontmatterLines.push(`${key}: [${value.join(', ')}]`);
      } else {
        frontmatterLines.push(`${key}: ${value}`);
      }
    }

    const frontmatter = frontmatterLines.join('\n');
    return `---\n${frontmatter}\n---\n\n${content}`;
  }

  /**
   * Archive the current version of a page before updating
   * @private
   * @param {string} filePath - Relative path to the page (e.g., 'concepts/architecture.md')
   * @param {Object} commitInfo - Optional { sha, timestamp } for naming the archive
   */
  async _archivePageVersion(filePath, commitInfo) {
    const fullPath = path.join(this.wikiPath, filePath);

    // Read current content
    let currentContent;
    try {
      currentContent = await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      // File doesn't exist, nothing to archive
      return;
    }

    // Determine archive directory structure
    // Example: 'concepts/architecture.md' -> '_history/concepts/architecture/'
    const filePathWithoutExt = filePath.replace(/\.md$/, '');
    const archiveDir = path.join(this.wikiPath, '_history', filePathWithoutExt);

    // Create archive directory
    await fs.mkdir(archiveDir, { recursive: true });

    // Generate archive filename with timestamp and optional commit SHA
    // Format: 2025-11-24T10-30-00-abc1234.md or 2025-11-24T10-30-00.md
    const timestamp = commitInfo?.timestamp
      ? commitInfo.timestamp.replace(/:/g, '-').replace(/Z$/, '').split('.')[0] // Remove Z and milliseconds
      : new Date().toISOString().replace(/:/g, '-').replace(/Z$/, '').split('.')[0];

    const commitSuffix = commitInfo?.sha ? `-${commitInfo.sha.slice(0, 7)}` : '';
    const archiveFileName = `${timestamp}${commitSuffix}.md`;
    const archivePath = path.join(archiveDir, archiveFileName);

    // Write archive
    await fs.writeFile(archivePath, currentContent, 'utf-8');
  }
}

module.exports = WikiManager;
