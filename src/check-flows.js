const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  const base = 'file:///C:/pembuatan%20aplikasi/miegacoan_selong/src/';

  // ---- Load homepage ----
  await page.goto(base + 'index.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);

  const bodyClass = await page.evaluate(() => document.body.className);
  console.log('body class:', JSON.stringify(bodyClass));
  const hasBodyLoaded = await page.evaluate(() => document.body.classList.contains('body-loaded'));
  console.log('has body-loaded:', hasBodyLoaded);

  // ---- Hero entrance animations ----
  const headline = await page.evaluate(() => {
    const h = document.querySelector('.hero__headline');
    return {
      anim: window.getComputedStyle(h).animationName,
      opacity: window.getComputedStyle(h).opacity
    };
  });
  console.log('hero headline anim:', headline);

  const decor = await page.evaluate(() => {
    const d = document.querySelector('.hero__decor-chili');
    return {
      anim: d ? window.getComputedStyle(d).animationName : 'missing',
      animDuration: d ? window.getComputedStyle(d).animationDuration : 'missing'
    };
  });
  console.log('decor chili anim:', decor);

  // ---- Gallery entrance ----
  const gallery = await page.evaluate(() => {
    const items = document.querySelectorAll('.gallery__item');
    return Array.from(items).map((it, i) => ({
      i,
      anim: window.getComputedStyle(it).animationName,
      delay: window.getComputedStyle(it).animationDelay
    }));
  });
  console.log('gallery items:', gallery);

  // ---- Scroll progress ----
  await page.evaluate(() => window.scrollTo(0, 500));
  await page.waitForTimeout(200);
  const sp = await page.evaluate(() => {
    const el = document.querySelector('.scroll-progress');
    const after = window.getComputedStyle(el, '::after');
    return {
      hasAttr: el.hasAttribute('data-progress'),
      val: el.getAttribute('data-progress'),
      afterScaleX: after.transform
    };
  });
  console.log('scroll progress:', JSON.stringify(sp));

  // ---- Mobile nav ----
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(200);
  const mobileNav = await page.evaluate(() => {
    return {
      linksDisplay: window.getComputedStyle(document.querySelector('.navbar__links')).display,
      hamburgerDisplay: window.getComputedStyle(document.querySelector('.navbar__hamburger')).display,
      ctaDisplay: window.getComputedStyle(document.querySelector('.navbar__cta')).display,
      productGridCols: window.getComputedStyle(document.querySelector('.product-grid')).gridTemplateColumns,
      galleryCols: window.getComputedStyle(document.querySelector('.gallery--home')).gridTemplateColumns,
    };
  });
  console.log('mobile nav:', JSON.stringify(mobileNav));

  // ---- Tablet nav ----
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.waitForTimeout(200);
  const tabletNav = await page.evaluate(() => {
    return {
      footerCols: window.getComputedStyle(document.querySelector('.footer__grid')).gridTemplateColumns,
      galleryHomeCols: window.getComputedStyle(document.querySelector('.gallery--home')).gridTemplateColumns,
    };
  });
  console.log('tablet nav:', JSON.stringify(tabletNav));

  // ---- Hamburger menu open/close ----
  await page.setViewportSize({ width: 375, height: 812 });
  await page.waitForTimeout(200);
  await page.click('.navbar__hamburger');
  await page.waitForTimeout(400);
  const menuOpen = await page.evaluate(() => document.querySelector('.mobile-menu').classList.contains('mobile-menu--open'));
  console.log('hamburger menu open:', menuOpen);
  const bodyOverflow = await page.evaluate(() => document.body.style.overflow);
  console.log('body overflow locked:', bodyOverflow === 'hidden');
  await page.click('.mobile-menu__close');
  await page.waitForTimeout(400);
  const menuClosed = await page.evaluate(() => !document.querySelector('.mobile-menu').classList.contains('mobile-menu--open'));
  console.log('hamburger menu closed:', menuClosed);

  // ---- Category filter ----
  await page.goto(base + 'index.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  await page.click('.category-tab[data-category="mie"]');
  await page.waitForTimeout(500);
  const filterState = await page.evaluate(() => {
    const cards = document.querySelectorAll('.product-card');
    const visible = [];
    cards.forEach(c => {
      if (c.style.display !== 'none') {
        visible.push({
          name: c.querySelector('.product-card__name').textContent,
          hasFilterIn: c.classList.contains('filter-in')
        });
      }
    });
    return { visibleCount: visible.length, items: visible };
  });
  console.log('after Mie filter:', JSON.stringify(filterState));

  // ---- Product modal ----
  await page.goto(base + 'index.html');
  await page.waitForLoadState('domcontentloaded');
  await page.waitForTimeout(1500);
  await page.click('.product-card:first-child');
  await page.waitForTimeout(500);
  const modalState = await page.evaluate(() => {
    const overlay = document.querySelector('.modal-overlay');
    const name = document.querySelector('.modal__name').textContent;
    const bodyOverflow = document.body.style.overflow;
    return {
      open: overlay.classList.contains('modal-overlay--open'),
      bodyLocked: bodyOverflow === 'hidden',
      name
    };
  });
  console.log('modal open:', JSON.stringify(modalState));

  await page.click('.modal__close');
  await page.waitForTimeout(400);
  const modalClosed = await page.evaluate(() => !document.querySelector('.modal-overlay').classList.contains('modal-overlay--open'));
  console.log('modal closed:', modalClosed);

  await browser.close();
  console.log('\n✓ All flow checks passed');
})().catch(e => {
  console.error('✗ Error:', e.message);
  process.exit(1);
});
