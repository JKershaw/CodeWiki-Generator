document.addEventListener('DOMContentLoaded', () => {
  const editor = document.getElementById('markdownEditor');
  const preview = document.getElementById('markdownPreview');
  const saveBtn = document.getElementById('saveBtn');
  const cancelBtn = document.getElementById('cancelBtn');
  const autosaveStatus = document.getElementById('autosaveStatus');
  const projectName = document.getElementById('projectName').value;
  const pagePath = document.getElementById('pagePath').value;
  const createdDate = document.getElementById('createdDate').value;

  const titleInput = document.getElementById('pageTitle');
  const categoryInput = document.getElementById('pageCategory');
  const tagsInput = document.getElementById('pageTags');

  let hasUnsavedChanges = false;
  let originalContent = editor.value;
  let originalMetadata = {
    title: titleInput.value,
    category: categoryInput.value,
    tags: tagsInput.value
  };
  let autoSaveTimer = null;
  let previewDebounceTimer = null;

  marked.setOptions({
    breaks: true,
    gfm: true,
    headerIds: true,
    mangle: false
  });

  function updatePreview() {
    try {
      const markdown = editor.value;
      const html = marked.parse(markdown);
      preview.innerHTML = html;
    } catch (error) {
      preview.innerHTML = `<p style="color: red;">Error rendering preview: ${error.message}</p>`;
    }
  }

  function checkForChanges() {
    const contentChanged = editor.value !== originalContent;
    const metadataChanged =
      titleInput.value !== originalMetadata.title ||
      categoryInput.value !== originalMetadata.category ||
      tagsInput.value !== originalMetadata.tags;

    hasUnsavedChanges = contentChanged || metadataChanged;

    if (hasUnsavedChanges) {
      autosaveStatus.textContent = 'Unsaved changes';
      autosaveStatus.className = 'autosave-status';
    } else {
      autosaveStatus.textContent = '';
    }
  }

  function debouncedPreviewUpdate() {
    clearTimeout(previewDebounceTimer);
    previewDebounceTimer = setTimeout(updatePreview, 300);
  }

  function autoSaveToLocalStorage() {
    const data = {
      content: editor.value,
      metadata: {
        title: titleInput.value,
        category: categoryInput.value,
        tags: tagsInput.value
      },
      timestamp: Date.now()
    };
    localStorage.setItem(`wiki-draft-${projectName}-${pagePath}`, JSON.stringify(data));
  }

  function loadFromLocalStorage() {
    const key = `wiki-draft-${projectName}-${pagePath}`;
    const saved = localStorage.getItem(key);

    if (saved) {
      try {
        const data = JSON.parse(saved);
        const age = Date.now() - data.timestamp;

        if (age < 24 * 60 * 60 * 1000) {
          if (confirm('Found an auto-saved draft. Would you like to restore it?')) {
            editor.value = data.content;
            if (data.metadata) {
              titleInput.value = data.metadata.title || titleInput.value;
              categoryInput.value = data.metadata.category || categoryInput.value;
              tagsInput.value = data.metadata.tags || tagsInput.value;
            }
            updatePreview();
          }
        } else {
          localStorage.removeItem(key);
        }
      } catch (error) {
        console.error('Error loading draft:', error);
      }
    }
  }

  async function savePage() {
    try {
      saveBtn.disabled = true;
      saveBtn.textContent = 'Saving...';
      autosaveStatus.textContent = 'Saving...';
      autosaveStatus.className = 'autosave-status saving';

      const tags = tagsInput.value
        .split(',')
        .map(tag => tag.trim())
        .filter(tag => tag.length > 0);

      const metadata = {
        title: titleInput.value || 'Untitled',
        category: categoryInput.value || 'general',
        tags: tags
      };

      if (createdDate) {
        metadata.created = createdDate;
      }

      const response = await fetch(`/wiki/${projectName}/${pagePath.replace('.md', '')}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: editor.value,
          metadata: metadata
        })
      });

      const result = await response.json();

      if (response.ok) {
        autosaveStatus.textContent = 'Saved successfully';
        autosaveStatus.className = 'autosave-status saved';

        hasUnsavedChanges = false;
        originalContent = editor.value;
        originalMetadata = {
          title: titleInput.value,
          category: categoryInput.value,
          tags: tagsInput.value
        };

        localStorage.removeItem(`wiki-draft-${projectName}-${pagePath}`);

        setTimeout(() => {
          autosaveStatus.textContent = '';
        }, 3000);
      } else {
        throw new Error(result.error || 'Failed to save');
      }
    } catch (error) {
      alert(`Error saving page: ${error.message}`);
      autosaveStatus.textContent = 'Save failed';
      autosaveStatus.className = 'autosave-status';
    } finally {
      saveBtn.disabled = false;
      saveBtn.textContent = 'Save';
    }
  }

  editor.addEventListener('input', () => {
    debouncedPreviewUpdate();
    checkForChanges();
  });

  [titleInput, categoryInput, tagsInput].forEach(input => {
    input.addEventListener('input', checkForChanges);
  });

  saveBtn.addEventListener('click', savePage);

  cancelBtn.addEventListener('click', () => {
    if (hasUnsavedChanges) {
      if (confirm('You have unsaved changes. Are you sure you want to leave?')) {
        window.location.href = `/wiki/${projectName}/${pagePath.replace('.md', '')}`;
      }
    } else {
      window.location.href = `/wiki/${projectName}/${pagePath.replace('.md', '')}`;
    }
  });

  window.addEventListener('beforeunload', (e) => {
    if (hasUnsavedChanges) {
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  document.addEventListener('keydown', (e) => {
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
      e.preventDefault();
      savePage();
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'b') {
      e.preventDefault();
      insertMarkdown('**', '**', 'bold text');
    }

    if ((e.ctrlKey || e.metaKey) && e.key === 'i') {
      e.preventDefault();
      insertMarkdown('*', '*', 'italic text');
    }
  });

  document.querySelectorAll('.toolbar-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const action = btn.getAttribute('data-action');
      handleToolbarAction(action);
    });
  });

  function handleToolbarAction(action) {
    switch (action) {
      case 'bold':
        insertMarkdown('**', '**', 'bold text');
        break;
      case 'italic':
        insertMarkdown('*', '*', 'italic text');
        break;
      case 'heading':
        insertAtLineStart('## ', 'Heading');
        break;
      case 'link':
        insertMarkdown('[', '](url)', 'link text');
        break;
      case 'code':
        insertMarkdown('\n```\n', '\n```\n', 'code here');
        break;
      case 'list':
        insertAtLineStart('- ', 'list item');
        break;
    }
  }

  function insertMarkdown(prefix, suffix, placeholder) {
    const start = editor.selectionStart;
    const end = editor.selectionEnd;
    const selectedText = editor.value.substring(start, end);
    const replacement = selectedText || placeholder;
    const newText = prefix + replacement + suffix;

    editor.value = editor.value.substring(0, start) + newText + editor.value.substring(end);

    if (selectedText) {
      editor.setSelectionRange(start, start + newText.length);
    } else {
      editor.setSelectionRange(start + prefix.length, start + prefix.length + placeholder.length);
    }

    editor.focus();
    debouncedPreviewUpdate();
    checkForChanges();
  }

  function insertAtLineStart(prefix, placeholder) {
    const start = editor.selectionStart;
    const text = editor.value;

    const lineStart = text.lastIndexOf('\n', start - 1) + 1;
    const lineEnd = text.indexOf('\n', start);
    const actualLineEnd = lineEnd === -1 ? text.length : lineEnd;

    const currentLine = text.substring(lineStart, actualLineEnd);

    if (currentLine.trim() === '') {
      editor.value = text.substring(0, lineStart) + prefix + placeholder + text.substring(actualLineEnd);
      editor.setSelectionRange(lineStart + prefix.length, lineStart + prefix.length + placeholder.length);
    } else {
      editor.value = text.substring(0, lineStart) + prefix + currentLine + text.substring(actualLineEnd);
      editor.setSelectionRange(lineStart + prefix.length + currentLine.length, lineStart + prefix.length + currentLine.length);
    }

    editor.focus();
    debouncedPreviewUpdate();
    checkForChanges();
  }

  setInterval(() => {
    if (hasUnsavedChanges) {
      autoSaveToLocalStorage();
      autosaveStatus.textContent = 'Draft auto-saved';
      autosaveStatus.className = 'autosave-status saved';
      setTimeout(() => {
        if (hasUnsavedChanges) {
          autosaveStatus.textContent = 'Unsaved changes';
          autosaveStatus.className = 'autosave-status';
        }
      }, 2000);
    }
  }, 30000);

  updatePreview();
  loadFromLocalStorage();
  checkForChanges();
});
