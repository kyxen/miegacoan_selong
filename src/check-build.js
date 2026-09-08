const fs = require('fs');

// JS syntax check
const jsPath = 'js/main.js';
const js = fs.readFileSync(jsPath, 'utf8');
try {
  new Function(js);
  console.log('✓ JS syntax (main.js): OK');
} catch(e) {
  console.log('✗ JS syntax error:', e.message);
  process.exit(1);
}

// CSS brace balance check
function checkBraces(content, label) {
  let depth = 0;
  let errors = [];
  let inString = false;
  let stringChar = '';
  for (let i = 0; i < content.length; i++) {
    const c = content[i];
    const prev = i > 0 ? content[i-1] : '';
    if (inString) {
      if (c === stringChar && prev !== '\\') inString = false;
      continue;
    }
    if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; continue; }
    if (c === '{') { depth++; }
    else if (c === '}') {
      depth--;
      if (depth < 0) { errors.push('Extra } at pos ' + i); depth = 0; }
    }
  }
  if (errors.length) console.log('✗ ' + label + ' errors:', errors);
  else if (depth === 0) console.log('✓ ' + label + ' braces: BALANCED');
  else console.log('✗ ' + label + ' braces: UNBALANCED (depth=' + depth + ')');
}

const files = [
  'styles/design-tokens.css',
  'styles/base.css',
  'styles/components.css',
  'styles/pages.css'
];

files.forEach(f => {
  const css = fs.readFileSync(f, 'utf8');
  checkBraces(css, f);
});

// Verify key CSS rules exist
const combined = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');

const checks = [
  ['body-loaded class', '.body-loaded'],
  ['fadeUp keyframe', '@keyframes fadeUp'],
  ['scaleIn keyframe', '@keyframes scaleIn'],
  ['filterFadeIn keyframe', '@keyframes filterFadeIn'],
  ['modalIn keyframe', '@keyframes modalIn'],
  ['toastIn keyframe', '@keyframes toastIn'],
  ['toastOut keyframe', '@keyframes toastOut'],
  ['float keyframe', '@keyframes float'],
  ['focusPulse keyframe', '@keyframes focusPulse'],
  ['navbar__links hidden on mobile', '@media (max-width: 900px)'],
  ['hero parallax', '.hero.scrolled .hero__image'],
  ['scroll progress data attr', '[data-progress="1"]'],
  ['product card filter-in', '.product-card.filter-in'],
  ['gallery entrance', '.body-loaded .gallery__item'],
  ['final CTA entrance', '.body-loaded .final-cta'],
  ['hero entrance', '.body-loaded .hero__headline'],
  ['responsive 1024', '@media (max-width: 1024px)'],
  ['responsive 768', '@media (max-width: 768px)'],
  ['responsive 480', '@media (max-width: 480px)'],
  ['landscape phone', '@media (max-height: 500px)'],
  ['reduced motion', '@media (prefers-reduced-motion: reduce)'],
];

console.log('\n--- CSS rule checks ---');
checks.forEach(([label, selector]) => {
  if (combined.includes(selector)) console.log('✓', label);
  else console.log('✗ MISSING:', label);
});

// JS content checks
console.log('\n--- JS content checks ---');
const jsChecks = [
  ['body-loaded class add', "document.body.classList.add('body-loaded')"],
  ['filter-in class use', "card.classList.add('filter-in')"],
  ['scroll progress data-attr', "setAttribute('data-progress'"],
  ['hero parallax scroll', "hero.classList.add('scrolled')"],
  ['toast class remove', "toast.classList.add('toast--removing')"],
  ['IntersectionObserver', 'IntersectionObserver'],
];
jsChecks.forEach(([label, snippet]) => {
  if (js.includes(snippet)) console.log('✓', label);
  else console.log('✗ MISSING:', label);
});
