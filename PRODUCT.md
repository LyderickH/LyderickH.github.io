# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux lecteurs, à égalité, qui évaluent une candidature en CDI :

- **Recruteurs RH et cabinets de recrutement.** Ils trient des candidatures et veulent le profil, le CV et la disponibilité en moins d'une minute.
- **Managers opérationnels en audit IT et en data.** Ils lisent les projets en détail pour juger la méthode et la technique avant un entretien.

Aucune des deux lectures ne doit être sacrifiée à l'autre.

## Product Purpose

Portfolio personnel de Lydérick Henry, profil data et finance. Il existe pour obtenir un CDI à la croisée de l'audit des systèmes d'information et de la data, en région lilloise ou en télétravail partiel.

Le succès est une prise de contact : e-mail (canal privilégié), LinkedIn ou téléphone, avec le CV comme pièce à joindre à la candidature.

## Positioning

Comptable venu à la data, pas l'inverse. Lydérick comprend comment un chiffre est construit et à quelle décision il sert avant de le mesurer : la data sert le métier finance. Quatre ans d'alternance en comptabilité, contrôle de gestion puis audit IT fondent cette position.

## Operating Context

- Le site accompagne une candidature : le lecteur arrive depuis un CV, un profil LinkedIn ou un e-mail, puis parcourt l'accueil, les projets et le CV.
- Le CV existe en deux formats : une version web interactive, filtrable par compétences (`cv.html`), et une version A4 à imprimer ou à joindre (`projets/CV à jour.html`).
- Chaque projet a sa page, avec ses livrables consultables ou téléchargeables (PDF, captures, fichiers sources) et parfois une démo intégrée.
- Le site est lu sur ordinateur comme sur mobile.

## Capabilities and Constraints

Fonctionnalités en place :

- 17 pages : accueil, à propos, projets, dix pages projet, mémoire, explorateur open data, CV, contact.
- Page projets filtrable par famille d'outils (Power BI, Python et IA, Cloud et SQL, Tableau, Excel).
- Bascule de langue FR / EN et bascule de thème clair / sombre, mémorisées dans le navigateur.
- Démos intégrées par iframe : rapport Power BI (projet 1, chargé au clic car sous licence), Regex par l'exemple (projet 10), explorateur open data (hébergé sur Hugging Face Spaces).

Contraintes confirmées :

- **Site statique sans build.** HTML, CSS et JavaScript écrits à la main, hébergés sur GitHub Pages. Pas de framework ni d'étape de compilation.
- **Bilingue FR / EN.** Le français est la langue source. Tout texte ajouté doit avoir sa traduction dans `js/i18n.js`.
- **Réalisations réelles uniquement.** Aucun témoignage, client, chiffre ou résultat inventé.
- **CV A4 imprimable.** La version A4 reste disponible et cohérente avec la version web.

Dépendances externes : Google Fonts, Chart.js par CDN (page mémoire), services tiers des démos intégrées.

Points non décidés :

- Le statut affiché (M2 et alternance chez Forvis Mazars jusqu'en août 2026) est à mettre à jour par Lydérick une fois la période terminée. Ne pas le reformuler sans son accord.

## Brand Commitments

- Nom : Lydérick Henry. Intitulé du profil : « Data et Finance ».
- Voix observée sur le site, non reconfirmée en entretien : première personne, directe, concrète, sans jargon marketing (« je cherche d'abord ce qui peut disparaître »).
- Portrait professionnel : `Photo professionnel.webp`. Favicon : `favicon.png`.
- Les choix visuels déjà arrêtés sont tracés dans `TASKS.md` (revue anti-« IA ») et `css/tokens.css`, pas ici.

## Evidence on Hand

- **Dix projets**, documentés dans `projet1.html` à `projet10.html`, livrables dans `projets/projet1/` à `projets/projet10/` : Power BI (immobilier, suivi bancaire, restauration, accidents et assurance, Power BI × Claude), Excel SIG / CAF, revue de presse automatisée en Python, Tableau, pipeline GCP (BigQuery, Dataform, Looker Studio), Regex par l'exemple.
- **Mémoire de M2** sur l'IA générative en audit, 67 répondants : PDF, protocole, notebook exécuté et support de soutenance dans `projets/memoire/`, page `memoire.html`.
- **Parcours** détaillé dans `cv.html` : collaborateur comptable (Humafin Coop), contrôleur de gestion (CIC Nord Ouest), auditeur IT (Forvis Mazars), Master CGAO Big Data à l'IAE Lille.
- **Absences à ne pas combler par invention :** aucun témoignage, aucune recommandation, aucun client nommé en dehors des employeurs, aucune mesure d'impact chiffrée des projets. Le projet « accidents et assurance » est une commande fictive issue d'un test de recrutement et doit rester présenté comme tel.

## Product Principles

1. **Deux vitesses de lecture.** Le profil, le CV et la disponibilité se trouvent en moins d'une minute ; la preuve détaillée attend celui qui creuse.
2. **Le métier avant l'outil.** Un projet se présente par la question financière ou opérationnelle à laquelle il répond, puis par la technique.
3. **La preuve plutôt que l'affirmation.** Chaque compétence annoncée renvoie à un livrable réel et consultable.
4. **Chaque page mène au contact ou au CV.** Le lecteur convaincu ne doit pas chercher comment écrire.
5. **Simple à maintenir seul.** Un site statique, modifiable à la main, où chaque texte existe en français et en anglais.
