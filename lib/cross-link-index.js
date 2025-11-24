/**
 * CrossLinkIndex manages an inverted index for efficient cross-linking
 * Instead of scanning all pages to find mentions, we track which pages mention each page
 * This reduces cross-linking from O(n²) to O(k) where k = pages that actually need updates
 */
class CrossLinkIndex {
  constructor() {
    // Map of page title -> Set of page paths that mention it
    this.mentionIndex = new Map();

    // Map of page path -> Set of pages it mentions
    this.reverseIndex = new Map();
  }

  /**
   * Extract bold mentions from markdown content
   * Bold mentions like **Page Title** are candidates for cross-linking
   * @param {string} content - Markdown content
   * @returns {Set<string>} Set of mentioned page titles
   * @private
   */
  _extractBoldMentions(content) {
    const mentions = new Set();

    // Match **text** that isn't already a link
    const boldPattern = /\*\*([^*\]]+?)\*\*/g;
    let match;

    while ((match = boldPattern.exec(content)) !== null) {
      const text = match[1].trim();

      // Skip if it's just emphasis (too short or common words)
      if (text.length < 3) continue;

      mentions.add(text);
    }

    return mentions;
  }

  /**
   * Add a page to the index
   * @param {string} pagePath - Path to the page (e.g., "components/processor.md")
   * @param {string} content - Page content
   * @param {string} pageTitle - Page title
   */
  addPage(pagePath, content, pageTitle) {
    // Extract all bold mentions from this page's content
    const mentions = this._extractBoldMentions(content);

    // Store reverse mapping (this page -> pages it mentions)
    this.reverseIndex.set(pagePath, mentions);

    // Update forward index (mentioned page -> pages that mention it)
    for (const mentionedTitle of mentions) {
      if (!this.mentionIndex.has(mentionedTitle)) {
        this.mentionIndex.set(mentionedTitle, new Set());
      }
      this.mentionIndex.get(mentionedTitle).add(pagePath);
    }
  }

  /**
   * Remove a page from the index
   * @param {string} pagePath - Path to the page to remove
   */
  removePage(pagePath) {
    // Get all pages this page mentioned
    const mentions = this.reverseIndex.get(pagePath);

    if (mentions) {
      // Remove this page from all forward index entries
      for (const mentionedTitle of mentions) {
        const mentioners = this.mentionIndex.get(mentionedTitle);
        if (mentioners) {
          mentioners.delete(pagePath);

          // Clean up empty sets
          if (mentioners.size === 0) {
            this.mentionIndex.delete(mentionedTitle);
          }
        }
      }
    }

    // Remove from reverse index
    this.reverseIndex.delete(pagePath);
  }

  /**
   * Update a page in the index (remove old, add new)
   * @param {string} pagePath - Path to the page
   * @param {string} newContent - New content
   * @param {string} pageTitle - Page title
   */
  updatePage(pagePath, newContent, pageTitle) {
    this.removePage(pagePath);
    this.addPage(pagePath, newContent, pageTitle);
  }

  /**
   * Get all pages that should be updated when a specific page is modified
   * Returns pages that mention the modified page (they need link updates)
   * @param {string} pageTitle - Title of the modified page
   * @returns {Set<string>} Set of page paths that mention this page
   */
  getPagesToUpdate(pageTitle) {
    return this.mentionIndex.get(pageTitle) || new Set();
  }

  /**
   * Get all pages that mention any of the given page titles
   * @param {string[]} pageTitles - Array of page titles
   * @returns {Set<string>} Set of page paths that mention any of these pages
   */
  getPagesToUpdateForMultiple(pageTitles) {
    const allPaths = new Set();

    for (const title of pageTitles) {
      const paths = this.getPagesToUpdate(title);
      for (const path of paths) {
        allPaths.add(path);
      }
    }

    return allPaths;
  }

  /**
   * Get statistics about the index
   * @returns {Object} Statistics
   */
  getStats() {
    return {
      totalPages: this.reverseIndex.size,
      totalMentions: this.mentionIndex.size,
      avgMentionsPerPage: this.reverseIndex.size > 0
        ? Array.from(this.reverseIndex.values()).reduce((sum, set) => sum + set.size, 0) / this.reverseIndex.size
        : 0
    };
  }

  /**
   * Clear the entire index
   */
  clear() {
    this.mentionIndex.clear();
    this.reverseIndex.clear();
  }
}

module.exports = CrossLinkIndex;
