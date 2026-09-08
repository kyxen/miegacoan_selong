# Component System — Mie Gacoan Lombok Selong

## 1. Navbar

**States:** Default, Scroll (solid bg), Mobile (hamburger)

**Desktop:**
- Logo left
- Links: Home | Menu | Promo | Tentang | Lokasi
- CTA "Pesan Sekarang" right

**Mobile:**
- Logo left, hamburger right
- Hamburger opens slide drawer from right
- Overlay backdrop

**Behavior:**
- Sticky, top-0, z-50
- Transparent on hero, solid on scroll
- Transition: 250ms cubic-bezier

**Props:**
- `logo` (string)
- `links` (array of {name, href})
- `cta` (string | null)

## 2. Button

**Variants:**
- Primary (solid red bg, white text)
- Secondary (outline, charcoal border)
- Ghost (transparent, underline on hover)
- Icon (icon only, circle)

**States:** Default, Hover, Active, Disabled, Focus

**Sizes:** sm (40px), md (48px default), lg (56px)

**Interaction:**
- Hover: scale 1.02, shadow
- Active: scale 0.98
- Focus: outline ring
- Arrow icon on hover slides right 4px

## 3. Hero

**Variants:** HomeHero (large, food image + headline), PageHero (smaller, breadcrumb-style)

**Home Hero:**
- Large headline (H1, serif)
- Subheadline (body, muted)
- Two CTAs side by side
- Food image on right side
- Optional: floating chili, steam, spice particles

**Composition:**
- Asymmetric layout (text left, image right on desktop)
- Full height on mobile, 80vh on desktop
- Depth via overlapping layers

## 4. SectionHeading

**Props:**
- `title` (string) — H2, large, bold
- `subtitle` (string) — body, muted
- `align` (left | center)

**Style:**
- Large typography, generous bottom margin
- Optional decorative underline or accent

## 5. ProductCard

**Props:**
- `image` (src)
- `name` (string)
- `description` (string, short)
- `price` (string, e.g., "[Harga]")
- `badge` (string | null)
- `category` (string)

**States:** Default, Hover

**Hover:**
- Image scale 1.04
- Card translateY(-4px)
- Shadow increase
- CTA more visible

**CTA:** "Pesan" button, primary style

## 6. CategoryTabs

**Props:**
- `categories` (array of strings)
- `active` (string)
- `onChange` (callback)

**Style:**
- Horizontal scroll on mobile
- Active indicator underline or pill
- Smooth transition on active change

## 7. ProductModal

**Trigger:** Click ProductCard

**Content:**
- Large image (left or top)
- Name, description, price
- Level selector (pills 1-8 for mie)
- Quantity selector (- / 1 / +)
- "Pesan via WhatsApp" CTA

**Mobile:** Bottom sheet (90vh max, slide up)
**Desktop:** Center modal (560px max-width)

**Animation:**
- Open: fade + scale 0.95 → 1, slide up on mobile
- Close: fade + scale 1 → 0.95, slide down on mobile

## 8. QuantitySelector

**Props:**
- `value` (number, default 1)
- `min` (number, default 1)
- `max` (number, default 99)
- `onChange` (callback)

**Style:**
- [-] [1] [+] with border, rounded
- Hover: bg neutral
- Disabled state at min/max
- Touch target ≥ 44px

## 9. PromoCard

**Props:**
- `title` (string)
- `description` (string)
- `image` (src)
- `price` (string)
- `badge` (string | null)

**Layout:**
- Editorial: large image with bold typography overlay or side-by-side
- Asymmetric design
- Price highlight with accent color

## 10. Gallery

**Layout:** Masonry/editorial with varied image sizes

**Props:**
- `images` (array of {src, alt})

**Interaction:**
- Hover: image scale 1.05, overlay darken
- Click: lightbox (full image view)

**Lightbox:**
- Overlay with dark bg
- Image centered
- Close button
- Keyboard: Escape to close
- Touch: swipe or tap to close

## 11. LocationCard

**Props:**
- `name` (string)
- `address` (string)
- `mapsUrl` (string)
- `operatingHours` (string)
- `whatsappUrl` (string)
- `instagramUrl` (string)

**Layout:**
- Address info left/top
- Map preview right/bottom
- Contact icons row

## 12. CTASection

**Props:**
- `headline` (string)
- `subheadline` (string)
- `ctaLabel` (string)
- `ctaHref` (string)

**Style:**
- Large headline, bold
- Background: dark charcoal or primary
- Text: white/cream
- CTA prominent

## 13. Footer

**Sections:**
- Logo + brand
- Quick Links (5 links)
- Contact (location, WhatsApp, Instagram)
- Copyright

**Style:**
- Minimal, clean
- Dark bg, light text
- Icons for social

## 14. Toast

**Trigger:** WhatsApp link click, form submit, etc.

**Content:** "Pesanan berhasil ditambahkan" or "Opening WhatsApp..."

**Position:** Bottom right
**Animation:** Slide in from right, auto-dismiss 3s

## 15. MobileMenu

**Trigger:** Hamburger icon click

**Content:** Nav links + CTA

**Animation:**
- Open: slide from right, overlay backdrop
- Close: slide out, overlay fade
- ESC key closes

## Data Model — Menu Item

```json
{
  "id": "mie-gacoan",
  "name": "Mie Gacoan",
  "category": "mie",
  "description": "Mie pedas level 1-8 dengan topping pilihan.",
  "price": "[Harga]",
  "image": "/assets/food/mie-gacoan.jpg",
  "levels": [1, 2, 3, 4, 5, 6, 7, 8]
}
```