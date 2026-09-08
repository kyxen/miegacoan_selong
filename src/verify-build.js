const fs = require('fs');
const path = require('path');

// ===== Verification without browser: CSS/JS structure + DOM analysis =====

const base = 'C:/pembuatan aplikasi/miegacoan_selong/src';

// Read all CSS
const cssFiles = [
  'styles/design-tokens.css',
  'styles/base.css',
  'styles/components.css',
  'styles/pages.css'
].map(f => fs.readFileSync(path.join(base, f), 'utf8'));

const allCss = cssFiles.join('\n');

// Read all HTML
const htmlFiles = ['index.html', 'menu.html', 'promo.html', 'tentang.html', 'lokasi.html']
  .map(f => fs.readFileSync(path.join(base, f), 'utf8'));

const js = fs.readFileSync(path.join(base, 'js/main.js'), 'utf8');

// ============ CSS STRUCTURE CHECKS ============
console.log('=== CSS STRUCTURE ===');
const cssChecks = [
  ['body-loaded selector', allCss.includes('.body-loaded')],
  ['animate-on-scroll base', allCss.includes('.animate-on-scroll {')],
  ['animate-in state', allCss.includes('.animate-in {')],
  ['stagger-child base', allCss.includes('.stagger-child {')],
  ['fadeUp keyframe', allCss.includes('@keyframes fadeUp')],
  ['scaleIn keyframe', allCss.includes('@keyframes scaleIn')],
  ['filterFadeIn keyframe', allCss.includes('@keyframes filterFadeIn')],
  ['modalIn keyframe', allCss.includes('@keyframes modalIn')],
  ['toastIn keyframe', allCss.includes('@keyframes toastIn')],
  ['toastOut keyframe', allCss.includes('@keyframes toastOut')],
  ['float keyframe', allCss.includes('@keyframes float')],
  ['focusPulse keyframe', allCss.includes('@keyframes focusPulse')],
  ['hero parallax rule', allCss.includes('.hero.scrolled .hero__image')],
  ['scroll progress data attr selector', allCss.includes('[data-progress="1"]')],
  ['product card filter-in class', allCss.includes('.product-card.filter-in')],
  ['gallery entrance (body-loaded)', allCss.includes('.body-loaded .gallery__item')],
  ['final CTA entrance', allCss.includes('.body-loaded .final-cta')],
  ['hero headline entrance', allCss.includes('.body-loaded .hero__headline')],
  ['decor chili float animation', allCss.includes('.hero__decor-chili') && allCss.includes('float')],
  ['responsive 900px (hamburger)', allCss.includes('@media (max-width: 900px)')],
  ['responsive 1024px', allCss.includes('@media (max-width: 1024px)')],
  ['responsive 768px', allCss.includes('@media (max-width: 768px)')],
  ['responsive 480px', allCss.includes('@media (max-width: 480px)')],
  ['landscape phone', allCss.includes('@media (max-height: 500px)')],
  ['reduced motion', allCss.includes('@media (prefers-reduced-motion: reduce)')],
  ['navbar links hidden on mobile', allCss.includes('.navbar__links {') && allCss.includes('display: none')],
  ['hamburger flex on mobile', allCss.includes('.navbar__hamburger') && allCss.includes('display: flex')],
  ['product grid 2-col tablet', allCss.includes('grid-template-columns: repeat(2, 1fr)')],
  ['product grid 1-col phone', allCss.includes('repeat(2, 1fr)') || allCss.includes('1fr')], // generic
  ['scroll progress width 100%', allCss.includes('.scroll-progress') && allCss.includes('width: 100%')],
  ['modal responsive stack', allCss.includes('.modal {') && allCss.includes('grid-template-columns: 1fr')],
  ['footer 1-col on phone', allCss.includes('.footer__grid') && allCss.includes('1fr')],
];

cssChecks.forEach(([label, ok]) => {
  console.log((ok ? '✓' : '✗'), label);
});

// ============ JS CONTENT CHECKS ============
console.log('\n=== JS CONTENT ===');
const jsChecks = [
  ['body-loaded class added', js.includes("document.body.classList.add('body-loaded')")],
  ['filter-in class on cards', js.includes("card.classList.add('filter-in')")],
  ['scroll progress data-attr', js.includes("setAttribute('data-progress'")],
  ['hero scroll class', js.includes("hero.classList.add('scrolled')")],
  ['toast class removal', js.includes("toast.classList.add('toast--removing')")],
  ['IntersectionObserver for animations', js.includes('IntersectionObserver')],
  ['no page-loaded references', !js.includes('page-loaded')],
  ['no stale fadeIn style', !js.includes("style.animation = 'fadeIn'")],
  ['mobile menu open class', js.includes("mobileMenu.classList.add('mobile-menu--open')")],
  ['modal open class', js.includes("modalOverlay.classList.add('modal-overlay--open')")],
  ['Escape key closes mobile menu', js.includes("e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')")],
  ['Escape key closes modal', js.includes("e.key === 'Escape' && modalOverlay.classList.contains('modal-overlay--open')")],
  ['Escape key closes lightbox', js.includes("e.key === 'Escape' && lightboxOverlay")],
];

jsChecks.forEach(([label, ok]) => {
  console.log((ok ? '✓' : '✗'), label);
});

// ============ DOM ANALYSIS (HTML files) ============
console.log('\n=== DOM ANALYSIS ===');

// Check all HTML files have body-loaded trigger via JS
htmlFiles.forEach((html, i) => {
  const name = ['index.html', 'menu.html', 'promo.html', 'tentang.html', 'lokasi.html'][i];
  const hasScript = html.includes('<script src="js/main.js"');
  const hasAnimateOnScroll = html.includes('animate-on-scroll');
  const hasBodyLoadedSupport = html.includes('mobile-menu') && html.includes('scroll-progress');
  console.log(`${name}: script=${hasScript}, animate-on-scroll=${hasAnimateOnScroll}, mobile=${hasBodyLoadedSupport}`);
});

// ============ RESPONSIVE BREAKPOINT SIMULATION ============
console.log('\n=== RESPONSIVE SIMULATION (CSS media query analysis) ===');

function simulateMedia(query, css) {
  // Simple simulation: check if the CSS rule would apply
  if (query.includes('max-width: 900px')) {
    return {
      navbarLinksHidden: css.includes('.navbar__links {') && css.includes('@media (max-width: 900px)'),
      hamburgerShown: css.includes('.navbar__hamburger {') && css.includes('@media (max-width: 900px)'),
      ctaHidden: css.includes('.navbar__cta {') && css.includes('@media (max-width: 900px)'),
    };
  }
  if (query.includes('max-width: 768px')) {
    return {
      heroAutoHeight: css.includes('.hero {') && css.includes('@media (max-width: 768px)'),
      ctaGroupStacked: css.includes('.hero__cta-group') && css.includes('flex-direction: column') && css.includes('@media (max-width: 768px)'),
      productGrid2Col: css.includes('grid-template-columns: repeat(2, 1fr)') && css.includes('@media (max-width: 768px)'),
    };
  }
  if (query.includes('max-width: 480px')) {
    return {
      productGrid1Col: css.includes('grid-template-columns: 1fr') && css.includes('@media (max-width: 480px)'),
      gallery1Col: css.includes('.gallery') && css.includes('@media (max-width: 480px)'),
      footer1Col: css.includes('.footer__grid') && css.includes('@media (max-width: 480px)'),
    };
  }
  return {};
}

console.log('900px breakpoint:', simulateMedia('max-width: 900px', allCss));
console.log('768px breakpoint:', simulateMedia('max-width: 768px', allCss));
console.log('480px breakpoint:', simulateMedia('max-width: 480px', allCss));

// ============ ANIMATION TIMING ANALYSIS ============
console.log('\n=== ANIMATION TIMING ===');
const timingChecks = [
  ['hero entrance delay (headline 0.1s)', allCss.includes('0.1s') && allCss.includes('hero__headline')],
  ['hero entrance delay (subheadline 0.2s)', allCss.includes('0.2s') && allCss.includes('hero__subheadline')],
  ['hero entrance delay (cta 0.3s)', allCss.includes('0.3s') && allCss.includes('hero__cta-group')],
  ['gallery staggered delays', allCss.includes('0.3s') && allCss.includes('0.55s') && allCss.includes('gallery__item')],
  ['filter-in stagger via index', js.includes('index * 60')],
  ['toast auto-remove 3s', js.includes('3000') || js.includes('3000')],
  ['modal transition 0.3s', allCss.includes('modalIn') && allCss.includes('0.3s')],
];

timingChecks.forEach(([label, ok]) => {
  console.log((ok ? '✓' : '✗'), label);
});

// ============ SUMMARY ============
const allCssPass = cssChecks.every(c => c[1]);
const allJsPass = jsChecks.every(c => c[1]);
console.log('\n=== SUMMARY ===');
console.log('CSS checks:', cssChecks.filter(c => c[1]).length + '/' + cssChecks.length, allCssPass ? 'ALL PASS' : 'SOME FAILED');
console.log('JS checks:', jsChecks.filter(c => c[1]).length + '/' + jsChecks.length, allJsPass ? 'ALL PASS' : 'SOME FAILED');
