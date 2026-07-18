# Guide pour un futur agent Claude — création de rapports Power BI (PBIP/PBIR)

Ce guide résume ce qui a été appris en construisant `TestReport.pbip` (dataset de
test + dashboard) dans ce dossier. Objectif : éviter de refaire les mêmes
erreurs et gagner plusieurs heures.

---

## 0. À LIRE EN PREMIER : le plugin MCP est probablement déjà là

Un vrai serveur MCP Power BI (**plugin `powerbi-report-builder`**, outils
`mcp__plugin_powerbi-report-builder_powerbi-report__pbir_*`) a fini par
s'activer dans cette session — il avait été téléchargé/installé en tout
début de session mais n'était pas encore reconnu par l'outillage, d'où tout
le travail manuel décrit plus bas.

**Avant de commencer un nouveau projet PBIP, vérifier s'il est déjà actif :**

```
ToolSearch query="pbir_"
```

S'il apparaît, **l'utiliser en priorité plutôt que d'écrire le JSON PBIR à la
main** — ça évite la quasi-totalité des erreurs listées dans ce guide :
- `pbir_set_report` / `pbir_get_report` — se connecter à un `.Report`
- `pbir_create_page`, `pbir_add_visual`, `pbir_format_visual` — construire
  sans écrire de JSON brut
- `pbir_apply_theme` / `pbir_set_report_theme` / `pbir_list_report_themes` —
  gérer le thème sans les pièges décrits en section 5
- `pbir_guide` — documentation intégrée, à lire en premier via l'outil
  lui-même

S'il n'apparaît PAS dans `ToolSearch`, suivre la procédure manuelle
(sections 1 à 6) — c'est celle qui a servi de filet de sécurité cette fois-ci
et elle fonctionne, juste plus lentement et avec plus de pièges à éviter.

---

## 1. Outils à installer (dans cet ordre)

### 1.1 CLI officielles Power BI (npm, installation globale)

```bash
npm install -g @microsoft/powerbi-report-authoring-cli@latest @microsoft/powerbi-desktop-bridge-cli@latest
```

- `powerbi-report-author` : catalogue des visuels, schémas de formatage exacts,
  **validation PBIR** (`validate <path>`). **Ne jamais deviner le JSON PBIR à
  la main** — toujours vérifier avec `catalog describe <type>` et
  `formatting describe-object <type> <objet>` avant d'écrire une propriété.
- `powerbi-desktop` : pilote Power BI Desktop en local (open/status/reload/
  screenshot) via son "Desktop Bridge".
- ⚠️ L'installation globale npm peut être bloquée par le classificateur
  auto-mode de Claude Code ("Untrusted Code Integration") — c'est normal,
  demander confirmation explicite à l'utilisateur.

### 1.2 Power BI Desktop lui-même

Sur cette machine il n'était pas installé. Installation via winget/Microsoft
Store (c'est un paquet MSIX, pas un .exe classique) :

```bash
winget install --id 9NTXR16HNW1T --source msstore --accept-package-agreements --accept-source-agreements
```

**Piège** : `powerbi-desktop open` cherche l'exécutable dans des chemins
classiques (`Program Files\Microsoft Power BI Desktop\...`) qui n'existent PAS
pour une install MSIX. Il faut trouver le vrai chemin et l'exporter :

```powershell
Get-AppxPackage -Name "*PowerBI*" | Select-Object PackageFullName, InstallLocation
```

Puis dans le shell utilisé pour les commandes CLI :

```bash
export PBI_DESKTOP_PATH="C:\Program Files\WindowsApps\Microsoft.MicrosoftPowerBIDesktop_<version>_x64__8wekyb3d8bbwe\bin\PBIDesktop.exe"
```

(chemin exact = `InstallLocation` + `\bin\PBIDesktop.exe`)

**Piège #2** : au tout premier lancement, Desktop peut se bloquer sur un état
"Host is not ready to accept operations" tant que la **fonctionnalité en
préversion du Desktop Bridge** n'est pas activée manuellement par
l'utilisateur : `Fichier → Options → Options d'informatique décisionnelle
globales → Fonctionnalités en préversion`. Aucun outil d'automatisation UI
Windows n'est disponible pour cocher ça soi-même — il faut le demander à
l'utilisateur.

### 1.3 Skills de référence Microsoft (fortement recommandé)

```bash
git clone https://github.com/microsoft/skills-for-fabric.git
```

Contient dans `plugins/powerbi-authoring/skills/` :
- `semantic-model-authoring/` — TMDL, DAX, structure PBIP
- `powerbi-report-authoring/` — PBIR (pages/visuals/thèmes/formatage), avec
  `references/*.md` très détaillés (card.md, cartesian.md, theming.md, etc.)
- `powerbi-report-design/` — archétypes de dashboard, couleurs, layout

**Lire `SKILL.md` de `powerbi-report-authoring` avant de commencer** — il dit
explicitement "Do not guess PBIR JSON from memory". C'est vrai, ne pas
outrepasser cette consigne même sous pression de temps.

### 1.4 Alternative NON utilisée ici (à considérer si pertinent)

Un plugin communautaire `jonathan-pap/powerbi-report-mcp` existe (Cowork
plugin `.plugin`, expose un vrai serveur MCP avec des outils `pbir_*`). Il
n'a pas été utilisé dans cette session au final (on a pris la voie
"CLI + fichiers" à la place). Si un MCP réel est installé et connecté, il
peut simplifier la génération PBIR (pas besoin de générer le JSON à la main) —
mais vérifier qu'il est bien actif (`ToolSearch` sur `pbir_`) avant de compter
dessus.

---

## 2. Erreurs commises (dans l'ordre chronologique) — à ne PAS refaire

| # | Erreur | Cause | Fix |
|---|---|---|---|
| 1 | `formatString: $#,##0` devenait un octet NUL dans le fichier TMDL | `bash -e "...\$#,##0..."` — le `$` est spécial en bash même échappé dans certains contextes de heredoc composé | Écrire les fichiers avec l'outil `Write`/`Edit` plutôt que `node -e "..."` en ligne de commande dès qu'il y a des `$` dans le contenu |
| 2 | Power BI Desktop plantait au chargement : *"Erreur du moteur M : Jeton ',' attendu"* | J'ai mis un suffixe `L` sur les nombres dans le code **M** (`54L`) — ce suffixe existe en DAX/TMDL/PBIR-JSON mais **pas en langage M** (Power Query) | En M, les nombres n'ont jamais de suffixe de type. `54`, pas `54L`. Le typage vient du schéma `type table [...]` |
| 3 | `version.json` : `$schema` invalide (essayé `.../version/2.0.0/...`) | Deviné au lieu de vérifié | Bon nom de schéma : `.../definition/versionMetadata/2.0.0/schema.json` |
| 4 | `pages.json` : `$schema` invalide (essayé `.../pages/1.4.0/...`) | Deviné | Bon nom : `.../definition/pagesMetadata/1.4.0/schema.json` |
| 5 | `page.json` : propriété `pageAlignment` rejetée par le validateur | Copié depuis un doc de design (archétype), qui n'est pas au format PBIR strict | Ne pas ajouter de propriété sans la voir dans un exemple `authoring.md`/`page-formatting.md` |
| 6 | `theme.json` (cardVisual) : `border.radius`, `spacing.customizeSpacing`, `padding.top/bottom/left/right` rejetés | Copié le style théorique sans vérifier les props exactes au niveau thème | Toujours croiser avec `powerbi-report-author formatting describe-object <type> <objet>` — les props valides au niveau **thème** (JSON plat) ne sont pas toujours les mêmes qu'au niveau **visual.json** (JSON avec `expr`/`Literal`) |
| 7 | `objects.padding` d'un `cardVisual` (fichier visual.json) : `paddingTop/paddingLeft/...` puis `top/left/...` — les deux rejetés | `card.md` documente `paddingIndividual` + `paddingTop/...` mais la CLI dit que `objects.padding` (au niveau visual, PAS visualContainerObjects) n'expose QUE `paddingUniform`/`paddingIndividual`/`paddingSelection` en pratique | Utiliser uniquement `paddingUniform` pour un padding symétrique simple. Ne pas faire confiance aveuglément à un exemple de doc si la CLI contredit |
| 8 | Virgules traînantes après des `Edit` de blocs JSON | Suppression d'un bloc sans supprimer la virgule qui le précédait/suivait | Toujours revalider avec `powerbi-report-author validate` juste après un `Edit` qui supprime un bloc |
| 9 | **LE GROS BUG** : les 4 cartes KPI restaient visuellement vides (conteneur/bordure/ombre visibles mais aucun texte de valeur/libellé), alors que la donnée était correcte (confirmée en changeant de type de visuel) | `theme.json` → `visualStyles.cardVisual.*.value` et `.label` contenaient `"$id": "default"` — copié tel quel depuis l'exemple "Theme Approach" de `card.md`. **Cette syntaxe `$id` n'est valide que dans un `visual.json`** (`"selector": {"id": "default"}`), **pas dans un thème** (JSON plat, la portée `cardVisual.*` suffit). Desktop ignore la clé silencieusement mais ça casse le rendu du texte — **et `powerbi-report-author validate` ne détecte PAS ce genre d'erreur** car il ne valide pas la sémantique croisée thème↔visual | Ne jamais mettre de sélecteur (`$id`, `selector`) dans un fichier **thème**. Les scopes `"*"`/`"cardVisual"`/etc. du thème remplacent déjà le rôle du sélecteur. **Recommandation forte : éviter un thème custom pour un premier jet — utiliser le thème par défaut de Power BI (ne pas créer `theme.json`, ne pas toucher `report.json.themeCollection`)** |
| 10 | Après un `reload`, le bandeau *"colonnes calculées à actualiser"* réapparaît systématiquement et les nouveaux/modifiés visuels restent vides tant que l'utilisateur n'a pas cliqué **"Actualiser maintenant"** | Comportement normal de Desktop pour un modèle avec colonnes calculées TMDL chargé hors de l'UI — aucune commande CLI n'expose ce rafraîchissement | Prévenir l'utilisateur d'emblée qu'un clic manuel sera nécessaire après **chaque** `reload` tant que le modèle a des colonnes calculées. Éviter les colonnes calculées TMDL si possible (préférer une mesure DAX, ou une colonne déjà présente dans les données M) |
| 11 | `reload` avec des changements de modèle en attente a fait planter/fermer complètement Desktop une fois | Le modèle avait un vrai bug M (voir erreur #2) à ce moment-là — le `reload` a forcé une recompilation qui a fait planter le process | Toujours valider (`validate`) ET s'assurer qu'il n'y a plus d'erreur avant de faire `reload`. Si `hasUnsavedChanges: true`, demander à l'utilisateur de sauvegarder (Ctrl+S) avant de `reload` |
| 12 | Screenshots parfois obsolètes/en cache, ne reflétant pas l'état réel après une action utilisateur | Le pipeline de capture peut renvoyer une image légèrement en retard sur l'état réel de l'app | Si l'utilisateur confirme visuellement un état différent de la capture, **faire confiance à l'utilisateur** plutôt qu'insister avec d'autres captures automatiques |
| 13 | Même le thème **officiel Microsoft "Copilot"** (copié depuis l'installation Desktop, voir §5) ne passe pas `powerbi-report-author validate` tel quel : `textClasses.*.fontSize` est en `string` ("20") au lieu de `number`, et le fichier couvre des dizaines de types de visuels (gauge, card legacy, kpi, tableEx, map, etc.) dont certaines propriétés (`valueAxis`, `legend`) sont invalides pour ces types selon le schéma strict de la CLI | Desktop lui-même est tolérant (il accepte ces incohérences), mais notre validateur externe est plus strict — normal, pas un bug de ma part | Convertir les `fontSize` en nombres, et **supprimer du thème copié toutes les entrées `visualStyles.<type>` pour les types de visuels non utilisés dans le rapport** (garder seulement `page` + les types réellement présents, ex. `cardVisual`/`barChart`/`lineChart`). Revalider après coup |

---

## 3. Boucle de travail qui fonctionne

```
1. Écrire/éditer les fichiers PBIR/TMDL (Write/Edit — jamais de bash -e avec $ dedans)
2. powerbi-report-author validate <path>\<Name>.Report --pretty   → 0 erreur obligatoire
3. powerbi-desktop status                                          → trouver le bon PID
   - si hasUnsavedChanges: true → demander à l'utilisateur de sauvegarder d'abord
4. powerbi-desktop reload --pid <pid>
5. (si le modèle a des colonnes calculées) → demander à l'utilisateur de cliquer
   "Actualiser maintenant" dans Desktop, puis attendre sa confirmation
6. powerbi-desktop screenshot-all --pid <pid> --output-dir <scratchpad>
7. Read l'image PNG → vérifier visuellement
8. Si problème visuel → corriger, revalider, reload, screenshot — en boucle
9. Ne jamais déclarer "terminé" sans capture d'écran ET/OU confirmation utilisateur
```

---

## 5. Utiliser le thème officiel "Copilot" plutôt qu'un thème custom fait main

Power BI Desktop expédie un thème intégré nommé **Copilot** (celui utilisé
par les nouvelles expériences de mise en forme). Il vit à l'intérieur de
l'installation Desktop elle-même, PAS dans le repo `skills-for-fabric` :

```
<InstallLocation>\bin\WebView2Resources\minerva\sharedresources\BuiltInThemes\CopilotDefault.json
```

(`InstallLocation` = celui trouvé via `Get-AppxPackage -Name "*PowerBI*"`,
voir §1.2)

Procédure pour l'utiliser dans un PBIP (voie manuelle, sans MCP) :

1. Copier ce fichier dans
   `<Name>.Report/StaticResources/RegisteredResources/CopilotTheme-<guid>.json`
2. Changer le champ `"name"` à l'intérieur du JSON pour qu'il corresponde
   exactement au nom de fichier (avec `.json`)
3. **Corriger le fichier avant de le garder** — voir erreur #13 ci-dessus :
   convertir `textClasses.*.fontSize` en nombres, et supprimer les entrées
   `visualStyles.<type>` pour tout type de visuel non utilisé dans le rapport
4. Enregistrer dans `report.json` :
   ```json
   "themeCollection": {
     "customTheme": {
       "name": "CopilotTheme-<guid>.json",
       "reportVersionAtImport": { "visual": "2.9.0", "report": "3.3.0", "page": "2.1.0" },
       "type": "RegisteredResources"
     }
   },
   "resourcePackages": [{
     "name": "RegisteredResources",
     "type": "RegisteredResources",
     "items": [{ "name": "CopilotTheme-<guid>.json", "path": "CopilotTheme-<guid>.json", "type": "CustomTheme" }]
   }]
   ```
5. `powerbi-report-author validate` → 0 erreur avant de `reload`

Si le plugin MCP (§0) est actif, c'est probablement bien plus simple via
`pbir_apply_theme` / `pbir_set_report_theme` / `pbir_list_report_themes` —
tester ça en premier.

---

## 6. Recommandations pour la prochaine fois

1. **Utiliser le thème officiel "Copilot"** (voir §5) plutôt que d'inventer un
   thème custom à la main — ça donne un rendu professionnel cohérent avec
   l'écosystème Power BI récent, sans avoir à choisir soi-même les couleurs.
   Le thème par défaut de Desktop (aucun `theme.json` du tout) reste une
   option de repli valable si on veut juste tester vite fait.
2. Toujours lancer `powerbi-report-author catalog describe <type>` et
   `formatting describe-object <type> <objet>` **avant** d'écrire une
   propriété de formatage — ne jamais copier un exemple de doc sans vérifier.
3. Pour les données de test M : pas de suffixe `L`/`D` sur les nombres (ça
   c'est pour DAX/TMDL/PBIR-JSON uniquement).
4. Préférer des colonnes déjà présentes dans les données brutes plutôt que des
   colonnes calculées TMDL, pour éviter le rafraîchissement manuel obligatoire
   à chaque reload.
5. `PBI_DESKTOP_PATH` doit être ré-exporté à chaque nouvelle session de shell
   (variable d'environnement non persistante entre les appels Bash).
6. Le fichier `.pbip` et tous les JSON PBIR peuvent être réécrits par Desktop
   lui-même à la sauvegarde (Ctrl+S) — schéma bumpé, formatage changé,
   propriétés ajoutées (ex. `"format": "G"` sur les projections). C'est normal,
   ne pas s'en inquiéter, mais **relire le fichier avant de l'éditer à nouveau**
   après une sauvegarde utilisateur.
