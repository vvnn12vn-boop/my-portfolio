/*
  dashboard.js
  آمار کلی و نمودار وضعیت وظایف در صفحه اصلی
*/

document.addEventListener('DOMContentLoaded', () => {

  seedInitialData();

  function animateCount(el, value) {
    const duration = 500;
    const start = performance.now();
    function step(now) {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(eased * value);
      if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  const tasks = getTasks();
  const today = new Date().toISOString().split('T')[0];

  const total = tasks.length;
  const pending = tasks.filter(t => t.status === 'pending').length;
  const inProgress = tasks.filter(t => t.status === 'in-progress').length;
  const completed = tasks.filter(t => t.status === 'completed').length;
  const overdue = tasks.filter(t => t.status !== 'completed' && t.dueDate && t.dueDate < today).length;

  animateCount(document.getElementById('statTotal'), total);
  animateCount(document.getElementById('statPending'), pending);
  animateCount(document.getElementById('statInProgress'), inProgress);
  animateCount(document.getElementById('statCompleted'), completed);
  animateCount(document.getElementById('statOverdue'), overdue);

  /* ---------- نمودار وضعیت وظایف ---------- */
  const ctx = document.getElementById('statusChart');
  const chartEmpty = document.getElementById('chartEmpty');
  if (ctx) {
    if (total === 0) {
      ctx.classList.add('d-none');
      if (chartEmpty) chartEmpty.classList.remove('d-none');
    } else {
      new Chart(ctx, {
        type: 'doughnut',
        data: {
          labels: ['در انتظار', 'در حال انجام', 'انجام‌شده'],
          datasets: [{
            data: [pending, inProgress, completed],
            backgroundColor: ['#5b6472', '#2f6f8f', '#1f7a4d'],
            borderWidth: 0
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          cutout: '68%',
          plugins: {
            legend: { position: 'bottom', labels: { font: { family: 'Vazirmatn' }, usePointStyle: true, pointStyle: 'circle' } }
          }
        }
      });
    }
  }

  /* ---------- لیست نزدیک‌ترین سررسیدها ---------- */
  const upcomingList = document.getElementById('upcomingList');
  const upcoming = tasks
    .filter(t => t.status !== 'completed' && t.dueDate)
    .sort((a, b) => a.dueDate.localeCompare(b.dueDate))
    .slice(0, 5);

  if (upcoming.length === 0) {
    upcomingList.innerHTML = '<li class="list-group-item text-muted bg-transparent border-0 px-0">وظیفه‌ای برای نمایش وجود ندارد.</li>';
  } else {
    upcomingList.innerHTML = upcoming.map(t => {
      const late = t.dueDate < today;
      return `
        <li class="list-group-item d-flex justify-content-between align-items-center bg-transparent px-0">
          <span>${escapeHtml(t.title)}</span>
          <span class="due-date ${late ? 'is-overdue' : ''}">${t.dueDate}</span>
        </li>
      `;
    }).join('');
  }

  function escapeHtml(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
});
