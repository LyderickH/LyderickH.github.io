# Guide : rapports Power BI automatisés avec GitHub Copilot (contexte EY)

Ce guide capitalise le projet « Power BI × Claude » (projet 9 de ce dépôt : `GUIDE_AGENT_POWERBI.md`,
`SuiviBudgetaire_PBIP.zip`, `TestReport_PBIP.zip`) et le transpose à **GitHub Copilot** (VS Code, mode
agent) tel qu'il sera utilisé chez EY. Les couleurs, polices et logos EY ne sont **pas** dans ce guide :
chaque endroit où ils doivent aller est marqué `<<EY_...>>`.

Critère de « terminé » pour un rapport produit avec ce guide : `powerbi-report-author validate` sans
erreur, capture Power BI Desktop relue, checklist de la section 9 cochée, dossier PBIP commité.

---

## Sommaire

1. [Ce qu'il faut retenir du projet 9](#1-ce-quil-faut-retenir-du-projet-9)
2. [Prérequis et installation sur un poste EY](#2-prérequis-et-installation-sur-un-poste-ey)
3. [Cadrer Copilot : skills, instructions, prompts, agents, MCP](#3-cadrer-copilot--skills-instructions-prompts-agents-mcp)
4. [Structure de dépôt recommandée](#4-structure-de-dépôt-recommandée)
5. [Pipeline de production en 7 étapes](#5-pipeline-de-production-en-7-étapes)
6. [Thème EY : où et comment brancher la charte](#6-thème-ey--où-et-comment-brancher-la-charte)
7. [Prompts prêts à l'emploi](#7-prompts-prêts-à-lemploi)
8. [Automatiser : Git, revue, CI, publication](#8-automatiser--git-revue-ci-publication)
9. [Checklist qualité avant livraison](#9-checklist-qualité-avant-livraison)
10. [Pièges connus (ne pas refaire)](#10-pièges-connus-ne-pas-refaire)
11. [Annexes : fichiers à copier](#11-annexes--fichiers-à-copier)
12. [Ce qui n'a pas été vérifié](#12-ce-qui-na-pas-été-vérifié)

---

## 1. Ce qu'il faut retenir du projet 9

Le projet a fait construire par un agent un rapport complet (modèle TMDL + rapport PBIR) en deux
itérations : un dashboard de test, puis un « Suivi Réel vs Budget » (6 tables, 8 mesures DAX, matrice
à 3 niveaux avec alerte colorée et commentaire automatique des dépassements).

Les cinq enseignements qui conditionnent tout le reste :

1. **Ne jamais deviner le format des fichiers Power BI.** PBIR (rapport), TMDL (modèle), M (requêtes)
   et DAX ont chacun leur syntaxe. L'agent doit lire les schémas officiels et valider après chaque
   édition. C'est la règle n°1 de la skill Microsoft et elle a été confirmée à chaque incident.
2. **Le validateur ne voit pas tout.** Le bug le plus coûteux (cartes KPI vides) venait d'un sélecteur
   `"$id"` copié dans un fichier de thème : valide dans un `visual.json`, ignoré en silence dans un
   `theme.json`. Aucun outil ne l'a signalé. D'où l'étape « capture + relecture visuelle » obligatoire.
3. **Un modèle simple se vérifie mieux.** Les colonnes calculées TMDL imposent un clic manuel
   « Actualiser maintenant » après chaque rechargement. Préférer des colonnes issues de Power Query
   ou des mesures.
4. **Les données de test sont générées par script.** Un `generate_data.py` rejouable (seed fixé) a
   permis de travailler sans aucune donnée réelle. Chez EY c'est une exigence, pas une option.
5. **Le guide d'erreurs écrit par l'agent lui-même** est ce qui a le plus accéléré la session
   suivante. Le reproduire : chaque mission alimente `docs/LECONS.md`.

Patterns réutilisables sortis du projet (tous dans `SuiviBudgetaire_PBIP.zip`) :

| Pattern | Où le voir | Réutilisation |
|---|---|---|
| Table de mesures dédiée `_Mesures` avec `displayFolder: Indicateurs` | `SuiviBudgetaire.SemanticModel/definition/tables/_Mesures.tmdl` | Toujours isoler les mesures dans une table vide `#table(type table [Column1 = text], {})` |
| Calendrier `CALENDARAUTO()` + colonnes `ANNEE-MOIS`, `TRIMESTRE`, `SEMAINE`, exercice `FY` | `CALENDRIER.tmdl` | Remplacer par une vraie table de dates Power Query dès que le modèle quitte le prototype (voir point 3) |
| Mesure de commentaire conditionnel `Analyse des dérives` (`ISINSCOPE` + seuil + `FORMAT`) | `_Mesures.tmdl` | Modèle pour toute colonne « explication automatique » dans une matrice |
| Mesure factice `Alerte = 0` comme support d'icône conditionnelle | `_Mesures.tmdl` + `visual.json` de la matrice | Évite de poser l'icône sur une mesure métier |
| Script d'état d'expansion de matrice (`expansionStates`) | `generate_expansion_json.py` | Piloter l'ouverture par défaut des niveaux d'une matrice |
| Thème de base `CY23SU08` (aucun thème custom) | `SuiviBudgetaire.Report/definition/report.json` | Point de départ sûr avant d'appliquer le thème EY |

---

## 2. Prérequis et installation sur un poste EY

Sur un poste EY, l'installation passe généralement par le portail logiciel interne et un proxy npm.
Les commandes ci-dessous sont celles qui ont fonctionné sur un poste personnel ; adapter au contexte
(droits admin, registre npm d'entreprise, politiques Copilot).

### 2.1 Logiciels

| Outil | Rôle | Installation |
|---|---|---|
| Power BI Desktop (version récente, canal Store/MSIX) | Rendu réel, sauvegarde PBIP | Portail EY, sinon `winget install --id 9NTXR16HNW1T --source msstore` |
| VS Code + extensions GitHub Copilot et GitHub Copilot Chat | Agent | Portail EY ou marketplace |
| Node.js LTS | CLIs Microsoft, serveurs MCP via `npx` | Portail EY |
| Git | Versionner le PBIP | Portail EY |
| Python 3.11+ avec `pandas`, `openpyxl`, `numpy` | Jeux de données synthétiques, scripts utilitaires | `pip install pandas openpyxl numpy` |

### 2.2 CLIs Microsoft (npm, globales)

```bash
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

- `powerbi-report-author` : catalogue des visuels, schéma exact de chaque propriété de formatage,
  **validation PBIR** (`validate <chemin>.Report --pretty`).
- `powerbi-desktop` : pilote Power BI Desktop (`open`, `status`, `reload`, `screenshot-all`) via le
  Desktop Bridge.

### 2.3 Activer le Desktop Bridge dans Power BI Desktop

Deux actions manuelles, à faire une fois par poste :

1. `Fichier → Options et paramètres → Options → Fonctionnalités en préversion` : cocher l'option
   d'accès des outils externes / Desktop Bridge (libellé variable selon la version, voir section 12),
   puis redémarrer Desktop. Sans cela, `powerbi-desktop` répond « Host is not ready to accept operations ».
2. Si Desktop est installé en MSIX (Store), la CLI ne trouve pas l'exécutable. Récupérer le chemin
   puis l'exporter dans chaque nouveau terminal :

```powershell
Get-AppxPackage -Name "*PowerBI*" | Select-Object PackageFullName, InstallLocation
```

```bash
export PBI_DESKTOP_PATH="C:\Program Files\WindowsApps\Microsoft.MicrosoftPowerBIDesktop_<version>_x64__8wekyb3d8bbwe\bin\PBIDesktop.exe"
```

Chemin utilisateur Windows : utiliser un dossier de travail court et sans accent
(ex. `C:\u\pbi\<mission>`), jamais sous un profil accentué. Les scripts du projet 9 contenaient des
chemins absolus `C:\Users\lydérick\...` codés en dur dans le M : à remplacer par un paramètre
Power Query (`Dossier_Sources`) pointant sur le dossier `RESSOURCES` relatif à la mission.

### 2.4 Skills Microsoft de référence

```bash
git clone https://github.com/microsoft/skills-for-fabric.git
```

Le dépôt a été réorganisé depuis le projet 9. État constaté au 24/10/2026 :

- `skills/powerbi-report-cli/` : skill unique pour le rapport, en 4 modes
  `planning → design → authoring → management` (anciennement `powerbi-report-planning`,
  `powerbi-report-design`, `powerbi-report-authoring`, `powerbi-report-management`).
  Les ~75 fichiers de `references/` (card, cartesian, matrix, theming, layout, archétypes…) sont la
  vraie documentation PBIR.
- `skills/semantic-model-authoring/` : TMDL, DAX, structure PBIP, relations.
- `plugins/powerbi-authoring/` : empaquetage des deux skills ci-dessus avec un `.mcp.json`.

Deux voies d'installation pour Copilot :

- **Copilot CLI** (marketplace de plugins) : `/plugin marketplace add microsoft/skills-for-fabric`
  puis `/plugin install powerbi-authoring@fabric-collection`.
- **VS Code** (recommandé ici, aucun outil tiers) : copier les dossiers de skills dans le dépôt de la
  mission, voir section 3.1. Avantage : versionné avec le projet, revu comme du code, pas de
  dépendance réseau au moment de la mission.

### 2.5 Serveurs MCP

| Serveur | Statut | Couche | Installation |
|---|---|---|---|
| `powerbi-modeling-mcp` | Officiel Microsoft | Modèle sémantique : tables, relations, mesures DAX (ne touche pas au rapport) | Extension VS Code « Power BI Modeling MCP », ou `npx -y @microsoft/powerbi-modeling-mcp@latest --start` dans `.vscode/mcp.json` |
| `powerbi-report-builder` (jonathan-pap/powerbi-report-mcp) | Communautaire | Rapport PBIR : ~30 outils `pbir_*` (pages, visuels, thème) | À faire valider par la sécurité EY avant usage ; sinon voie « CLI + fichiers » |

Chez EY, les serveurs MCP dans Copilot sont **désactivés par défaut sur les comptes Enterprise** et
doivent être autorisés par un administrateur (politique « MCP servers in Copilot »). Prévoir la
demande en amont de la mission. La voie sans MCP (CLI + skills + édition des fichiers) fonctionne
intégralement : c'est celle qui a produit le projet 9.

---

## 3. Cadrer Copilot : skills, instructions, prompts, agents, MCP

Le projet 9 a été fait avec Claude Code. Correspondances Copilot :

| Besoin | Claude Code | GitHub Copilot (VS Code) |
|---|---|---|
| Règles permanentes du dépôt | `CLAUDE.md` | `.github/copilot-instructions.md` |
| Règles par type de fichier | règles dans `CLAUDE.md` | `.github/instructions/<nom>.instructions.md` avec `applyTo: "**/*.tmdl"` |
| Procédure à la demande, avec scripts et références | skill (`SKILL.md`) | skill (`SKILL.md`), même standard ouvert « Agent Skills » |
| Prompt réutilisable paramétrable | commande slash | `.github/prompts/<nom>.prompt.md` (lancé par `/nom` dans le chat) |
| Rôle spécialisé avec outils restreints | sous-agent | `.github/agents/<nom>.agent.md` |
| Outils actionnables | serveur MCP (`.mcp.json`) | serveur MCP (`.vscode/mcp.json`) |

### 3.1 Skills

Copier dans le dépôt de mission :

```
.github/skills/
  powerbi-report-cli/          ← depuis skills-for-fabric/skills/
  semantic-model-authoring/    ← depuis skills-for-fabric/skills/
  ey-report-standards/         ← skill maison (section 11.4) : charte, conventions, checklist
```

Chaque skill = un dossier avec `SKILL.md` (frontmatter `name` + `description`) et des ressources.
Copilot charge la skill quand la description correspond à la demande ; vérifier dans les paramètres
VS Code que l'usage des skills est activé (`chat.useAgentSkills` ou équivalent selon la version).

Règle : **ne pas modifier les skills Microsoft** copiées (mise à jour par simple re-copie). Tout ce qui
est spécifique EY va dans `ey-report-standards`.

### 3.2 Instructions

- `.github/copilot-instructions.md` : règles globales courtes (section 11.1). Toujours chargé, donc
  court : 40 lignes maximum, sinon Copilot les dilue.
- `.github/instructions/tmdl.instructions.md` (`applyTo: "**/*.tmdl"`) : conventions modèle.
- `.github/instructions/pbir.instructions.md` (`applyTo: "**/*.Report/definition/**/*.json"`) :
  « valider après chaque édition », « pas de propriété non vérifiée au catalogue ».
- `.github/instructions/m.instructions.md` (`applyTo: "**/*.tmdl"` section `partition`) : pas de
  suffixe de type sur les nombres en M, chemins via paramètre.

### 3.3 Prompt files

Un fichier par étape du pipeline (section 7). Ils rendent le processus répétable d'une mission à
l'autre : même brief, même structure de sortie.

### 3.4 Agents personnalisés

Deux agents suffisent :

- `pbi-builder.agent.md` : construit (édition fichiers, terminal pour les CLIs, MCP modèle si autorisé).
- `pbi-reviewer.agent.md` : relit uniquement (lecture + terminal `validate`), produit la checklist de
  la section 9 remplie. Le séparer du builder évite qu'il « corrige » sans tracer.

### 3.5 MCP (`.vscode/mcp.json`)

Voir section 11.3. Démarrer sans MCP, l'ajouter une fois la politique EY validée.

---

## 4. Structure de dépôt recommandée

```
<mission>-powerbi/
├── .github/
│   ├── copilot-instructions.md
│   ├── instructions/            tmdl / pbir / m
│   ├── prompts/                 01-cadrage … 06-revue
│   ├── agents/                  pbi-builder, pbi-reviewer
│   └── skills/                  powerbi-report-cli, semantic-model-authoring, ey-report-standards
├── .vscode/
│   └── mcp.json                 (vide tant que non autorisé)
├── docs/
│   ├── SPEC.md                  spécification validée (sortie de l'étape 1)
│   ├── MODELE.md                dictionnaire des tables/mesures
│   ├── LECONS.md                erreurs rencontrées, alimenté à chaque mission
│   └── captures/                captures de référence datées
├── data/
│   ├── generate_data.py         données synthétiques (seed fixe)
│   └── RESSOURCES/              fichiers générés (gitignorés si volumineux)
├── theme/
│   ├── EY-theme.json            thème Power BI EY (section 6)
│   └── assets/                  <<EY_LOGO>> svg/png
├── <Rapport>.pbip
├── <Rapport>.SemanticModel/
├── <Rapport>.Report/
├── .gitignore                   .pbi/cache.abf, localSettings.json, RESSOURCES/*.xlsx
└── README.md
```

`.gitignore` minimal :

```
**/.pbi/cache.abf
**/.pbi/localSettings.json
data/RESSOURCES/*.xlsx
data/RESSOURCES/*.csv
```

---

## 5. Pipeline de production en 7 étapes

Chaque étape a une entrée, une sortie vérifiable et un prompt associé (section 7). L'agent n'enchaîne
pas deux étapes sans la sortie de la précédente : c'est le « planning approval gate » de la skill
Microsoft, qui exige une validation explicite de la spec avant de construire.

### Étape 1 : cadrage (mode `planning`)

- Entrée : besoin métier (mail, support de formation, maquette, capture d'un rapport existant).
- Sortie : `docs/SPEC.md` : audience, questions auxquelles le rapport répond, KPI avec définition et
  formule, granularité, filtres, pages, archétype de mise en page, sources, exigences de sécurité
  (RLS, données sensibles), format cible (1280×720 standard, ou A4 pour export PDF).
- Validation : relecture humaine et accord écrit (« spec validée » dans le chat ou la PR).

### Étape 2 : données

- Pas de données clients sur un poste de dev tant que la mission ne l'autorise pas explicitement.
  Générer un jeu synthétique **de même forme** (mêmes colonnes, mêmes cardinalités, cas limites
  volontaires) avec `data/generate_data.py`, seed fixe, formats bruts réalistes (ex. budget pivoté
  avec service rempli sur la première ligne seulement, comme dans le projet 9).
- Sortie : fichiers dans `data/RESSOURCES/`, décrits dans `docs/MODELE.md` (source, colonnes, types).
- Validation : le script tourne sans erreur et les volumes sont affichés en fin d'exécution.

### Étape 3 : modèle sémantique (skill `semantic-model-authoring`)

Conventions à imposer dans `tmdl.instructions.md` :

- Schéma en étoile (ou flocon si deux faits partagent des dimensions, cas Réel vs Budget).
- Table `_Mesures` dédiée, mesures classées par `displayFolder`, `formatString` systématique
  (`#,##0" €"`, `+0.0%;-0.0%;0.0%`), description `///` sur toute mesure non triviale.
- Table de dates Power Query ou DAX marquée table de dates ; `__PBI_TimeIntelligenceEnabled = 0`
  pour couper les tables de dates automatiques cachées.
- Colonnes techniques masquées (`isHidden`), clés en `summarizeBy: none`.
- Culture `fr-FR` si le client est français (séparateurs, formats de date).
- Transformations dans Power Query plutôt qu'en colonnes calculées (évite le rafraîchissement manuel
  après chaque rechargement par le Desktop Bridge).
- Chemins de sources via paramètre M, jamais en dur.
- Si le MCP `powerbi-modeling-mcp` est autorisé : l'utiliser pour créer tables/relations/mesures,
  puis relire le TMDL produit. Sinon, édition directe des `.tmdl`.

Validation : Desktop charge le modèle sans erreur, vue Modèle conforme à `docs/MODELE.md`, une
mesure de contrôle (total Réel, total Budget) rapprochée avec le script Python.

### Étape 4 : rapport (mode `authoring`)

Boucle qui a fonctionné dans le projet 9, à faire respecter par l'agent :

```
1. Éditer les fichiers PBIR (pages/*.json, visuals/*.json) avec l'éditeur, pas via une commande shell
   contenant des `$` (un `$#,##0` est devenu un octet NUL dans le projet 9).
2. powerbi-report-author catalog describe <type>            → types de visuels et rôles de données
   powerbi-report-author formatting describe-object <type> <objet>  → propriétés exactes
3. powerbi-report-author validate <Rapport>.Report --pretty → 0 erreur, obligatoire
4. powerbi-desktop status                                    → PID ; si hasUnsavedChanges: true,
   demander la sauvegarde (Ctrl+S) avant tout reload
5. powerbi-desktop reload --pid <pid>
6. (colonnes calculées) demander le clic « Actualiser maintenant », attendre la confirmation
7. powerbi-desktop screenshot-all --pid <pid> --output-dir docs/captures/<date>
8. Relire la capture (l'agent l'ouvre) : valeurs présentes, totaux, libellés, couleurs
9. Boucler jusqu'à conformité ; ne jamais déclarer terminé sans capture relue
```

Règles de mise en page (issues des références `design` de la skill) : grille de 8 px, marges 16 px,
titre de page en haut à gauche, filtres en bandeau sous le titre, KPI en cartes sur une ligne, un
visuel principal par page, maximum 6 à 8 visuels, info-bulles et titres explicites, ordre de
tabulation cohérent (`tabOrder`).

### Étape 5 : thème EY

Appliquer `theme/EY-theme.json` **après** que le rapport fonctionne avec le thème de base. Détails
section 6. Revalider, recharger, recapturer.

### Étape 6 : revue (agent `pbi-reviewer`)

Le relecteur exécute `validate`, ouvre les captures, rapproche 3 chiffres avec la source, et remplit
la checklist de la section 9 dans la PR. Toute case non cochée bloque la livraison.

### Étape 7 : publication (mode `management`)

- Push dans l'espace de travail Fabric/Power BI de la mission (Git integration Fabric ou
  publication depuis Desktop selon la politique EY).
- RLS testée avec « Afficher en tant que ».
- Actualisation planifiée paramétrée, propriétaire de jeu de données = compte de service mission.
- Tag Git `v1.0-<date>` et note de version dans `README.md`.

---

## 6. Thème EY : où et comment brancher la charte

Le thème Power BI est un JSON plat. Trois règles non négociables apprises dans le projet 9 :

1. **Jamais de sélecteur** (`"$id"`, `"selector"`) dans un fichier de thème. Les portées `"*"` et
   `"<typeDeVisuel>"` suffisent. Un sélecteur est ignoré sans erreur et casse l'affichage du texte.
2. **`fontSize` en nombre**, pas en chaîne (le thème « Copilot » livré avec Desktop ne passe pas le
   validateur tel quel pour cette raison).
3. **Ne décrire que les types de visuels réellement utilisés** dans `visualStyles` : chaque type en
   trop est une source d'erreur de validation.

Squelette à compléter avec la charte (valeurs à remplacer) :

```json
{
  "name": "EY-theme.json",
  "dataColors": ["<<EY_C1>>", "<<EY_C2>>", "<<EY_C3>>", "<<EY_C4>>", "<<EY_C5>>", "<<EY_C6>>"],
  "foreground": "<<EY_TEXTE>>",
  "background": "<<EY_FOND>>",
  "tableAccent": "<<EY_ACCENT>>",
  "good": "<<EY_VERT>>",
  "neutral": "<<EY_ORANGE>>",
  "bad": "<<EY_ROUGE>>",
  "textClasses": {
    "callout":    { "fontSize": 20, "fontFace": "<<EY_POLICE_TITRE>>", "color": "<<EY_TEXTE>>" },
    "title":      { "fontSize": 12, "fontFace": "<<EY_POLICE_TITRE>>", "color": "<<EY_TEXTE>>" },
    "header":     { "fontSize": 12, "fontFace": "<<EY_POLICE_TITRE>>", "color": "<<EY_TEXTE>>" },
    "label":      { "fontSize": 10, "fontFace": "<<EY_POLICE_TEXTE>>", "color": "<<EY_TEXTE>>" }
  },
  "visualStyles": {
    "*": {
      "*": {
        "background": [{ "color": { "solid": { "color": "<<EY_FOND_VISUEL>>" } }, "transparency": 0 }],
        "border":     [{ "show": false }],
        "title":      [{ "show": true, "fontColor": { "solid": { "color": "<<EY_TEXTE>>" } }, "fontSize": 12 }]
      }
    },
    "page": {
      "*": {
        "background": [{ "color": { "solid": { "color": "<<EY_FOND_PAGE>>" } }, "transparency": 0 }],
        "outspace":   [{ "color": { "solid": { "color": "<<EY_FOND_HORS_PAGE>>" } } }]
      }
    }
  }
}
```

Points d'attention charte :

- Les polices d'entreprise ne sont pas embarquées dans Power BI : si la police EY n'est pas installée
  sur le poste du lecteur (service Power BI inclus), Desktop retombe sur une police système. Prévoir
  le repli dans la skill `ey-report-standards` (`<<EY_POLICE_TITRE>>` → `Segoe UI Semibold`, texte →
  `Segoe UI` ou `Arial`).
- Logo : image dans `theme/assets/`, posée via un visuel image dans `page.json` du gabarit de page,
  pas dans le thème.
- Sémantique des couleurs d'alerte : garder `good / neutral / bad` pour la mise en forme
  conditionnelle (le projet 9 utilise rouge au-delà de +0,2 %, orange entre 0 et +0,2 %, vert en
  dessous de 0). Ne pas réutiliser une couleur de `dataColors` pour signaler un état.
- Contraste : vérifier texte/fond à 4,5:1 minimum (exigence d'accessibilité, et les projections en
  salle sont impitoyables).
- Un seul fichier de thème par dépôt, version dans le nom (`EY-theme-v1.json`) et dans `docs/LECONS.md`.

Enregistrement dans `report.json` (voie manuelle, identique au projet 9) : copier le thème dans
`<Rapport>.Report/StaticResources/RegisteredResources/`, faire correspondre le champ `name` au nom
de fichier, déclarer `themeCollection.customTheme` et `resourcePackages`, puis `validate`.

---

## 7. Prompts prêts à l'emploi

À déposer dans `.github/prompts/`. Chaque fichier commence par un frontmatter `description` et
éventuellement `agent`. Les textes sont volontairement contraignants : c'est ce qui a manqué dans la
première session du projet 9.

### `01-cadrage.prompt.md`

```
---
description: Produire docs/SPEC.md à partir d'un besoin métier (mode planning)
agent: pbi-builder
---
Utilise la skill powerbi-report-cli en mode planning.
Besoin métier : ${input:besoin}
Audience : ${input:audience}
Contraintes EY : aucune donnée client dans ce dépôt ; format 1280x720 ; thème EY appliqué en étape 5.
Produis docs/SPEC.md avec : questions métier, KPI (nom, définition, formule DAX pressentie, format),
granularité, dimensions, filtres, pages et archétype, sources, RLS, hors périmètre.
Termine par la liste des points à arbitrer. Ne construis rien tant que je n'ai pas écrit « spec validée ».
```

### `02-donnees.prompt.md`

```
---
description: Générer un jeu de données synthétique conforme à docs/SPEC.md
agent: pbi-builder
---
Lis docs/SPEC.md. Écris data/generate_data.py (pandas, seed 42) qui produit dans data/RESSOURCES/
des fichiers de même forme que les sources décrites, avec des cas limites volontaires (mois sans
budget, service sans écriture, dépassement concentré sur un fournisseur). Affiche les volumes en fin
de script. Documente chaque fichier dans docs/MODELE.md. Lance le script et colle sa sortie.
```

### `03-modele.prompt.md`

```
---
description: Construire le modèle sémantique TMDL depuis docs/MODELE.md
agent: pbi-builder
---
Utilise la skill semantic-model-authoring et .github/instructions/tmdl.instructions.md.
Construis <Rapport>.SemanticModel : tables, relations, table _Mesures, table de dates.
Chemins de sources via un paramètre M Dossier_Sources. Aucune colonne calculée sans justification écrite.
Ouvre le PBIP dans Power BI Desktop (powerbi-desktop open), vérifie le chargement, et rapproche
Réel total et Budget total avec la sortie du script Python. Colle les commandes et leurs sorties.
```

### `04-rapport.prompt.md`

```
---
description: Construire les pages PBIR décrites dans docs/SPEC.md avec le thème de base
agent: pbi-builder
---
Utilise la skill powerbi-report-cli en mode authoring. Thème : base CY23SU08 uniquement pour l'instant.
Pour chaque visuel : catalog describe puis formatting describe-object avant d'écrire une propriété.
Après chaque fichier modifié : powerbi-report-author validate <Rapport>.Report --pretty (0 erreur).
Puis status → reload → screenshot-all dans docs/captures/<date>/ et relis chaque capture.
Si hasUnsavedChanges est vrai, demande-moi de sauvegarder avant le reload.
Ne déclare pas terminé sans capture relue et sans sortie de validate collée.
```

### `05-theme.prompt.md`

```
---
description: Appliquer theme/EY-theme.json au rapport
agent: pbi-builder
---
Applique theme/EY-theme.json via RegisteredResources. Interdit : tout sélecteur ($id, selector)
dans le thème ; fontSize en chaîne ; visualStyles pour un type de visuel absent du rapport.
validate → reload → screenshot-all → relecture. Compare avec les captures de l'étape 4 et liste
toute différence autre que les couleurs et polices.
```

### `06-revue.prompt.md`

```
---
description: Revue de livraison (checklist section 9 du GUIDE)
agent: pbi-reviewer
---
Sans modifier aucun fichier : exécute validate, ouvre les dernières captures, rapproche trois
valeurs avec data/RESSOURCES, et remplis la checklist de docs/CHECKLIST.md. Pour chaque case non
cochée : fichier, ligne, ce qu'il faut montrer pour la cocher. Pas de remarque de style.
```

---

## 8. Automatiser : Git, revue, CI, publication

### 8.1 Git

- Une branche par rapport ou par évolution, PR obligatoire, le relecteur est `pbi-reviewer` puis un
  humain. Le PBIP est du texte : le diff montre exactement ce qui a changé (mesure, visuel, thème).
- Desktop réécrit les fichiers à la sauvegarde (schémas montés de version, propriétés ajoutées comme
  `"format": "G"`). Normal. Toujours relire un fichier avant de le rééditer après un Ctrl+S.
- Ne jamais commiter `.pbi/cache.abf` ni les données.

### 8.2 CI de validation (GitHub Actions)

Un workflow Windows ou Linux exécute la validation PBIR à chaque PR. Le Desktop Bridge nécessite
Desktop (Windows, session interactive) et ne tourne donc pas en CI ; seul `validate` y passe.

```yaml
name: validate-pbir
on: [pull_request]
jobs:
  validate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: 20 }
      - run: npm install -g @microsoft/powerbi-report-authoring-cli@latest
      - run: powerbi-report-author validate "$(ls -d *.Report)" --pretty
      - run: python -m py_compile data/generate_data.py
```

Compléments utiles côté modèle : Tabular Editor 2 (gratuit) avec Best Practice Analyzer en ligne de
commande pour auditer le TMDL (mesures sans format, relations bidirectionnelles, colonnes non
masquées). À faire valider comme outil tiers chez EY.

### 8.3 Publication et actualisation

- Fabric Git integration : lier l'espace de travail à la branche `main`, chaque merge publie.
- À défaut : publication depuis Desktop par le chef de mission, puis `management` pour rebinder le
  rapport sur le modèle partagé.
- Actualisation planifiée + alerte sur échec vers la boîte mission.

### 8.4 Rapports récurrents (mensuel, trimestriel)

Le gain réel de l'approche : la structure ne change pas, seules les données changent.

1. Les sources arrivent dans `RESSOURCES/` (ou dans le lakehouse) avec un nom daté.
2. Le paramètre M `Dossier_Sources` ou `Periode` est le seul point de variation.
3. Un prompt `07-cloture.prompt.md` demande à l'agent : recharger, recapturer, comparer avec les
   captures du mois précédent, lister les écarts hors tolérance et les commentaires automatiques
   générés (pattern `Analyse des dérives`), puis produire la note de synthèse dans `docs/notes/<mois>.md`.
4. La note est relue par un humain avant diffusion. L'agent ne diffuse jamais lui-même.

---

## 9. Checklist qualité avant livraison

À copier dans `docs/CHECKLIST.md` et à remplir dans chaque PR.

**Conformité et sécurité**

- [ ] Aucune donnée client, identifiant personnel ou chemin de partage interne dans le dépôt
- [ ] RLS définie et testée (« Afficher en tant que ») si le rapport est multi-entités
- [ ] Sources et transformations documentées dans `docs/MODELE.md`
- [ ] Outils tiers (MCP communautaire, Tabular Editor) validés par la sécurité EY ou absents

**Exactitude**

- [ ] `powerbi-report-author validate` : 0 erreur (sortie collée dans la PR)
- [ ] Trois valeurs rapprochées avec la source (total, un sous-total, une ligne de détail)
- [ ] Totaux et sous-totaux cohérents avec les lignes (pas de double comptage via relations)
- [ ] Mesures de pourcentage protégées par `DIVIDE`, écarts signés avec `formatString`
- [ ] Mise en forme conditionnelle testée sur les totaux (option `matchingOption` vérifiée)
- [ ] Slicers de date en mode plage (`Between`), pas liste déroulante à valeur unique

**Lisibilité**

- [ ] Captures de chaque page relues par l'agent et par un humain
- [ ] Titres de page et de visuels explicites, unités dans les en-têtes, culture `fr-FR`
- [ ] Contraste texte/fond ≥ 4,5:1, pas d'information portée uniquement par la couleur
- [ ] Ordre de tabulation logique, texte alternatif sur les visuels clés
- [ ] 1280×720 (ou format spec), aucun visuel hors page, grille 8 px respectée

**Livraison**

- [ ] Thème EY appliqué, version du thème notée
- [ ] `README.md` : objet, sources, actualisation, contacts, version
- [ ] `docs/LECONS.md` complété avec les incidents de la mission
- [ ] Tag Git posé

---

## 10. Pièges connus (ne pas refaire)

Condensé des 13 erreurs du projet 9 et des 4 incidents de l'étude de cas, par couche.

| Couche | Piège | Parade |
|---|---|---|
| Shell | `$#,##0` passé dans une commande shell devient un octet NUL | Éditer les fichiers avec l'éditeur, jamais par une commande inline contenant `$` |
| M | Suffixe de type sur un nombre (`54L`) : « Jeton ',' attendu » | En M, jamais de suffixe ; le typage vient de `type table [...]` ou `Table.TransformColumnTypes` |
| M | Chemin absolu du poste de dev codé en dur | Paramètre `Dossier_Sources` |
| TMDL | Colonne d'une table calculée déclarée avec `sourceColumn` : « ID de colonne non valide » | Pour une table calculée, `column X = <expression DAX>` |
| TMDL | Colonnes calculées → bandeau « colonnes à actualiser » après chaque reload | Transformations dans Power Query, mesures DAX plutôt que colonnes |
| PBIR | `$schema` deviné (`version.json`, `pages.json`) | `versionMetadata/2.0.0`, `pagesMetadata/1.4.0` ; copier depuis un PBIP sauvegardé par Desktop |
| PBIR | Propriété copiée d'un doc de design (`pageAlignment`) rejetée | Ne rien écrire sans `formatting describe-object` |
| PBIR | `objects.padding` d'une carte : seules `paddingUniform / paddingIndividual / paddingSelection` passent | Suivre la CLI quand elle contredit un exemple de doc |
| PBIR | Virgule traînante après suppression d'un bloc | `validate` juste après chaque édition destructive |
| PBIR | Icône conditionnelle avec `matchingOption: 1` → « 0 » sur les sous-totaux | Tester les totaux ; adapter `matchingOption` ou masquer la mesure support sur les totaux |
| PBIR | Slicer date créé en `Dropdown` : le Réel s'effondre à un jour | Mode `Between` |
| Thème | Sélecteur `$id` dans `theme.json` : cartes KPI vides, aucune erreur | Jamais de sélecteur dans un thème |
| Thème | `fontSize` en chaîne, dizaines de types de visuels inutiles | Nombres ; ne garder que `page` + types présents |
| Desktop | « Host is not ready to accept operations » | Préversion Desktop Bridge non activée : action manuelle utilisateur |
| Desktop | `open` ne trouve pas l'exécutable (install MSIX) | `PBI_DESKTOP_PATH`, à réexporter à chaque terminal |
| Desktop | `reload` avec une erreur M en attente a fermé Desktop | `validate` propre et pas de `hasUnsavedChanges` avant `reload` |
| Desktop | Capture en retard sur l'état réel | Si l'humain voit autre chose que la capture, l'humain a raison |
| Process | « Terminé » annoncé sans capture | Capture relue ou confirmation utilisateur, sinon pas terminé |

---

## 11. Annexes : fichiers à copier

### 11.1 `.github/copilot-instructions.md`

```markdown
# Règles du dépôt Power BI (EY)

- Ce dépôt ne contient jamais de données client : données synthétiques via data/generate_data.py.
- Formats Power BI : ne jamais deviner le JSON PBIR, le TMDL ou le M. Lire les skills
  .github/skills/powerbi-report-cli et semantic-model-authoring, utiliser
  `powerbi-report-author catalog describe` et `formatting describe-object` avant d'écrire une propriété.
- Après toute modification d'un fichier *.Report : `powerbi-report-author validate <Rapport>.Report --pretty`,
  coller la sortie. 0 erreur avant tout reload.
- Vérification visuelle obligatoire : status → reload → screenshot-all → relecture de la capture.
  Si `hasUnsavedChanges` est vrai, demander la sauvegarde avant le reload.
- Ne jamais écrire un fichier via une commande shell contenant `$`.
- Thème : theme/EY-theme.json uniquement, appliqué après que le rapport fonctionne avec le thème de base.
  Jamais de sélecteur ($id/selector) dans un thème.
- Mesures dans la table _Mesures, formatString systématique, culture fr-FR.
- Terminé = validate propre + capture relue + checklist docs/CHECKLIST.md remplie. Sinon, dire ce qui manque.
- Incidents rencontrés : les ajouter à docs/LECONS.md avant de clore la tâche.
```

### 11.2 `.github/instructions/tmdl.instructions.md`

```markdown
---
applyTo: "**/*.tmdl"
---
- Schéma en étoile ; relations 1-N mono-directionnelles sauf justification écrite dans docs/MODELE.md.
- Mesures uniquement dans la table _Mesures, avec displayFolder, formatString et description ///.
- Pas de colonne calculée sans justification ; préférer Power Query ou une mesure.
- Table calculée : `column X = <DAX>` sans sourceColumn. Table Power Query : sourceColumn obligatoire.
- En M : aucun suffixe de type sur les nombres ; chemins via le paramètre Dossier_Sources.
- Colonnes clés : summarizeBy: none ; colonnes techniques : isHidden.
- culture et sourceQueryCulture : fr-FR.
```

### 11.3 `.vscode/mcp.json` (quand la politique EY l'autorise)

```json
{
  "servers": {
    "powerbi-modeling": {
      "type": "stdio",
      "command": "npx",
      "args": ["-y", "@microsoft/powerbi-modeling-mcp@latest", "--start"]
    }
  }
}
```

Le serveur officiel ne touche qu'au modèle ; sauvegarder le PBIP (commit) avant toute opération,
comme le recommande Microsoft.

### 11.4 `.github/skills/ey-report-standards/SKILL.md`

```markdown
---
name: ey-report-standards
description: Charte EY pour les rapports Power BI (thème, polices de repli, gabarit de page, conventions de nommage, checklist de livraison). À utiliser dès qu'un rapport doit être mis en forme ou livré.
---
# Standards EY pour Power BI

## Thème
- Fichier unique : theme/EY-theme.json (voir references/theme.md pour la palette <<EY_...>>).
- Polices : <<EY_POLICE_TITRE>> / <<EY_POLICE_TEXTE>>, repli Segoe UI Semibold / Segoe UI.
- Couleurs d'état : good / neutral / bad du thème, jamais une couleur de série.

## Gabarit de page (1280x720)
- Bandeau titre 52 px, logo <<EY_LOGO>> à droite, filtres sous le titre, grille 8 px, marges 16 px.
- Cartes KPI : 4 maximum sur une ligne, visuel principal en dessous, commentaire à droite si prévu.

## Nommage
- Tables : PascalCase métier (Comptabilite, Budget, Ref_Services) ; mesures : libellé lisible avec unité.
- Pages : « 01 Synthèse », « 02 Détail… » ; visuels : titre = question à laquelle il répond.

## Livraison
- Checklist docs/CHECKLIST.md remplie dans la PR, captures datées dans docs/captures/.
```

Ajouter `references/theme.md` (palette, logo, exemples de rendu validés) et `references/gabarit.md`
(un `page.json` et un `visual.json` de bandeau prêts à copier).

### 11.5 `.github/agents/pbi-reviewer.agent.md`

```markdown
---
name: pbi-reviewer
description: Relecteur Power BI : valide, rapproche, remplit la checklist, ne modifie rien.
tools: ["read", "search", "terminal"]
---
Tu relis un rapport Power BI avant livraison. Tu ne modifies aucun fichier.
Exécute `powerbi-report-author validate`, ouvre les captures les plus récentes de docs/captures/,
rapproche trois valeurs avec data/RESSOURCES, puis remplis docs/CHECKLIST.md.
Pour chaque case non cochée : fichier, ligne, raison, comment le montrer. Aucune remarque de style.
```

---

## 12. Ce qui n'a pas été vérifié

Ce guide s'appuie sur les fichiers du projet 9 (relus intégralement) et sur les pages publiques
consultées le 24/10/2026. Accès réseau restreint pendant la rédaction : les points suivants sont à
confirmer sur le poste cible avant de les figer dans les instructions Copilot.

- **Libellé exact de l'option Desktop Bridge** dans les fonctionnalités en préversion de Power BI
  Desktop. Le projet 9 parle de « Fonctionnalités en préversion » sans citer le libellé ; une source
  tierce cite « Enable external tool access to Power BI Desktop through secure local APIs ». La page
  Microsoft Learn n'a pas pu être ouverte.
- **Emplacement des skills pour Copilot dans VS Code** : les sources officielles consultées indiquent
  un dossier de skills au niveau du dépôt et un au niveau du profil utilisateur, sans que le chemin
  `.github/skills/` ait pu être confirmé sur la documentation VS Code elle-même (site inaccessible).
  Une source tierce cite `.github/copilot/skills/`. Tester les deux, garder celui que Copilot charge.
- **Nom du paramètre VS Code** activant les skills (`chat.useAgentSkills` cité de mémoire).
- **Sous-commandes exactes** de `powerbi-report-author` et `powerbi-desktop` : reprises du projet 9
  (elles y ont fonctionné) ; la skill Microsoft actuelle renvoie à `references/authoring.md`, non
  ouvert. Lancer `--help` sur chaque CLI après installation.
- **Politique EY** sur les serveurs MCP dans Copilot Enterprise, l'installation globale npm et les
  outils tiers (MCP communautaire, Tabular Editor) : à demander à l'administrateur Copilot / IT.
- **Portabilité des polices EY** dans le service Power BI : à tester sur un lecteur sans la police
  installée.
