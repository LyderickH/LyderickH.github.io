# Revue UX / design anti-« IA »

Critère de fin : pages clés affichées sans erreur dans Chromium (desktop 1366 + mobile 390), sans débordement horizontal, sans les patterns listés ; poussé sur `claude/festive-rubin-01j92h`.

## Fait
- [x] Étiquettes monospace en capitales espacées → sans-serif en casse normale (`.label`, méta du hero, footer, liens retour, légendes, styles en ligne de cv, explorateur, mémoire, projet9, projet10). Mono gardé pour le code uniquement.
- [x] Numérotation « 01 / 02 / 03 / 04 » → catégorie du projet (« Outil web · IA locale »…)
- [x] Tags, badges, filtres, liens de nav, sélecteur de vue, boutons du CV : plus de pilules (rayon 2–4 px)
- [x] Encadrés à bordure gauche colorée (`.callout`, `.p9-callout`) → cadre complet sur fond neutre
- [x] Icônes en pastilles rondes supprimées (cartes « Travaux complémentaires », contact)
- [x] Emojis des boutons de documents (projets 1 à 6) → format du fichier affiché à droite (PDF, PY, CSV…) ; emojis du projet 10 → « Étape 1/2/3 »
- [x] Inter → Archivo (titres) + Source Sans 3 (texte), y compris les graphiques Chart.js du mémoire
- [x] Nav : plus de flou « verre », page courante soulignée ; menu déroulant sous 900 px (les 6 pages accessibles sur mobile, Échap et clic extérieur ferment)
- [x] Cartes : plus de soulèvement ni de zoom d'image au survol, ombres retirées
- [x] Portrait : rectangle aux coins droits au lieu du rond
- [x] Projet 1 : l'iframe Power BI sous licence se charge au clic au lieu d'un grand cadre vide
- [x] Vérification : 16 pages, desktop + mobile, 0 erreur JS, 0 défilement horizontal ; mode sombre, menu mobile et chargement de l'iframe testés

## Reste / à décider
- [ ] Image de couverture du projet 9 (`projets/projet9/cover.svg`) : contient elle-même une étiquette monospace « DATA / IA AGENTIQUE » et un titre serif
- [ ] Ligne de contact du CV au style terminal (« email → … tel → … »)
- [ ] Projet 10 : l'iframe de démo affiche aussi un grand cadre vide si l'app ne charge pas (non modifié)

# Impeccable init

Critère de fin : `PRODUCT.md` écrit à la racine, relu, et reconnu par `impeccable context` ; poussé sur `claude/compassionate-clarke-yhag3q`.

- [x] Contexte chargé (`impeccable context`) : pas de PRODUCT.md, implémentation visuelle existante
- [x] Exploration du dépôt (pages, textes, i18n, CV, dépendances externes)
- [x] Entretien : lecteur principal, positionnement, contraintes
- [x] `PRODUCT.md` écrit
- [ ] Mode live non configuré dans cette session cloud (à lancer sur le PC avec `/impeccable live`)
- [ ] À décider : mise à jour du statut affiché (M2 et alternance « jusqu'en août 2026 »)
- [ ] À décider : le bouton « Télécharger le CV A4 (PDF) » pointe vers une page HTML (`projets/CV à jour.html`), pas un PDF

# Critique + polish de tout le site, mise à jour du statut et du CV

Critère de fin : les 17 pages et le CV A4 s'affichent dans Chromium (1366 et 390 px) sans erreur JS ni défilement horizontal ; statut à jour partout en FR et EN ; bouton d'impression fonctionnel sur le CV A4 ; poussé sur `claude/compassionate-clarke-yhag3q`.

Source des faits : profil LinkedIn fourni (PDF) — consultant FAAS chez EY à Lille depuis octobre 2026, Forvis Mazars sept. 2025 – août 2026, Master CGAO obtenu en août 2026.

- [x] Critique : revue design A1 (accueil, à propos, projets, contact, CV web, CV A4)
- [x] Critique : revue design A2 (projets 1 à 5)
- [x] Critique : revue design A3 (projets 6 à 10, mémoire, explorateur)
- [x] Critique : passe détecteur + navigateur B (18 pages) — 18 signalements, 11 confirmés, 6 faux positifs
- [x] Décision utilisateur : « en poste chez EY, ouvert aux échanges » ; gel de style sur le CV A4 seulement
- [x] Synthèse de la critique : 361/604 (60 %), rapport rendu dans la conversation
- [x] Statut à jour : accueil, à propos, contact, descriptions de page, traductions EN
- [x] CV web : EY ajouté, bug anglais réparé (employeurs et dates), `<main>`, deux colonnes rétablies
- [x] CV A4 : EY ajouté, contenu condensé sur une page, style inchangé, bouton d'impression masqué à l'impression
- [x] Pages projet : lien « ← Projets », chapô repris des cartes, bloc de fin (contact, CV, projet suivant)
- [x] Projet 8 : mention « commande fictive », six légendes réécrites d'après les images
- [x] Diaporama : hauteur stable, texte alternatif tiré des légendes, lien « taille réelle »
- [x] Démos intégrées (projets 1 et 10, explorateur) : chargement à la demande
- [x] Page projets : recherche « Audit », « SQL », « finance » fonctionnelle, hiérarchie des titres
- [x] À propos : numérotation 01/02/03 retirée, traduction anglaise fidèle
- [x] Styles : contraste du badge (5,2:1), cibles tactiles 44 px, mesure de texte 68ch, code en fonte mono
- [x] Couverture du projet 9 : plus d'étiquette monospace ni de titre serif
- [x] PRODUCT.md aligné sur la nouvelle situation
- [x] Mémoire : résultats de l'enquête sourcés dans la thèse, sept points d'échelle affichés, radar remplacé par des barres 0–100, repli texte sans Chart.js
- [x] Vérification finale Chromium : 72 chargements (18 pages × 2 tailles × 2 langues), 0 erreur JS, 0 fichier local manquant, seul débordement = CV A4 sur mobile (style figé)

## Non traité, à décider
- [ ] Titres des projets « outil d'abord » (« Power BI - … ») : les reformuler par la question métier
- [ ] Ordre des diapositives : les projets 1, 2 et 4 s'ouvrent sur une page de navigation, pas sur l'analyse
- [ ] Cartes « chiffres clés » qui ne sont pas des mesures (« OPML », « .docx », « Étoile ») sur les projets 1, 3, 4, 5, 7, 10
- [ ] Projet 8 : remplacer les trois détails flous (575×450) par des pages entières du PDF
- [ ] Projets 1 et 2 : le fichier de code M s'ouvre mal ; étiquette « DAX » sur les cartes sans mesure DAX montrée
- [ ] CV A4 : âge « 22 ans » et adresse postale complète publiés
- [ ] `projets/projet10/cover.svg` : fichier non utilisé qui enfreint les règles visuelles (à supprimer ?)
- [ ] Ligne de contact du CV web au style terminal (« email → … »)
- [ ] Mode sombre : les captures claires forment un bloc blanc dans le diaporama
- [ ] Préférence système « sombre » ignorée au premier chargement
- [ ] Aperçu de partage (Open Graph) absent ; site non indexé (`robots.txt`)

# Critique de l'accueil + identité « sobre, mais affirmée »

Critère de fin : accueil et pages types vérifiés dans Chromium (1366, 1024, 390 px ; FR, EN ; clair, sombre), sans erreur ni débordement, contrastes AA ; poussé sur la branche.

- [x] Critique de l'accueil : 25/32 (78 %), retours d'une amie intégrés (trop neutre, une couleur, paragraphes longs)
- [x] Décisions : caractère visuel d'abord ; ton sobre mais affirmé ; projet phare gardé, couverture changée ; identité appliquée à tout le site
- [x] Haut de page : poste chez EY en ligne sous le nom, mot-clé souligné à l'orange, étiquette « Data et Finance » retirée
- [x] Projet phare : couverture = page « Profil de risque croisé » du dashboard, titre par la question métier
- [x] Sélection : Power BI × Claude (réel contre budget), SIG/CAF, suivi bancaire à la place de Regex et GCP
- [x] Texte : descriptions de deux lignes, étiquettes redondantes retirées
- [x] Bloc de fin bleu sur l'accueil (contact, CV)
- [x] Tout le site : titres Archivo 700 et plus grands, catégorie des projets en orange sous le titre, page courante en orange, encadrés bleutés à étiquette orange, fin de page en aplat bleu
- [x] Description de page traduite en anglais (6 pages)
- [x] Vérification : 72 chargements sans défaut ; contrastes 4,6:1 au minimum (étiquette d'encadré, clair)

# Distill : alléger le texte sans changer le propos

Critère de fin : À propos, page projets et projets 1 à 10 allégés (mots avant/après mesurés), mêmes faits et même voix, FR et EN alignés ; 0 erreur JS, 0 débordement dans Chromium ; poussé sur la branche.
Hors périmètre : accueil (déjà fait), CV web et CV A4, mémoire (résultats sourcés), contact et explorateur (déjà courts).

- [x] Lot 1 : À propos, page projets (descriptions des cartes), projets 1, 2, 3
- [x] Lot 2 : projets 4, 5, 6, 7, 8
- [x] Lot 3 : projets 9, 10 (tableau d'outils du projet 9 replié dans un bloc « Les outils et leur rôle »)
- [x] Relecture des coupes : 6 rétablissements (première personne projet 1, multi-colonnes et exports Regex, PWA et « l'atout idéal » projet 10, .docx projet 4, analyse « Profils de risque » projet 8)
- [x] Vérification Chromium : 72 chargements sans défaut ; 4 266 → 3 541 mots (−17 %) sur le périmètre ; faux positif cramped-padding du projet 9 ignoré (.impeccable/config.json)

# Accueil allégé, détails repliés, tirets

Critère de fin : 72 chargements Chromium sans défaut, 0 tiret cadratin, blocs repliés au chargement et dépliables au clavier, FR et EN ; poussé sur la branche.

- [x] Ancienne phrase d'intro rétablie, « la comptabilité à la data » souligné
- [x] Accueil : une seule ligne sous le nom, plus de rangées d'étiquettes, projets en rangées sans cadre (26 → 11 cadres)
- [x] Vignettes des projets 8 et 9 : vraies captures (profil de risque croisé, matrice Réel vs Budget)
- [x] Tirets cadratins « — » supprimés partout (6 visibles + traductions)
- [x] Pages projet : contexte, chiffres, captures et « L'essentiel » visibles ; détails repliés dans « Le détail »-type (11 blocs sur 10 pages)
