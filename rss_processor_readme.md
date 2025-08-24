# 📰 RSS Processor - Générateur de Revue de Presse Automatique

> **Transformez vos flux RSS en documents Word professionnels avec traduction automatique et résumés IA**
![Python 3.8+](https://www.python.org/downloads/)

## 🚀 Fonctionnalités

### ✨ **Traitement Intelligent**
- 📥 **Import OPML** : Importez vos flux RSS depuis n'importe quel lecteur RSS
- 🤖 **Résumés IA** : Génération automatique de résumés avec BART (Facebook AI)
- 🌍 **Traduction Multi-Sources** : Traduction automatique vers le français avec plusieurs APIs
- 📄 **Export Word** : Documents Word professionnels avec mise en page automatique

### 🎯 **Fonctionnalités Avancées**
- ⚡ **Traitement Parallèle** : Traitement simultané de plusieurs flux RSS
- 💾 **Cache Intelligent** : Système de cache pour éviter les re-traductions
- 📊 **Interface Graphique** : Sélection de fichiers via interface Tkinter
- 🔄 **Gestion d'Erreurs** : Système robuste avec fallback automatique
- 📝 **Logging Complet** : Suivi détaillé des opérations

---

## 📦 Installation

### 🔧 **Prérequis**
- Python 3.8 ou supérieur
- Connexion Internet (pour les API de traduction)

### 📥 **Installation des Dépendances**

```bash
# Téléchharger le projet
https://lyderickh.github.io/projet4.html 


#Ouvrez la commande box avec win+r CMD (en administrateur ) ou tapez dans la barre de recherche "invite de commande"
# Installer toutes les dépendances

pip install -r requirements.txt
```

**OU installez manuellement :**

```bash
# En une seule commande :
pip install feedparser==6.0.10 transformers==4.30.0 torch>=1.9.0 newspaper3k==0.2.8 python-docx==0.8.11 tqdm==4.65.0 requests==2.31.0 urllib3==2.0.3 langdetect==1.0.9 googletrans==4.0.0rc1 python-dateutil==2.8.2 lxml==4.9.2 beautifulsoup4==4.12.2 sentencepiece==0.1.99 protobuf==4.23.3

# Sinon : 

# Dépendances principales
pip install feedparser transformers torch newspaper3k python-docx tqdm requests urllib3

# Traitement du langage
pip install langdetect googletrans==4.0.0rc1

# Interface et utilitaires
pip install python-dateutil lxml beautifulsoup4

# Dépendances optionnelles pour de meilleures performances
pip install sentencepiece protobuf
```

### 📋 **Fichier requirements.txt**

Si vous préférez utiliser un fichier requirements.txt, créez-le avec ce contenu :

```text
feedparser==6.0.10
transformers==4.30.0
torch>=1.9.0
newspaper3k==0.2.8
python-docx==0.8.11
tqdm==4.65.0
requests==2.31.0
urllib3==2.0.3
langdetect==1.0.9
googletrans==4.0.0rc1
python-dateutil==2.8.2
lxml==4.9.2
beautifulsoup4==4.12.2
sentencepiece==0.1.99
protobuf==4.23.3
```

---

## 📄 Préparation du Fichier OPML

### 🔍 **Qu'est-ce qu'un fichier OPML ?**

OPML (Outline Processor Markup Language) est un format XML utilisé pour organiser et partager des listes de flux RSS. C'est le format d'export standard de tous les lecteurs RSS.

### 📱 **Comment Exporter depuis votre Lecteur RSS**

#### **Feedly** 📰
1. Connectez-vous à Feedly
2. Cliquez sur votre nom d'utilisateur (coin supérieur droit)
3. Sélectionnez **"Settings"** → **"OPML"**
4. Cliquez sur **"Export OPML"**

#### **Inoreader** 📖
1. Menu **"Settings"** → **"Import/Export"**
2. Cliquez sur **"Export to OPML file"**

#### **The Old Reader** 📚
1. Menu **"Settings"** → **"Import/Export"**
2. Bouton **"Export subscriptions"**

#### **NewsBlur** 📊
1. Menu principal → **"Account"**
2. Section **"Import/Export"** → **"Export"**

#### **Autres Lecteurs**
- **RSS Guard** : Flux → Exporter flux → OPML
- **QuiteRSS** : Fichier → Exporter flux → OPML
- **Thunderbird** : Outils → Exporter → OPML

### 🏗️ **Structure OPML Attendue**

Votre fichier OPML doit avoir cette structure :

```xml
<?xml version="1.0" encoding="UTF-8"?>
<opml version="1.0">
  <head>
    <title>Mes Flux RSS</title>
  </head>
  <body>
    <outline text="Technologie" title="Technologie">
      <outline text="TechCrunch" xmlUrl="https://techcrunch.com/feed/" />
      <outline text="Wired" xmlUrl="https://www.wired.com/feed/" />
    </outline>
    <outline text="Actualités" title="Actualités">
      <outline text="Le Monde" xmlUrl="https://www.lemonde.fr/rss/une.xml" />
      <outline text="BBC News" xmlUrl="http://feeds.bbci.co.uk/news/rss.xml" />
    </outline>
  </body>
</opml>
```

### ✅ **Exemples de Flux RSS Populaires**

```xml
<!-- Technologie -->
<outline text="TechCrunch" xmlUrl="https://techcrunch.com/feed/" />
<outline text="Ars Technica" xmlUrl="https://feeds.arstechnica.com/arstechnica/index" />
<outline text="The Verge" xmlUrl="https://www.theverge.com/rss/index.xml" />

<!-- Actualités Françaises -->
<outline text="Le Figaro" xmlUrl="https://www.lefigaro.fr/rss/figaro_actualites.xml" />
<outline text="Libération" xmlUrl="https://www.liberation.fr/arc/outboundfeeds/rss/" />
<outline text="franceinfo" xmlUrl="https://www.francetvinfo.fr/titres.rss" />

<!-- International -->
<outline text="Reuters" xmlUrl="https://feeds.reuters.com/reuters/topNews" />
<outline text="Associated Press" xmlUrl="https://feeds.apnews.com/rss/apf-topnews" />
<outline text="BBC World" xmlUrl="http://feeds.bbci.co.uk/news/world/rss.xml" />
```

---

## 🎮 Utilisation

### 🖥️ **Lancement du Programme**

```bash
python rss_processor.py
```

### 📋 **Étapes d'Utilisation**

1. **Lancement** : Exécutez le script Python
2. **Sélection** : Une fenêtre s'ouvre pour sélectionner votre fichier OPML
3. **Traitement** : Le programme traite automatiquement tous vos flux
4. **Résultat** : Des dossiers sont créés avec les documents Word générés

### 📁 **Structure des Fichiers de Sortie**

```
📦 Dossier de travail
├── 📁 Technologie/
│   └── 📄 Technologie_20240824_14h30.docx
├── 📁 Actualités/
│   └── 📄 Actualités_20240824_14h30.docx
├── 📄 rss_processor.log
└── 📄 translation_cache.json
```

---

## ⚙️ Configuration

### 🎛️ **Paramètres Modifiables**

Dans la classe `Config` du fichier `rss_processor.py` :

```python
class Config:
    MAX_ARTICLES_PER_FEED = 3      # Nombre d'articles par flux
    MAX_WORKERS = 3                # Threads simultanés
    REQUEST_TIMEOUT = 10           # Timeout des requêtes
    RETRY_COUNT = 2                # Nombre de tentatives
    MAX_CONTENT_LENGTH = 1000      # Longueur max du contenu
    MIN_SUMMARY_LENGTH = 50        # Longueur min du résumé
    MAX_SUMMARY_LENGTH = 300       # Longueur max du résumé
```

### 🌐 **Services de Traduction**

Le programme utilise plusieurs services en cascade :

1. **MyMemory API** (gratuit, 1000 requêtes/jour)
2. **LibreTranslate** (gratuit, open source)
3. **Google Translate** (fallback)

---

## 📊 Format du Document Word

### 📝 **Contenu Généré**

Chaque document Word contient :

- **🏷️ Page de titre** avec nom de catégorie
- **📋 Table des matières** (à générer dans Word)
- **📊 Statistiques** (nombre d'articles, date de génération)
- **📰 Articles** avec :
  - Titre traduit en français
  - Date formatée en français
  - Source originale
  - Résumé IA en français
  - Lien vers l'article original

### 🎨 **Mise en Page**

- **En-tête** : Nom de la catégorie
- **Pied de page** : Date et heure de génération
- **Numérotation** automatique des articles
- **Formatage** professionnel avec texte en gras

---

## 🐛 Dépannage

### ❗ **Problèmes Courants**

#### **Erreur d'installation**
```bash
# Si torch ne s'installe pas
pip install torch --index-url https://download.pytorch.org/whl/cpu

# Si newspaper3k échoue
pip install --upgrade setuptools wheel
pip install newspaper3k
```

#### **Erreur de traduction**
- Vérifiez votre connexion Internet
- Les services gratuits ont des limites de taux
- Le cache évite les re-traductions

#### **Fichier OPML non reconnu**
- Vérifiez que le fichier a l'extension `.opml`
- Assurez-vous qu'il contient des balises `xmlUrl`
- Testez avec un petit fichier d'exemple

### 📝 **Fichiers de Log**

- **`rss_processor.log`** : Journal détaillé des opérations
- **`translation_cache.json`** : Cache des traductions


## 🔗 Liens Utiles

- [Documentation Feedparser](https://pythonhosted.org/feedparser/)
- [Guide OPML](http://opml.org/spec2.html)
- [Modèles Hugging Face](https://huggingface.co/models)
- [Python-docx Documentation](https://python-docx.readthedocs.io/)

---

*Développé avec plusieurs LLM pour automatiser la veille informationnelle*