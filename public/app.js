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
});
