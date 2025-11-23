// CodeWiki Generator - Projects Management Client-Side JavaScript

document.addEventListener('DOMContentLoaded', () => {
  let projectsData = [];
  let currentDeleteProject = null;
  let currentSettingsProject = null;

  // Load projects on page load
  loadProjects();

  // Create Project Modal
  const createProjectBtn = document.getElementById('createProjectBtn');
  const createModal = document.getElementById('createModal');
  const closeCreateModal = document.getElementById('closeCreateModal');
  const cancelCreateBtn = document.getElementById('cancelCreateBtn');
  const createProjectForm = document.getElementById('createProjectForm');

  createProjectBtn.addEventListener('click', () => {
    createModal.style.display = 'flex';
  });

  closeCreateModal.addEventListener('click', () => {
    createModal.style.display = 'none';
    createProjectForm.reset();
  });

  cancelCreateBtn.addEventListener('click', () => {
    createModal.style.display = 'none';
    createProjectForm.reset();
  });

  createProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const projectData = {
      name: formData.get('displayName'),
      description: formData.get('description'),
      repository: formData.get('repository'),
      theme: formData.get('theme'),
      maxPageSize: parseInt(formData.get('maxPageSize'))
    };

    const saveBtn = document.getElementById('saveCreateBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoading = saveBtn.querySelector('.btn-loading');

    saveBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const response = await fetch('/api/projects/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(projectData)
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Project created successfully!', 'success');
        createModal.style.display = 'none';
        createProjectForm.reset();
        loadProjects();
      } else {
        showNotification(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  // Import Project Modal
  const importProjectBtn = document.getElementById('importProjectBtn');
  const importModal = document.getElementById('importModal');
  const closeImportModal = document.getElementById('closeImportModal');
  const cancelImportBtn = document.getElementById('cancelImportBtn');
  const importProjectForm = document.getElementById('importProjectForm');

  importProjectBtn.addEventListener('click', () => {
    importModal.style.display = 'flex';
  });

  closeImportModal.addEventListener('click', () => {
    importModal.style.display = 'none';
    importProjectForm.reset();
  });

  cancelImportBtn.addEventListener('click', () => {
    importModal.style.display = 'none';
    importProjectForm.reset();
  });

  importProjectForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const importData = {
      sourcePath: formData.get('sourcePath'),
      name: formData.get('name')
    };

    const saveBtn = document.getElementById('saveImportBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoading = saveBtn.querySelector('.btn-loading');

    saveBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const response = await fetch('/api/projects/import', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(importData)
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Project imported successfully!', 'success');
        importModal.style.display = 'none';
        importProjectForm.reset();
        loadProjects();
      } else {
        showNotification(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  // Settings Modal
  const settingsModal = document.getElementById('settingsModal');
  const closeSettingsModal = document.getElementById('closeSettingsModal');
  const cancelSettingsBtn = document.getElementById('cancelSettingsBtn');
  const settingsForm = document.getElementById('settingsForm');

  closeSettingsModal.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    settingsForm.reset();
  });

  cancelSettingsBtn.addEventListener('click', () => {
    settingsModal.style.display = 'none';
    settingsForm.reset();
  });

  settingsForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const projectId = document.getElementById('settingsProjectId').value;
    const formData = new FormData(e.target);
    const settings = {
      theme: formData.get('theme'),
      maxPageSize: parseInt(formData.get('maxPageSize'))
    };

    const saveBtn = document.getElementById('saveSettingsBtn');
    const btnText = saveBtn.querySelector('.btn-text');
    const btnLoading = saveBtn.querySelector('.btn-loading');

    saveBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const response = await fetch(`/api/projects/${projectId}/settings`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(settings)
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Settings updated successfully!', 'success');
        settingsModal.style.display = 'none';
        settingsForm.reset();
        loadProjects();
      } else {
        showNotification(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      saveBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  // Delete Modal
  const deleteModal = document.getElementById('deleteModal');
  const closeDeleteModal = document.getElementById('closeDeleteModal');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

  closeDeleteModal.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    currentDeleteProject = null;
  });

  cancelDeleteBtn.addEventListener('click', () => {
    deleteModal.style.display = 'none';
    currentDeleteProject = null;
  });

  confirmDeleteBtn.addEventListener('click', async () => {
    if (!currentDeleteProject) return;

    const btnText = confirmDeleteBtn.querySelector('.btn-text');
    const btnLoading = confirmDeleteBtn.querySelector('.btn-loading');

    confirmDeleteBtn.disabled = true;
    btnText.style.display = 'none';
    btnLoading.style.display = 'inline';

    try {
      const response = await fetch(`/api/projects/${currentDeleteProject}`, {
        method: 'DELETE'
      });

      const result = await response.json();

      if (response.ok) {
        showNotification('Project deleted successfully!', 'success');
        deleteModal.style.display = 'none';
        currentDeleteProject = null;
        loadProjects();
      } else {
        showNotification(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    } finally {
      confirmDeleteBtn.disabled = false;
      btnText.style.display = 'inline';
      btnLoading.style.display = 'none';
    }
  });

  // Comparison View
  const toggleComparisonBtn = document.getElementById('toggleComparisonBtn');
  const comparisonView = document.getElementById('comparisonView');
  const compareProject1 = document.getElementById('compareProject1');
  const compareProject2 = document.getElementById('compareProject2');
  const comparisonResults = document.getElementById('comparisonResults');

  toggleComparisonBtn.addEventListener('click', () => {
    const isVisible = comparisonView.style.display !== 'none';
    comparisonView.style.display = isVisible ? 'none' : 'block';
    toggleComparisonBtn.textContent = isVisible ? 'Compare Projects' : 'Hide Comparison';
  });

  compareProject1.addEventListener('change', updateComparison);
  compareProject2.addEventListener('change', updateComparison);

  // Load projects function
  async function loadProjects() {
    try {
      const response = await fetch('/api/projects');
      const data = await response.json();

      projectsData = data.projects || [];

      renderProjects(projectsData);
      updateComparisonSelects(projectsData);

      // Show/hide empty state
      const emptyState = document.getElementById('emptyState');
      const projectsContainer = document.getElementById('projectsContainer');

      if (projectsData.length === 0) {
        emptyState.style.display = 'block';
        projectsContainer.style.display = 'none';
      } else {
        emptyState.style.display = 'none';
        projectsContainer.style.display = 'grid';
      }
    } catch (error) {
      showNotification(`Error loading projects: ${error.message}`, 'error');
    }
  }

  // Render projects function
  function renderProjects(projects) {
    const container = document.getElementById('projectsContainer');
    container.innerHTML = '';

    projects.forEach(project => {
      const card = createProjectCard(project);
      container.appendChild(card);
    });
  }

  // Create project card function
  function createProjectCard(project) {
    const card = document.createElement('div');
    card.className = 'project-card';

    const lastUpdated = project.updatedAt
      ? new Date(project.updatedAt).toLocaleDateString()
      : 'Never';

    const totalSize = formatBytes(project.stats?.totalSize || 0);

    card.innerHTML = `
      <div class="project-card-header">
        <h3 class="project-name">${escapeHtml(project.name)}</h3>
        <div class="project-actions">
          <button class="btn-icon" onclick="openSettings('${escapeHtml(project.id)}')" title="Settings">
            ⚙️
          </button>
          <button class="btn-icon btn-delete" onclick="confirmDelete('${escapeHtml(project.id)}', '${escapeHtml(project.name)}')" title="Delete">
            🗑️
          </button>
        </div>
      </div>
      <p class="project-description">${escapeHtml(project.description || 'No description')}</p>
      <div class="project-stats">
        <div class="stat-item">
          <span class="stat-label">Pages</span>
          <span class="stat-value">${project.stats?.pageCount || 0}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Size</span>
          <span class="stat-value">${totalSize}</span>
        </div>
        <div class="stat-item">
          <span class="stat-label">Updated</span>
          <span class="stat-value">${lastUpdated}</span>
        </div>
      </div>
      ${project.repository ? `<div class="project-repository">
        <a href="${escapeHtml(project.repository)}" target="_blank" rel="noopener">
          📦 ${escapeHtml(project.repository)}
        </a>
      </div>` : ''}
      <div class="project-footer">
        <a href="/wiki/${encodeURIComponent(project.id)}/index" class="btn-link">View Wiki</a>
      </div>
    `;

    return card;
  }

  // Open settings modal
  window.openSettings = async (projectId) => {
    try {
      const response = await fetch(`/api/projects/${projectId}/settings`);
      const result = await response.json();

      if (response.ok) {
        currentSettingsProject = projectId;
        document.getElementById('settingsProjectId').value = projectId;
        document.getElementById('settingsTheme').value = result.settings.theme || 'default';
        document.getElementById('settingsMaxPageSize').value = result.settings.maxPageSize || 5000;

        settingsModal.style.display = 'flex';
      } else {
        showNotification(`Error: ${result.error}`, 'error');
      }
    } catch (error) {
      showNotification(`Error: ${error.message}`, 'error');
    }
  };

  // Confirm delete
  window.confirmDelete = (projectId, projectName) => {
    currentDeleteProject = projectId;
    document.getElementById('deleteProjectName').textContent = projectName;
    deleteModal.style.display = 'flex';
  };

  // Update comparison selects
  function updateComparisonSelects(projects) {
    const select1 = document.getElementById('compareProject1');
    const select2 = document.getElementById('compareProject2');

    select1.innerHTML = '<option value="">Select project...</option>';
    select2.innerHTML = '<option value="">Select project...</option>';

    projects.forEach(project => {
      const option1 = document.createElement('option');
      option1.value = project.id;
      option1.textContent = project.name;

      const option2 = document.createElement('option');
      option2.value = project.id;
      option2.textContent = project.name;

      select1.appendChild(option1);
      select2.appendChild(option2);
    });
  }

  // Update comparison
  function updateComparison() {
    const project1Id = compareProject1.value;
    const project2Id = compareProject2.value;

    if (!project1Id || !project2Id || project1Id === project2Id) {
      comparisonResults.style.display = 'none';
      return;
    }

    const project1 = projectsData.find(p => p.id === project1Id);
    const project2 = projectsData.find(p => p.id === project2Id);

    if (!project1 || !project2) {
      comparisonResults.style.display = 'none';
      return;
    }

    document.getElementById('project1Name').textContent = project1.name;
    document.getElementById('project2Name').textContent = project2.name;

    const tableBody = document.getElementById('comparisonTableBody');
    tableBody.innerHTML = `
      <tr>
        <td>Total Pages</td>
        <td>${project1.stats?.pageCount || 0}</td>
        <td>${project2.stats?.pageCount || 0}</td>
      </tr>
      <tr>
        <td>Concept Pages</td>
        <td>${project1.stats?.conceptPages || 0}</td>
        <td>${project2.stats?.conceptPages || 0}</td>
      </tr>
      <tr>
        <td>Component Pages</td>
        <td>${project1.stats?.componentPages || 0}</td>
        <td>${project2.stats?.componentPages || 0}</td>
      </tr>
      <tr>
        <td>Guide Pages</td>
        <td>${project1.stats?.guidePages || 0}</td>
        <td>${project2.stats?.guidePages || 0}</td>
      </tr>
      <tr>
        <td>Total Size</td>
        <td>${formatBytes(project1.stats?.totalSize || 0)}</td>
        <td>${formatBytes(project2.stats?.totalSize || 0)}</td>
      </tr>
      <tr>
        <td>Last Updated</td>
        <td>${project1.updatedAt ? new Date(project1.updatedAt).toLocaleDateString() : 'Never'}</td>
        <td>${project2.updatedAt ? new Date(project2.updatedAt).toLocaleDateString() : 'Never'}</td>
      </tr>
      <tr>
        <td>Created</td>
        <td>${project1.createdAt ? new Date(project1.createdAt).toLocaleDateString() : 'Unknown'}</td>
        <td>${project2.createdAt ? new Date(project2.createdAt).toLocaleDateString() : 'Unknown'}</td>
      </tr>
    `;

    comparisonResults.style.display = 'block';
  }

  // Helper functions
  function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
  }

  function formatBytes(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  }

  function showNotification(message, type = 'info') {
    // Simple alert for now - could be enhanced with a toast notification system
    if (type === 'error') {
      alert(`Error: ${message}`);
    } else {
      alert(message);
    }
  }

  // Close modals on outside click
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.style.display = 'none';
      if (e.target === createModal) createProjectForm.reset();
      if (e.target === importModal) importProjectForm.reset();
      if (e.target === settingsModal) settingsForm.reset();
      if (e.target === deleteModal) currentDeleteProject = null;
    }
  });
});
