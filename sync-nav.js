const fs = require('fs');
const path = require('path');

const ROOT = __dirname;

const HTML_FILES = [
  'index.html',
  'cv.html',
  'memoire.html',
  'explorateur.html',
  ...Array.from({ length: 8 }, (_, i) => `projet${i + 1}.html`),
  path.join('projets', 'memoire', 'explorateur_donnees_67_2.html'),
];

const INLINE_NAV_CSS =
  /\s*\/\* ─── Navbar ─── \*\/[\s\S]*?\[data-theme="dark"\] \.theme-toggle \.icon-moon \{ display: none; \}\s*/g;

const LEGACY_NAV_CSS =
  /\s*\.site-nav \{ position:fixed; top:0; left:0; right:0; z-index:100; height:52px;[\s\S]*?\.nav-link:hover \{ color:var\(--(?:accent|primary)\); \}\s*/g;

const LEGACY_NAV_BLOCK =
  /\s*\/\* ========== NAVBAR ========== \*\/[\s\S]*?\.back-link:hover \{[\s\S]*?\}\s*/g;

function assetPrefix(filePath) {
  const depth = filePath.split(path.sep).length - 1;
  return depth > 0 ? '../'.repeat(depth) : '';
}

function ensureThemeScript(content) {
  const themeScript =
    '<script>\n    (function () {\n      var saved = localStorage.getItem(\'theme\');\n      document.documentElement.setAttribute(\'data-theme\', saved === \'dark\' ? \'dark\' : \'light\');\n    })();\n  </script>';
  content = content.replace(
    /saved === 'light' \? 'light' : 'dark'/g,
    "saved === 'dark' ? 'dark' : 'light'"
  );
  if (content.includes("localStorage.getItem('theme')")) return content;
  return content.replace('</head>', '\n  ' + themeScript + '\n</head>');
}

function ensureAssets(content, prefix) {
  const themeHref = prefix + 'css/theme.css';
  const cssHref = prefix + 'css/site-nav.css';
  const jsSrc = prefix + 'js/site-nav.js';

  if (!content.includes('css/theme.css')) {
    if (content.includes('css/site-nav.css')) {
      content = content.replace(
        `<link rel="stylesheet" href="${cssHref}">`,
        `  <link rel="stylesheet" href="${themeHref}">\n  <link rel="stylesheet" href="${cssHref}">`
      );
    } else {
      content = content.replace(
        '</head>',
        `  <link rel="stylesheet" href="${themeHref}">\n  <link rel="stylesheet" href="${cssHref}">\n</head>`
      );
    }
  }

  if (!content.includes('css/site-nav.css')) {
    content = content.replace(
      '</head>',
      `  <link rel="stylesheet" href="${cssHref}">\n</head>`
    );
  }

  content = content.replace(
    new RegExp(`\\s*<script src="${jsSrc.replace(/\//g, '\\/')}"><\\/script>\\s*`, 'g'),
    '\n'
  );

  if (!content.includes('js/site-nav.js')) {
    content = content.replace(
      '</head>',
      `  <script src="${jsSrc}" defer></script>\n</head>`
    );
  }

  return content;
}

function cleanCss(content) {
  let next = content;
  let prev;
  do {
    prev = next;
    next = next.replace(INLINE_NAV_CSS, '\n');
    next = next.replace(LEGACY_NAV_CSS, '\n');
    next = next.replace(LEGACY_NAV_BLOCK, '\n');
  } while (next !== prev);

  next = next.replace(/padding-top:\s*52px/g, 'padding-top: 64px');
  return next;
}

function normalizeNav(content) {
  return content.replace(
    /<nav class="site-nav">[\s\S]*?<\/nav>/,
    '  <nav class="site-nav"></nav>'
  );
}

function removeDuplicateThemeScript(content) {
  return content.replace(
    /<script>\s*var toggle = document\.getElementById\('theme-toggle'\);[\s\S]*?<\/script>\s*/g,
    ''
  );
}

for (const rel of HTML_FILES) {
  const filePath = path.join(ROOT, rel);
  if (!fs.existsSync(filePath)) {
    console.warn('Skip missing:', rel);
    continue;
  }

  const prefix = assetPrefix(rel);
  let content = fs.readFileSync(filePath, 'utf8');

  content = cleanCss(content);
  content = ensureThemeScript(content);
  content = ensureAssets(content, prefix);
  content = normalizeNav(content);
  content = removeDuplicateThemeScript(content);

  fs.writeFileSync(filePath, content, 'utf8');
  console.log('Updated:', rel);
}

console.log('Navbar sync complete.');
