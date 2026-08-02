(function () {
  const DICTIONARY = {
    fr: {
      'nav.about': 'À propos',
      'nav.projects': 'Projets',
      'nav.explorer': 'Explorateur data',
      'nav.thesis': 'Mémoire',
      'nav.resume': 'CV',
      'nav.contact': 'Contact',

      'home.eyebrow': 'Data & Finance · Master CGAO Big Data (IAE Lille)',
      'home.title': 'Transformer des données brutes en décisions financières et opérationnelles.',
      'home.lead': 'Alternant Auditeur IT chez Forvis Mazars. Diplômé M2 CGAO. Spécialisé en Business Intelligence, automatisation Python et modélisation de données.',
      'home.cta_projects': 'Voir les projets',
      'home.cta_cv': 'Consulter le CV',
      'home.featured_eyebrow': 'Projet phare · 01',
      'home.featured_title': 'Power BI — Analyse du marché immobilier français (2019–2024)',
      'home.featured_desc': 'Exploitation des données DVF (data.gouv) : modélisation DAX avancée, simulateur d\'achat et cartographie dynamique du marché immobilier.',
      'home.featured_link': 'Découvrir le projet →',
      'home.section_other': 'Autres projets',
      'home.see_all_projects': 'Voir les 9 projets →',
      'home.thesis_eyebrow': 'Mémoire M2',
      'home.thesis_title': 'L\'impact de l\'IA générative sur les métiers de l\'audit',
      'home.thesis_desc': 'Travail de recherche explorant l\'automatisation des contrôles, l\'analyse de risques et la transformation du rôle d\'auditeur à l\'ère de l\'IA.',
      'home.thesis_link': 'Consulter le mémoire →',
      'home.explorer_eyebrow': 'Explorateur open data',
      'home.explorer_title': 'Explorateur interactif des données d\'accidents BAAC',
      'home.explorer_desc': 'Application d\'analyse visuelle des facteurs d\'accidents de la route en France, construite pour la tarification d\'assurance.',
      'home.explorer_link': 'Lancer l\'explorateur →',

      'projets.header_title': 'Projets',
      'projets.header_lead': 'Neuf réalisations en business intelligence, automatisation et ingénierie de données. Filtrez par famille d\'outils.',
      'projets.search_placeholder': 'Rechercher par mot-clé (Power BI, Python, Audit, DAX, SQL, GCP...)',
      'projets.filter_all': 'Tous',
      'projets.filter_powerbi': 'Power BI',
      'projets.filter_ia': 'Python et IA',
      'projets.filter_cloud': 'Cloud et SQL',
      'projets.filter_tableau': 'Tableau',
      'projets.filter_excel': 'Excel',
      'projets.no_results_title': 'Aucun projet ne correspond à votre recherche',
      'projets.no_results_desc': 'Essayez un autre mot-clé ou réinitialisez les filtres.',
      'projets.reset_btn': 'Réinitialiser les filtres',

      'cv.subtitle': 'Data et Finance · M2 CGAO · Forvis Mazars',
      'cv.bio': '22 ans, en M2 CGAO Big Data à l\'IAE Lille jusqu\'en août 2026, actuellement auditeur IT en alternance chez Forvis Mazars. Major de promotion à chaque cycle. Je relie une formation comptable et audit à des compétences data solides (BI, Python, GCP).',
      'cv.experiences_title': 'Expériences professionnelles',
      'cv.education_title': 'Formation & Diplômes',
      'cv.skills_title': 'Compétences clés',

      'about.title': 'À propos',
      'about.subtitle': 'De la comptabilité et l\'audit vers l\'ingénierie data',

      'footer.rights': 'Tous droits réservés.'
    },
    en: {
      'nav.about': 'About',
      'nav.projects': 'Projects',
      'nav.explorer': 'Data Explorer',
      'nav.thesis': 'Thesis',
      'nav.resume': 'Resume',
      'nav.contact': 'Contact',

      'home.eyebrow': 'Data & Finance · Master CGAO Big Data (IAE Lille)',
      'home.title': 'Transforming raw data into actionable financial and operational insights.',
      'home.lead': 'IT Audit Apprentice at Forvis Mazars. Master\'s degree in Data & Finance. Specialized in Business Intelligence, Python automation, and data modeling.',
      'home.cta_projects': 'View projects',
      'home.cta_cv': 'View resume',
      'home.featured_eyebrow': 'Featured Project · 01',
      'home.featured_title': 'Power BI — French Real Estate Market Analysis (2019–2024)',
      'home.featured_desc': 'Exploiting DVF French open data: advanced DAX modeling, purchase simulator, and dynamic market mapping.',
      'home.featured_link': 'Discover project →',
      'home.section_other': 'Other Projects',
      'home.see_all_projects': 'View all 9 projects →',
      'home.thesis_eyebrow': 'Master\'s Thesis',
      'home.thesis_title': 'The Impact of Generative AI on Audit & Risk Consulting',
      'home.thesis_desc': 'Research on automated internal controls, risk assessment, and auditing transformation in the age of AI.',
      'home.thesis_link': 'Read thesis →',
      'home.explorer_eyebrow': 'Open Data Explorer',
      'home.explorer_title': 'Interactive BAAC Road Accident Data Explorer',
      'home.explorer_desc': 'Visual analysis web tool analyzing road risk factors in France, designed for actuarial pricing.',
      'home.explorer_link': 'Launch explorer →',

      'projets.header_title': 'Projects',
      'projets.header_lead': 'Nine projects in business intelligence, automation, and data engineering. Filter by tech stack.',
      'projets.search_placeholder': 'Search by keyword (Power BI, Python, Audit, DAX, SQL, GCP...)',
      'projets.filter_all': 'All',
      'projets.filter_powerbi': 'Power BI',
      'projets.filter_ia': 'Python & AI',
      'projets.filter_cloud': 'Cloud & SQL',
      'projets.filter_tableau': 'Tableau',
      'projets.filter_excel': 'Excel',
      'projets.no_results_title': 'No projects match your search query',
      'projets.no_results_desc': 'Try another keyword or reset active filters.',
      'projets.reset_btn': 'Reset filters',

      'cv.subtitle': 'Data & Finance · M2 CGAO · Forvis Mazars',
      'cv.bio': '22 years old, completing Master\'s CGAO Big Data at IAE Lille until August 2026, currently IT Audit apprentice at Forvis Mazars. Top of class in every cycle. Combining accounting/audit foundation with strong data skills (BI, Python, GCP).',
      'cv.experiences_title': 'Professional Experience',
      'cv.education_title': 'Education & Degrees',
      'cv.skills_title': 'Key Skills',

      'about.title': 'About Me',
      'about.subtitle': 'From accounting & audit to data engineering',

      'footer.rights': 'All rights reserved.'
    }
  };

  function translateDOM(lang) {
    const targetLang = lang === 'en' ? 'en' : 'fr';
    document.documentElement.setAttribute('lang', targetLang);
    const isEn = targetLang === 'en';

    // Translate elements with data-i18n
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (DICTIONARY[targetLang] && DICTIONARY[targetLang][key]) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          if (el.hasAttribute('placeholder')) {
            el.setAttribute('placeholder', DICTIONARY[targetLang][key]);
          } else {
            el.value = DICTIONARY[targetLang][key];
          }
        } else {
          el.textContent = DICTIONARY[targetLang][key];
        }
      }
    });

    // Auto-translate common text patterns
    const filterAll = document.querySelector('[data-filtre="tous"]');
    if (filterAll) filterAll.textContent = isEn ? 'All' : 'Tous';

    const filterIa = document.querySelector('[data-filtre="ia"]');
    if (filterIa) filterIa.textContent = isEn ? 'Python & AI' : 'Python et IA';

    const filterCloud = document.querySelector('[data-filtre="cloud"]');
    if (filterCloud) filterCloud.textContent = isEn ? 'Cloud & SQL' : 'Cloud et SQL';

    const searchInput = document.getElementById('projet-search');
    if (searchInput) {
      searchInput.placeholder = isEn 
        ? 'Search by keyword (Power BI, Python, Audit, DAX, SQL, GCP...)' 
        : 'Rechercher par mot-clé (Power BI, Python, Audit, DAX, SQL, GCP...)';
    }

    const sectionTitle = document.querySelector('.section-title');
    if (sectionTitle && (sectionTitle.textContent.trim() === 'Autres projets' || sectionTitle.textContent.trim() === 'Other Projects')) {
      sectionTitle.textContent = isEn ? 'Other Projects' : 'Autres projets';
    }

    const sectionLink = document.querySelector('.section-link');
    if (sectionLink && sectionLink.textContent.includes('projet')) {
      sectionLink.innerHTML = isEn ? 'View all 9 projects <span>→</span>' : 'Voir les 9 projets <span>→</span>';
    }

    const backLinks = document.querySelectorAll('.back-link');
    backLinks.forEach(link => {
      if (link.textContent.includes('Accueil') || link.textContent.includes('Home')) {
        link.textContent = isEn ? '← Home' : '← Accueil';
      }
    });
  }

  window.setLanguage = function (lang) {
    localStorage.setItem('lang', lang);
    translateDOM(lang);
  };

  document.addEventListener('DOMContentLoaded', function () {
    const saved = localStorage.getItem('lang') || 'fr';
    translateDOM(saved);
  });

  document.addEventListener('lang-changed', function (e) {
    if (e.detail && e.detail.lang) {
      translateDOM(e.detail.lang);
    }
  });
})();
