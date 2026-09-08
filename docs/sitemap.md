# Sitemap — Mie Gacoan Lombok Selong

## Architecture
Single-page demo with 5 separate HTML pages, shared CSS/JS, and a small SPA router for navigation.

## Pages

### 1. Home (`index.html`)
- Navbar (sticky, transparent on hero, solid on scroll)
- Hero Section (large typography, food focal point, CTAs)
- Best Seller Section (Mie Gacoan, Mie Hompimpa, Mie Suit, Pangsit Goreng)
- Menu Preview Section (category tabs + product cards + "Lihat Semua Menu →")
- Promo Section (editorial/asymmetrical layout)
- About Section (storytelling, highlights)
- Gallery (masonry/editorial, hover zoom, lightbox)
- Location CTA ("Temui Kami di Selong")
- Final CTA ("Sudah siap cobain pedasnya?")
- Footer (logo, quick links, contact, copyright)

### 2. Menu (`menu.html`)
- Page header ("MENU")
- Category navigation (Semua, Mie, Dimsum, Minuman, Paket)
- Product grid (3-4 cols desktop, 2 tablet, 1-2 mobile)
- Product detail modal/bottom sheet (image, name, description, price, level selector 1-8, quantity, CTA)

### 3. Promo (`promo.html`)
- Hero ("PROMO — Lebih banyak makan, lebih hemat.")
- Promo cards (Paket hemat, Paket berdua, Paket sharing, seasonal)
- Visual storytelling layout

### 4. Tentang (`tentang.html`)
- Hero ("TENTANG KAMI — Pedasnya Punya Cerita.")
- Story section
- Values
- Experience
- Statistics (01 Mie, 02 Dimsum, 03 Level Pedas, 04 Tempat Nongkrong)
- Editorial composition with large photography

### 5. Lokasi & Kontak (`lokasi.html`)
- Hero ("DATANG DAN RASAKAN SENDIRI.")
- Address card
- Google Maps preview
- Jam operasional
- WhatsApp CTA
- Instagram CTA
- "Petunjuk Arah" CTA
- "Pesan Sekarang" CTA

## Shared Components
1. Navbar (sticky, hamburger mobile)
2. Button (primary, secondary, ghost)
3. Hero (variant: home, page)
4. SectionHeading
5. ProductCard
6. CategoryTabs
7. ProductModal
8. QuantitySelector
9. PromoCard
10. Gallery
11. LocationCard
12. CTASection
13. Footer
14. Toast
15. MobileMenu

## Navigation Flow
Home → Menu → Product → Level → Quantity → WhatsApp

## Data
- `data/menu.json` — menu items with categories, prices, descriptions, images
- All prices are placeholders ([Harga]) since official prices are not provided

## Assets
- `/assets/logo` — brand logo
- `/assets/food` — food photography
- `/assets/outlet` — outlet images
- `/assets/promo` — promo images
- `/assets/gallery` — gallery images