/**
 * Planning page JavaScript - Task management with Kanban board
 */

// State
let currentProject = null;
let allTasks = [];
let currentFilter = 'all';
let editingTaskId = null;
let deletingTaskId = null;

// DOM elements
const projectSelector = document.getElementById('project');
const priorityFilter = document.getElementById('priorityFilter');
const createTaskBtn = document.getElementById('createTaskBtn');
const taskModal = document.getElementById('taskModal');
const deleteModal = document.getElementById('deleteModal');
const taskForm = document.getElementById('taskForm');
const closeModalBtn = document.getElementById('closeModal');
const cancelBtn = document.getElementById('cancelBtn');
const closeDeleteModalBtn = document.getElementById('closeDeleteModal');
const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');
const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  currentProject = projectSelector.value;
  loadTasks();
  setupEventListeners();
});

// Event listeners
function setupEventListeners() {
  projectSelector.addEventListener('change', handleProjectChange);
  priorityFilter.addEventListener('change', handleFilterChange);
  createTaskBtn.addEventListener('click', handleCreateTask);
  closeModalBtn.addEventListener('click', closeTaskModal);
  cancelBtn.addEventListener('click', closeTaskModal);
  taskForm.addEventListener('submit', handleTaskSubmit);
  closeDeleteModalBtn.addEventListener('click', closeDeleteConfirmation);
  cancelDeleteBtn.addEventListener('click', closeDeleteConfirmation);
  confirmDeleteBtn.addEventListener('click', handleDeleteConfirm);

  // Close modal on outside click
  taskModal.addEventListener('click', (e) => {
    if (e.target === taskModal) {
      closeTaskModal();
    }
  });

  deleteModal.addEventListener('click', (e) => {
    if (e.target === deleteModal) {
      closeDeleteConfirmation();
    }
  });

  // Setup drag and drop for all columns
  setupDragAndDrop();
}

// Project change handler
function handleProjectChange() {
  currentProject = projectSelector.value;
  loadTasks();
}

// Filter change handler
function handleFilterChange() {
  currentFilter = priorityFilter.value;
  renderTasks();
}

// Load tasks from API
async function loadTasks() {
  try {
    const response = await fetch(`/api/planning/${currentProject}`);
    const data = await response.json();

    if (data.success) {
      allTasks = data.tasks;
      renderTasks();
      updateStatistics(data.statistics);
    } else {
      showError('Failed to load tasks');
    }
  } catch (error) {
    console.error('Error loading tasks:', error);
    showError('Error loading tasks');
  }
}

// Render tasks on the board
function renderTasks() {
  // Filter tasks by priority if needed
  const filteredTasks = currentFilter === 'all'
    ? allTasks
    : allTasks.filter(task => task.priority === currentFilter);

  // Group tasks by status
  const tasksByStatus = {
    'todo': filteredTasks.filter(t => t.status === 'todo'),
    'in-progress': filteredTasks.filter(t => t.status === 'in-progress'),
    'done': filteredTasks.filter(t => t.status === 'done')
  };

  // Render each column
  renderColumn('todoColumn', tasksByStatus['todo']);
  renderColumn('inProgressColumn', tasksByStatus['in-progress']);
  renderColumn('doneColumn', tasksByStatus['done']);

  // Update counts
  updateCounts(tasksByStatus);
}

// Render a single column
function renderColumn(columnId, tasks) {
  const column = document.getElementById(columnId);
  const emptyState = column.querySelector('.empty-state');

  if (tasks.length === 0) {
    if (emptyState) {
      emptyState.style.display = 'block';
    }
    // Remove all task cards
    const taskCards = column.querySelectorAll('.task-card');
    taskCards.forEach(card => card.remove());
  } else {
    if (emptyState) {
      emptyState.style.display = 'none';
    }

    // Clear existing tasks
    const taskCards = column.querySelectorAll('.task-card');
    taskCards.forEach(card => card.remove());

    // Add task cards
    tasks.forEach(task => {
      const card = createTaskCard(task);
      column.appendChild(card);
    });
  }
}

// Create task card element
function createTaskCard(task) {
  const card = document.createElement('div');
  card.className = 'task-card';
  card.draggable = true;
  card.dataset.taskId = task.id;
  card.dataset.priority = task.priority;

  const priorityBadge = `<span class="priority-badge priority-${task.priority}">${task.priority}</span>`;

  const assignedPages = task.assignedPages && task.assignedPages.length > 0
    ? `<div class="task-pages">${task.assignedPages.length} page(s) assigned</div>`
    : '';

  const completedDate = task.completedAt
    ? `<div class="task-date">Completed: ${formatDate(task.completedAt)}</div>`
    : `<div class="task-date">Created: ${formatDate(task.createdAt)}</div>`;

  card.innerHTML = `
    <div class="task-header">
      <h3 class="task-title">${escapeHtml(task.title)}</h3>
      ${priorityBadge}
    </div>
    ${task.description ? `<p class="task-description">${escapeHtml(task.description)}</p>` : ''}
    ${assignedPages}
    ${completedDate}
    <div class="task-actions">
      <button class="btn-icon btn-edit" data-task-id="${task.id}" title="Edit">✎</button>
      <button class="btn-icon btn-delete" data-task-id="${task.id}" title="Delete">🗑</button>
    </div>
  `;

  // Add event listeners
  card.querySelector('.btn-edit').addEventListener('click', (e) => {
    e.stopPropagation();
    handleEditTask(task.id);
  });

  card.querySelector('.btn-delete').addEventListener('click', (e) => {
    e.stopPropagation();
    handleDeleteTask(task.id);
  });

  // Drag events
  card.addEventListener('dragstart', handleDragStart);
  card.addEventListener('dragend', handleDragEnd);

  return card;
}

// Update task counts
function updateCounts(tasksByStatus) {
  document.getElementById('todoCount').textContent = tasksByStatus['todo'].length;
  document.getElementById('inProgressCount').textContent = tasksByStatus['in-progress'].length;
  document.getElementById('doneCount').textContent = tasksByStatus['done'].length;
}

// Update statistics panel
function updateStatistics(stats) {
  document.getElementById('statTotal').textContent = stats.total;
  document.getElementById('statTodo').textContent = stats.todo;
  document.getElementById('statInProgress').textContent = stats.inProgress;
  document.getElementById('statCompleted').textContent = stats.completed;
  document.getElementById('statCompletionRate').textContent = stats.completedPercentage + '%';
}

// Drag and drop setup
function setupDragAndDrop() {
  const columns = document.querySelectorAll('.column-content');

  columns.forEach(column => {
    column.addEventListener('dragover', handleDragOver);
    column.addEventListener('drop', handleDrop);
    column.addEventListener('dragenter', handleDragEnter);
    column.addEventListener('dragleave', handleDragLeave);
  });
}

// Drag handlers
let draggedElement = null;

function handleDragStart(e) {
  draggedElement = e.currentTarget;
  e.currentTarget.classList.add('dragging');
  e.dataTransfer.effectAllowed = 'move';
  e.dataTransfer.setData('text/html', e.currentTarget.innerHTML);
}

function handleDragEnd(e) {
  e.currentTarget.classList.remove('dragging');
  draggedElement = null;

  // Remove all drag-over classes
  document.querySelectorAll('.column-content').forEach(col => {
    col.classList.remove('drag-over');
  });
}

function handleDragOver(e) {
  if (e.preventDefault) {
    e.preventDefault();
  }
  e.dataTransfer.dropEffect = 'move';
  return false;
}

function handleDragEnter(e) {
  if (e.currentTarget.classList.contains('column-content')) {
    e.currentTarget.classList.add('drag-over');
  }
}

function handleDragLeave(e) {
  if (e.currentTarget.classList.contains('column-content') &&
      !e.currentTarget.contains(e.relatedTarget)) {
    e.currentTarget.classList.remove('drag-over');
  }
}

async function handleDrop(e) {
  if (e.stopPropagation) {
    e.stopPropagation();
  }

  e.currentTarget.classList.remove('drag-over');

  if (draggedElement && draggedElement !== e.currentTarget) {
    const taskId = draggedElement.dataset.taskId;
    const newStatus = e.currentTarget.dataset.status;

    // Update task status via API
    await updateTaskStatus(taskId, newStatus);
  }

  return false;
}

// Update task status
async function updateTaskStatus(taskId, newStatus) {
  try {
    const response = await fetch(`/api/planning/${currentProject}/tasks/${taskId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ status: newStatus })
    });

    const data = await response.json();

    if (data.success) {
      // Update local task
      const taskIndex = allTasks.findIndex(t => t.id === taskId);
      if (taskIndex !== -1) {
        allTasks[taskIndex] = data.task;
      }
      // Re-render
      await loadTasks();
    } else {
      showError('Failed to update task status');
    }
  } catch (error) {
    console.error('Error updating task status:', error);
    showError('Error updating task status');
  }
}

// Create task handler
function handleCreateTask() {
  editingTaskId = null;
  document.getElementById('modalTitle').textContent = 'Create Task';
  taskForm.reset();
  document.getElementById('taskId').value = '';
  showTaskModal();
}

// Edit task handler
function handleEditTask(taskId) {
  const task = allTasks.find(t => t.id === taskId);
  if (!task) return;

  editingTaskId = taskId;
  document.getElementById('modalTitle').textContent = 'Edit Task';

  // Populate form
  document.getElementById('taskId').value = task.id;
  document.getElementById('taskTitle').value = task.title;
  document.getElementById('taskDescription').value = task.description || '';
  document.getElementById('taskPriority').value = task.priority;
  document.getElementById('taskStatus').value = task.status;
  document.getElementById('taskPages').value = (task.assignedPages || []).join(', ');
  document.getElementById('taskNotes').value = task.notes || '';

  showTaskModal();
}

// Delete task handler
function handleDeleteTask(taskId) {
  deletingTaskId = taskId;
  showDeleteConfirmation();
}

// Delete confirmation handler
async function handleDeleteConfirm() {
  if (!deletingTaskId) return;

  const btn = confirmDeleteBtn;
  const btnText = btn.querySelector('.btn-text');
  const btnLoading = btn.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  btn.disabled = true;

  try {
    const response = await fetch(`/api/planning/${currentProject}/tasks/${deletingTaskId}`, {
      method: 'DELETE'
    });

    const data = await response.json();

    if (data.success) {
      closeDeleteConfirmation();
      await loadTasks();
    } else {
      showError('Failed to delete task');
    }
  } catch (error) {
    console.error('Error deleting task:', error);
    showError('Error deleting task');
  } finally {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btn.disabled = false;
  }
}

// Form submit handler
async function handleTaskSubmit(e) {
  e.preventDefault();

  const btn = document.getElementById('saveTaskBtn');
  const btnText = btn.querySelector('.btn-text');
  const btnLoading = btn.querySelector('.btn-loading');

  btnText.style.display = 'none';
  btnLoading.style.display = 'inline';
  btn.disabled = true;

  const formData = new FormData(taskForm);
  const taskData = {
    title: formData.get('title'),
    description: formData.get('description'),
    priority: formData.get('priority'),
    status: formData.get('status'),
    notes: formData.get('notes'),
    assignedPages: formData.get('assignedPages')
      ? formData.get('assignedPages').split(',').map(p => p.trim()).filter(p => p)
      : []
  };

  try {
    let response;

    if (editingTaskId) {
      // Update existing task
      response = await fetch(`/api/planning/${currentProject}/tasks/${editingTaskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
    } else {
      // Create new task
      response = await fetch(`/api/planning/${currentProject}/tasks`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(taskData)
      });
    }

    const data = await response.json();

    if (data.success) {
      closeTaskModal();
      await loadTasks();
    } else {
      showError(data.error || 'Failed to save task');
    }
  } catch (error) {
    console.error('Error saving task:', error);
    showError('Error saving task');
  } finally {
    btnText.style.display = 'inline';
    btnLoading.style.display = 'none';
    btn.disabled = false;
  }
}

// Modal controls
function showTaskModal() {
  taskModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeTaskModal() {
  taskModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  taskForm.reset();
  editingTaskId = null;
}

function showDeleteConfirmation() {
  deleteModal.style.display = 'flex';
  document.body.style.overflow = 'hidden';
}

function closeDeleteConfirmation() {
  deleteModal.style.display = 'none';
  document.body.style.overflow = 'auto';
  deletingTaskId = null;
}

// Utility functions
function formatDate(dateString) {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function showError(message) {
  // Simple error display - could be enhanced with a toast/notification system
  alert(message);
}
