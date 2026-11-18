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

    var projetsHref = prefix + 'projets.html';

    function linkClass(target) {
      var cls = 'nav-link';
      var isActive =
        page === target ||
        (target === 'projets' && (page === 'projets' || /^projet\d+$/.test(page)));
      if (isActive) cls += ' active';
      return cls;
    }

    var savedLang = localStorage.getItem('lang') || 'fr';
    document.documentElement.setAttribute('lang', savedLang);

    function ariaLang(lang) {
      return lang === 'en' ? 'Switch language FR / EN' : 'Basculer la langue FR / EN';
    }
    function ariaTheme(lang) {
      return lang === 'en' ? 'Toggle light / dark theme' : 'Basculer le thème clair / sombre';
    }

    var langBtn =
      '<button class="lang-toggle" id="lang-toggle" aria-label="' + ariaLang(savedLang) + '" type="button">' +
      '<span class="lang-option lang-fr' + (savedLang === 'fr' ? ' active' : '') + '">FR</span>' +
      '<span class="lang-sep">/</span>' +
      '<span class="lang-option lang-en' + (savedLang === 'en' ? ' active' : '') + '">EN</span>' +
      '</button>';

    var themeBtn =
      '<button class="theme-toggle" id="theme-toggle" aria-label="' + ariaTheme(savedLang) + '" type="button">' +
      '<svg class="icon-moon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>' +
      '<svg class="icon-sun" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>' +
      '</button>';

    nav.innerHTML =
      '<div class="nav-inner">' +
      '<a href="' + prefix + 'index.html" class="nav-logo">Lydérick Henry</a>' +
      '<div class="nav-links" id="nav-links">' +
      '<a href="' + prefix + 'a-propos.html" class="' + linkClass('a-propos') + '">' + (savedLang === 'en' ? 'About' : 'À propos') + '</a>' +
      '<a href="' + projetsHref + '" class="' + linkClass('projets') + '">' + (savedLang === 'en' ? 'Projects' : 'Projets') + '</a>' +
      '<a href="' + prefix + 'explorateur.html" class="' + linkClass('explorateur') + '" data-secondary="true">' + (savedLang === 'en' ? 'Data Explorer' : 'Explorateur data') + '</a>' +
      '<a href="' + prefix + 'memoire.html" class="' + linkClass('memoire') + '" data-secondary="true">' + (savedLang === 'en' ? 'Thesis' : 'Mémoire') + '</a>' +
      '<a href="' + prefix + 'cv.html" class="' + linkClass('cv') + '" data-secondary="true">' + (savedLang === 'en' ? 'Resume' : 'CV') + '</a>' +
      '<a href="' + prefix + 'contact.html" class="' + linkClass('contact') + '">Contact</a>' +
      '</div>' +
      '<div class="nav-controls">' +
      themeBtn +
      langBtn +
      '<button class="nav-menu-btn" id="nav-menu-btn" type="button" aria-expanded="false" aria-controls="nav-links">' +
      'Menu' +
      '</button>' +
      '</div>' +
      '</div>';

    function applyNavTranslations(lang) {
      var links = nav.querySelectorAll('.nav-link');
      links.forEach(function (link) {
        var href = link.getAttribute('href');
        if (href.indexOf('a-propos') !== -1) link.textContent = lang === 'en' ? 'About' : 'À propos';
        else if (href.indexOf('projets.html') !== -1) link.textContent = lang === 'en' ? 'Projects' : 'Projets';
        else if (href.indexOf('explorateur') !== -1) link.textContent = lang === 'en' ? 'Data Explorer' : 'Explorateur data';
        else if (href.indexOf('memoire') !== -1) link.textContent = lang === 'en' ? 'Thesis' : 'Mémoire';
        else if (href.indexOf('cv.html') !== -1) link.textContent = lang === 'en' ? 'Resume' : 'CV';
        else if (href.indexOf('contact') !== -1) link.textContent = 'Contact';
      });

      var lb = nav.querySelector('#lang-toggle');
      if (lb) lb.setAttribute('aria-label', ariaLang(lang));
      var tb = nav.querySelector('#theme-toggle');
      if (tb) tb.setAttribute('aria-label', ariaTheme(lang));
    }

    /* La barre est écrite en JS : le moteur i18n ne la traduit pas. On se
       raccroche à son signal pour que la nav suive, quel que soit le point
       d'entrée (clic sur le bouton, setLanguage(), chargement de page). */
    document.addEventListener('i18n-applied', function (e) {
      applyNavTranslations(e.detail && e.detail.lang === 'en' ? 'en' : 'fr');
    });

    /* Sur petit écran, les liens passent dans un panneau déroulant : sans lui,
       Explorateur, Mémoire et CV n'étaient pas atteignables depuis la barre. */
    var menuBtn = document.getElementById('nav-menu-btn');
    if (menuBtn) {
      var menuLabel = function () {
        var en = (localStorage.getItem('lang') || 'fr') === 'en';
        var open = nav.classList.contains('is-open');
        menuBtn.textContent = open ? (en ? 'Close' : 'Fermer') : 'Menu';
      };
      var setOpen = function (open) {
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', open ? 'true' : 'false');
        menuLabel();
      };
      menuBtn.addEventListener('click', function () {
        var open = !nav.classList.contains('is-open');
        setOpen(open);
        /* Les liens précèdent le bouton dans le DOM : sans ce déplacement,
           Tab quittait le menu ouvert sans jamais passer par ses liens. */
        if (open) {
          var first = nav.querySelector('.nav-links .nav-link');
          if (first) first.focus();
        }
      });
      document.addEventListener('i18n-applied', menuLabel);
      document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && nav.classList.contains('is-open')) {
          setOpen(false);
          menuBtn.focus();
        }
      });
      document.addEventListener('click', function (e) {
        if (nav.classList.contains('is-open') && !nav.contains(e.target)) setOpen(false);
      });
    }

    // Theme toggle listener
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

    // Language toggle listener
    var langToggle = document.getElementById('lang-toggle');
    if (langToggle && !langToggle.dataset.bound) {
      langToggle.dataset.bound = 'true';
      langToggle.addEventListener('click', function (e) {
        e.preventDefault();
        var currentLang = localStorage.getItem('lang') || 'fr';
        var nextLang = currentLang === 'fr' ? 'en' : 'fr';
        localStorage.setItem('lang', nextLang);
        document.documentElement.setAttribute('lang', nextLang);

        var frEl = document.querySelector('.lang-option.lang-fr');
        var enEl = document.querySelector('.lang-option.lang-en');
        if (frEl && enEl) {
          if (nextLang === 'en') {
            frEl.classList.remove('active');
            enEl.classList.add('active');
          } else {
            enEl.classList.remove('active');
            frEl.classList.add('active');
          }
        }
        applyNavTranslations(nextLang);
        document.dispatchEvent(new CustomEvent('lang-changed', { detail: { lang: nextLang } }));
      });
    }
  }

  /* ── Fin de page ────────────────────────────────────────────────────────
     Les pages projet, le mémoire et l'explorateur se terminaient sur un
     bouton de téléchargement : aucun chemin vers le contact, le CV ou le
     projet suivant. Ce bloc est écrit ici pour n'exister qu'à un endroit.
     L'ordre et les titres reprennent ceux de projets.html : en ajoutant un
     projet là-bas, l'ajouter aussi dans PROJECTS. */
  var PROJECTS = [
    { page: 'projet8',  fr: 'Power BI - Analyse Accidents et Assurance', en: 'Power BI - Road Accident & Insurance Analysis' },
    { page: 'projet9',  fr: 'Power BI × Claude', en: 'Power BI × Claude' },
    { page: 'projet10', fr: "Regex par l'exemple", en: 'Regex by Example' },
    { page: 'projet1',  fr: 'Power BI - Analyse Immobilière', en: 'Power BI - Real Estate Analysis' },
    { page: 'projet2',  fr: 'Power BI - Suivi Bancaire', en: 'Power BI - Banking Tracker' },
    { page: 'projet7',  fr: 'Pipeline de données GCP', en: 'GCP Data Pipeline' },
    { page: 'projet4',  fr: 'Revue de presse automatisée', en: 'Automated Press Review' },
    { page: 'projet5',  fr: 'Power BI - Dashboard Restauration', en: 'Power BI - Restaurant Dashboard' },
    { page: 'projet6',  fr: 'Tableau - Analyse Financière', en: 'Tableau - Investor Behaviour Analysis' },
    { page: 'projet3',  fr: 'Excel - SIG, CAF et Ratios', en: 'Excel - Financial Statements, Cash Flow & Ratios' }
  ];

  function initPageEnd() {
    var file = window.location.pathname.replace(/\\/g, '/').split('/').pop() || 'index.html';
    var page = file.replace(/\.html$/, '');
    var index = -1;
    for (var i = 0; i < PROJECTS.length; i++) if (PROJECTS[i].page === page) index = i;
    var isProject = index !== -1;
    if (!isProject && page !== 'memoire' && page !== 'explorateur') return;

    var main = document.querySelector('main');
    if (!main || main.querySelector('.page-end')) return;

    var next = isProject ? PROJECTS[(index + 1) % PROJECTS.length] : null;
    var block = document.createElement('nav');
    block.className = 'page-end';
    var host = block;
    if (!main.classList.contains('container')) {
      host = document.createElement('div');
      host.className = 'container';
      host.appendChild(block);
    }
    main.appendChild(host);

    function esc(text) {
      return text.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    }

    function render() {
      var en = (localStorage.getItem('lang') || 'fr') === 'en';
      block.setAttribute('aria-label', en ? 'What next' : 'Pour continuer');
      var lead = isProject
        ? (en ? 'A question about this project, or want to see another one?'
              : "Une question sur ce projet, ou envie d'en voir un autre ?")
        : (en ? 'A question about this work, or want to see the projects?'
              : 'Une question sur ce travail, ou envie de voir les projets ?');
      var html = '<p>' + lead + '</p><div class="page-end-actions">' +
        '<a class="btn btn-primary" href="contact.html">' + (en ? 'Contact me' : 'Me contacter') + '</a>' +
        '<a class="btn" href="cv.html">' + (en ? 'View the resume' : 'Consulter le CV') + '</a>';
      if (next) {
        html += '<a class="btn" href="' + next.page + '.html">' +
          (en ? 'Next project: ' : 'Projet suivant : ') + esc(en ? next.en : next.fr) + ' →</a>';
      }
      html += '<a class="btn" href="projets.html">' + (en ? 'All projects' : 'Tous les projets') + '</a></div>';
      block.innerHTML = html;
    }

    render();
    document.addEventListener('i18n-applied', render);
  }

  /* ── Démos intégrées ────────────────────────────────────────────────────
     Une iframe tierce (Power BI, Hugging Face, application hébergée) n'est
     chargée que sur demande : pas de grand cadre vide si le service tarde,
     et le défilement de la page n'est plus capté par surprise. */
  function initEmbeds() {
    var buttons = document.querySelectorAll('[data-embed-load]');
    Array.prototype.forEach.call(buttons, function (button) {
      button.addEventListener('click', function () {
        var scope = button.closest('.embed-frame') || button.parentNode;
        var frame = scope.querySelector('iframe[data-src]');
        if (!frame) return;
        frame.src = frame.getAttribute('data-src');
        frame.hidden = false;
        var launch = button.closest('.embed-launch');
        if (launch) launch.hidden = true; else button.hidden = true;
        frame.focus();
      });
    });
  }

  function initAll() {
    initSiteNav();
    initPageEnd();
    initEmbeds();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initAll);
  } else {
    initAll();
  }
})();
