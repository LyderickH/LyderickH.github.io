const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirPath = __dirname;
const indexContent = fs.readFileSync(path.join(dirPath, 'index.html'), 'utf8');

const styleMatch = indexContent.match(/<style>([\s\S]*?)<\/style>/);
const themeScriptMatch = indexContent.match(/<script>\s*\(function \(\) \{[\s\S]*?<\/script>/);
const navMatch = indexContent.match(/<nav class="site-nav">([\s\S]*?)<\/nav>/);
const footerMatch = indexContent.match(/<footer>([\s\S]*?)<\/footer>/);

const files = fs.readdirSync(dirPath).filter(f => f.startsWith('projet') && f.endsWith('.html'));

for (const file of files) {
  const filePath = path.join(dirPath, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Inject Theme Script in <head>
  if (!content.includes("localStorage.getItem('theme')")) {
    content = content.replace('</head>', '\n' + themeScriptMatch[0] + '\n</head>');
  }

  // Swap <nav>
  if (navMatch) {
    content = content.replace(/<nav class="site-nav">[\s\S]*?<\/nav>/, '<nav class="site-nav">\n' + navMatch[1] + '\n</nav>');
  }

  // Swap <footer>
  if (footerMatch) {
    content = content.replace(/<footer>[\s\S]*?<\/footer>/, '<footer>\n' + footerMatch[1] + '\n</footer>');
  }

  // Fix CSS: Replace :root block and body background
  // We add the index styles at the top of <style>
  const indexStyle = styleMatch[1];
  
  let customStyle = content.match(/<style>([\s\S]*?)<\/style>/)[1];
  
  customStyle = customStyle.replace(/:root\s*\{[\s\S]*?\}/, '');
  customStyle = customStyle.replace(/\*\s*\{[\s\S]*?\}/, '');
  customStyle = customStyle.replace(/body\s*\{[\s\S]*?\}/, `
  body {
    font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
    background: var(--bg-primary);
    color: var(--text-primary);
    padding-top: 64px;
    min-height: 100vh;
  }
  `);

  // Override colors in the rest of the CSS to match light/dark theme
  customStyle = customStyle.replace(/var\(--glass-bg\)/g, 'var(--bg-secondary)');
  customStyle = customStyle.replace(/var\(--glass-border\)/g, 'var(--border)');
  customStyle = customStyle.replace(/var\(--shadow\)/g, 'var(--shadow-card)');
  customStyle = customStyle.replace(/var\(--shadow-hover\)/g, 'var(--shadow-hover)');
  customStyle = customStyle.replace(/rgba\(0, 0, 0, 0\.7\)/g, 'var(--bg-muted)');
  
  // Hide particles
  customStyle += `\n.bg-particles { display: none !important; }\n`;

  // Make titles match index typography
  customStyle += `\n
  header h1 {
    font-family: 'Fraunces', Georgia, serif;
    background: none;
    -webkit-text-fill-color: var(--text-primary);
    color: var(--text-primary);
  }
  .content-section h2 {
    font-family: 'Fraunces', Georgia, serif;
    background: none;
    -webkit-text-fill-color: var(--text-primary);
    color: var(--text-primary);
  }
  .back-link {
     font-family: 'JetBrains Mono', monospace;
     color: var(--text-secondary);
     border-color: var(--border);
     background: var(--bg-primary);
  }
  .modern-btn {
     background: var(--bg-secondary);
     border-color: var(--border-strong);
     color: var(--text-primary);
  }
  .modern-btn:hover {
     background: var(--bg-muted);
     border-color: var(--accent);
  }
  .modern-btn::before { display: none; }
  .slide-btn {
     background: var(--bg-primary);
     border-color: var(--border);
     color: var(--text-primary);
  }
  .counter {
     background: var(--bg-primary);
     color: var(--text-primary);
     border-color: var(--border);
  }
  `;

  content = content.replace(/<style>[\s\S]*?<\/style>/, '<style>\n' + indexStyle + '\n' + customStyle + '\n</style>');

  // Make sure the theme toggle works (adds the click listener if it's missing)
  if (!content.includes('toggle.addEventListener')) {
      content = content.replace('</body>', `
<script>
  var toggle = document.getElementById('theme-toggle');
  if (toggle) {
    toggle.addEventListener('click', function () {
      var current = document.documentElement.getAttribute('data-theme') || 'light';
      var next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    });
  }
</script>
</body>`);
  }

  fs.writeFileSync(filePath, content, 'utf8');
}

console.log("Done");