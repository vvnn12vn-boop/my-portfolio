/*
  tasks.js
  مدیریت کامل وظایف: افزودن، ویرایش، حذف، تغییر وضعیت، فیلتر و جستجو
*/

document.addEventListener('DOMContentLoaded', () => {

  seedInitialData();

  const tableBody = document.getElementById('tasksTableBody');
  const emptyState = document.getElementById('emptyState');
  const taskForm = document.getElementById('taskForm');
  const taskModalEl = document.getElementById('taskModal');
  const taskModal = new bootstrap.Modal(taskModalEl);
  const taskModalLabel = document.getElementById('taskModalLabel');
  const deleteModalEl = document.getElementById('deleteModal');
  const deleteModal = new bootstrap.Modal(deleteModalEl);

  const searchInput = document.getElementById('searchInput');
  const statusFilter = document.getElementById('statusFilter');
  const priorityFilter = document.getElementById('priorityFilter');
  const clearFiltersBtn = document.getElementById('clearFiltersBtn');
  const addTaskBtn = document.getElementById('addTaskBtn');

  let taskIdToDelete = null;

  const priorityLabels = { low: 'کم', medium: 'متوسط', high: 'بالا' };
  const priorityClasses = { low: 'tag-slate', medium: 'tag-amber', high: 'tag-brick' };
  const statusLabels = { pending: 'در انتظار', 'in-progress': 'در حال انجام', completed: 'انجام‌شده' };
  const statusClasses = { pending: 'tag-slate', 'in-progress': 'tag-info', completed: 'tag-success' };

  function isOverdue(task) {
    return task.status !== 'completed' && task.dueDate && task.dueDate < todayStr();
  }

  function todayStr() {
    return new Date().toISOString().split('T')[0];
  }

  function getFilteredTasks() {
    const search = searchInput.value.trim().toLowerCase();
    const status = statusFilter.value;
    const priority = priorityFilter.value;

    return getTasks().filter(task => {
      const matchesSearch = !search ||
        task.title.toLowerCase().includes(search) ||
        (task.description || '').toLowerCase().includes(search);
      const matchesStatus = !status || task.status === status;
      const matchesPriority = !priority || task.priority === priority;
      return matchesSearch && matchesStatus && matchesPriority;
    }).sort((a, b) => (a.dueDate || '').localeCompare(b.dueDate || ''));
  }

  function render() {
    const tasks = getFilteredTasks();
    tableBody.innerHTML = '';

    if (tasks.length === 0) {
      emptyState.classList.remove('d-none');
    } else {
      emptyState.classList.add('d-none');
    }

    tasks.forEach(task => {
      const row = document.createElement('tr');
      row.dataset.priority = task.priority;
      if (isOverdue(task)) row.classList.add('is-overdue');

      row.innerHTML = `
        <td>
          <div class="form-check">
            <input class="form-check-input complete-checkbox" type="checkbox" ${task.status === 'completed' ? 'checked' : ''} data-id="${task.id}">
          </div>
        </td>
        <td>
          <div class="fw-semibold ${task.status === 'completed' ? 'text-decoration-line-through text-muted' : ''}">${escapeHtml(task.title)}</div>
          ${task.description ? `<div class="small text-muted">${escapeHtml(task.description)}</div>` : ''}
        </td>
        <td><span class="tag ${priorityClasses[task.priority]}">${priorityLabels[task.priority]}</span></td>
        <td><span class="tag ${statusClasses[task.status]}">${statusLabels[task.status]}</span></td>
        <td>
          <span class="due-date ${isOverdue(task) ? 'is-overdue' : ''}">${task.dueDate || '—'}</span>
          ${isOverdue(task) ? '<span class="tag tag-brick ms-1">دیرکرد</span>' : ''}
        </td>
        <td class="text-end">
          <button class="btn btn-sm btn-outline-secondary edit-btn" data-id="${task.id}"><i class="bi bi-pencil"></i></button>
          <button class="btn btn-sm btn-outline-danger delete-btn" data-id="${task.id}"><i class="bi bi-trash"></i></button>
        </td>
      `;
      tableBody.appendChild(row);
    });

    updateCounters();
    attachRowEvents();
  }

  function updateCounters() {
    const all = getTasks();
    document.getElementById('countTotal').textContent = all.length;
    document.getElementById('countPending').textContent = all.filter(t => t.status === 'pending').length;
    document.getElementById('countInProgress').textContent = all.filter(t => t.status === 'in-progress').length;
    document.getElementById('countCompleted').textContent = all.filter(t => t.status === 'completed').length;
  }

  function attachRowEvents() {
    tableBody.querySelectorAll('.complete-checkbox').forEach(cb => {
      cb.addEventListener('change', () => {
        updateTask(cb.dataset.id, { status: cb.checked ? 'completed' : 'pending' });
        render();
      });
    });

    tableBody.querySelectorAll('.edit-btn').forEach(btn => {
      btn.addEventListener('click', () => openEditModal(btn.dataset.id));
    });

    tableBody.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        taskIdToDelete = btn.dataset.id;
        deleteModal.show();
      });
    });
  }

  function openAddModal() {
    taskForm.reset();
    document.getElementById('taskId').value = '';
    document.getElementById('taskTitle').classList.remove('is-invalid');
    taskModalLabel.textContent = 'افزودن وظیفه جدید';
    taskModal.show();
  }

  function openEditModal(id) {
    const task = getTasks().find(t => t.id === id);
    if (!task) return;
    document.getElementById('taskTitle').classList.remove('is-invalid');
    document.getElementById('taskId').value = task.id;
    document.getElementById('taskTitle').value = task.title;
    document.getElementById('taskDescription').value = task.description || '';
    document.getElementById('taskDueDate').value = task.dueDate || '';
    document.getElementById('taskPriority').value = task.priority;
    document.getElementById('taskStatus').value = task.status;
    taskModalLabel.textContent = 'ویرایش وظیفه';
    taskModal.show();
  }

  addTaskBtn.addEventListener('click', openAddModal);

  taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('taskId').value;
    const title = document.getElementById('taskTitle').value.trim();

    if (!title) {
      document.getElementById('taskTitle').classList.add('is-invalid');
      return;
    }
    document.getElementById('taskTitle').classList.remove('is-invalid');

    const data = {
      title,
      description: document.getElementById('taskDescription').value.trim(),
      dueDate: document.getElementById('taskDueDate').value,
      priority: document.getElementById('taskPriority').value,
      status: document.getElementById('taskStatus').value
    };

    if (id) {
      updateTask(id, data);
    } else {
      addTask({ id: generateId(), createdAt: Date.now(), ...data });
    }

    taskModal.hide();
    render();
  });

  document.getElementById('confirmDeleteBtn').addEventListener('click', () => {
    if (taskIdToDelete) {
      deleteTask(taskIdToDelete);
      taskIdToDelete = null;
      deleteModal.hide();
      render();
    }
  });

  searchInput.addEventListener('input', render);
  [statusFilter, priorityFilter].forEach(el => {
    el.addEventListener('change', render);
  });

  clearFiltersBtn.addEventListener('click', () => {
    searchInput.value = '';
    statusFilter.value = '';
    priorityFilter.value = '';
    render();
  });

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }

  deleteModalEl.addEventListener('hidden.bs.modal', () => { taskIdToDelete = null; });
  taskModalEl.addEventListener('hidden.bs.modal', () => {
    document.getElementById('taskTitle').classList.remove('is-invalid');
  });

  render();
});
