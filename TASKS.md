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

- [ ] Critique : revue design A1 (accueil, à propos, projets, contact, CV web, CV A4)
- [ ] Critique : revue design A2 (projets 1 à 5)
- [ ] Critique : revue design A3 (projets 6 à 10, mémoire, explorateur)
- [ ] Critique : passe détecteur + navigateur B (18 pages)
- [ ] Décision utilisateur : mention de disponibilité, périmètre du gel de style des CV
- [ ] Synthèse de la critique et tri des corrections
- [ ] Statut à jour : accueil, à propos, contact, descriptions de page, i18n EN
- [ ] CV web et CV A4 : contenu mis à jour, style inchangé
- [ ] CV A4 : bouton d'impression (masqué à l'impression), libellé du lien corrigé
- [ ] Corrections issues de la critique (polish et commandes associées)
- [ ] PRODUCT.md aligné sur la nouvelle situation
- [ ] Vérification finale Chromium (desktop + mobile, FR + EN, clair + sombre) et push
