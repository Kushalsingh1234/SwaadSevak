# Swaad Sevak — Brand Identity System & Guidelines

> **Swaad** (*flavour/taste*) + **Sevak** (*the one who serves*).  
> "The dependable helper behind the counter" for Indian cafés, restaurants, cloud kitchens and food businesses.

---

## 1. Brand Mark Overview

The Swaad Sevak brand mark is a modern culinary silhouette:
- **The Soup / Serving Bowl:** A grounded parabolic basin symbolizing abundant hospitality, fresh preparation, and table service.
- **The Dual Steam Ribbons:** Two sweeping vertical aroma plumes forming an abstract, fluid "S" motion, symbolizing taste and hot kitchen-to-table delivery.

---

## 2. Color Palette & Exact HEX Tokens

| Color Name | HEX Code | Usage | Contrast on White | Contrast on #1B120C |
|---|---|---|---|---|
| **Swaad Saffron** | `#FF5E0E` | Primary brand accent, steam plumes, CTA buttons | 3.3:1 (large text / UI) | 4.8:1 (WCAG AA compliant) |
| **Deep Ink** | `#0B1020` | Light-mode bowl basin, body text, high-contrast marks | 17.5:1 (WCAG AAA) | — |
| **Roasted Teak** | `#1B120C` | Landing page canvas, dark theme surfaces | — | Base |
| **Mocha Surface** | `#251A12` | Dark theme surface cards, input wells | — | 1.3:1 |
| **Warm Ivory** | `#FFF7ED` | Dark-mode bowl basin, headings on dark backgrounds | 1.1:1 | 14.8:1 (WCAG AAA) |
| **Cardamom Green** | `#10B981` | Positive status, Veg badges, revenue metrics | 3.1:1 | 6.8:1 (WCAG AA) |
| **Turmeric Gold** | `#FFB020` | Highlights, pending tickets, active table alerts | 1.8:1 | 7.9:1 (WCAG AAA) |

---

## 3. Clear-Space & Alignment Rules

- **Clear-Space Unit ($X$):** The clear-space margin around all lockups is equal to the height of the bowl rim ($X = 8\text{px}$ in a $100\times100$ grid, or roughly $20\%$ of the mark's total height).
- No typography, borders, page edges, or adjacent buttons should enter this perimeter.
- **Baseline Alignment:** In horizontal lockups, the bowl foot aligns optically with the baseline of the wordmark "Swaad Sevak".

---

## 4. Minimum Sizes

| Format | Minimum Digital Size | Minimum Print Size | Notes |
|---|---|---|---|
| **Mark Symbol Only** | $16 \times 16\text{ px}$ | $6 \times 6\text{ mm}$ | Favicon, tiny status indicator |
| **Horizontal Lockup** | $120 \times 28\text{ px}$ | $30 \times 7\text{ mm}$ | App headers, mobile navbar |
| **Stacked Lockup** | $72 \times 64\text{ px}$ | $20 \times 18\text{ mm}$ | Table standees, receipts |
| **Thermal KOT Print** | $24 \times 24\text{ px}$ | $8 \times 8\text{ mm}$ | 58mm & 80mm ESC/POS slips |

---

## 5. Asset Directory Sitemap (`/public/brand/`)

```
client/public/brand/
├── logo-mark.svg              # Full color symbol only
├── logo-mark-mono-black.svg   # Solid black (for thermal printers & stamps)
├── logo-mark-mono-white.svg   # Solid white (for dark merchandise & embroidery)
├── logo-horizontal.svg        # Default horizontal lockup
├── logo-horizontal-light.svg  # Horizontal lockup for white backgrounds
├── logo-horizontal-dark.svg   # Horizontal lockup for dark backgrounds
├── logo-stacked.svg           # Stacked mark + wordmark for print & standees
├── app-icon.svg               # Vector squircle icon (512x512 safe frame)
├── app-icon-512.png           # 512x512 PNG app store icon
├── app-icon-192.png           # 192x192 PNG PWA home screen icon
├── apple-touch-icon.png       # 180x180 PNG iOS home screen icon
├── favicon.svg                # Browser tab icon (SVG)
├── favicon.ico                # Multi-resolution ICO (16, 32, 48px)
├── og-image.png               # 1200x630 Social / WhatsApp link preview card
└── brand-sheet.html           # Interactive visual concept showcase
```

---

## 6. Logo Usage: Do's & Don'ts

### ✅ DO
- Always use `logo-mark-mono-black.svg` for thermal receipts and monochrome bills.
- Use `theme="dark"` (white bowl, orange steam) against `#1B120C` or `#0B1020` backgrounds.
- Use `theme="light"` (ink bowl, orange steam) against white or `#F8FAFC` backgrounds.
- Maintain the aspect ratio when scaling.
- Use the provided React `<Logo />` component for automatic theme adaptation.

### ❌ DON'T
- Do not distort, stretch, or rotate the bowl or steam paths.
- Do not place the full-color dark bowl directly onto dark navy without the white outline/fill.
- Do not add artificial drop shadows, 3D extrusions, or outer neon glows to the logo.
- Do not replace the custom steam curves with clip-art cutlery or generic flame icons.
