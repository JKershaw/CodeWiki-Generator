/**
 * Git History Frontend Module
 * Handles fetching and displaying git history for wiki pages
 */

class GitHistoryManager {
  constructor() {
    this.historyPanel = document.getElementById('history-panel');
    this.historyTimeline = document.getElementById('history-timeline');
    this.historyLoading = document.querySelector('.history-loading');
    this.noGitMessage = document.getElementById('no-git-message');
    this.historyToggleBtn = document.getElementById('history-toggle-btn');
    this.historyCloseBtn = document.getElementById('history-close-btn');

    this.isHistoryLoaded = false;
    this.commits = [];

    this.init();
  }

  init() {
    // Set up event listeners
    if (this.historyToggleBtn) {
      this.historyToggleBtn.addEventListener('click', () => this.toggleHistory());
    }

    if (this.historyCloseBtn) {
      this.historyCloseBtn.addEventListener('click', () => this.hideHistory());
    }
  }

  /**
   * Toggle history panel visibility
   */
  async toggleHistory() {
    if (this.historyPanel.style.display === 'none') {
      await this.showHistory();
    } else {
      this.hideHistory();
    }
  }

  /**
   * Show history panel and load data if needed
   */
  async showHistory() {
    this.historyPanel.style.display = 'block';

    // Scroll to history panel
    this.historyPanel.scrollIntoView({ behavior: 'smooth', block: 'start' });

    // Load history if not already loaded
    if (!this.isHistoryLoaded) {
      await this.loadHistory();
    }
  }

  /**
   * Hide history panel
   */
  hideHistory() {
    this.historyPanel.style.display = 'none';
  }

  /**
   * Load git history from API
   */
  async loadHistory() {
    try {
      // Show loading state
      this.historyLoading.parentElement.style.display = 'block';
      this.historyTimeline.style.display = 'none';
      this.noGitMessage.style.display = 'none';

      const { project, pagePath } = window.wikiData;

      // Remove .md extension if present for the URL
      const cleanPath = pagePath.replace('.md', '');

      // Fetch page history
      const response = await fetch(`/api/history/${project}/${cleanPath}`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to load history');
      }

      // Check if git repository exists
      if (!data.hasGit) {
        this.showNoGitMessage();
        return;
      }

      this.commits = data.commits || [];

      // Hide loading, show timeline
      this.historyLoading.parentElement.style.display = 'none';

      if (this.commits.length === 0) {
        this.showEmptyState();
      } else {
        this.renderTimeline();
      }

      this.isHistoryLoaded = true;
    } catch (error) {
      console.error('Error loading history:', error);
      this.showError(error.message);
    }
  }

  /**
   * Show message when no git repository is found
   */
  showNoGitMessage() {
    this.historyLoading.parentElement.style.display = 'none';
    this.historyTimeline.style.display = 'none';
    this.noGitMessage.style.display = 'block';
    this.isHistoryLoaded = true;
  }

  /**
   * Show empty state when no commits found
   */
  showEmptyState() {
    this.historyTimeline.innerHTML = `
      <div class="history-empty">
        <p>No commit history found for this page.</p>
      </div>
    `;
    this.historyTimeline.style.display = 'block';
  }

  /**
   * Show error message
   */
  showError(message) {
    this.historyLoading.parentElement.style.display = 'none';
    this.historyTimeline.innerHTML = `
      <div class="history-error">
        <p>Error loading history: ${this.escapeHtml(message)}</p>
      </div>
    `;
    this.historyTimeline.style.display = 'block';
  }

  /**
   * Render timeline with commits
   */
  renderTimeline() {
    this.historyTimeline.innerHTML = '';

    this.commits.forEach((commit, index) => {
      const commitElement = this.createCommitElement(commit, index === 0);
      this.historyTimeline.appendChild(commitElement);
    });

    this.historyTimeline.style.display = 'block';
  }

  /**
   * Create commit element for timeline
   */
  createCommitElement(commit, isLatest = false) {
    const commitDiv = document.createElement('div');
    commitDiv.className = 'timeline-item';
    if (isLatest) {
      commitDiv.classList.add('latest');
    }

    // Format date
    const date = new Date(commit.date);
    const formattedDate = this.formatDate(date);
    const relativeTime = this.getRelativeTime(date);

    // Get author initials for avatar
    const initials = this.getInitials(commit.author.name);

    // Create commit HTML
    commitDiv.innerHTML = `
      <div class="timeline-marker"></div>
      <div class="timeline-content">
        <div class="commit-header">
          <div class="commit-author">
            <div class="author-avatar" title="${this.escapeHtml(commit.author.name)}">
              ${initials}
            </div>
            <div class="author-info">
              <span class="author-name">${this.escapeHtml(commit.author.name)}</span>
              <span class="commit-date" title="${formattedDate}">${relativeTime}</span>
            </div>
          </div>
          <div class="commit-sha">
            <code>${commit.shortSha}</code>
          </div>
        </div>
        <div class="commit-message">
          ${this.escapeHtml(commit.message)}
        </div>
        ${commit.body ? `<div class="commit-body">${this.escapeHtml(commit.body)}</div>` : ''}
      </div>
    `;

    // Add click handler to view commit details (optional)
    commitDiv.addEventListener('click', () => {
      this.showCommitDetails(commit);
    });

    return commitDiv;
  }

  /**
   * Show commit details (future enhancement)
   */
  showCommitDetails(commit) {
    // For now, just log to console
    // In the future, could show a modal with diff
    console.log('Commit details:', commit);
  }

  /**
   * Format date as locale string
   */
  formatDate(date) {
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  /**
   * Get relative time string (e.g., "2 hours ago")
   */
  getRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (diffSec < 60) {
      return 'just now';
    } else if (diffMin < 60) {
      return `${diffMin} minute${diffMin !== 1 ? 's' : ''} ago`;
    } else if (diffHour < 24) {
      return `${diffHour} hour${diffHour !== 1 ? 's' : ''} ago`;
    } else if (diffDay < 7) {
      return `${diffDay} day${diffDay !== 1 ? 's' : ''} ago`;
    } else if (diffWeek < 4) {
      return `${diffWeek} week${diffWeek !== 1 ? 's' : ''} ago`;
    } else if (diffMonth < 12) {
      return `${diffMonth} month${diffMonth !== 1 ? 's' : ''} ago`;
    } else {
      return `${diffYear} year${diffYear !== 1 ? 's' : ''} ago`;
    }
  }

  /**
   * Get initials from name
   */
  getInitials(name) {
    if (!name) return '?';

    const parts = name.trim().split(/\s+/);
    if (parts.length === 1) {
      return parts[0].substring(0, 2).toUpperCase();
    }

    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  }

  /**
   * Escape HTML to prevent XSS
   */
  escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    window.gitHistoryManager = new GitHistoryManager();
  });
} else {
  window.gitHistoryManager = new GitHistoryManager();
}
