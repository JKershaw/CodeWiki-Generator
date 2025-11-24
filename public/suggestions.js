/**
 * Suggestions page JavaScript - Smart documentation improvement suggestions
 */

// State
let currentProject = null;
let allSuggestions = [];
let currentTypeFilter = 'all';

// DOM elements
const projectSelector = document.getElementById('project');
const generateBtn = document.getElementById('generateSuggestionsBtn');
const typeFilter = document.getElementById('typeFilter');
const suggestionsContainer = document.getElementById('suggestionsContainer');
const emptyState = document.getElementById('emptyState');
const toggleSuggestionsBtn = document.getElementById('toggleSuggestions');
const suggestionsContent = document.getElementById('suggestionsContent');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  if (!projectSelector || !generateBtn) {
    return; // Not on suggestions page or dashboard with suggestions
  }

  currentProject = projectSelector.value;
  setupEventListeners();
  loadSuggestions();
});

// Event listeners
function setupEventListeners() {
  if (projectSelector) {
    projectSelector.addEventListener('change', handleProjectChange);
  }

  if (generateBtn) {
    generateBtn.addEventListener('click', handleGenerateSuggestions);
  }

  if (typeFilter) {
    typeFilter.addEventListener('change', handleTypeFilterChange);
  }

  if (toggleSuggestionsBtn && suggestionsContent) {
    toggleSuggestionsBtn.addEventListener('click', handleToggleSuggestions);
  }
}

// Project change handler
function handleProjectChange() {
  currentProject = projectSelector.value;
  loadSuggestions();
}

// Type filter change handler
function handleTypeFilterChange() {
  currentTypeFilter = typeFilter.value;
  renderSuggestions();
}

// Toggle suggestions panel
function handleToggleSuggestions() {
  const icon = toggleSuggestionsBtn.querySelector('.toggle-icon');
  const isExpanded = toggleSuggestionsBtn.getAttribute('aria-expanded') === 'true';

  if (isExpanded) {
    suggestionsContent.style.display = 'none';
    icon.textContent = '+';
    toggleSuggestionsBtn.setAttribute('aria-expanded', 'false');
  } else {
    suggestionsContent.style.display = 'block';
    icon.textContent = '−';
    toggleSuggestionsBtn.setAttribute('aria-expanded', 'true');
  }
}

// Load suggestions from API
async function loadSuggestions() {
  try {
    const response = await fetch(`/api/suggestions/${currentProject}`);
    const data = await response.json();

    if (data.success) {
      allSuggestions = data.suggestions || [];
      renderSuggestions();
      updateStatistics(data.statistics);
    } else {
      showError('Failed to load suggestions');
    }
  } catch (error) {
    console.error('Error loading suggestions:', error);
    showError('Error loading suggestions');
  }
}

// Generate suggestions
async function handleGenerateSuggestions() {
  const btnText = generateBtn.querySelector('.btn-text');
  const btnLoading = generateBtn.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  generateBtn.disabled = true;

  try {
    const response = await fetch(`/api/suggestions/${currentProject}/generate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      allSuggestions = data.suggestions || [];
      renderSuggestions();
      updateStatistics(data.statistics);
      showSuccess(`Generated ${data.suggestions.length} suggestions`);
    } else {
      showError('Failed to generate suggestions');
    }
  } catch (error) {
    console.error('Error generating suggestions:', error);
    showError('Error generating suggestions');
  } finally {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    generateBtn.disabled = false;
  }
}

// Render suggestions
function renderSuggestions() {
  if (!suggestionsContainer) return;

  // Filter suggestions by type and status (only show pending)
  const filteredSuggestions = allSuggestions.filter(s => {
    if (s.status !== 'pending') return false;
    if (currentTypeFilter === 'all') return true;
    return s.type === currentTypeFilter;
  });

  if (filteredSuggestions.length === 0) {
    if (emptyState) {
      emptyState.style.display = 'block';
    }
    suggestionsContainer.innerHTML = '';
    return;
  }

  if (emptyState) {
    emptyState.style.display = 'none';
  }

  // Clear container
  suggestionsContainer.innerHTML = '';

  // Render suggestion cards
  filteredSuggestions.forEach(suggestion => {
    const card = createSuggestionCard(suggestion);
    suggestionsContainer.appendChild(card);
  });
}

// Create suggestion card element
function createSuggestionCard(suggestion) {
  const card = document.createElement('div');
  card.className = 'suggestion-card';
  card.dataset.suggestionId = suggestion.id;
  card.dataset.priority = suggestion.priority;

  const typeLabels = {
    'short-page': 'Short Page',
    'orphaned-page': 'Orphaned Page',
    'broken-reference': 'Broken Link',
    'missing-related': 'Missing Related Pages',
    'missing-tags': 'Missing Tags'
  };

  const typeIcons = {
    'short-page': '📄',
    'orphaned-page': '🔗',
    'broken-reference': '⚠️',
    'missing-related': '🔍',
    'missing-tags': '🏷️'
  };

  const typeBadge = `
    <div class="suggestion-type">
      <span class="type-icon">${typeIcons[suggestion.type] || '📋'}</span>
      <span class="type-badge type-${suggestion.type}">${typeLabels[suggestion.type] || suggestion.type}</span>
      <span class="priority-badge priority-${suggestion.priority}">${suggestion.priority}</span>
    </div>
  `;

  const affectedPagesHtml = suggestion.affectedPages.length > 0
    ? `
      <div class="affected-pages">
        <strong>Affected pages:</strong>
        <ul>
          ${suggestion.affectedPages.slice(0, 3).map(page => `<li><a href="/wiki/${currentProject}/${page.replace('.md', '')}">${page}</a></li>`).join('')}
          ${suggestion.affectedPages.length > 3 ? `<li>...and ${suggestion.affectedPages.length - 3} more</li>` : ''}
        </ul>
      </div>
    `
    : '';

  card.innerHTML = `
    ${typeBadge}
    <h3 class="suggestion-title">${escapeHtml(suggestion.title)}</h3>
    <p class="suggestion-description">${escapeHtml(suggestion.description)}</p>
    ${affectedPagesHtml}
    <div class="suggestion-actions">
      <button class="btn btn-apply" data-suggestion-id="${suggestion.id}">
        <span class="btn-text">Apply</span>
        <span class="btn-loading" style="display: none;">Applying...</span>
      </button>
      <button class="btn btn-dismiss" data-suggestion-id="${suggestion.id}">
        <span class="btn-text">Dismiss</span>
        <span class="btn-loading" style="display: none;">Dismissing...</span>
      </button>
    </div>
  `;

  // Add event listeners
  card.querySelector('.btn-apply').addEventListener('click', (e) => {
    e.stopPropagation();
    handleApplySuggestion(suggestion.id, e.currentTarget);
  });

  card.querySelector('.btn-dismiss').addEventListener('click', (e) => {
    e.stopPropagation();
    handleDismissSuggestion(suggestion.id, e.currentTarget);
  });

  return card;
}

// Apply suggestion handler
async function handleApplySuggestion(suggestionId, button) {
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  button.disabled = true;

  try {
    const response = await fetch(`/api/suggestions/${currentProject}/${suggestionId}/apply`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    });

    const data = await response.json();

    if (data.success) {
      // Remove from local array
      allSuggestions = allSuggestions.filter(s => s.id !== suggestionId);
      // Re-render
      renderSuggestions();
      // Reload to update statistics
      await loadSuggestions();
      showSuccess('Suggestion applied');
    } else {
      showError('Failed to apply suggestion');
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      button.disabled = false;
    }
  } catch (error) {
    console.error('Error applying suggestion:', error);
    showError('Error applying suggestion');
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    button.disabled = false;
  }
}

// Dismiss suggestion handler
async function handleDismissSuggestion(suggestionId, button) {
  const btnText = button.querySelector('.btn-text');
  const btnLoading = button.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  button.disabled = true;

  try {
    const response = await fetch(`/api/suggestions/${currentProject}/${suggestionId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      // Remove from local array
      allSuggestions = allSuggestions.filter(s => s.id !== suggestionId);
      // Re-render
      renderSuggestions();
      // Reload to update statistics
      await loadSuggestions();
      showSuccess('Suggestion dismissed');
    } else {
      showError('Failed to dismiss suggestion');
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
      button.disabled = false;
    }
  } catch (error) {
    console.error('Error dismissing suggestion:', error);
    showError('Error dismissing suggestion');
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    button.disabled = false;
  }
}

// Update statistics panel
function updateStatistics(stats) {
  if (!stats) return;

  const statTotal = document.getElementById('statTotalSuggestions');
  const statPending = document.getElementById('statPending');
  const statByType = document.getElementById('statByType');

  if (statTotal) {
    statTotal.textContent = stats.total || 0;
  }

  if (statPending) {
    statPending.textContent = stats.byStatus?.pending || 0;
  }

  if (statByType && stats.byType) {
    const typeLabels = {
      'short-page': 'Short Pages',
      'orphaned-page': 'Orphaned',
      'broken-reference': 'Broken Links',
      'missing-related': 'Missing Related',
      'missing-tags': 'Missing Tags'
    };

    const typeStats = Object.entries(stats.byType)
      .map(([type, count]) => `${typeLabels[type] || type}: ${count}`)
      .join(', ');

    statByType.textContent = typeStats || 'None';
  }
}

// Utility functions
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  // Simple error display - could be enhanced with a toast/notification system
  alert(message);
}

function showSuccess(message) {
  // Simple success display - could be enhanced with a toast/notification system
  console.log('Success:', message);
}
