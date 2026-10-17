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
