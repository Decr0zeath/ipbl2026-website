// ============================================================
// SPA-lite viewer for the manual shell (manual.html), adapted
// from the course-viewer pattern: the chrome loads once, section
// content is fetched from sections/<slug>.html and injected, and
// hash routing (#slug) keeps every section linkable.
// On pages without MANUAL_MAP (index.html) only the mobile
// sidebar toggle below is active.
// ============================================================

(function () {
  // ---- Mobile sidebar toggle ----
  var toggle = document.querySelector('.nav-toggle');
  var sidebarEl = document.querySelector('aside.sidebar');

  function closeSidebar() {
    if (!sidebarEl) return;
    sidebarEl.classList.remove('open');
    if (toggle) {
      toggle.setAttribute('aria-expanded', 'false');
      toggle.textContent = 'Contents';
    }
  }

  if (toggle && sidebarEl) {
    toggle.addEventListener('click', function () {
      sidebarEl.classList.toggle('open');
      var expanded = sidebarEl.classList.contains('open');
      toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
      toggle.textContent = expanded ? 'Close' : 'Contents';
    });
  }

  // ---- Viewer (shell page only) ----
  if (typeof MANUAL_MAP === 'undefined') return;

  var navSections = document.getElementById('navSections');
  var navReference = document.getElementById('navReference');
  var pageHead = document.getElementById('pageHead');
  var view = document.getElementById('sectionView');
  var pagination = document.getElementById('pagination');
  var cache = {};

  var ALL = MANUAL_MAP.concat(MANUAL_REFERENCE);

  function findEntry(slug) {
    for (var i = 0; i < ALL.length; i++) {
      if (ALL[i].slug === slug) return ALL[i];
    }
    return null;
  }

  function esc(s) {
    return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  function renderSidebar(active) {
    var html = '';
    MANUAL_MAP.forEach(function (s) {
      html += '<li><a href="#' + s.slug + '"' + (s.slug === active ? ' class="current"' : '') + '>' + esc(s.title) + '</a></li>';
    });
    navSections.innerHTML = html;

    var rhtml = '';
    MANUAL_REFERENCE.forEach(function (s) {
      rhtml += '<li><a href="#' + s.slug + '"' + (s.slug === active ? ' class="current"' : '') + '><span>' + esc(s.title) + '</span></a></li>';
    });
    navReference.innerHTML = rhtml;
  }

  function renderHead(entry) {
    pageHead.innerHTML =
      '<div class="crumb">' + esc(entry.crumb) + '</div>' +
      '<h1>' + esc(entry.title) + '</h1>' +
      '<p class="subtitle">' + esc(entry.subtitle) + '</p>';
    document.title = (entry.num ? '§' + entry.num + ' ' : '') + entry.title + ' · iPBL 2026 Manual';
  }

  function pagLink(href, direction, title, cls) {
    return '<a href="' + href + '" class="' + cls + '">' +
      '<span class="page-direction">' + direction + '</span>' +
      '<span class="page-title">' + esc(title) + '</span></a>';
  }

  function renderPagination(entry) {
    var html = '';
    var idx = MANUAL_MAP.indexOf(entry);
    var last = MANUAL_MAP.length - 1;

    if (idx === -1) {
      // Reference pages (credits): previous = last manual section
      var lastSec = MANUAL_MAP[last];
      html += pagLink('#' + lastSec.slug, '← Previous · §' + lastSec.num, lastSec.title, 'prev');
      html += pagLink('index.html', '↑ Top', 'Back to Home', 'next');
    } else {
      if (idx === 0) {
        html += pagLink('index.html', '← Home', 'Welcome', 'prev');
      } else {
        var p = MANUAL_MAP[idx - 1];
        html += pagLink('#' + p.slug, '← Previous · §' + p.num, p.title, 'prev');
      }
      if (idx === last) {
        var ref = MANUAL_REFERENCE[0];
        html += pagLink('#' + ref.slug, 'Reference', ref.title, 'next');
      } else {
        var n = MANUAL_MAP[idx + 1];
        html += pagLink('#' + n.slug, 'Next · §' + n.num, n.title, 'next');
      }
    }
    pagination.innerHTML = html;
  }

  function inject(entry, html) {
    renderSidebar(entry.slug);
    renderHead(entry);
    view.innerHTML = html;
    renderPagination(entry);
    closeSidebar();
    window.scrollTo({ top: 0 });
  }

  function loadSection(slug) {
    var entry = findEntry(slug) || MANUAL_MAP[0];
    var file = 'sections/' + entry.slug + '.html';

    if (history.replaceState) history.replaceState(null, '', '#' + entry.slug);

    if (cache[file]) {
      inject(entry, cache[file]);
      return;
    }

    view.innerHTML = '<p class="view-status">Loading&hellip;</p>';

    fetch(file)
      .then(function (res) {
        if (!res.ok) throw new Error('HTTP ' + res.status);
        return res.text();
      })
      .then(function (html) {
        cache[file] = html;
        inject(entry, html);
      })
      .catch(function (err) {
        view.innerHTML = '<p class="view-status">Could not load this section (' + esc(err.message) + '). ' +
          'If you opened this file directly from disk, serve the folder over HTTP instead, e.g. VS Code Live Server.</p>';
      });
  }

  window.addEventListener('hashchange', function () {
    loadSection(window.location.hash.replace('#', ''));
  });

  loadSection(window.location.hash.replace('#', ''));
})();
