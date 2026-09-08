/* ========== Mie Gacoan Lombok Selong — Main JS ========== */

// GSAP + ScrollTrigger + Lenis (bundled via your build step; see note below)
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import Lenis from 'lenis';

gsap.registerPlugin(ScrollTrigger);

/* ========== DOM Elements ========== */
const navbar = document.querySelector('.navbar');
const mobileMenuBtn = document.querySelector('.navbar__hamburger');
const mobileMenu = document.querySelector('.mobile-menu');
const mobileMenuClose = document.querySelector('.mobile-menu__close');
const categoryTabs = document.querySelectorAll('.category-tab');
const productCards = document.querySelectorAll('.product-card');
const modalOverlay = document.querySelector('.modal-overlay');
const modalCloseBtn = document.querySelector('.modal__close');
const lightboxOverlay = document.querySelector('.lightbox');
const lightboxImg = document.querySelector('.lightbox__image');
const lightboxClose = document.querySelector('.lightbox__close');
const galleryItems = document.querySelectorAll('.gallery__item');
const scrollProgress = document.querySelector('.scroll-progress');
const whatsappBtns = document.querySelectorAll('[data-whatsapp]');

/* ========== Toast Container ========== */
const toastContainer = document.createElement('div');
toastContainer.id = 'toast-container';
toastContainer.style.cssText = 'position:fixed;bottom:24px;right:24px;z-index:200;pointer-events:none;';
document.body.appendChild(toastContainer);

/* ========== STATE ========== */
let currentCategory = 'semua';
let selectedProduct = null;
let menuData = { categories: [], products: [] };

/* ========== INIT ========== */
function init() {
  // Smooth scroll first — before ScrollTrigger/gsap animations touch scroll
  setupLenis();
  setupScrollProgress();

  handleScroll();
  setupNavbar();
  setupMobileMenu();
  setupCategoryTabs();
  setupProductCards();
  setupModal();
  setupLightbox();
  setupWhatsApp();
  setupResponsiveImages();
  setupPageLoadAnimations();
  setupQuantitySelectors();

  // Page load entrance timeline (GSAP)
  buildEntranceTimeline();
  buildScrollRevealAnimations();

  // Fetch menu data
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

/* ========== (Fallback) Native scroll listener ========== */
function handleScroll() {
  window.addEventListener('scroll', () => {
    updateNavbarScrollClass();
    updateHeroScrollClass();
  }, { passive: true });
}

function setupNavbar() {
  // Already handled in handleScroll
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

  // Close when clicking outside
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) {
      closeMobileMenu();
    }
  });

  // Close mobile menu when clicking links
  mobileMenu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', closeMobileMenu);
  });
}

function closeMobileMenu() {
  mobileMenu.classList.remove('mobile-menu--open');
  document.body.style.overflow = '';
  mobileMenuBtn?.setAttribute('aria-expanded', 'false');
}

/* ========== CATEGORY TABS ========== */
function setupCategoryTabs() {
  categoryTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      categoryTabs.forEach(t => {
        t.classList.remove('category-tab--active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('category-tab--active');
      tab.setAttribute('aria-selected', 'true');

      currentCategory = tab.dataset.category;
      filterProducts();
    });
  });
}

/* ========== PRODUCT CARDS ========== */
function setupProductCards() {
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      // Don't open modal if clicking on CTA button
      if (e.target.closest('.product-card__cta')) return;
      const productId = card.dataset.productId;
      if (productId) loadProductModal(productId);
    });

    card.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const productId = card.dataset.productId;
        if (productId) loadProductModal(productId);
      }
    });
  });
}

/* ========== PRODUCT FILTERING ========== */
function filterProducts() {
  const grid = document.querySelector('.product-grid');
  if (!grid) return;

  const cards = grid.querySelectorAll('.product-card');

  cards.forEach((card, index) => {
    const category = card.querySelector('.product-card__category')?.textContent?.toLowerCase();
    const shouldShow = currentCategory === 'semua' || category?.includes(currentCategory);

    if (shouldShow) {
      card.style.display = '';
      // Use CSS class for entrance animation, staggered by index
      card.classList.remove('filter-in');
      // Force reflow to restart animation
      void card.offsetWidth;
      card.style.animationDelay = `${Math.min(index * 60, 300)}ms`;
      card.classList.add('filter-in');
    } else {
      card.style.display = 'none';
      card.classList.remove('filter-in');
    }
  });
}

/* ========== FETCH MENU DATA ========== */
async function fetchMenuData() {
  try {
    const response = await fetch('/src/data/menu.json');
    if (response.ok) {
      menuData = await response.json();
    }
  } catch (error) {
    console.error('Failed to load menu data:', error);
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

  // Quantity selector buttons
  const quantityMinus = modalOverlay?.querySelector('.quantity-minus');
  const quantityPlus = modalOverlay?.querySelector('.quantity-plus');
  const quantityValue = modalOverlay?.querySelector('.quantity-value');

  if (quantityMinus && quantityPlus && quantityValue) {
    quantityMinus.addEventListener('click', () => {
      const current = parseInt(quantityValue.textContent) || 1;
      if (current > 1) {
        quantityValue.textContent = current - 1;
        quantityMinus.disabled = current - 1 <= 1;
        quantityPlus.disabled = false;
      }
    });

    quantityPlus.addEventListener('click', () => {
      const current = parseInt(quantityValue.textContent) || 1;
      if (current < 99) {
        quantityValue.textContent = current + 1;
        quantityPlus.disabled = current + 1 >= 99;
        quantityMinus.disabled = false;
      }
    });
  }

  // WhatsApp button in modal
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
  modalOverlay.classList.add('modal-overlay--open');
  document.body.style.overflow = 'hidden';
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

  // Set basic info
  modalImage.innerHTML = `<img src="${product.image || '/assets/food/mie-gacoan.jpg'}" alt="${product.name}">`;
  modalName.textContent = product.name;
  modalDescription.textContent = product.description;
  modalPrice.textContent = product.price;

  // Reset quantity
  if (quantityValue) {
    quantityValue.textContent = '1';
  }
  const qMinus = document.querySelector('.quantity-minus');
  const qPlus = document.querySelector('.quantity-plus');
  if (qMinus) qMinus.disabled = true;
  if (qPlus) qPlus.disabled = false;

  // Clear and rebuild level selector
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
      levelSelector.innerHTML = '<span class="muted">Tidak ada pilihan level</span>';
    }
  }

  // Setup WhatsApp button
  if (whatsappBtn) {
    whatsappBtn.onclick = sendToWhatsApp;
  }
}

function closeModal() {
  modalOverlay.classList.remove('modal-overlay--open');
  document.body.style.overflow = '';
  selectedProduct = null;
}

function sendToWhatsApp() {
  const levelSelector = document.querySelector('.level-selector');
  const quantityValue = document.querySelector('.quantity-value');
  const product = selectedProduct;

  const selectedLevel = levelSelector?.querySelector('.level-pill--active')?.dataset.level || '1';
  const quantity = parseInt(quantityValue?.textContent) || 1;

  let message = `Halo Mie Gacoan Selong, saya ingin memesan:\n${quantity}x ${product?.name} Level ${selectedLevel}\n\nTerima kasih.`;
  const whatsappUrl = `https://wa.me/6281234567890?text=${encodeURIComponent(message)}`;

  window.open(whatsappUrl, '_blank');
  showToast('Pesanan dikirim ke WhatsApp!');
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

function setupLenis() {
  if (typeof Lenis === 'undefined') return;
  lenis = new Lenis({
    duration: 1.2,
    easing: (t) => 1 - Math.pow(1 - t, 4),
    smoothWheel: true,
  });

  // Sync GSAP ticker to Lenis RAF so ScrollTrigger reads real scroll positions
  gsap.ticker.add((time, delta) => lenis.raf(time, delta));

  lenis.on('scroll', () => {
    ScrollTrigger.update();
    updateScrollProgress();
    updateHeroScrollClass();
  });
}

function stopLenis() {
  if (!lenis) return;
  gsap.ticker.remove((time, delta) => lenis.raf(time, delta));
  lenis.destroy();
  lenis = null;
}

/* ========== SCROLL PROGRESS (GSAP) ========== */
function updateScrollProgress() {
  if (!scrollProgress) return;
  const max = document.documentElement.scrollHeight - window.innerHeight;
  const pct = max > 0 ? window.scrollY / max : 0;
  gsap.set(scrollProgress, { scaleX: Math.max(0, Math.min(1, pct)) });
}

function setupScrollProgress() {
  if (!scrollProgress) return;

  // Initial render
  updateScrollProgress();

  // Lenis scroll handler already calls updateScrollProgress()
  // Also wire native listener as a fallback in case Lenis is disabled
  window.addEventListener('scroll', updateScrollProgress, { passive: true });
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
  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const img = entry.target;
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
        obs.unobserve(img);
      }
    });
  }, {
    rootMargin: '50px',
    threshold: 0.01
  });

  images.forEach(img => observer.observe(img));
}

/* ========== PAGE LOAD ANIMATIONS ========== */
function setupPageLoadAnimations() {
  // Mark body as loaded so CSS entrance animations trigger
  const setLoaded = () => {
    document.body.classList.add('body-loaded');
  };

  // Small delay so entrance animations play on load
  setTimeout(setLoaded, 80);

  // Scroll-triggered reveals for .animate-on-scroll elements
  const animateElements = document.querySelectorAll('.animate-on-scroll');
  if (animateElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

    animateElements.forEach(el => observer.observe(el));
  }
}

/* ========== TOAST SYSTEM ========== */
function showToast(message, type = 'success') {
  // Remove existing toast
  const existing = toastContainer.querySelector('.toast');
  if (existing) existing.remove();

  const toast = document.createElement('div');
  toast.className = `toast toast--${type}`;
  toast.style.cssText = `
    position: fixed;
    bottom: var(--space-6);
    right: var(--space-6);
    z-index: 200;
    background: var(--color-secondary);
    color: #FFFFFF;
    padding: var(--space-4) var(--space-6);
    border-radius: var(--radius-lg);
    box-shadow: var(--shadow-lg);
    display: flex;
    align-items: center;
    gap: var(--space-3);
    max-width: 360px;
    pointer-events: auto;
  `;
  toast.innerHTML = `
    <div class="toast__icon" style="width:24px;height:24px;display:flex;align-items:center;justify-content:center;">
      ${type === 'success' ? '✓' : '!'}
    </div>
    <div>${message}</div>
  `;

  toastContainer.appendChild(toast);

  // Auto remove after 3s using CSS animation
  setTimeout(() => {
    toast.classList.add('toast--removing');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ========== INITIALIZE ========== */
document.addEventListener('DOMContentLoaded', init);

/* ========== EXPORTS FOR DEBUGGING ========== */
window.MieGacoan = {
  menuData: () => menuData,
  showToast
};