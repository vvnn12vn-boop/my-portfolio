/*
  theme.js
  رفتار مشترک صفحات داخلی: toggle سایدبار، دارک/لایت مود، نمایش نام کاربر، دکمه خروج
*/

document.addEventListener('DOMContentLoaded', () => {

  /* ---------- Auth Guard ---------- */
  // اگر کاربر لاگین نکرده باشه، به صفحه ورود هدایت می‌شه
  const user = getCurrentUser();
  if (!user) {
    window.location.href = 'login.html';
    return;
  }

  const userNameEls = document.querySelectorAll('[data-user-name]');
  userNameEls.forEach(el => el.textContent = user.name);

  const userInitialEls = document.querySelectorAll('[data-user-initial]');
  userInitialEls.forEach(el => el.textContent = (user.name || '?').trim().charAt(0));

  /* ---------- Sidebar toggle (موبایل) ---------- */
  const sidebarToggle = document.getElementById('sidebarToggle');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');

  function closeSidebar() {
    sidebar.classList.remove('show');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('show');
  }

  if (sidebarToggle && sidebar) {
    sidebarToggle.addEventListener('click', () => {
      sidebar.classList.toggle('show');
      if (sidebarBackdrop) sidebarBackdrop.classList.toggle('show');
    });
  }
  const sidebarClose = document.getElementById('sidebarClose');
  if (sidebarClose) sidebarClose.addEventListener('click', closeSidebar);
  if (sidebarBackdrop) {
    sidebarBackdrop.addEventListener('click', closeSidebar);
  }

  /* ---------- دارک / لایت مود ---------- */
  const themeToggle = document.getElementById('themeToggle');
  const root = document.documentElement;

  function applyTheme(theme) {
    root.setAttribute('data-theme', theme);
    localStorage.setItem(STORAGE_KEYS.THEME, theme);
    if (themeToggle) {
      themeToggle.innerHTML = theme === 'dark'
        ? '<i class="bi bi-sun-fill"></i>'
        : '<i class="bi bi-moon-stars-fill"></i>';
    }
  }

  const savedTheme = localStorage.getItem(STORAGE_KEYS.THEME) || 'light';
  applyTheme(savedTheme);

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const current = root.getAttribute('data-theme');
      applyTheme(current === 'dark' ? 'light' : 'dark');
    });
  }

  /* ---------- پاک‌سازی همه‌ی وظایف (دستی، به‌درخواست کاربر) ---------- */
  const resetDataBtn = document.getElementById('resetDataBtn');
  if (resetDataBtn) {
    resetDataBtn.addEventListener('click', (e) => {
      e.preventDefault();
      if (confirm('همه‌ی وظایف پاک بشن؟ این عملیات قابل بازگشت نیست.')) {
        clearAllTaskData();
        window.location.reload();
      }
    });
  }

  /* ---------- خروج ---------- */
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      clearCurrentUser();
      window.location.href = 'login.html';
    });
  }
});
