// Mobile sidebar toggle + active link highlight
(function () {
  const toggle = document.querySelector('.nav-toggle');
  const sidebar = document.querySelector('aside.sidebar');
  if (toggle && sidebar) {
    toggle.addEventListener('click', () => {
      sidebar.classList.toggle('open');
      const expanded = sidebar.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.textContent = expanded ? 'Close' : 'Contents';
    });
  }

  // Highlight current page in sidebar
  const path = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('aside.sidebar a').forEach((a) => {
    const href = a.getAttribute('href');
    if (href === path) a.classList.add('current');
  });
})();
