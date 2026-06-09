(function () {
  function initSiteNav() {
    var nav = document.querySelector('.site-nav');
    if (!nav) return;

    var path = window.location.pathname.replace(/\\/g, '/');
    var inMemoireSubfolder = path.indexOf('/projets/memoire/') !== -1;
    var prefix = inMemoireSubfolder ? '../../' : '';

    var file = path.split('/').pop() || 'index.html';
    if (!file || file === '/') file = 'index.html';
    var page = file.replace(/\.html$/, '');

    var projetsHref = page === 'index' ? prefix + '#projets' : prefix + 'index.html#projets';

    function linkClass(target) {
      var cls = 'nav-link';
      var isActive =
        page === target ||
        (target === 'projets' && (page === 'index' || /^projet\d+$/.test(page)));
      if (isActive) cls += ' active';
      return cls;
    }

    var themeBtn =
      '<button class="theme-toggle" id="theme-toggle" aria-label="Basculer le thème clair / sombre" type="button">' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
      '</button>';

    nav.innerHTML =
      '<div class="nav-inner">' +
      '<a href="' + prefix + 'index.html" class="nav-logo">Lydérick Henry</a>' +
      '<div class="nav-links">' +
      '<a href="' + projetsHref + '" class="' + linkClass('projets') + '">Projets</a>' +
      '<a href="' + prefix + 'cv.html" class="' + linkClass('cv') + '">CV</a>' +
      '<a href="' + prefix + 'memoire.html" class="' + linkClass('memoire') + '" data-secondary="true">Mémoire</a>' +
      '<a href="' + prefix + 'explorateur.html" class="' + linkClass('explorateur') + '" data-secondary="true">Open data</a>' +
      themeBtn +
      '</div>' +
      '</div>';

    var toggle = document.getElementById('theme-toggle');
    if (toggle && !toggle.dataset.bound) {
      toggle.dataset.bound = 'true';
      toggle.addEventListener('click', function () {
        var current = document.documentElement.getAttribute('data-theme') || 'light';
        var next = current === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', next);
        localStorage.setItem('theme', next);
        document.dispatchEvent(new CustomEvent('theme-changed', { detail: { theme: next } }));
      });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initSiteNav);
  } else {
    initSiteNav();
  }
})();
