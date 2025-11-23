/**
 * Comments functionality for wiki pages
 * Handles loading, adding, editing, deleting, and resolving comments
 */

(function() {
  'use strict';

  // State
  let currentProject = '';
  let currentPageId = '';
  let comments = [];
  let editingCommentId = null;

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    // Get page data from window.wikiData
    if (window.wikiData) {
      currentProject = window.wikiData.project;
      currentPageId = window.wikiData.pagePath;
    } else {
      console.error('Wiki data not found');
      return;
    }

    // Set up event listeners
    setupEventListeners();

    // Load comments
    loadComments();
  }

  function setupEventListeners() {
    const form = document.getElementById('add-comment-form');
    if (form) {
      form.addEventListener('submit', handleAddComment);
    }
  }

  /**
   * Load comments from the server
   */
  async function loadComments() {
    const commentsList = document.getElementById('comments-list');

    try {
      const response = await fetch(`/api/comments/${currentProject}/${encodeURIComponent(currentPageId)}`);

      if (!response.ok) {
        throw new Error('Failed to load comments');
      }

      const data = await response.json();
      comments = data.comments || [];

      renderComments();
    } catch (error) {
      console.error('Error loading comments:', error);
      commentsList.innerHTML = '<div class="comments-error">Failed to load comments. Please try again later.</div>';
    }
  }

  /**
   * Render all comments to the DOM
   */
  function renderComments() {
    const commentsList = document.getElementById('comments-list');

    if (comments.length === 0) {
      commentsList.innerHTML = '<div class="comments-empty">No comments yet. Be the first to comment!</div>';
      return;
    }

    commentsList.innerHTML = comments.map(comment => renderComment(comment)).join('');

    // Attach event listeners to comment actions
    attachCommentEventListeners();
  }

  /**
   * Render a single comment
   */
  function renderComment(comment) {
    const date = new Date(comment.timestamp);
    const formattedDate = date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
    const resolvedClass = comment.resolved ? 'comment-resolved' : '';
    const resolvedBadge = comment.resolved ? '<span class="comment-resolved-badge">Resolved</span>' : '';

    return `
      <div class="comment-card ${resolvedClass}" data-comment-id="${comment.id}">
        <div class="comment-header">
          <div class="comment-author-info">
            <span class="comment-author">${escapeHtml(comment.author)}</span>
            <span class="comment-timestamp">${formattedDate}</span>
            ${resolvedBadge}
          </div>
          <div class="comment-actions">
            <label class="comment-resolve-toggle">
              <input
                type="checkbox"
                class="resolve-checkbox"
                data-comment-id="${comment.id}"
                ${comment.resolved ? 'checked' : ''}
              />
              <span class="resolve-label">${comment.resolved ? 'Resolved' : 'Resolve'}</span>
            </label>
            <button class="comment-action-btn edit-btn" data-comment-id="${comment.id}">Edit</button>
            <button class="comment-action-btn delete-btn" data-comment-id="${comment.id}">Delete</button>
          </div>
        </div>
        <div class="comment-body">
          <div class="comment-content" data-comment-id="${comment.id}">
            ${escapeHtml(comment.content)}
          </div>
          <div class="comment-edit-form" data-comment-id="${comment.id}" style="display: none;">
            <textarea class="comment-edit-textarea" rows="4">${escapeHtml(comment.content)}</textarea>
            <div class="comment-edit-actions">
              <button class="btn btn-primary save-edit-btn" data-comment-id="${comment.id}">Save</button>
              <button class="btn btn-secondary cancel-edit-btn" data-comment-id="${comment.id}">Cancel</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Attach event listeners to comment action buttons
   */
  function attachCommentEventListeners() {
    // Edit buttons
    document.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', handleEditClick);
    });

    // Delete buttons
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', handleDeleteClick);
    });

    // Resolve checkboxes
    document.querySelectorAll('.resolve-checkbox').forEach(checkbox => {
      checkbox.addEventListener('change', handleResolveToggle);
    });

    // Save edit buttons
    document.querySelectorAll('.save-edit-btn').forEach(btn => {
      btn.addEventListener('click', handleSaveEdit);
    });

    // Cancel edit buttons
    document.querySelectorAll('.cancel-edit-btn').forEach(btn => {
      btn.addEventListener('click', handleCancelEdit);
    });
  }

  /**
   * Handle adding a new comment
   */
  async function handleAddComment(event) {
    event.preventDefault();

    const form = event.target;
    const authorInput = form.querySelector('#comment-author');
    const contentInput = form.querySelector('#comment-content');

    const author = authorInput.value.trim() || 'Anonymous';
    const content = contentInput.value.trim();

    if (!content) {
      alert('Please enter a comment');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${currentProject}/${encodeURIComponent(currentPageId)}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ author, content })
      });

      if (!response.ok) {
        throw new Error('Failed to add comment');
      }

      // Clear form
      authorInput.value = '';
      contentInput.value = '';

      // Reload comments
      await loadComments();

      // Scroll to comments section
      document.getElementById('comments-section').scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment. Please try again.');
    }
  }

  /**
   * Handle edit button click
   */
  function handleEditClick(event) {
    const commentId = event.target.dataset.commentId;
    showEditForm(commentId);
  }

  /**
   * Show edit form for a comment
   */
  function showEditForm(commentId) {
    // Hide all edit forms first
    document.querySelectorAll('.comment-edit-form').forEach(form => {
      form.style.display = 'none';
    });
    document.querySelectorAll('.comment-content').forEach(content => {
      content.style.display = 'block';
    });

    // Show this comment's edit form
    const contentDiv = document.querySelector(`.comment-content[data-comment-id="${commentId}"]`);
    const editForm = document.querySelector(`.comment-edit-form[data-comment-id="${commentId}"]`);

    if (contentDiv && editForm) {
      contentDiv.style.display = 'none';
      editForm.style.display = 'block';
      editingCommentId = commentId;
    }
  }

  /**
   * Handle cancel edit button click
   */
  function handleCancelEdit(event) {
    const commentId = event.target.dataset.commentId;
    hideEditForm(commentId);
  }

  /**
   * Hide edit form for a comment
   */
  function hideEditForm(commentId) {
    const contentDiv = document.querySelector(`.comment-content[data-comment-id="${commentId}"]`);
    const editForm = document.querySelector(`.comment-edit-form[data-comment-id="${commentId}"]`);

    if (contentDiv && editForm) {
      contentDiv.style.display = 'block';
      editForm.style.display = 'none';
      editingCommentId = null;
    }
  }

  /**
   * Handle save edit button click
   */
  async function handleSaveEdit(event) {
    const commentId = event.target.dataset.commentId;
    const editForm = document.querySelector(`.comment-edit-form[data-comment-id="${commentId}"]`);
    const textarea = editForm.querySelector('.comment-edit-textarea');
    const newContent = textarea.value.trim();

    if (!newContent) {
      alert('Comment cannot be empty');
      return;
    }

    try {
      const response = await fetch(`/api/comments/${currentProject}/${commentId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ content: newContent })
      });

      if (!response.ok) {
        throw new Error('Failed to update comment');
      }

      // Reload comments
      await loadComments();
    } catch (error) {
      console.error('Error updating comment:', error);
      alert('Failed to update comment. Please try again.');
    }
  }

  /**
   * Handle delete button click
   */
  async function handleDeleteClick(event) {
    const commentId = event.target.dataset.commentId;

    if (!confirm('Are you sure you want to delete this comment?')) {
      return;
    }

    try {
      const response = await fetch(`/api/comments/${currentProject}/${commentId}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Failed to delete comment');
      }

      // Reload comments
      await loadComments();
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment. Please try again.');
    }
  }

  /**
   * Handle resolve checkbox toggle
   */
  async function handleResolveToggle(event) {
    const commentId = event.target.dataset.commentId;

    try {
      const response = await fetch(`/api/comments/${currentProject}/${commentId}/resolve`, {
        method: 'POST'
      });

      if (!response.ok) {
        throw new Error('Failed to toggle resolve status');
      }

      // Reload comments
      await loadComments();
    } catch (error) {
      console.error('Error toggling resolve status:', error);
      alert('Failed to update comment status. Please try again.');
      // Revert checkbox state
      event.target.checked = !event.target.checked;
    }
  }

  /**
   * Escape HTML to prevent XSS
   */
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
})();
