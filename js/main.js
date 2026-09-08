/* ========== Mie Gacoan Lombok Selong — Main JS (GSAP + Lenis) ========== */

import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ========== DOM Elements ========== */
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.navbar__hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const modalOverlay = document.querySelector('.modal-overlay');
const modalCloseBtn = document.querySelector('.modal__close');
const lightboxOverlay = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox__image');
const lightboxClose = document.querySelector('.lightbox__close');
const galleryItems = document.querySelectorAll('.gallery__item');
const scrollProgress = document.querySelector('.scroll-progress');
const whatsappBtns = document.querySelectorAll('[data-whatsapp]');

/* ========== Toast Container — use existing DOM element, don't create a duplicate ========== */
const toastContainer = document.getElementById('toast-container') || (() => {
  const el = document.createElement('div');
  el.id = 'toast-container';
  document.body.appendChild(el);
  return el;
})();

/* Style the toast container once */
toastContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:200;pointer-events:none;';

/* ========== STATE ========== */
let currentCategory = 'semua';
let currentSearch = '';
let selectedProduct = null;
let menuData = { categories: [], products: [] };
const entranceTL = gsap.timeline({ delay: 0.12, paused: true });
const scrollRevealTweens = [];

/* ========== INIT ========== */
function init() {
  setupLenis();
  setupScrollProgress();
  setupNavbar();
  setupMobileMenu();
  setupModal();
  setupLightbox();
  setupWhatsApp();
  setupResponsiveImages();
  setupQuantitySelectors();
  setupSearch();

  buildEntranceTimeline();
  buildScrollRevealAnimations();
  setupHeroParallax();
  setupFinalCtaReveal();
  setupResizeHandling();

  fetchMenuData();
}

/* ========== NAVBAR & HERO SCROLL CLASSES ========== */
function updateNavbarScrollClass() {
  if (!navbar) return;
  if (window.scrollY > 80) navbar.classList.add('navbar--scrolled');
  else navbar.classList.remove('navbar--scrolled');
}

function updateHeroScrollClass() {
  const hero = document.querySelector('.hero');
  if (!hero) return;
  if (window.scrollY > 60) hero.classList.add('scrolled');
  else hero.classList.remove('scrolled');
}

/* ========== NAVBAR ========== */
function setupNavbar() {
  // Navbar scroll state dikendalikan oleh updateNavbarScrollClass()
  // yang dipanggil dari lenis.on('scroll'). Tidak ada inisialisasi
  // satu kali yang diperlukan di sini.
}

/* ========== MOBILE MENU ========== */
function setupMobileMenu() {
  if (!mobileMenuBtn || !mobileMenu || !mobileMenuClose) return;

  mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.add('mobile-menu--open');
    document.body.style.overflow = 'hidden';
    mobileMenuBtn.setAttribute('aria-expanded', 'true');
  });

  mobileMenuClose.addEventListener('click', closeMobileMenu);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileMenu.classList.contains('mobile-menu--open')) {
      closeMobileMenu();
    }
  });

  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove('mobile-menu--open');
  document.body.style.overflow = '';
  mobileMenuBtn?.setAttribute('aria-expanded', 'false');
}

/* ========== SEARCH ========== */
function setupSearch() {
  const searchInput = document.querySelector('#menu-search');
  if (!searchInput) return;

  searchInput.addEventListener('input', (e) => {
    currentSearch = e.target.value.trim().toLowerCase();
    renderMenuPreview();
  });
}

/* ========== SETUP BEST SELLER CARDS (hardcoded HTML + JSON data) ========== */
function setupBestSellerCards() {
  document.querySelectorAll('.best-seller .product-card[data-product-id]').forEach(card => {
    // Remove old listeners by cloning (safest approach to avoid duplicates)
    const newCard = card.cloneNode(true);
    card.parentNode.replaceChild(newCard, card);

    newCard.addEventListener('click', (e) => {
      if (e.target.closest('.product-card__cta')) return;
      const productId = newCard.dataset.productId;
      if (productId) loadProductModal(productId);
    });

    newCard.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const productId = newCard.dataset.productId;
        if (productId) loadProductModal(productId);
      }
    });
  });
}

/* ========== FETCH MENU DATA ========== */
async function fetchMenuData() {
  try {
    let response;
    try {
      response = await fetch('data/menu.json');
      if (!response.ok) throw new Error();
    } catch {
      response = await fetch('./data/menu.json');
    }
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    menuData = await response.json();
    // Setelah data tersedia, render menu preview dari JSON
    renderMenuPreview();
    // Re-setup category tabs dari data JSON
    setupCategoryTabsFromData();
    // Setup best-seller cards click handler
    setupBestSellerCards();
  } catch (error) {
    console.error('Failed to load menu data:', error);
    // Jika gagal, fallback ke produk hardcoded yang sudah ada di HTML
    setupCategoryTabsFromDOM();
  }
}

/* ========== CATEGORY TABS (dari data JSON) ========== */
function setupCategoryTabsFromData() {
  const tabsContainer = document.querySelector('.category-tabs');
  if (!tabsContainer || !menuData.categories?.length) {
    setupCategoryTabsFromDOM();
    return;
  }

  // Rebuild tabs dari data JSON
  tabsContainer.innerHTML = '';
  menuData.categories.forEach((cat, i) => {
    const btn = document.createElement('button');
    btn.className = 'category-tab' + (i === 0 ? ' category-tab--active' : '');
    btn.dataset.category = cat.id;
    btn.setAttribute('role', 'tab');
    btn.setAttribute('aria-selected', i === 0 ? 'true' : 'false');
    btn.textContent = cat.name;
    tabsContainer.appendChild(btn);
  });

  attachCategoryTabListeners();
}

function setupCategoryTabsFromDOM() {
  attachCategoryTabListeners();
}

function attachCategoryTabListeners() {
  const tabs = document.querySelectorAll('.category-tab');
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => {
        t.classList.remove('category-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('category-tab--active');
      tab.setAttribute('aria-selected', 'true');
      currentCategory = tab.dataset.category;
      renderMenuPreview();
    });
  });
}

/* ========== RENDER MENU PREVIEW (dari JSON) ========== */
function renderMenuPreview() {
  const grid = document.querySelector('#menu-preview-grid') ||
    document.querySelector('.menu-preview .product-grid');
  if (!grid || !menuData.products?.length) return;

  // Filter berdasarkan category dan search
  const filtered = menuData.products.filter(product => {
    const matchCategory = currentCategory === 'semua' || product.category === currentCategory;
    const matchSearch = !currentSearch ||
      product.name.toLowerCase().includes(currentSearch) ||
      product.description?.toLowerCase().includes(currentSearch);
    return matchCategory && matchSearch;
  });

  // Clear grid
  grid.innerHTML = '';

  if (!filtered.length) {
    grid.innerHTML = `
      <div class="menu-empty" style="
        grid-column: 1/-1;
        text-align: center;
        padding: var(--space-10) var(--space-4);
        color: var(--color-secondary-light);
      ">
        <div style="font-size:3rem;margin-bottom:var(--space-4);">🍜</div>
        <p style="font-size:var(--type-lg);font-weight:var(--weight-semibold);">Menu tidak ditemukan</p>
        <p style="margin-top:var(--space-2);font-size:var(--type-sm);">Coba kata kunci atau kategori lain.</p>
      </div>
    `;
    return;
  }

  // Emoji fallback berdasarkan kategori
  const emojiMap = {
    mie: ['🍜', '🔥', '🍲'],
    dimsum: ['🥟', '🥡', '🍢'],
    minuman: ['🥤', '🍹', '🧋'],
    paket: ['🍱', '🎯', '🎉'],
  };
  const gradientMap = {
    mie: ['linear-gradient(135deg,#C5413C 0%,#E88B6E 100%)', 'linear-gradient(135deg,#D66B5F 0%,#C5413C 100%)', 'linear-gradient(135deg,#E88B6E 0%,#F4B8A0 100%)'],
    dimsum: ['linear-gradient(135deg,#F4B8A0 0%,#E88B6E 100%)', 'linear-gradient(135deg,#E88B6E 0%,#D66B5F 100%)', 'linear-gradient(135deg,#F4B8A0 0%,#FBD4C2 100%)'],
    minuman: ['linear-gradient(135deg,#4299E1 0%,#63B3ED 100%)', 'linear-gradient(135deg,#38A169 0%,#68D391 100%)', 'linear-gradient(135deg,#9F7AEA 0%,#B794F4 100%)'],
    paket: ['linear-gradient(135deg,#2D3436 0%,#4A5568 100%)', 'linear-gradient(135deg,#C5413C 0%,#2D3436 100%)', 'linear-gradient(135deg,#E88B6E 0%,#C5413C 100%)'],
  };

  filtered.forEach((product, index) => {
    const catEmojis = emojiMap[product.category] || ['🍽️'];
    const catGrads = gradientMap[product.category] || ['linear-gradient(135deg,#E8E0D8 0%,#F0E8E0 100%)'];
    const emoji = catEmojis[index % catEmojis.length];
    const gradient = catGrads[index % catGrads.length];

    const card = document.createElement('article');
    card.className = 'product-card';
    card.dataset.productId = product.id;
    card.setAttribute('tabindex', '0');
    card.setAttribute('aria-label', `${product.name}${product.badge ? ' — ' + product.badge : ''}`);

    card.innerHTML = `
      <div class="product-card__image">
        <div class="placeholder-image placeholder-image--card" style="background:${gradient};">${emoji}</div>
        ${product.badge ? `<span class="product-card__badge">${product.badge}</span>` : ''}
      </div>
      <div class="product-card__content" style="padding:var(--space-4);">
        <span class="product-card__category">${product.category}</span>
        <h3 class="product-card__name">${product.name}</h3>
        <p class="product-card__description">${product.description || ''}</p>
        <div class="product-card__footer">
          <span class="product-card__price">${product.price}</span>
          <button class="btn btn--ghost btn--sm product-card__cta">Pesan</button>
        </div>
      </div>
    `;

    // Click handler
    card.addEventListener('click', (e) => {
      if (e.target.closest('.product-card__cta')) return;
      loadProductModal(product.id);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        loadProductModal(product.id);
      }
    });

    grid.appendChild(card);
  });

  // GSAP stagger animation untuk cards yang baru dirender
  const cards = grid.querySelectorAll('.product-card');
  if (cards.length) {
    gsap.fromTo(
      cards,
      { opacity: 0, y: 28, scale: 0.96 },
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.5,
        ease: 'back.out(1.4)',
        stagger: { each: 0.07, from: 'start' },
        overwrite: 'auto',
      }
    );
  }
}

/* ========== MODAL ========== */
function setupModal() {
  if (!modalCloseBtn || !modalOverlay) return;

  modalCloseBtn.addEventListener('click', closeModal);
  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalOverlay.classList.contains('modal-overlay--open')) {
      closeModal();
    }
  });

  const whatsappModalBtn = modalOverlay?.querySelector('.btn-whatsapp-modal');
  if (whatsappModalBtn) {
    whatsappModalBtn.addEventListener('click', sendToWhatsApp);
  }
}

function loadProductModal(productId) {
  const product = menuData.products?.find(p => p.id === productId);
  if (!product) return;

  selectedProduct = product;
  renderProductModal(product);

  // GSAP modal entrance
  const modal = modalOverlay.querySelector('.modal');
  gsap.set(modal, { scale: 0.9, y: 20, opacity: 0 });
  modalOverlay.classList.add('modal-overlay--open');
  document.body.style.overflow = 'hidden';

  gsap.to(modal, {
    scale: 1,
    y: 0,
    opacity: 1,
    duration: 0.45,
    ease: 'back.out(1.4)',
    overwrite: 'auto',
  });

  modalCloseBtn?.focus();
}

function renderProductModal(product) {
  const modalBody = document.querySelector('.modal__body');
  const modalImage = document.querySelector('.modal__image');
  const modalName = document.querySelector('.modal__name');
  const modalDescription = document.querySelector('.modal__description');
  const modalPrice = document.querySelector('.modal__price');
  const levelSelector = document.querySelector('.level-selector');
  const quantityValue = document.querySelector('.quantity-value');
  const whatsappBtn = document.querySelector('.btn-whatsapp-modal');

  if (!modalBody) return;

  // Emoji fallback berdasarkan kategori
  const emojiMap = { mie: '🍜', dimsum: '🥟', minuman: '🥤', paket: '🍱' };
  const gradMap = {
    mie: 'linear-gradient(135deg,#C5413C 0%,#E88B6E 100%)',
    dimsum: 'linear-gradient(135deg,#F4B8A0 0%,#E88B6E 100%)',
    minuman: 'linear-gradient(135deg,#4299E1 0%,#63B3ED 100%)',
    paket: 'linear-gradient(135deg,#2D3436 0%,#4A5568 100%)',
  };

  modalImage.innerHTML = `
    <div class="placeholder-image" style="
      background:${gradMap[product.category] || '#E8E0D8'};
      aspect-ratio:1;
      font-size:5rem;
      border-radius:var(--radius-xl) 0 0 var(--radius-xl);
    ">${emojiMap[product.category] || '🍽️'}</div>
  `;

  modalName.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;

  if (quantityValue) quantityValue.textContent = '1';

  const qMinus = document.querySelector('.quantity-minus');
  const qPlus = document.querySelector('.quantity-plus');
  if (qMinus) qMinus.disabled = true;
  if (qPlus) qPlus.disabled = false;

  if (levelSelector) {
    levelSelector.innerHTML = '';
    if (product.levels && product.levels.length > 0) {
      product.levels.forEach((level, index) => {
        const pill = document.createElement('button');
        pill.className = 'level-pill';
        pill.dataset.level = level;
        pill.textContent = level;
        if (index === 0) pill.classList.add('level-pill--active');

        pill.addEventListener('click', () => {
          levelSelector.querySelectorAll('.level-pill').forEach(p => p.classList.remove('level-pill--active'));
          pill.classList.add('level-pill--active');
        });

        levelSelector.appendChild(pill);
      });
    } else {
      levelSelector.innerHTML = '<span class="muted" style="font-size:var(--type-sm);">Tidak ada pilihan level</span>';
    }
  }

  if (whatsappBtn) {
    whatsappBtn.onclick = sendToWhatsApp;
  }
}

function closeModal() {
  const modal = modalOverlay?.querySelector('.modal');

  // GSAP modal exit
  if (modal) {
    gsap.to(modal, {
      scale: 0.92,
      y: 16,
      opacity: 0,
      duration: 0.3,
      ease: 'power2.in',
      overwrite: 'auto',
      onComplete: () => {
        modalOverlay.classList.remove('modal-overlay--open');
        document.body.style.overflow = '';
        selectedProduct = null;
        // Reset transform untuk next open
        gsap.set(modal, { clearProps: 'all' });
      },
    });
  } else {
    modalOverlay.classList.remove('modal-overlay--open');
    document.body.style.overflow = '';
    selectedProduct = null;
  }
}

function sendToWhatsApp() {
  const levelSelector = document.querySelector('.level-selector');
  const quantityValue = document.querySelector('.quantity-value');
  const product = selectedProduct;

  const selectedLevel = levelSelector?.querySelector('.level-pill--active')?.dataset.level;
  const quantity = parseInt(quantityValue?.textContent) || 1;

  let message = `Halo Mie Gacoan Selong, saya ingin memesan:\n${quantity}x ${product?.name}`;
  if (selectedLevel) message += ` Level ${selectedLevel}`;
  message += '\n\nTerima kasih.';

  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
  window.open(whatsappUrl, '_blank');
  showToast('Pesanan dikirim ke WhatsApp! 🎉');
  closeModal();
}

/* ========== LIGHTBOX ========== */
function setupLightbox() {
  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const img = item.querySelector('img');
      if (img && lightboxImg && lightboxOverlay) {
        lightboxImg.src = img.src;
        lightboxImg.alt = img.alt;
        lightboxOverlay.classList.add('lightbox--open');
        document.body.style.overflow = 'hidden';
        lightboxClose?.focus();
      }
    });
  });

  if (lightboxClose && lightboxOverlay) {
    lightboxClose.addEventListener('click', () => {
      lightboxOverlay.classList.remove('lightbox--open');
      document.body.style.overflow = '';
    });

    lightboxOverlay.addEventListener('click', (e) => {
      if (e.target === lightboxOverlay) {
        lightboxOverlay.classList.remove('lightbox--open');
        document.body.style.overflow = '';
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && lightboxOverlay?.classList.contains('lightbox--open')) {
      lightboxOverlay.classList.remove('lightbox--open');
      document.body.style.overflow = '';
    }
  });
}

/* ========== WHATSAPP BUTTONS ========== */
function setupWhatsApp() {
  whatsappBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const message = btn.dataset.message || 'Halo Mie Gacoan Selong, saya ingin memesan makanan.';
      const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;
      window.open(whatsappUrl, '_blank');
      showToast('Buka WhatsApp...');
    });
  });
}

/* ========== LENIS SMOOTH SCROLL ========== */
let lenis = null;
let lenisRafCallback = null;

function setupLenis() {
  if (typeof Lenis === 'undefined') return;
  if (lenis) return; // Jangan double initialize

  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
  });

  lenisRafCallback = (time) => lenis.raf(time * 1000);
  gsap.ticker.add(lenisRafCallback);
  gsap.ticker.lagSmoothing(0);

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    updateScrollProgress();
    updateNavbarScrollClass();
    updateHeroScrollClass();
  });
}

function stopLenis() {
  if (!lenis) return;
  if (lenisRafCallback) {
    gsap.ticker.remove(lenisRafCallback);
    lenisRafCallback = null;
  }
  lenis.destroy();
  lenis = null;
}

/* ========== SCROLL PROGRESS (GSAP) ========== */
function updateScrollProgress() {
  if (!scrollProgress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? window.scrollY / max : 0;
  scrollProgress.style.setProperty('--progress', String(Math.max(0, Math.min(1, pct))));
}

function setupScrollProgress() {
  if (!scrollProgress) return;
  updateScrollProgress();
}

/* ========== QUANTITY SELECTORS (Global) ========== */
function setupQuantitySelectors() {
  document.addEventListener('click', (e) => {
    const minusBtn = e.target.closest('.quantity-minus');
    const plusBtn = e.target.closest('.quantity-plus');

    if (minusBtn || plusBtn) {
      const container = (minusBtn || plusBtn).closest('.quantity-selector');
      const valueEl = container?.querySelector('.quantity-value');
      const current = parseInt(valueEl?.textContent) || 1;

      if (minusBtn && current > 1) {
        valueEl.textContent = current - 1;
        minusBtn.disabled = current - 1 <= 1;
        const plus = container.querySelector('.quantity-plus');
        if (plus) plus.disabled = false;
      }

      if (plusBtn && current < 99) {
        valueEl.textContent = current + 1;
        plusBtn.disabled = current + 1 >= 99;
        const minus = container.querySelector('.quantity-minus');
        if (minus) minus.disabled = false;
      }
    }
  });
}

/* ========== RESPONSIVE IMAGES ========== */
function setupResponsiveImages() {
  const images = document.querySelectorAll('img[data-src]');
  if (!images.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, { rootMargin: '50px', threshold: 0.01 });

  images.forEach(img => observer.observe(img));
}

/* ========== GSAP PAGE-LOAD ENTRANCE ========== */
function buildEntranceTimeline() {
  const heroHeadline = document.querySelector('.hero__headline');
  const heroSub = document.querySelector('.hero__subheadline');
  const heroCta = document.querySelector('.hero__cta-group');
  const heroDecor = document.querySelector('.hero__decor-chili');
  const heroImage = document.querySelector('.hero__image');

  if (heroHeadline) {
    entranceTL.fromTo(heroHeadline,
      { opacity: 0, y: 48, clipPath: 'inset(0 0 100% 0)' },
      { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', duration: 0.9, ease: 'power4.out' },
      0
    );
  }
  if (heroSub) {
    entranceTL.fromTo(heroSub,
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.7, ease: 'power3.out' },
      0.18
    );
  }
  if (heroCta) {
    entranceTL.fromTo(heroCta,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.65, ease: 'back.out(1.4)' },
      0.32
    );
  }
  if (heroImage) {
    entranceTL.fromTo(heroImage,
      { opacity: 0, scale: 0.92, x: 40 },
      { opacity: 1, scale: 1, x: 0, duration: 1.0, ease: 'power3.out' },
      0.1
    );
  }
  if (heroDecor) {
    entranceTL.fromTo(heroDecor,
      { opacity: 0, scale: 0.6, rotation: -20 },
      { opacity: 0.12, scale: 1, rotation: 0, duration: 1.2, ease: 'elastic.out(1, 0.6)' },
      0.4
    );
  }

  buildGalleryEntrance();
  entranceTL.play();
}

function buildGalleryEntrance() {
  const items = document.querySelectorAll('.gallery__item');
  if (!items.length) return;

  const gt = gsap.timeline({ delay: 0.55 });
  items.forEach((item, i) => {
    gt.fromTo(item,
      { opacity: 0, scale: 0.88, y: 20 },
      { opacity: 1, scale: 1, y: 0, duration: 0.55, ease: 'back.out(1.7)', overwrite: 'auto' },
      i * 0.09
    );
  });
}

/* ========== GSAP SCROLL REVEAL ========== */
function buildScrollRevealAnimations() {
  const sections = document.querySelectorAll('.animate-on-scroll');
  sections.forEach(section => {
    const children = Array.from(section.children).filter(el => el.nodeType === 1);
    if (!children.length) return;

    const staggerDelay = Math.min(children.length * 0.06, 0.5);

    const tween = gsap.fromTo(
      children,
      { opacity: 0, y: 32 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: 'power3.out',
        stagger: { each: staggerDelay / Math.max(children.length, 1), from: 'random' },
        overwrite: 'auto',
        paused: true,
      }
    );

    ScrollTrigger.create({
      trigger: section,
      start: 'top 92%',
      end: 'top 40%',
      onEnter: () => { if (tween.isActive) tween.kill(); tween.play(); },
      once: true,
      invalidateOnRefresh: true,
    });

    scrollRevealTweens.push(tween);
  });

  // Best seller cards stagger
  const bestSellerCards = document.querySelectorAll('.best-seller .product-card');
  if (bestSellerCards.length) {
    const t = gsap.fromTo(
      bestSellerCards,
      { opacity: 0, y: 40, scale: 0.95 },
      {
        opacity: 1, y: 0, scale: 1,
        duration: 0.6,
        ease: 'back.out(1.4)',
        stagger: 0.1,
        overwrite: 'auto',
        paused: true,
      }
    );
    ScrollTrigger.create({
      trigger: '.best-seller',
      start: 'top 85%',
      onEnter: () => t.play(),
      once: true,
      invalidateOnRefresh: true,
    });
  }

  const staggerContainers = document.querySelectorAll('.stagger-container');
  staggerContainers.forEach(container => {
    const kids = Array.from(container.children).filter(el => el.nodeType === 1);
    if (!kids.length) return;
    const t = gsap.fromTo(
      kids,
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.6,
        ease: 'power2.out',
        stagger: 0.07,
        overwrite: 'auto',
        paused: true,
      }
    );
    ScrollTrigger.create({
      trigger: container,
      start: 'top 90%',
      onEnter: () => { t.play(); },
      once: true,
    });
    scrollRevealTweens.push(t);
  });

  // About section animation
  const aboutLayout = document.querySelector('.about__layout');
  if (aboutLayout) {
    const aboutImg = aboutLayout.querySelector('.about__image');
    const aboutText = aboutLayout.querySelector('.about__image + *') ||
      aboutLayout.querySelector('div:not(.about__image)');

    if (aboutImg) {
      gsap.fromTo(aboutImg,
        { opacity: 0, x: -40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutLayout,
            start: 'top 82%',
            once: true,
          },
        }
      );
    }
    if (aboutText) {
      gsap.fromTo(aboutText,
        { opacity: 0, x: 40 },
        {
          opacity: 1, x: 0, duration: 0.9, ease: 'power3.out',
          scrollTrigger: {
            trigger: aboutLayout,
            start: 'top 82%',
            once: true,
          },
          delay: 0.15,
        }
      );
    }
  }

  // Section headings reveal
  document.querySelectorAll('.section-heading').forEach(heading => {
    const overline = heading.querySelector('.section-heading__overline');
    const title = heading.querySelector('.section-heading__title');
    const subtitle = heading.querySelector('.section-heading__subtitle');

    const els = [overline, title, subtitle].filter(Boolean);
    if (!els.length) return;

    gsap.fromTo(
      els,
      { opacity: 0, y: 24 },
      {
        opacity: 1, y: 0,
        duration: 0.7,
        ease: 'power3.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: heading,
          start: 'top 88%',
          once: true,
        },
      }
    );
  });

  ScrollTrigger.refresh();
}

/* ========== GSAP HERO PARALLAX ========== */
function setupHeroParallax() {
  const heroImage = document.querySelector('.hero__image');
  if (heroImage) {
    ScrollTrigger.create({
      trigger: '.hero',
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => {
        const y = self.progress * 80;
        gsap.set(heroImage, { y });
      },
      invalidateOnRefresh: true,
    });
  }

  const decor = document.querySelector('.hero__decor-chili');
  if (decor) {
    gsap.to(decor, {
      y: -10,
      rotation: 6,
      duration: 3.2,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
      overwrite: 'auto',
    });
  }

  document.querySelectorAll('.promo-card').forEach(card => {
    const bg = card.querySelector('[style*="linear-gradient"], [style*="background:#"]');
    if (!bg) return;
    ScrollTrigger.create({
      trigger: card,
      start: 'top bottom',
      end: 'bottom top',
      onUpdate: (self) => gsap.set(bg, { y: self.progress * 40 }),
      invalidateOnRefresh: true,
    });
  });
}

/* ========== GSAP FINAL CTA REVEAL ========== */
function setupFinalCtaReveal() {
  const cta = document.querySelector('.final-cta');
  if (!cta) return;

  gsap.fromTo(
    cta,
    { opacity: 0, y: 60 },
    {
      opacity: 1,
      y: 0,
      duration: 1.1,
      ease: 'power4.out',
      scrollTrigger: {
        trigger: cta,
        start: 'top 88%',
        toggleActions: 'play none none reverse',
        invalidateOnRefresh: true,
      },
    }
  );
}

/* ========== GLOBAL RESIZE HANDLER ========== */
let resizeDebounce = null;

function setupResizeHandling() {
  window.addEventListener('resize', () => {
    clearTimeout(resizeDebounce);
    resizeDebounce = setTimeout(() => {
      ScrollTrigger.refresh();
      updateScrollProgress();
    }, 180);
  }, { passive: true });

  document.addEventListener('visibilitychange', () => {
    if (document.hidden) stopLenis();
    else setupLenis();
  });
}

/* ========== TOAST SYSTEM ========== */
function showToast(message, type = 'success') {
  // Remove existing toast if any
  const existing = toastContainer.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.setAttribute('role', 'status');
  toast.innerHTML = `
    <div class="toast__icon">${type === 'success' ? '✓' : '!'}</div>
    <div>${message}</div>
  `;

  toastContainer.appendChild(toast);

  // GSAP toast animation
  gsap.fromTo(toast,
    { opacity: 0, y: 20, scale: 0.9 },
    { opacity: 1, y: 0, scale: 1, duration: 0.35, ease: 'back.out(1.7)' }
  );

  setTimeout(() => {
    gsap.to(toast, {
      opacity: 0, y: 10, scale: 0.95, duration: 0.3, ease: 'power2.in',
      onComplete: () => toast.remove(),
    });
  }, 3000);
}

/* ========== INITIALIZE ========== */
document.addEventListener('DOMContentLoaded', init);

/* ========== EXPORTS FOR DEBUGGING ========== */
window.MieGacoan = {
  menuData: () => menuData,
  showToast,
  renderMenuPreview,
};
