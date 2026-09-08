# Design Direction — Mie Gacoan Lombok Selong

## Visual Identity

**bold** **playful** **energetic** **modern** **youthful** **appetizing** **premium** **slightly rebellious** **memorable**

### AVOID
- corporate
- terlalu formal
- terlalu minimal sampai terasa kosong
- template restaurant biasa
- Bootstrap-looking UI
- card berlebihan
- gradient berlebihan
- glassmorphism berlebihan
- terlalu banyak rounded corners
- animasi gimmick

## Color System

### Primary
- deep red / spicy red — the signature color representing heat/appetite

### Secondary
- dark charcoal / black — for contrast and grounding

### Neutral
- warm white / cream — backgrounds, spacing areas

### Accent
- used sparingly only when needed (e.g., highlights, badges)

### Usage
- Primary: headlines, CTA accents, active states
- Secondary: text, borders, navbar
- Neutral: backgrounds, cards, cards
- Accent: decorative elements only

## Typography

### Scale (must be strictly followed)
H1 > H2 > H3 > body > caption

### Type Family (max 2)
- **Headline**: expressive / bold display font — strong personality, highly legible at large sizes
- **Body**: clean sans-serif — highly readable for long form, good on screen

### Prohibited
- Do NOT use decorative font for all text
- Do NOT mix more than 2 font families

## UI Style

### Core Principles
- strong typography
- generous whitespace
- asymmetric layouts
- editorial composition
- bold imagery
- premium food photography
- clear CTA
- subtle borders
- subtle shadows
- consistent radius

### Rounded Corners
- Use rounded corners secukupnya (enough, not excessive)
- Jangan membuat setiap elemen menjadi pill — not every element needs pill corners
- Typical radius: 4px–12px depending on component

### Layout
- Asymmetric layouts preferred over symmetric grids where appropriate
- Editorial composition for key sections
- Whitespace as design element

## Animation System

### Purposeful Only
- Page load: hero text fade + slide, image reveal, CTA stagger
- Scroll: section reveal, light image parallax, cards fade-up
- Hover: image zoom, card lift, button movement
- Menu: category transition, product modal animation
- Navbar: smooth background transition saat scroll

### Properties
- transform, opacity, scale, translate
- 200–500ms mayoritas transition
- Easing yang natural (cubic-bezier, not linear)
- Hindari animasi yang terlalu lambat

## Mobile Experience

Mobile bukan versi desktop yang diperkecil — design ulang hierarchy untuk mobile.

### Mobile Navbar
- Logo + hamburger only

### Hero
- headline lebih kecil
- image tetap menjadi focal point
- CTA stack jika diperlukan

### Product
- optimized card
- horizontal scrolling category

### Modal
- bottom sheet lebih cocok untuk mobile

### CTA
- buat mudah disentuh — minimum touch target sekitar 44px

## Responsive Breakpoints

Minimal: 320px, 375px, 425px, 768px, 1024px, 1280px, 1440px+

## Accessibility

- contrast cukup
- keyboard navigation
- focus states (clear, visible)
- alt text untuk semua image
- semantic HTML
- aria labels untuk interactive elements
- touch target cukup besar (≥44px)
- prefers-reduced-motion support

## Performance

Jangan mengorbankan performance demi visual.

- optimize image loading
- lazy loading
- animation yang efisien
- hindari layout shift
- responsive images

## Content Rules

Jangan mengarang:
- harga resmi
- nomor WhatsApp
- jam operasional
- promo resmi
- jumlah cabang
- rating
- jumlah pelanggan
- testimonial palsu
- klaim bisnis

Jika data belum tersedia gunakan:
- [Harga]
- [Nomor WhatsApp]
- [Jam Operasional]

atau data demo yang diberi label jelas sebagai placeholder.

## Component System

Reusable components to build:
1. Navbar
2. Button
3. Hero
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

## Order Flow (Demo)

User journey:
1. Klik "Pesan Sekarang"
2. Pilih produk
3. Pilih level (interactive pills/buttons: 1–8)
4. Pilih quantity ([-] 1 [+])
5. Klik "Pesan via WhatsApp"
6. Buka WhatsApp dengan pesan otomatis

Format WhatsApp:
"Halo Mie Gacoan Selong, saya ingin memesan: 1x Mie Gacoan Level 5, 1x Pangsit Goreng, 1x Es ... Terima kasih."

## Image Direction

Gunakan gambar makanan yang:
- close-up
- appetizing
- high contrast
- realistic
- warm lighting
- editorial food photography
- shallow depth of field

Makanan harus menjadi visual hero.

Jika belum ada asset asli, gunakan placeholder image yang mudah diganti.

## Structure Assets

/assets
  /logo
  /food
  /outlet
  /promo
  /gallery

## Micro Interactions

Semua harus memiliki tujuan:
- button arrow animation
- image hover
- active category indicator
- selected level state
- quantity feedback
- toast notification
- smooth modal
- cursor interaction jika memang diperlukan
- scroll progress jika cocok
- subtle food-related decorative motion

## UX Principles

- Visual hierarchy
- Clear CTA
- Progressive disclosure
- Hick's Law
- Fitts's Law
- Gestalt principles
- Consistency
- Accessibility
- Feedback
- Recognition over recall

User harus dapat: Home → Menu → Product → Level → Quantity → WhatsApp dengan sesedikit mungkin friction.