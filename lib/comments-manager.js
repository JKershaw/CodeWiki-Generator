const fs = require('fs').promises;
const path = require('path');

/**
 * CommentsManager handles comment storage and operations for wiki pages
 * Comments are stored in <project>/comments.json
 */
class CommentsManager {
  constructor(wikisBasePath = './wikis') {
    this.wikisBasePath = wikisBasePath;
  }

  /**
   * Get the path to comments file for a project
   * @private
   */
  getCommentsFilePath(project) {
    return path.join(this.wikisBasePath, project, 'comments.json');
  }

  /**
   * Load comments from file
   * @private
   */
  async loadComments(project) {
    const filePath = this.getCommentsFilePath(project);

    try {
      const data = await fs.readFile(filePath, 'utf-8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File doesn't exist yet, return empty structure
        return { comments: [] };
      }
      throw error;
    }
  }

  /**
   * Save comments to file
   * @private
   */
  async saveComments(project, data) {
    const filePath = this.getCommentsFilePath(project);
    const dirPath = path.dirname(filePath);

    // Ensure directory exists
    await fs.mkdir(dirPath, { recursive: true });

    // Write with pretty formatting
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf-8');
  }

  /**
   * Generate unique ID for comments
   * @private
   */
  generateId() {
    return `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  /**
   * Get all comments for a specific page
   * @param {string} project - Project name
   * @param {string} pageId - Page identifier (path)
   * @returns {Promise<Array>} Array of comments
   */
  async getComments(project, pageId) {
    const data = await this.loadComments(project);

    // Filter comments for this page, sorted by timestamp (newest first)
    const pageComments = data.comments
      .filter(comment => comment.pageId === pageId)
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    return pageComments;
  }

  /**
   * Add a new comment to a page
   * @param {string} project - Project name
   * @param {string} pageId - Page identifier (path)
   * @param {Object} commentData - Comment data { author, content }
   * @returns {Promise<Object>} Created comment
   */
  async addComment(project, pageId, commentData) {
    const data = await this.loadComments(project);

    const newComment = {
      id: this.generateId(),
      pageId,
      author: commentData.author || 'Anonymous',
      content: commentData.content,
      timestamp: new Date().toISOString(),
      resolved: false
    };

    data.comments.push(newComment);
    await this.saveComments(project, data);

    return newComment;
  }

  /**
   * Update an existing comment
   * @param {string} project - Project name
   * @param {string} commentId - Comment ID
   * @param {Object} updates - Fields to update
   * @returns {Promise<Object>} Updated comment
   */
  async updateComment(project, commentId, updates) {
    const data = await this.loadComments(project);

    const commentIndex = data.comments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
      throw new Error(`Comment not found: ${commentId}`);
    }

    // Update allowed fields
    const comment = data.comments[commentIndex];
    if (updates.content !== undefined) {
      comment.content = updates.content;
    }
    if (updates.author !== undefined) {
      comment.author = updates.author;
    }

    // Update timestamp to reflect modification
    comment.lastModified = new Date().toISOString();

    await this.saveComments(project, data);

    return comment;
  }

  /**
   * Delete a comment
   * @param {string} project - Project name
   * @param {string} commentId - Comment ID
   * @returns {Promise<void>}
   */
  async deleteComment(project, commentId) {
    const data = await this.loadComments(project);

    const commentIndex = data.comments.findIndex(c => c.id === commentId);

    if (commentIndex === -1) {
      throw new Error(`Comment not found: ${commentId}`);
    }

    data.comments.splice(commentIndex, 1);
    await this.saveComments(project, data);
  }

  /**
   * Toggle resolved status of a comment
   * @param {string} project - Project name
   * @param {string} commentId - Comment ID
   * @returns {Promise<Object>} Updated comment
   */
  async resolveComment(project, commentId) {
    const data = await this.loadComments(project);

    const comment = data.comments.find(c => c.id === commentId);

    if (!comment) {
      throw new Error(`Comment not found: ${commentId}`);
    }

    // Toggle resolved state
    comment.resolved = !comment.resolved;
    comment.resolvedAt = comment.resolved ? new Date().toISOString() : null;

    await this.saveComments(project, data);

    return comment;
  }

  /**
   * Get comment statistics for a project
   * @param {string} project - Project name
   * @returns {Promise<Object>} Statistics
   */
  async getStatistics(project) {
    const data = await this.loadComments(project);

    const total = data.comments.length;
    const resolved = data.comments.filter(c => c.resolved).length;
    const unresolved = total - resolved;

    // Count comments per page
    const byPage = {};
    data.comments.forEach(comment => {
      if (!byPage[comment.pageId]) {
        byPage[comment.pageId] = 0;
      }
      byPage[comment.pageId]++;
    });

    return {
      total,
      resolved,
      unresolved,
      byPage
    };
  }
}

module.exports = CommentsManager;
