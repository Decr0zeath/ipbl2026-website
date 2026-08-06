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

  // ---- Media loading (figures + hero 3D model) ----
  // Covers img, video, model-viewer and kicanvas-embed. Hides the host's
  // asset until it resolves; figure .frame hosts also get a "Loading"
  // label over the gap, but .hero-mark hides silently. Re-run on injected
  // section content, since fragments arrive as fetched HTML rather than
  // being present at parse time.
  function markLoading(host, asset) {
    if (host.classList.contains('is-loading') || host.dataset.loadingDone) return;
    host.classList.add('is-loading');
    // The hero 3D model hides silently until it's ready; every other
    // host (figure frames) shows a "Loading" label over the gap.
    var label = null;
    if (!host.classList.contains('hero-mark')) {
      label = document.createElement('span');
      label.className = 'asset-loading-label';
      label.textContent = 'Loading';
      host.appendChild(label);
    }

    function clear() {
      host.classList.remove('is-loading');
      host.dataset.loadingDone = 'true';
      if (label && label.parentNode) label.parentNode.removeChild(label);
    }

    switch (asset.tagName) {
      case 'IMG':
        if (asset.complete && asset.naturalWidth !== 0) { clear(); return; }
        asset.addEventListener('load', clear, { once: true });
        asset.addEventListener('error', clear, { once: true });
        break;
      case 'VIDEO':
        if (asset.readyState >= 1) { clear(); return; }
        asset.addEventListener('loadedmetadata', clear, { once: true });
        asset.addEventListener('error', clear, { once: true });
        break;
      case 'MODEL-VIEWER':
        if (asset.loaded) { clear(); return; }
        asset.addEventListener('load', clear, { once: true });
        asset.addEventListener('error', clear, { once: true });
        break;
      case 'KICANVAS-EMBED':
        // kicanvas.js does not fire load/error events (tracked upstream as
        // not yet implemented), but it does reflect a `loaded` attribute
        // once rendered; watch for that and fall back to a fixed timeout
        // rather than risk the label getting stuck forever.
        if (asset.hasAttribute('loaded')) { clear(); return; }
        var observer = new MutationObserver(function () {
          if (asset.hasAttribute('loaded')) {
            observer.disconnect();
            clear();
          }
        });
        observer.observe(asset, { attributes: true, attributeFilter: ['loaded'] });
        setTimeout(clear, 8000);
        break;
      default:
        clear();
    }
  }

  function initMediaLoading(root) {
    root.querySelectorAll('figure .frame, .hero-mark').forEach(function (host) {
      var asset = host.querySelector('img, video, model-viewer, kicanvas-embed');
      if (asset) markLoading(host, asset);
    });
  }

  initMediaLoading(document);

  // ---- Scroll reveal (ease/zoom-in the first time an element appears) ----
  function initScrollReveal(root) {
    var targets = root.querySelectorAll('.scroll-reveal:not(.in-view)');
    if (!targets.length) return;
    if (!('IntersectionObserver' in window)) {
      targets.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }
    // Observer is created lazily on the first scroll so a target already
    // sitting in the viewport at page load doesn't zoom before the visitor
    // has scrolled at all.
    window.addEventListener('scroll', function () {
      var observer = new IntersectionObserver(function (entries) {
        entries.forEach(function (entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.25 });
      targets.forEach(function (el) { observer.observe(el); });
    }, { once: true, passive: true });
  }

  initScrollReveal(document);

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
    document.title = entry.title + ' · iPBL 2026 Manual';
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
      html += pagLink('#' + lastSec.slug, '← Previous · Section ' + lastSec.num, lastSec.title, 'prev');
      html += pagLink('index.html', '↑ Top', 'Back to Home', 'next');
    } else {
      if (idx === 0) {
        html += pagLink('index.html', '← Home', 'Welcome', 'prev');
      } else {
        var p = MANUAL_MAP[idx - 1];
        html += pagLink('#' + p.slug, '← Previous · Section ' + p.num, p.title, 'prev');
      }
      if (idx === last) {
        var ref = MANUAL_REFERENCE[0];
        html += pagLink('#' + ref.slug, 'Credits →', ref.title, 'next');
      } else {
        var n = MANUAL_MAP[idx + 1];
        html += pagLink('#' + n.slug, 'Next · Section ' + n.num + ' →', n.title, 'next');
      }
    }
    pagination.innerHTML = html;
  }

  function inject(entry, html, anchor) {
    renderSidebar(entry.slug);
    renderHead(entry);
    view.innerHTML = html;
    renderPagination(entry);
    initMediaLoading(view);
    initScrollReveal(view);
    closeSidebar();
    var target = anchor && document.getElementById(anchor);
    if (target) {
      target.scrollIntoView();
    } else {
      window.scrollTo({ top: 0 });
    }
  }

  function loadSection(hash) {
    var sep = hash.indexOf(':');
    var slug = sep === -1 ? hash : hash.slice(0, sep);
    var anchor = sep === -1 ? null : hash.slice(sep + 1);
    var entry = findEntry(slug) || MANUAL_MAP[0];
    var file = 'sections/' + entry.slug + '.html';

    if (history.replaceState) history.replaceState(null, '', '#' + entry.slug + (anchor ? ':' + anchor : ''));
    document.documentElement.scrollTop = document.body.scrollTop = 0;

    if (cache[file]) {
      inject(entry, cache[file], anchor);
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
        inject(entry, html, anchor);
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
