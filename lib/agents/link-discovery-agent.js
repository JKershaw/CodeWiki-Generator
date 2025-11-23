/**
 * LinkDiscoveryAgent - Detects and manages cross-page hyperlinks
 * Responsible for finding mentions of wiki pages in content and suggesting links
 */
class LinkDiscoveryAgent {
  /**
   * Find all mentions of wiki page titles in content
   * @param {string} content - Page markdown content
   * @param {Array} allPages - All wiki pages with titles and paths
   * @returns {Array} Link mentions found
   */
  findMentions(content, allPages) {
    const mentions = [];

    for (const page of allPages) {
      const title = page.title || page.metadata?.title;
      if (!title) continue;

      // Skip very short titles (likely false positives)
      if (title.length < 4) continue;

      // Pattern 1: **Title** (bold text - highest priority)
      const boldPattern = new RegExp(`\\*\\*(${this._escapeRegex(title)})\\*\\*`, 'gi');
      let match;
      while ((match = boldPattern.exec(content)) !== null) {
        mentions.push({
          originalText: match[0],
          titleText: match[1],
          targetPath: page.path,
          targetTitle: title,
          position: match.index,
          priority: 1 // Bold = high priority
        });
      }

      // Pattern 2: Plain text with word boundaries
      const plainPattern = new RegExp(`\\b(${this._escapeRegex(title)})\\b`, 'gi');
      while ((match = plainPattern.exec(content)) !== null) {
        // Skip if it's inside bold (**...**) or already linked ([...])
        if (this._isInsideMarkup(content, match.index)) {
          continue;
        }

        mentions.push({
          originalText: match[0],
          titleText: match[1],
          targetPath: page.path,
          targetTitle: title,
          position: match.index,
          priority: 2 // Plain text = lower priority
        });
      }
    }

    return this._deduplicateMentions(mentions);
  }

  /**
   * Detect related pages based on content mentions
   * Used to populate frontmatter `related:` field
   * @param {string} pageContent - Current page content
   * @param {string} pagePath - Current page path
   * @param {Array} allPages - All wiki pages
   * @returns {Array<string>} Related page paths (max 5)
   */
  findRelatedPages(pageContent, pagePath, allPages) {
    const mentions = this.findMentions(pageContent, allPages);

    // Filter out self-references and count mentions per page
    const relatedCounts = {};
    mentions.forEach(mention => {
      if (mention.targetPath !== pagePath) {
        relatedCounts[mention.targetPath] = (relatedCounts[mention.targetPath] || 0) + 1;
      }
    });

    // Sort by mention count (descending) and take top 5
    const related = Object.entries(relatedCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([path, _]) => path);

    return related;
  }

  /**
   * Escape special regex characters in title for pattern matching
   * @private
   */
  _escapeRegex(text) {
    return text.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  /**
   * Check if position is inside bold, link, or code markup
   * @private
   */
  _isInsideMarkup(content, position) {
    // Look backwards for unclosed markup
    const before = content.substring(Math.max(0, position - 100), position);

    // Check for unclosed bold **
    const boldCount = (before.match(/\*\*/g) || []).length;
    if (boldCount % 2 === 1) return true; // Odd count = inside bold

    // Check for unclosed link [
    const bracketCount = (before.match(/\[/g) || []).length;
    const closeBracketCount = (before.match(/\]/g) || []).length;
    if (bracketCount > closeBracketCount) return true; // Inside link

    // Check for unclosed code `
    const backtickCount = (before.match(/`/g) || []).length;
    if (backtickCount % 2 === 1) return true; // Inside code

    return false;
  }

  /**
   * Deduplicate mentions that overlap
   * Prefers higher priority (bold > plain)
   * @private
   */
  _deduplicateMentions(mentions) {
    // Sort by position first, then by priority
    mentions.sort((a, b) => {
      if (a.position !== b.position) return a.position - b.position;
      return a.priority - b.priority;
    });

    const deduplicated = [];
    let lastEnd = -1;

    for (const mention of mentions) {
      // Skip if this mention overlaps with previous
      if (mention.position < lastEnd) {
        continue;
      }

      deduplicated.push(mention);
      lastEnd = mention.position + mention.originalText.length;
    }

    return deduplicated;
  }
}

module.exports = LinkDiscoveryAgent;
