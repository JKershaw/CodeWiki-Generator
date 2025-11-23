/**
 * Analytics Dashboard Frontend
 * Handles data loading, chart rendering, and user interactions
 */

// State
let currentProject = null;
let analyticsData = null;
let charts = {};

// Chart color palette
const colors = {
  primary: ['#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b', '#10b981', '#06b6d4', '#6366f1', '#84cc16', '#f97316', '#14b8a6'],
  primaryAlpha: ['rgba(59, 130, 246, 0.8)', 'rgba(139, 92, 246, 0.8)', 'rgba(236, 72, 153, 0.8)', 'rgba(245, 158, 11, 0.8)', 'rgba(16, 185, 129, 0.8)', 'rgba(6, 182, 212, 0.8)', 'rgba(99, 102, 241, 0.8)', 'rgba(132, 204, 22, 0.8)', 'rgba(249, 115, 22, 0.8)', 'rgba(20, 184, 166, 0.8)'],
  border: '#e5e7eb',
  grid: '#f3f4f6'
};

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
  const projectSelector = document.getElementById('project');
  currentProject = projectSelector.value;

  // Event listeners
  projectSelector.addEventListener('change', handleProjectChange);
  document.getElementById('exportData').addEventListener('click', exportToCSV);
  document.getElementById('retryBtn')?.addEventListener('click', loadAnalytics);

  // Load initial analytics
  loadAnalytics();
});

/**
 * Handle project selection change
 */
function handleProjectChange(event) {
  currentProject = event.target.value;
  loadAnalytics();
}

/**
 * Load analytics data for current project
 */
async function loadAnalytics() {
  showLoading();

  try {
    const response = await fetch(`/api/analytics/${currentProject}`);

    if (!response.ok) {
      throw new Error(`Failed to load analytics: ${response.statusText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.error || 'Failed to load analytics');
    }

    analyticsData = data.analytics;
    renderDashboard();
    showContent();
  } catch (error) {
    console.error('Error loading analytics:', error);
    showError(error.message);
  }
}

/**
 * Render the complete dashboard
 */
function renderDashboard() {
  renderStatistics();
  renderCharts();
  renderTables();
}

/**
 * Render statistics cards
 */
function renderStatistics() {
  const stats = analyticsData.statistics;

  document.getElementById('statTotalPages').textContent = stats.totalPages || 0;
  document.getElementById('statCategories').textContent = stats.categoryCount || 0;
  document.getElementById('statAvgLength').textContent = stats.avgPageLength || 0;
  document.getElementById('statTotalLinks').textContent = stats.totalLinks || 0;
}

/**
 * Render all charts
 */
function renderCharts() {
  // Destroy existing charts
  Object.values(charts).forEach(chart => chart?.destroy());
  charts = {};

  const stats = analyticsData.statistics;

  // Category Chart (Bar)
  charts.category = renderCategoryChart(stats.categories);

  // Tag Distribution Chart (Pie)
  charts.tag = renderTagChart(stats.tags);

  // Activity Over Time Chart (Line)
  charts.activity = renderActivityChart(stats.updatesByMonth);

  // Most Linked Pages Chart (Horizontal Bar)
  charts.mostLinked = renderMostLinkedChart(stats.mostLinked);

  // Longest Pages Chart (Horizontal Bar)
  charts.longestPages = renderLongestPagesChart(analyticsData.pageMetrics);
}

/**
 * Render category bar chart
 */
function renderCategoryChart(categories) {
  const ctx = document.getElementById('categoryChart');

  const labels = Object.keys(categories);
  const data = Object.values(categories);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels.map(label => label.charAt(0).toUpperCase() + label.slice(1)),
      datasets: [{
        label: 'Number of Pages',
        data: data,
        backgroundColor: colors.primaryAlpha,
        borderColor: colors.primary,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        },
        title: {
          display: false
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Render tag distribution pie chart
 */
function renderTagChart(tags) {
  const ctx = document.getElementById('tagChart');

  // Get top 10 tags
  const sortedTags = Object.entries(tags)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 10);

  const labels = sortedTags.map(([tag]) => tag);
  const data = sortedTags.map(([, count]) => count);

  return new Chart(ctx, {
    type: 'pie',
    data: {
      labels: labels,
      datasets: [{
        data: data,
        backgroundColor: colors.primaryAlpha,
        borderColor: colors.primary,
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'right',
          labels: {
            boxWidth: 12,
            padding: 10
          }
        }
      }
    }
  });
}

/**
 * Render activity over time line chart
 */
function renderActivityChart(updatesByMonth) {
  const ctx = document.getElementById('activityChart');

  const labels = updatesByMonth.map(item => item.month);
  const data = updatesByMonth.map(item => item.count);

  return new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Pages Updated',
        data: data,
        borderColor: colors.primary[0],
        backgroundColor: colors.primaryAlpha[0],
        tension: 0.4,
        fill: true
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: true
        }
      },
      scales: {
        y: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Render most linked pages horizontal bar chart
 */
function renderMostLinkedChart(mostLinked) {
  const ctx = document.getElementById('mostLinkedChart');

  const labels = mostLinked.map(item => {
    const parts = item.path.split('/');
    return parts[parts.length - 1].replace('.md', '');
  });
  const data = mostLinked.map(item => item.linkCount);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Incoming Links',
        data: data,
        backgroundColor: colors.primaryAlpha[4],
        borderColor: colors.primary[4],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true,
          ticks: {
            stepSize: 1
          }
        }
      }
    }
  });
}

/**
 * Render longest pages horizontal bar chart
 */
function renderLongestPagesChart(pageMetrics) {
  const ctx = document.getElementById('longestPagesChart');

  // Get top 10 longest pages
  const top10 = pageMetrics.slice(0, 10);

  const labels = top10.map(page => page.title || page.path);
  const data = top10.map(page => page.wordCount);

  return new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Word Count',
        data: data,
        backgroundColor: colors.primaryAlpha[6],
        borderColor: colors.primary[6],
        borderWidth: 1
      }]
    },
    options: {
      indexAxis: 'y',
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          display: false
        }
      },
      scales: {
        x: {
          beginAtZero: true
        }
      }
    }
  });
}

/**
 * Render data tables
 */
function renderTables() {
  const stats = analyticsData.statistics;

  // Orphaned pages table
  renderOrphanedTable(stats.orphanedPages);

  // Dead links table
  renderDeadLinksTable(stats.deadLinks);
}

/**
 * Render orphaned pages table
 */
function renderOrphanedTable(orphanedPages) {
  const table = document.getElementById('orphanedTable').getElementsByTagName('tbody')[0];
  const countBadge = document.getElementById('orphanedCount');

  countBadge.textContent = orphanedPages.length;

  if (orphanedPages.length === 0) {
    table.innerHTML = '<tr class="empty-row"><td colspan="3">No orphaned pages found</td></tr>';
    return;
  }

  table.innerHTML = orphanedPages.map(page => `
    <tr>
      <td>${escapeHtml(page.title)}</td>
      <td class="path-cell">${escapeHtml(page.path)}</td>
      <td>
        <a href="/wiki/${currentProject}/${page.path.replace('.md', '')}" class="btn-link" target="_blank">View</a>
      </td>
    </tr>
  `).join('');
}

/**
 * Render dead links table
 */
function renderDeadLinksTable(deadLinks) {
  const table = document.getElementById('deadLinksTable').getElementsByTagName('tbody')[0];
  const countBadge = document.getElementById('deadLinksCount');

  countBadge.textContent = deadLinks.length;

  if (deadLinks.length === 0) {
    table.innerHTML = '<tr class="empty-row"><td colspan="3">No dead links found</td></tr>';
    return;
  }

  // Group by source page and limit display
  const groupedLinks = {};
  deadLinks.forEach(link => {
    if (!groupedLinks[link.sourcePage]) {
      groupedLinks[link.sourcePage] = [];
    }
    groupedLinks[link.sourcePage].push(link);
  });

  const rows = [];
  Object.entries(groupedLinks).forEach(([sourcePage, links]) => {
    links.slice(0, 3).forEach((link, index) => {
      rows.push(`
        <tr>
          <td>${index === 0 ? escapeHtml(link.sourceTitle) : ''}</td>
          <td class="path-cell">${escapeHtml(link.deadLink)}</td>
          <td>
            <a href="/wiki/${currentProject}/${sourcePage.replace('.md', '')}" class="btn-link" target="_blank">View Source</a>
          </td>
        </tr>
      `);
    });
  });

  table.innerHTML = rows.join('');
}

/**
 * Export analytics data to CSV
 */
function exportToCSV() {
  if (!analyticsData) {
    alert('No data to export');
    return;
  }

  const stats = analyticsData.statistics;
  const metrics = analyticsData.pageMetrics;

  // Build CSV content
  let csv = 'Wiki Analytics Export\n\n';

  // Statistics
  csv += 'Statistic,Value\n';
  csv += `Total Pages,${stats.totalPages}\n`;
  csv += `Categories,${stats.categoryCount}\n`;
  csv += `Average Page Length,${stats.avgPageLength}\n`;
  csv += `Total Links,${stats.totalLinks}\n`;
  csv += `Link Density,${stats.linkDensity}\n`;
  csv += `Orphaned Pages,${stats.orphanedCount}\n`;
  csv += `Dead Links,${stats.deadLinkCount}\n\n`;

  // Page Metrics
  csv += 'Page Metrics\n';
  csv += 'Title,Path,Category,Word Count,Link Count,Created,Updated\n';
  metrics.forEach(page => {
    csv += `"${page.title}","${page.path}","${page.category}",${page.wordCount},${page.linkCount},"${page.created}","${page.updated}"\n`;
  });

  // Category Distribution
  csv += '\nCategory Distribution\n';
  csv += 'Category,Count\n';
  Object.entries(stats.categories).forEach(([category, count]) => {
    csv += `"${category}",${count}\n`;
  });

  // Tag Distribution
  csv += '\nTag Distribution\n';
  csv += 'Tag,Count\n';
  Object.entries(stats.tags).forEach(([tag, count]) => {
    csv += `"${tag}",${count}\n`;
  });

  // Create download
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `wiki-analytics-${currentProject}-${new Date().toISOString().split('T')[0]}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

/**
 * Show loading state
 */
function showLoading() {
  document.getElementById('loadingState').style.display = 'block';
  document.getElementById('analyticsContent').style.display = 'none';
  document.getElementById('errorState').style.display = 'none';
}

/**
 * Show content
 */
function showContent() {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('analyticsContent').style.display = 'block';
  document.getElementById('errorState').style.display = 'none';
}

/**
 * Show error state
 */
function showError(message) {
  document.getElementById('loadingState').style.display = 'none';
  document.getElementById('analyticsContent').style.display = 'none';
  document.getElementById('errorState').style.display = 'block';
  document.getElementById('errorMessage').textContent = message;
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
