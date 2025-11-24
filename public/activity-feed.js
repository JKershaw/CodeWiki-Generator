// Activity Feed - Client-Side JavaScript
// Handles real-time activity updates via Server-Sent Events

class ActivityFeedManager {
  constructor() {
    this.eventSource = null;
    this.events = [];
    this.currentFilter = 'all';
    this.maxEvents = 100;
    this.isConnected = false;
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
    this.reconnectDelay = 1000; // Start with 1 second

    this.init();
  }

  init() {
    // DOM elements
    this.feedContainer = document.getElementById('activityFeed');
    this.connectionStatus = document.getElementById('connectionStatus');
    this.eventCountEl = document.getElementById('eventCount');
    this.toggleBtn = document.getElementById('toggleActivity');
    this.exportBtn = document.getElementById('exportActivity');
    this.clearBtn = document.getElementById('clearActivity');
    this.filterButtons = document.querySelectorAll('.filter-btn');
    this.activityContent = document.getElementById('activityContent');

    if (!this.feedContainer) {
      console.error('Activity feed container not found');
      return;
    }

    this.setupEventListeners();
    this.connectToFeed();
  }

  setupEventListeners() {
    // Toggle panel
    if (this.toggleBtn) {
      this.toggleBtn.addEventListener('click', () => this.togglePanel());
    }

    // Filter buttons
    this.filterButtons.forEach(btn => {
      btn.addEventListener('click', (e) => {
        this.setFilter(e.target.dataset.filter);
      });
    });

    // Export button
    if (this.exportBtn) {
      this.exportBtn.addEventListener('click', () => this.exportToJSON());
    }

    // Clear button
    if (this.clearBtn) {
      this.clearBtn.addEventListener('click', () => this.clearHistory());
    }

    // Reconnect on visibility change
    document.addEventListener('visibilitychange', () => {
      if (!document.hidden && !this.isConnected) {
        this.connectToFeed();
      }
    });
  }

  connectToFeed() {
    if (this.eventSource) {
      this.eventSource.close();
    }

    this.updateConnectionStatus('connecting', 'Connecting...');

    try {
      this.eventSource = new EventSource('/api/activity/feed');

      this.eventSource.addEventListener('open', () => {
        this.isConnected = true;
        this.reconnectAttempts = 0;
        this.reconnectDelay = 1000;
        this.updateConnectionStatus('connected', 'Connected');
      });

      this.eventSource.addEventListener('history', (e) => {
        const history = JSON.parse(e.data);
        this.loadHistory(history);
      });

      this.eventSource.addEventListener('activity', (e) => {
        const event = JSON.parse(e.data);
        this.addEvent(event);
      });

      this.eventSource.addEventListener('error', (e) => {
        this.isConnected = false;
        this.updateConnectionStatus('error', 'Connection error');
        this.eventSource.close();

        // Attempt to reconnect with exponential backoff
        if (this.reconnectAttempts < this.maxReconnectAttempts) {
          this.reconnectAttempts++;
          const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);

          console.log(`Reconnecting in ${delay}ms (attempt ${this.reconnectAttempts}/${this.maxReconnectAttempts})`);

          setTimeout(() => {
            this.connectToFeed();
          }, delay);
        } else {
          this.updateConnectionStatus('error', 'Connection failed. Refresh page to retry.');
        }
      });

    } catch (error) {
      console.error('Error connecting to activity feed:', error);
      this.updateConnectionStatus('error', 'Failed to connect');
    }
  }

  loadHistory(history) {
    // Clear existing events
    this.events = [];
    this.feedContainer.innerHTML = '';

    // Load history events (already reversed from backend)
    if (history && history.length > 0) {
      history.forEach(event => {
        this.events.unshift(event); // Add to beginning to maintain order
      });
      this.renderEvents();
    } else {
      this.showEmptyState();
    }
  }

  addEvent(event) {
    // Remove empty state if present
    const emptyState = this.feedContainer.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    // Add event to beginning of array
    this.events.unshift(event);

    // Limit events
    if (this.events.length > this.maxEvents) {
      this.events.pop();
    }

    // Create and prepend event element with animation
    const eventEl = this.createEventElement(event);
    this.feedContainer.insertBefore(eventEl, this.feedContainer.firstChild);

    // Trigger animation
    setTimeout(() => {
      eventEl.classList.add('show');
    }, 10);

    // Update count
    this.updateEventCount();

    // Apply current filter
    if (this.currentFilter !== 'all' && event.type !== this.currentFilter) {
      eventEl.style.display = 'none';
    }
  }

  createEventElement(event) {
    const div = document.createElement('div');
    div.className = `activity-item event-${event.type.toLowerCase()}`;
    div.dataset.type = event.type;
    div.dataset.id = event.id;

    const icon = this.getEventIcon(event.type);
    const time = this.formatTime(event.timestamp);
    const message = this.formatEventMessage(event);

    div.innerHTML = `
      <div class="event-icon">${icon}</div>
      <div class="event-content">
        <div class="event-header">
          <span class="event-type">${this.formatEventType(event.type)}</span>
          <span class="event-time">${time}</span>
        </div>
        <div class="event-message">${message}</div>
      </div>
    `;

    return div;
  }

  getEventIcon(type) {
    const icons = {
      'COMMIT_START': '📝',
      'FILE_ANALYSIS': '🔍',
      'WIKI_UPDATE': '📄',
      'ERROR': '❌',
      'COMPLETION': '✅'
    };
    return icons[type] || '📌';
  }

  formatEventType(type) {
    const types = {
      'COMMIT_START': 'Commit',
      'FILE_ANALYSIS': 'File Analysis',
      'WIKI_UPDATE': 'Wiki Update',
      'ERROR': 'Error',
      'COMPLETION': 'Completion'
    };
    return types[type] || type;
  }

  formatEventMessage(event) {
    switch (event.type) {
      case 'COMMIT_START':
        return `<strong>${this.truncate(event.commitSha, 8)}</strong>: ${this.escapeHtml(event.commitMessage)}`;

      case 'FILE_ANALYSIS':
        return `<strong>${this.escapeHtml(event.fileName)}</strong> - ${event.status}`;

      case 'WIKI_UPDATE':
        return `<strong>${this.escapeHtml(event.pagePath)}</strong> ${event.action}`;

      case 'ERROR':
        return `<span class="error-text">${this.escapeHtml(event.error)}</span> in ${event.context}`;

      case 'COMPLETION':
        const s = event.summary;
        return `Processed ${s.filesProcessed} files, ${s.pagesCreated} pages created, ${s.pagesUpdated} updated`;

      default:
        return JSON.stringify(event);
    }
  }

  formatTime(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diff = now - date;

    // Less than 1 minute
    if (diff < 60000) {
      return 'just now';
    }

    // Less than 1 hour
    if (diff < 3600000) {
      const minutes = Math.floor(diff / 60000);
      return `${minutes}m ago`;
    }

    // Less than 24 hours
    if (diff < 86400000) {
      const hours = Math.floor(diff / 3600000);
      return `${hours}h ago`;
    }

    // Format as time
    return date.toLocaleTimeString();
  }

  renderEvents() {
    this.feedContainer.innerHTML = '';

    const filteredEvents = this.currentFilter === 'all'
      ? this.events
      : this.events.filter(e => e.type === this.currentFilter);

    if (filteredEvents.length === 0) {
      this.showEmptyState();
      return;
    }

    filteredEvents.forEach(event => {
      const eventEl = this.createEventElement(event);
      eventEl.classList.add('show');
      this.feedContainer.appendChild(eventEl);
    });

    this.updateEventCount();
  }

  setFilter(filter) {
    this.currentFilter = filter;

    // Update button states
    this.filterButtons.forEach(btn => {
      btn.classList.toggle('active', btn.dataset.filter === filter);
    });

    // Re-render events
    this.renderEvents();
  }

  showEmptyState() {
    this.feedContainer.innerHTML = `
      <div class="empty-state">
        <p>${this.currentFilter === 'all'
          ? 'No activity yet. Start processing to see real-time updates.'
          : `No ${this.formatEventType(this.currentFilter)} events.`}</p>
      </div>
    `;
  }

  updateConnectionStatus(status, text) {
    if (!this.connectionStatus) return;

    const indicator = this.connectionStatus.querySelector('.status-indicator');
    const statusText = this.connectionStatus.querySelector('.status-text');

    indicator.className = `status-indicator status-${status}`;
    statusText.textContent = text;
  }

  updateEventCount() {
    if (!this.eventCountEl) return;

    const count = this.currentFilter === 'all'
      ? this.events.length
      : this.events.filter(e => e.type === this.currentFilter).length;

    this.eventCountEl.textContent = count;
  }

  togglePanel() {
    const isExpanded = this.toggleBtn.getAttribute('aria-expanded') === 'true';
    const newState = !isExpanded;

    this.toggleBtn.setAttribute('aria-expanded', newState);
    this.activityContent.style.display = newState ? 'block' : 'none';

    const icon = this.toggleBtn.querySelector('.toggle-icon');
    if (icon) {
      icon.textContent = newState ? '−' : '+';
    }
  }

  async exportToJSON() {
    try {
      const response = await fetch('/api/activity/history?limit=1000');
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to export');
      }

      const blob = new Blob(
        [JSON.stringify(data, null, 2)],
        { type: 'application/json' }
      );

      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `activity-log-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

    } catch (error) {
      console.error('Error exporting activity:', error);
      alert(`Failed to export: ${error.message}`);
    }
  }

  async clearHistory() {
    if (!confirm('Clear all activity history? This cannot be undone.')) {
      return;
    }

    try {
      const response = await fetch('/api/activity/clear', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        }
      });

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || 'Failed to clear history');
      }

      // Clear local events
      this.events = [];
      this.renderEvents();

    } catch (error) {
      console.error('Error clearing activity:', error);
      alert(`Failed to clear history: ${error.message}`);
    }
  }

  // Utility functions
  truncate(str, length) {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
  }

  escapeHtml(text) {
    if (!text) return '';
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
    this.isConnected = false;
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  window.activityFeed = new ActivityFeedManager();
});

// Clean up on page unload
window.addEventListener('beforeunload', () => {
  if (window.activityFeed) {
    window.activityFeed.disconnect();
  }
});
