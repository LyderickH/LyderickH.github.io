(function () {
  const EXACT_TEXT_MAP = {
    // Navigation & Common Actions
    "Aller au contenu": "Skip to content",
    "← Accueil": "← Home",
    "← Retour": "← Back",
    "Voir les projets": "View projects",
    "Consulter le CV": "View resume",
    "Consulter le mémoire →": "Read thesis →",
    "Lancer l'explorateur →": "Launch explorer →",
    "Découvrir le projet →": "Discover project →",
    "En savoir plus →": "Read more →",
    "Me contacter": "Contact me",
    "Autres projets": "Other Projects",
    "Voir les 9 projets →": "View all 9 projects →",
    "Tous les projets": "All projects",
    "Grille": "Grid",
    "Ligne": "List",
    "Réinitialiser les filtres": "Reset filters",
    "Tous droits réservés.": "All rights reserved.",

    // Navigation Labels
    "À propos": "About",
    "Projets": "Projects",
    "Explorateur data": "Data Explorer",
    "Mémoire": "Thesis",
    "CV": "Resume",
    "Contact": "Contact",

    // Home Page
    "Data & Finance · Master CGAO Big Data (IAE Lille)": "Data & Finance · Master CGAO Big Data (IAE Lille)",
    "Transformer des données brutes en décisions financières et opérationnelles.": "Transforming raw data into actionable financial and operational insights.",
    "Alternant Auditeur IT chez Forvis Mazars. Diplômé M2 CGAO. Spécialisé en Business Intelligence, automatisation Python et modélisation de données.": "IT Audit Apprentice at Forvis Mazars. Master's degree in Data & Finance. Specialized in Business Intelligence, Python automation, and data modeling.",
    "Projet phare · 01": "Featured Project · 01",
    "Power BI — Analyse du marché immobilier français (2019–2024)": "Power BI — French Real Estate Market Analysis (2019–2024)",
    "Exploitation des données DVF (data.gouv) : modélisation DAX avancée, simulateur d'achat et cartographie dynamique du marché immobilier.": "Exploiting DVF French open data: advanced DAX modeling, purchase simulator, and dynamic market mapping.",
    "Mémoire M2": "Master's Thesis",
    "L'impact de l'IA générative sur les métiers de l'audit": "The Impact of Generative AI on Audit & Risk Consulting",
    "Travail de recherche explorant l'automatisation des contrôles, l'analyse de risques et la transformation du rôle d'auditeur à l'ère de l'IA.": "Research exploring automated controls, risk assessment, and auditing transformation in the age of AI.",
    "Explorateur open data": "Open Data Explorer",
    "Explorateur interactif des données d'accidents BAAC": "Interactive BAAC Road Accident Data Explorer",
    "Application d'analyse visuelle des facteurs d'accidents de la route en France, construite pour la tarification d'assurance.": "Visual analysis tool analyzing road risk factors in France, designed for actuarial pricing.",
    "Recherche et exploration des jeux de données publics français (data.gouv.fr)": "Search and visual exploration of French open public datasets (data.gouv.fr)",

    // Projets Page
    "Neuf réalisations en business intelligence, automatisation et ingénierie de données. Filtrez par famille d'outils.": "Nine projects in business intelligence, automation, and data engineering. Filter by tech stack.",
    "Aucun projet ne correspond à votre recherche": "No projects match your search query",
    "Essayez un autre mot-clé ou réinitialisez les filtres.": "Try another keyword or reset active filters.",
    "Tous": "All",
    "Python et IA": "Python & AI",
    "Python & IA": "Python & AI",
    "Cloud et SQL": "Cloud & SQL",
    "Cloud & SQL": "Cloud & SQL",

    // Project Titles & Summaries
    "Modélisation DVF & Analyse du marché immobilier français": "DVF Data Modeling & French Real Estate Market Analysis",
    "Exploitation des données DVF sur 5 ans : modèle de données en étoile, métriques DAX temporelles, cartographie par département et simulateur de capacité d'achat.": "5-year DVF dataset analysis: star schema modeling, DAX time intelligence, departmental mapping, and purchasing power simulator.",

    "Explorateur interactif des données d'accidents de la route BAAC": "Interactive BAAC Road Accident Open Data Explorer",
    "Visualisation et exploration fil de l'eau des facteurs d'accidents en France (BAAC) : cartographie folium, filtres multi-critères et analyse de gravité pour la tarification.": "Visual exploration of road accident risk factors in France: interactive Folium mapping, multi-criteria filtering, and severity scoring for insurance pricing.",

    "Extraction & Analyse des bilans bancaires des acteurs du secteur automobile": "Banking Financial Statement Extraction & Automotive Industry Analysis",
    "Pipeline Python d'ingestion de liasses fiscales PDF, normalisation des comptes d'analytique et tableau de bord de benchmark financier des concessions.": "Python pipeline ingesting PDF financial statements, chart of accounts normalization, and dealer financial benchmark dashboard.",

    "Développement d'un pipeline ETL cloud complet sous GCP BigQuery": "End-to-End Cloud ETL Pipeline on GCP & BigQuery",
    "Ingestion de données brutes via Cloud Storage, transformation automatisée avec Dataform et orchestration SQL pour alimenter un modèle décisionnel.": "Raw data ingestion via Cloud Storage, automated transformation with Dataform, and SQL orchestration feeding an analytics model.",

    "Outil de détection & Analyse des RBE négatifs pour le contrôle de gestion bancaire": "Negative Net Banking Income (NBI) Detection & Analysis Tool",
    "Conception d'une application VBA/Excel pour isoler et catégoriser les agences et portefeuilles en marge brute négative au sein du réseau bancaire.": "VBA/Excel tool isolating and categorizing negative gross margin branches and portfolios across banking networks.",

    "Reporting interactif d'analyse de la masse salariale & RH": "Interactive Payroll & HR Analytics Reporting Dashboard",
    "Dashboard Tableau interconnecté permettant le suivi dynamique de la masse salariale, des effectifs ETP et des écarts budgétaires par direction.": "Interconnected Tableau dashboard for real-time payroll tracking, FTE headcount analytics, and variance budget monitoring.",

    "Automatisation de la révision comptable & Contrôle d'accès macros Excel": "Automated Audit Revision & Access Control Excel Macros",
    "Suite de macros Excel automatisant les vérifications de concordance de balance et les contrôles de séparation des pouvoirs applicatifs.": "Excel macro suite automating trial balance reconciliation checks and segregation of duties controls.",

    "Audit du système d'information & Cartographie des risques ITGC": "IT Information System Audit & ITGC Risk Mapping",
    "Mission d'évaluation des contrôles généraux informatiques (ITGC) : gestion des accès, gestion des changements et opérations informatiques.": "IT General Controls (ITGC) audit evaluation: access control management, change management, and computer operations.",

    // About Page
    "Mon parcours, ma démarche et comment j'allie la rigueur financière à l'ingénierie data pour automatiser et créer de la valeur.": "My background, methodology, and how I combine financial rigor with data engineering to automate and deliver value.",
    "Mon parcours": "My Journey",
    "Ma méthode": "My Methodology",
    "Ce que je cherche": "What I'm Looking For",
    "Comprendre le métier d'abord": "Understand the Business First",
    "Un indicateur mal défini produit un dashboard inutile, si beau soit-il. Je commence par comprendre comment le chiffre est construit et à quelle décision il sert : c'est là que la formation comptable paie.": "A poorly defined metric produces an unused dashboard, no matter how good it looks. I start by understanding how data is compiled and what decision it drives.",
    "Automatiser la reprise": "Automate Data Pipelines",
    "Un rapport qui demande une manipulation manuelle à chaque mise à jour finira abandonné. Je préfère passer du temps sur la normalisation en amont (langage M, Python, Dataform) que sur la mise en forme.": "A report requiring manual updates will eventually be abandoned. I focus on upstream automation (M language, Python, Dataform) rather than manual formatting.",
    "Vérifier avant de livrer": "Audit Before Delivery",
    "Réflexe d'audit : je recoupe les totaux, je teste les cas limites, je documente ce qui reste fragile. Un livrable dont je ne peux pas expliquer les écarts n'est pas fini.": "Audit mindset: I reconcile totals, test edge cases, and document fragile assumptions. A deliverable isn't complete without verified numbers.",
    "Je suis arrivé à la data par la comptabilité, pas l'inverse. Quatre ans d'alternance (collaborateur comptable, puis contrôleur de gestion, aujourd'hui auditeur IT chez Forvis Mazars) pendant lesquels j'ai passé beaucoup de temps à faire à la main des choses qui n'auraient pas dû l'être.": "I came to data through accounting, not the other way around. Four years of work-study experience (accounting assistant, financial controller, and currently IT auditor at Forvis Mazars) where I spent significant time automating manual tasks.",
    "C'est ce qui m'a poussé vers Power BI, Python et le SQL : moins par goût de la technique que par agacement devant les tâches répétitives. Ça oriente encore ma façon de travailler aujourd'hui : je cherche d'abord ce qui peut disparaître.": "That is what drove me toward Power BI, Python, and SQL: driven by efficiency and eliminating repetitive tasks. It shapes how I work today: automating what can be streamlined.",
    "Ouvert aux opportunités en CDI, à la croisée de l'audit des systèmes d'information et de la data : missions où il faut à la fois comprendre un processus métier et savoir le mesurer. Région lilloise ou télétravail partiel.": "Open for full-time CDI opportunities at the intersection of IT audit and data engineering: roles combining business process understanding with analytical measurement. Lille region or hybrid remote.",

    // CV Page
    "Data et Finance · M2 CGAO · Forvis Mazars": "Data & Finance · M2 CGAO · Forvis Mazars",
    "22 ans, en M2 CGAO Big Data à l'IAE Lille jusqu'en août 2026, actuellement auditeur IT en alternance chez Forvis Mazars. Major de promotion à chaque cycle. Je relie une formation comptable et audit à des compétences data solides (BI, Python, GCP).": "22 years old, completing Master's CGAO Big Data at IAE Lille until August 2026, currently IT Audit apprentice at Forvis Mazars. Top of class in every cycle. Combining accounting/audit foundation with strong data skills (BI, Python, GCP).",
    "Expériences professionnelles": "Professional Experience",
    "Formation & Diplômes": "Education & Degrees",
    "Compétences clés": "Key Skills",
    "Savoir-être & Langues": "Soft Skills & Languages",
    "Auditeur IT - Alternance": "IT Auditor - Apprenticeship",
    "Contrôleur de gestion - Alternance": "Financial Controller - Apprenticeship",
    "Collaborateur comptable - Alternance": "Accounting Associate - Apprenticeship",
    "Analyse de l'environnement des systèmes d'information (SI).": "Information systems environment analysis (IT).",
    "Projets Data (Power BI et Alteryx).": "Data projects (Power BI and Alteryx).",
    "Évaluation du contrôle interne IT et évaluation des risques.": "IT internal control evaluation and risk assessment.",
    "Réalisation des contrôles généraux informatiques (ITGC).": "IT General Controls (ITGC) testing.",
    "Tests de contrôles ITAC (IT Automated Controls).": "IT Automated Controls (ITAC) testing.",
    "Revue de processus métier et IT.": "Business process and IT reviews.",
    "Automatisation du reporting via Excel & VBA pour fiabiliser et accélérer les traitements récurrents.": "Reporting automation via Excel & VBA to secure and accelerate recurring processes.",
    "Développement d'un outil d'analyse des RBE négatifs pour diagnostiquer des écarts de performance.": "Development of a negative Net Banking Income analysis tool to diagnose performance gaps.",
    "Audit et contrôle de délégations d'autorisation et droits (macros Excel).": "Audit and control of authorization delegations and user rights (Excel macros).",
    "Comité des Taux mensuel et analyses financières pour la tarification.": "Monthly Rate Committee and financial analytics for pricing decisions.",
    "Contrôle des frais généraux, suivi et participation au processus budgétaire.": "Overhead costs control, variance tracking, and budget process participation.",
    "TVA mensuelle et trimestrielle pour 25 dossiers clients.": "Monthly and quarterly VAT returns for 25 client accounts.",
    "Établissement des liasses fiscales et bilans prévisionnels.": "Preparation of tax returns, financial statements, and forecasts.",
    "Suivi et mise à jour des mandats, paramétrage des logiciels comptables.": "Engagement monitoring, software configuration, and client onboarding.",
    "Référent logiciel Welyb (formation interne et lien fournisseur).": "Welyb software champion (internal training and vendor point of contact).",
    "Master CGAO - Contrôle de Gestion et Audit Organisationnel (Parcours Big Data & SI)": "Master's CGAO - Financial Control & Organizational Audit (Data & IT Track)",
    "Licence CCA - Comptabilité, Contrôle, Audit": "Bachelor's Degree CCA - Accounting, Control & Audit",
    "DUT GEA - Gestion des Entreprises et des Administrations": "Associate Degree GEA - Business Administration & Management",

    // Thesis Page
    "Mémoire de M2 CGAO - ACG": "Master's Thesis — M2 CGAO",
    "Perception et adoption de l'IA générative en cabinet d'audit : Analyse empirique (N = 67)": "Perception and adoption of generative AI in audit firms: Empirical analysis (N = 67)",
    "Présentation du mémoire": "Thesis Overview",
    "Thème :": "Topic:",
    "Cadre théorique :": "Theoretical framework:",
    "Répondants retenus": "Retained respondents",
    "Réponses brutes": "Raw survey responses",
    "Usage ≥ plusieurs fois/sem.": "Usage ≥ several times/wk",
    "Fréquence médiane (sur 7)": "Median frequency (out of 7)",
    "Bénéfices perçus > risques": "Perceived benefits > risks",
    "Score risques perçus / éch.": "Perceived risk score / scale",
    "Variables du modèle": "Model Variables",

    // Contact Page
    "Ouvert aux opportunités en CDI.": "Open for full-time (CDI) opportunities.",
    "Canal privilégié · Réponse rapide": "Preferred channel · Quick response",
    "Envoyer un message →": "Send message →",
    "Profil professionnel & réseau": "Professional profile & network",
    "Voir le profil ↗": "View profile ↗",
    "Disponible pour un échange": "Available for a call",
    "Appeler →": "Call →",
    "Région lilloise & Télétravail": "Lille Region & Remote",
    "Le CV en deux formats": "Resume in Two Formats",
    "La version web interactive se parcourt et se filtre par compétences. La version A4 s'imprime et se joint facilement à une candidature.": "The interactive web version lets you filter by tech stack. The A4 PDF version is ready for printing and job applications.",
    "Consulter le CV en ligne →": "View web resume →",
    "Télécharger le CV A4 (PDF) ↗": "Download A4 PDF Resume ↗"
  };

  // Reverse map for EN -> FR
  const REVERSE_TEXT_MAP = {};
  Object.keys(EXACT_TEXT_MAP).forEach(frText => {
    REVERSE_TEXT_MAP[EXACT_TEXT_MAP[frText]] = frText;
  });

  function translateNodeTree(node, isEn) {
    if (node.nodeType === Node.TEXT_NODE) {
      // Stocker le texte original en Français dès la première lecture
      if (node._frText === undefined) {
        node._frText = node.textContent;
      }

      const origText = node._frText;
      if (!origText || origText.trim().length === 0) return;

      if (isEn) {
        const trimmed = origText.trim();
        if (EXACT_TEXT_MAP[trimmed]) {
          node.textContent = origText.replace(trimmed, EXACT_TEXT_MAP[trimmed]);
        }
      } else {
        // Restauration exacte du texte original en Français
        node.textContent = origText;
      }
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      // Ne pas modifier les balises de script et de style
      if (node.tagName === 'SCRIPT' || node.tagName === 'STYLE') return;

      if (node.tagName === 'INPUT' || node.tagName === 'TEXTAREA') {
        const ph = node.getAttribute('placeholder');
        if (ph) {
          if (node._frPh === undefined) node._frPh = ph;
          if (isEn) {
            const trimmedPh = node._frPh.trim();
            if (EXACT_TEXT_MAP[trimmedPh]) {
              node.setAttribute('placeholder', EXACT_TEXT_MAP[trimmedPh]);
            }
          } else {
            node.setAttribute('placeholder', node._frPh);
          }
        }
      }

      node.childNodes.forEach(child => translateNodeTree(child, isEn));
    }
  }

  function translateDOM(lang) {
    const targetLang = lang === 'en' ? 'en' : 'fr';
    document.documentElement.setAttribute('lang', targetLang);
    const isEn = targetLang === 'en';

    // Translate DOM text tree
    translateNodeTree(document.body, isEn);

    // Placeholder explicitly
    const searchInput = document.getElementById('projet-search');
    if (searchInput) {
      searchInput.placeholder = isEn 
        ? 'Search by keyword (Power BI, Python, Audit, DAX, SQL, GCP...)' 
        : 'Rechercher par mot-clé (Power BI, Python, Audit, DAX, SQL, GCP...)';
    }
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
