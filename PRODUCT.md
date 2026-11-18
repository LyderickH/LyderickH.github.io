# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Deux lecteurs, à égalité, qui évaluent le profil (confirmés avant la prise de poste chez EY ; à reconfirmer si la cible change) :

- **Recruteurs RH et cabinets de recrutement.** Ils veulent le profil, le poste actuel et le CV en moins d'une minute.
- **Managers opérationnels en audit IT et en data.** Ils lisent les projets en détail pour juger la méthode et la technique avant un entretien.

Aucune des deux lectures ne doit être sacrifiée à l'autre.

## Product Purpose

Portfolio personnel de Lydérick Henry, consultant FAAS chez EY à Lille depuis octobre 2026. Il présente son profil data et finance, prouve ses compétences par des réalisations consultables, et le rend joignable.

Le site n'affiche pas de recherche d'emploi : la formule retenue est « en poste, ouvert aux échanges » (décision de novembre 2026). Le succès est une prise de contact : e-mail (canal privilégié), LinkedIn ou téléphone.

## Positioning

Comptable venu à la data, pas l'inverse. Lydérick comprend comment un chiffre est construit et à quelle décision il sert avant de le mesurer : la data sert le métier finance. Quatre ans d'alternance en comptabilité, contrôle de gestion puis audit IT, puis le conseil FAAS chez EY, fondent cette position.

## Operating Context

- Le lecteur arrive par un lien (profil LinkedIn, CV, e-mail), puis parcourt l'accueil, les projets et le CV. Le site n'est pas indexé par les moteurs de recherche (`robots.txt` et balises `noindex`).
- Le CV existe en deux formats : une version web (`cv.html`) et une version A4 (`projets/CV à jour.html`), dotée d'un bouton pour l'imprimer ou l'enregistrer en PDF. Le style de la version A4 est figé : seul son contenu évolue.
- Chaque projet a sa page, avec ses livrables consultables ou téléchargeables (PDF, captures, fichiers sources) et parfois une démo intégrée.
- Le site est lu sur ordinateur comme sur mobile.

## Capabilities and Constraints

Fonctionnalités en place :

- 17 pages : accueil, à propos, projets, dix pages projet, mémoire, explorateur open data, CV, contact.
- Page projets filtrable par famille d'outils (Power BI, Python et IA, Cloud et SQL, Tableau, Excel).
- Bascule de langue FR / EN et bascule de thème clair / sombre, mémorisées dans le navigateur.
- Démos intégrées par iframe, chargées à la demande : rapport Power BI (projet 1, sous licence), Regex par l'exemple (projet 10), explorateur open data (hébergé sur Hugging Face Spaces).

Contraintes confirmées :

- **Site statique sans build.** HTML, CSS et JavaScript écrits à la main, hébergés sur GitHub Pages. Pas de framework ni d'étape de compilation.
- **Bilingue FR / EN.** Le français est la langue source. Tout texte ajouté doit avoir sa traduction dans `js/i18n.js`.
- **Réalisations réelles uniquement.** Aucun témoignage, client, chiffre ou résultat inventé.
- **CV A4 imprimable.** La version A4 reste disponible et cohérente avec la version web.

Dépendances externes : Google Fonts, Chart.js par CDN (page mémoire), services tiers des démos intégrées.

Points non décidés :

- L'âge (« 22 ans ») et l'adresse postale complète figurent sur le CV A4 : à confirmer ou retirer par Lydérick.
- L'ouverture du site aux moteurs de recherche n'est pas décidée.

## Brand Commitments

- Nom : Lydérick Henry. Intitulé du profil : « Data et Finance ».
- Voix observée sur le site, non reconfirmée en entretien : première personne, directe, concrète, sans jargon marketing (« je cherche d'abord ce qui peut disparaître »).
- Portrait professionnel : `Photo professionnel.webp`. Favicon : `favicon.png`.
- Les choix visuels déjà arrêtés sont tracés dans `TASKS.md` (revue anti-« IA ») et `css/tokens.css`, pas ici.

## Evidence on Hand

- **Dix projets**, documentés dans `projet1.html` à `projet10.html`, livrables dans `projets/projet1/` à `projets/projet10/` : Power BI (immobilier, suivi bancaire, restauration, accidents et assurance, Power BI × Claude), Excel SIG / CAF, revue de presse automatisée en Python, Tableau, pipeline GCP (BigQuery, Dataform, Looker Studio), Regex par l'exemple.
- **Mémoire de M2** sur l'IA générative en audit, 67 répondants : PDF, protocole, notebook exécuté et support de soutenance dans `projets/memoire/`, page `memoire.html`.
- **Parcours** détaillé dans `cv.html` : collaborateur comptable (Humafin Coop), contrôleur de gestion (CIC Nord Ouest), auditeur IT (Forvis Mazars), consultant FAAS (EY, depuis octobre 2026), Master CGAO Big Data à l'IAE Lille.
- **Absences à ne pas combler par invention :** aucun témoignage, aucune recommandation, aucun client nommé en dehors des employeurs, aucune mesure d'impact chiffrée des projets. Le projet « accidents et assurance » est une commande fictive issue d'un test de recrutement et doit rester présenté comme tel.

## Product Principles

1. **Deux vitesses de lecture.** Le profil, le poste actuel et le CV se trouvent en moins d'une minute ; la preuve détaillée attend celui qui creuse.
2. **Le métier avant l'outil.** Un projet se présente par la question financière ou opérationnelle à laquelle il répond, puis par la technique.
3. **La preuve plutôt que l'affirmation.** Chaque compétence annoncée renvoie à un livrable réel et consultable.
4. **Chaque page mène au contact ou au CV.** Le lecteur convaincu ne doit pas chercher comment écrire.
5. **Simple à maintenir seul.** Un site statique, modifiable à la main, où chaque texte existe en français et en anglais.
