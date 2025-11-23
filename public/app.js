// CodeWiki Generator - Dashboard Client-Side JavaScript

document.addEventListener('DOMContentLoaded', () => {
  // Handle form submission
  const startForm = document.getElementById('start-form');
  if (startForm) {
    startForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const repoUrl = document.getElementById('repoUrl').value;

      try {
        const response = await fetch('/process/start', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ repoUrl })
        });

        const result = await response.json();

        if (response.ok) {
          alert('Processing started!');
          window.location.reload();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Handle pause button
  const pauseBtn = document.getElementById('pauseBtn');
  if (pauseBtn) {
    pauseBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/process/pause', {
          method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
          alert('Processing paused');
          window.location.reload();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Handle step button
  const stepBtn = document.getElementById('stepBtn');
  if (stepBtn) {
    stepBtn.addEventListener('click', async () => {
      try {
        const response = await fetch('/process/step', {
          method: 'POST'
        });

        const result = await response.json();

        if (response.ok) {
          alert(`Processed commit: ${result.commitSha}`);
          window.location.reload();
        } else {
          alert(`Error: ${result.error}`);
        }
      } catch (error) {
        alert(`Error: ${error.message}`);
      }
    });
  }

  // Auto-refresh status every 5 seconds when processing
  const statusElement = document.querySelector('.status-badge');
  if (statusElement && statusElement.classList.contains('processing')) {
    setInterval(async () => {
      try {
        const response = await fetch('/api/status');
        const status = await response.json();

        if (status.status !== 'processing') {
          window.location.reload();
        }
      } catch (error) {
        console.error('Error checking status:', error);
      }
    }, 5000);
  }

  // Project selector functionality
  const projectSelector = document.getElementById('project');
  if (projectSelector) {
    // Load saved project selection from localStorage
    const savedProject = localStorage.getItem('selectedProject');
    if (savedProject) {
      projectSelector.value = savedProject;
      updateWikiLinks(savedProject);
    }

    // Handle project selection change
    projectSelector.addEventListener('change', function(e) {
      const selectedProject = e.target.value;
      localStorage.setItem('selectedProject', selectedProject);
      updateWikiLinks(selectedProject);
    });
  }

  // Update all wiki links with the selected project
  function updateWikiLinks(project) {
    document.querySelectorAll('.wiki-link').forEach(link => {
      const href = link.getAttribute('href');
      const parts = href.split('/');
      if (parts.length >= 3 && parts[1] === 'wiki') {
        // Replace project in /wiki/PROJECT/page
        parts[2] = project;
        link.setAttribute('href', parts.join('/'));
      }
    });
  }

  // Research Panel Functionality
  const toggleResearchBtn = document.getElementById('toggleResearch');
  const researchContent = document.getElementById('researchContent');

  if (toggleResearchBtn && researchContent) {
    toggleResearchBtn.addEventListener('click', () => {
      const isExpanded = toggleResearchBtn.getAttribute('aria-expanded') === 'true';
      toggleResearchBtn.setAttribute('aria-expanded', !isExpanded);
      researchContent.style.display = isExpanded ? 'none' : 'block';
      toggleResearchBtn.querySelector('.toggle-icon').textContent = isExpanded ? '+' : '−';
    });
  }

  // Research Form Submission
  const researchForm = document.getElementById('research-form');
  if (researchForm) {
    researchForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const query = document.getElementById('researchQuery').value.trim();
      if (!query) return;

      const researchBtn = document.getElementById('researchBtn');
      const btnText = researchBtn.querySelector('.btn-text');
      const btnLoading = researchBtn.querySelector('.btn-loading');
      const resultsContainer = document.getElementById('researchResults');

      // Show loading state
      researchBtn.disabled = true;
      btnText.style.display = 'none';
      btnLoading.style.display = 'inline';

      try {
        // Get selected project
        const project = projectSelector ? projectSelector.value : 'codewiki-generator';

        const response = await fetch('/api/context/research', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ query, project })
        });

        if (!response.ok) {
          const error = await response.json();
          throw new Error(error.error || 'Research request failed');
        }

        const result = await response.json();
        displayResearchResults(result);
        resultsContainer.style.display = 'block';

      } catch (error) {
        alert(`Error: ${error.message}`);
        console.error('Research error:', error);
      } finally {
        // Reset button state
        researchBtn.disabled = false;
        btnText.style.display = 'inline';
        btnLoading.style.display = 'none';
      }
    });
  }

  // Clear Results Button
  const clearResultsBtn = document.getElementById('clearResults');
  if (clearResultsBtn) {
    clearResultsBtn.addEventListener('click', () => {
      const resultsContainer = document.getElementById('researchResults');
      resultsContainer.style.display = 'none';

      // Clear all content
      document.getElementById('resultSummary').innerHTML = '';
      document.getElementById('relevantPages').innerHTML = '';
      document.getElementById('keyComponents').innerHTML = '';
      document.getElementById('keyConcepts').innerHTML = '';
      document.getElementById('implementationSteps').innerHTML = '';
      document.getElementById('relatedFiles').innerHTML = '';
    });
  }

  // Display Research Results
  function displayResearchResults(result) {
    // Display Summary
    const summaryEl = document.getElementById('resultSummary');
    summaryEl.innerHTML = `<p>${escapeHtml(result.summary)}</p>`;

    // Display Relevant Pages
    const pagesEl = document.getElementById('relevantPages');
    if (result.relevantPages && result.relevantPages.length > 0) {
      document.querySelector('.page-count').textContent = `(${result.relevantPages.length})`;
      pagesEl.innerHTML = result.relevantPages.map(page => `
        <div class="page-item">
          <div class="page-header">
            <a href="/wiki/${projectSelector.value}/${page.path}" class="page-title" target="_blank">
              ${escapeHtml(page.title)}
            </a>
            <button class="btn-expand" data-page-id="${escapeHtml(page.path)}">
              Show Excerpt
            </button>
          </div>
          <p class="page-reason">${escapeHtml(page.reason)}</p>
          <div class="page-excerpt" id="excerpt-${escapeHtml(page.path)}" style="display: none;">
            <pre><code>${escapeHtml(page.excerpt || 'No excerpt available')}</code></pre>
          </div>
        </div>
      `).join('');

      // Add excerpt toggle handlers
      pagesEl.querySelectorAll('.btn-expand').forEach(btn => {
        btn.addEventListener('click', (e) => {
          const pageId = e.target.getAttribute('data-page-id');
          const excerpt = document.getElementById(`excerpt-${pageId}`);
          const isVisible = excerpt.style.display !== 'none';
          excerpt.style.display = isVisible ? 'none' : 'block';
          e.target.textContent = isVisible ? 'Show Excerpt' : 'Hide Excerpt';
        });
      });
    } else {
      pagesEl.innerHTML = '<p class="no-results">No relevant pages found.</p>';
    }

    // Display Key Components
    const componentsEl = document.getElementById('keyComponents');
    if (result.keyComponents && result.keyComponents.length > 0) {
      document.querySelector('.component-count').textContent = `(${result.keyComponents.length})`;
      componentsEl.innerHTML = '<ul>' + result.keyComponents.map(comp => `
        <li>
          <strong>${escapeHtml(comp.name)}</strong> - ${escapeHtml(comp.description)}
          <br><code class="file-path">${escapeHtml(comp.location)}</code>
        </li>
      `).join('') + '</ul>';
    } else {
      componentsEl.innerHTML = '<p class="no-results">No key components identified.</p>';
    }

    // Display Key Concepts
    const conceptsEl = document.getElementById('keyConcepts');
    if (result.keyConcepts && result.keyConcepts.length > 0) {
      document.querySelector('.concept-count').textContent = `(${result.keyConcepts.length})`;
      conceptsEl.innerHTML = '<ul>' + result.keyConcepts.map(concept => `
        <li>
          <strong>${escapeHtml(concept.concept)}</strong> - ${escapeHtml(concept.application)}
        </li>
      `).join('') + '</ul>';
    } else {
      conceptsEl.innerHTML = '<p class="no-results">No key concepts identified.</p>';
    }

    // Display Implementation Steps
    const stepsEl = document.getElementById('implementationSteps');
    if (result.implementationSteps && result.implementationSteps.length > 0) {
      stepsEl.innerHTML = '<ol class="steps-list">' + result.implementationSteps.map(step => `
        <li>${escapeHtml(step)}</li>
      `).join('') + '</ol>';
    } else {
      stepsEl.innerHTML = '<p class="no-results">No implementation steps provided.</p>';
    }

    // Display Related Files
    const filesEl = document.getElementById('relatedFiles');
    if (result.relatedFiles && result.relatedFiles.length > 0) {
      document.querySelector('.file-count').textContent = `(${result.relatedFiles.length})`;
      filesEl.innerHTML = '<ul class="files-list">' + result.relatedFiles.map(file => `
        <li><code>${escapeHtml(file)}</code></li>
      `).join('') + '</ul>';
    } else {
      filesEl.innerHTML = '<p class="no-results">No related files identified.</p>';
    }
  }

  // Expandable Section Headers
  document.addEventListener('click', (e) => {
    if (e.target.closest('.section-header')) {
      const header = e.target.closest('.section-header');
      const targetId = header.getAttribute('data-target');
      const content = document.getElementById(targetId);
      const icon = header.querySelector('.expand-icon');

      if (content && icon) {
        const isCollapsed = content.classList.contains('collapsed');
        content.classList.toggle('collapsed');
        icon.textContent = isCollapsed ? '▼' : '▶';
      }
    }
  });

  // HTML Escape Helper
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }
});
