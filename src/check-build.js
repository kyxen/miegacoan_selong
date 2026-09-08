const fs = require('fs');

// JS syntax check via Node's native parser
const jsPath = 'src/js/main.js';
const js = fs.readFileSync(jsPath, 'utf8');
const nodeResult = require('child_process').spawnSync('node', ['--check', jsPath], { encoding: 'utf8' });
if (nodeResult.status === 0) console.log('✓ JS syntax (main.js): OK');
else { console.log('✗ JS syntax error:', nodeResult.stderr); process.exit(1); }

// CSS brace balance check
function checkBraces(content, label) {
  let depth = 0, errors = [], inString = false, stringChar = '';
  for (let i = 0; i < content.length; i++) {
    const c = content[i], prev = i > 0 ? content[i-1] : '';
    if (inString) { if (c === stringChar && prev !== '\\') inString = false; continue; }
    if (c === '"' || c === "'" || c === '`') { inString = true; stringChar = c; continue; }
    if (c === '{') depth++;
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
  'src/styles/design-tokens.css',
  'src/styles/base.css',
  'src/styles/components.css',
  'src/styles/pages.css'
];

files.forEach(f => {
  const css = fs.readFileSync(f, 'utf8');
  checkBraces(css, f);
});

// Verify key CSS rules exist
const combined = files.map(f => fs.readFileSync(f, 'utf8')).join('\n');

const checks = [
  ['animate-in class for GSAP reveal', '.animate-in'],
  ['animate-on-scroll base hidden', '.animate-on-scroll'],
  ['stagger-child base hidden', '.stagger-child'],
  ['filter-in class for GSAP filter', '.product-card.filter-in'],
  ['modal entrance animation', '.modal-overlay--open .modal'],
  ['lightbox image animation', '.lightbox--open .lightbox__image'],
  ['toast base styles', '.toast'],
  ['toast removing class', '.toast--removing'],
  ['hero scrolled parallax', '.hero.scrolled'],
  ['scroll progress CSS var', 'var(--progress, 0)'],
  ['scroll progress transition', 'transition: transform 0.08s'],
  ['hero__decor-chili float animation', '.hero__decor-chili'],
  ['product card filter-in keyframe', '@keyframes filterFadeIn'],
  ['modalIn keyframe', '@keyframes modalIn'],
  ['toastIn keyframe', '@keyframes toastIn'],
  ['toastOut keyframe', '@keyframes toastOut'],
  ['float keyframe', '@keyframes float'],
  ['focusPulse keyframe', '@keyframes focusPulse'],
  ['responsive 1024', '@media (max-width: 1024px)'],
  ['responsive 768', '@media (max-width: 768px)'],
  ['responsive 480', '@media (max-width: 480px)'],
  ['landscape phone', '@media (max-height: 500px)'],
  ['reduced motion', '@media (prefers-reduced-motion: reduce)'],
  ['promo hero styles', '.promo-hero'],
];

console.log('\n--- CSS rule checks ---');
checks.forEach(([label, selector]) => {
  if (combined.includes(selector)) console.log('✓', label);
  else console.log('✗ MISSING:', label);
});

// JS content checks - GSAP/Lenis architecture
console.log('\n--- JS content checks ---');
const jsChecks = [
  ['gsap import', "import { gsap } from 'gsap'"],
  ['ScrollTrigger import', "import { ScrollTrigger } from 'gsap/ScrollTrigger'"],
  ['Lenis import', "import Lenis from 'lenis'"],
  ['registerPlugin ScrollTrigger', 'gsap.registerPlugin(ScrollTrigger)'],
  ['Lenis instantiation', 'new Lenis({'],
  ['gsap.ticker add lenis raf', 'gsap.ticker.add'],
  ['lenis.raf', 'lenis.raf'],
  ['ScrollTrigger.update in lenis onScroll', 'ScrollTrigger.update()'],
  ['entrance timeline', 'entranceTL = gsap.timeline'],
  ['entranceTL.play', 'entranceTL.play()'],
  ['buildEntranceTimeline', 'function buildEntranceTimeline'],
  ['buildScrollRevealAnimations', 'function buildScrollRevealAnimations'],
  ['ScrollTrigger.create for reveal', 'ScrollTrigger.create({'],
  ['hero parallax ScrollTrigger', 'ScrollTrigger.create({'],
  ['filterProducts GSAP fromTo', 'gsap.fromTo('],
  ['filterProducts stagger', 'stagger: { each'],
  ['scroll progress setProperty', "style.setProperty('--progress'"],
  ['final CTA GSAP fromTo with scrollTrigger', 'scrollTrigger: {'],
  ['lenis destroy on page hide', 'lenis.destroy()'],
  ['stopLenis wired to visibilitychange', "visibilitychange"],
  ['setupLenis called in init', 'setupLenis()'],
  ['promo parallax wired', "setupHeroParallax"],
  ['DOMContentLoaded init', "DOMContentLoaded', init"],
];

jsChecks.forEach(([label, snippet]) => {
  if (js.includes(snippet)) console.log('✓', label);
  else console.log('✗ MISSING:', label);
});

// Anti-checks: things that should NOT be present
console.log('\n--- Anti-checks (should be ABSENT) ---');
const antiChecks = [
  ['body-loaded CSS class', '.body-loaded'],
  ['page-loaded CSS class', '.page-loaded'],
  ['page-loaded JS', 'page-loaded'],
  ['IntersectionObserver for animations', 'IntersectionObserver for animations'],
  ['data-progress="1" CSS selector', '[data-progress="1"]'],
  ['body.classList.add body-loaded', "classList.add('body-loaded')"],
  ['fadeIn JS function (old)', 'fadeIn('],
  ['scroll listener added outside Lenis setup', 'window.addEventListener(\'scroll\''],
];

antiChecks.forEach(([label, snippet]) => {
  if (!js.includes(snippet) && !combined.includes(snippet)) console.log('✓ ABSENT:', label);
  else console.log('✗ STILL PRESENT:', label, '->', snippet);
});

console.log('\n✓ Build verification complete');
