/*
  storage.js
  لایه‌ی دسترسی به داده‌ها (Data Access Layer)
  همه‌ی خواندن/نوشتن روی localStorage فقط از همین فایل انجام می‌شه
  تا بقیه‌ی کد به ساختار ذخیره‌سازی وابسته نباشه.
*/

const STORAGE_KEYS = {
  USERS: 'tm_users',
  CURRENT_USER: 'tm_current_user',
  TASKS: 'tm_tasks',
  THEME: 'tm_theme'
};

/* ---------- کاربران ---------- */

function getUsers() {
  const raw = localStorage.getItem(STORAGE_KEYS.USERS);
  return raw ? JSON.parse(raw) : [];
}

function saveUsers(users) {
  localStorage.setItem(STORAGE_KEYS.USERS, JSON.stringify(users));
}

function findUserByEmail(email) {
  return getUsers().find(u => u.email.toLowerCase() === email.toLowerCase());
}

function addUser(user) {
  const users = getUsers();
  users.push(user);
  saveUsers(users);
}

function getCurrentUser() {
  const raw = localStorage.getItem(STORAGE_KEYS.CURRENT_USER);
  return raw ? JSON.parse(raw) : null;
}

function setCurrentUser(user) {
  // پسورد رو تو سشن جاری ذخیره نمی‌کنیم، فقط اطلاعات نمایشی
  const safeUser = { name: user.name, email: user.email };
  localStorage.setItem(STORAGE_KEYS.CURRENT_USER, JSON.stringify(safeUser));
}

function clearCurrentUser() {
  localStorage.removeItem(STORAGE_KEYS.CURRENT_USER);
}

/* ---------- وظایف (Tasks) ---------- */

function getTasks() {
  const raw = localStorage.getItem(STORAGE_KEYS.TASKS);
  return raw ? JSON.parse(raw) : [];
}

function saveTasks(tasks) {
  localStorage.setItem(STORAGE_KEYS.TASKS, JSON.stringify(tasks));
}

function addTask(task) {
  const tasks = getTasks();
  tasks.push(task);
  saveTasks(tasks);
}

function updateTask(id, updatedFields) {
  const tasks = getTasks();
  const index = tasks.findIndex(t => t.id === id);
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...updatedFields };
    saveTasks(tasks);
  }
}

function deleteTask(id) {
  const tasks = getTasks().filter(t => t.id !== id);
  saveTasks(tasks);
}

function generateId() {
  return 'task_' + Date.now() + '_' + Math.floor(Math.random() * 10000);
}

/* ---------- داده‌ی اولیه (Seed) ---------- */
/* فقط یک‌بار، در اولین اجرا، برای اینکه دمو خالی نباشه */

function seedInitialData() {
  if (getUsers().length === 0) {
    addUser({ name: 'کاربر دمو', email: 'admin@example.com', password: '123456' });
  }

  // پاک‌سازی وظایف نمونه‌ای که ممکنه از نسخه‌های قبلی در localStorage مرورگر مونده باشه
  if (localStorage.getItem('tm_seed_v3') !== 'done') {
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.setItem('tm_seed_v3', 'done');
  }
  // از این به بعد بدون وظیفه‌ی نمونه — کاربر با لیست خالی شروع می‌کند
}

function clearAllTaskData() {
  localStorage.removeItem(STORAGE_KEYS.TASKS);
}
