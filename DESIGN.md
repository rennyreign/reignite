# Design System: Capability Tracker

## 1. Visual Theme & Atmosphere

A warm, gallery-airy daily-use app for parents. The atmosphere is like a well-lit
notebook on a kitchen table — unhurried, personal, confident. Not a school portal,
not a SaaS dashboard. Every screen should feel like it belongs to the family, not
to an institution.

- **Density:** 4 — Daily App Balanced. Generous whitespace, no cramped tables.
- **Variance:** 5 — Gently asymmetric. Left-weighted headers, offset card details.
- **Motion:** 3 — Restrained. Subtle hover lifts, no theatrics.

---

## 2. Color Palette & Roles

- **Parchment Canvas** (`#F5F3EF`) — Primary background. Warm off-white, never cold grey.
- **Pure Surface** (`#FFFFFF`) — Card fills, input backgrounds.
- **Ink** (`#1C1917`) — Primary text. Warm near-black (Stone-950), never pure `#000000`.
- **Dusk** (`#78716C`) — Secondary text, metadata, labels. Stone-500.
- **Hairline** (`#E7E5E4`) — Card borders, dividers. Stone-200.
- **Moss** (`#3D7A5F`) — **Single accent.** CTAs, active states, progress fills, focus rings.
  Saturation ~55%. Calm forest green — growth without alarm.
- **Moss Light** (`#EBF3EE`) — Accent backgrounds, tag fills, hover tints.
- **Amber Signal** (`#D97706`) — Warning states, low-score badges only. Never decorative.
- **Rose Signal** (`#DC2626`) — Danger/delete actions only.

### Score Tier Colors (progress bars, badges)
- 8–10: Moss `#3D7A5F`
- 5–7:  Steel `#4A90A4`
- 3–4:  Amber `#D97706`
- 0–2:  Rose `#DC2626`

---

## 3. Typography Rules

- **Display / Page Titles:** `Outfit` — weight 700, tracking `-0.025em`. Controlled scale.
- **Body / Labels:** `Outfit` — weight 400–500, relaxed leading `1.6`. Max `65ch` line width.
- **Mono (scores, dates, counts):** `JetBrains Mono` — weight 500. Used for any numeric data.
- **Scale:**
  - Page title: `1.75rem` / 700
  - Section heading: `1.1rem` / 600
  - Card title: `1rem` / 600
  - Body: `0.9rem` / 400
  - Label / meta: `0.78rem` / 500, uppercase, letter-spacing `0.06em`
  - Mono data: `0.85rem` / 500

### Banned
- `Inter`, `Roboto`, `Poppins` — too generic
- Pure black `#000000`
- Serif fonts of any kind in this UI

---

## 4. Component Stylings

### Buttons
- **Primary:** `background: #1C1917`, `color: #fff`, `border-radius: 10px`, no shadow.
  Active state: `transform: translateY(1px)` — tactile push. No outer glow.
- **Outline/Secondary:** `border: 1.5px solid #1C1917`, `color: #1C1917`, same radius.
- **Accent (CTA):** `background: #3D7A5F`, `color: #fff` — used for primary actions per page.
- **Danger:** `background: #DC2626`, `color: #fff`.
- Padding: `10px 20px`. Font: `Outfit 600 0.875rem`. `text-transform: none`.

### Cards
- `background: #FFFFFF`, `border-radius: 16px`, `border: 1px solid #E7E5E4`.
- Shadow: `0 1px 4px rgba(28,25,23,0.06)` — tinted to background hue, not cold grey.
- Hover: `box-shadow: 0 4px 16px rgba(28,25,23,0.10)`, `transform: translateY(-1px)`.
- Padding: `24px`. No inner double-borders.

### Inputs / Forms
- Label **above** input, `Outfit 500 0.78rem` uppercase + letter-spacing.
- `border: 1.5px solid #E7E5E4`, `border-radius: 10px`, `background: #fff`.
- Focus: `border-color: #3D7A5F`, `box-shadow: 0 0 0 3px rgba(61,122,95,0.15)`.
- No floating labels.

### Progress Bars
- Height: `8px`, `border-radius: 99px`.
- Track: `#E7E5E4`. Fill: score-tier color (see palette).
- No Bootstrap `.progress-bar` class — use custom inline styles.

### Avatars / Initials
- `border-radius: 50%`, `background: #EBF3EE`, `color: #3D7A5F`, `font-weight: 700`.
- Size in lists: `48px`. Size in profile: `80px`.

### Badges / Score Tags
- `border-radius: 99px`, `padding: 3px 10px`, `font: Outfit 600 0.75rem`.
- Background tinted version of the score-tier color at 15% opacity.
- Border: 1px solid score-tier color at 40% opacity.

### Navigation Header
- `background: #FFFFFF`, `border-bottom: 1px solid #E7E5E4`. No elevation shadow.
- Brand name: `Outfit 700 1.1rem` `color: #1C1917`. No logo image dependency.
- Nav links: `Outfit 500 0.875rem` `color: #78716C`. Active: `color: #1C1917` + 2px bottom border `#3D7A5F`.
- Mobile: clean slide-in drawer, same palette.

### Empty States
- Centered composition, short headline `Outfit 600 1rem`, one-line description `Dusk`, single CTA.
- No alert boxes for empty — only for genuine errors.

### Loading States
- Skeleton shimmer bars matching exact card/row dimensions. No `CircularProgress` spinners.

---

## 5. Layout Principles

- Max content width: `860px` centered, `padding: 0 24px`.
- CSS Grid for multi-column layouts. No Bootstrap `Row/Col` for new components.
- Page sections separated by `32px` vertical gap, not horizontal rules.
- Header is sticky, `height: 64px`.
- No absolute-positioned stacking. Every element has its own spatial zone.
- Full-height: `min-height: 100dvh` on root.

---

## 6. Motion & Interaction

- Hover transitions: `transition: all 0.15s ease` on cards and buttons.
- Card hover lift: `translateY(-1px)` + shadow deepen.
- Button active push: `translateY(1px)`.
- No entrance animations, no page transitions — this is a daily utility app.
- Animate only `transform` and `opacity`. Never `height`, `width`, `top`, `left`.

---

## 7. Anti-Patterns (Banned)

- No `Inter`, `Poppins`, or `Roboto` in any new component
- No pure `#000000` — use Ink `#1C1917`
- No neon/outer glow `box-shadow`
- No cold grey backgrounds (`#F5F5F5`, `#EEEEEE`, `#E0E0E0`)
- No Bootstrap `Alert` for empty states — only for real errors
- No Bootstrap `Badge bg="success/info/warning/danger"` — use custom score-tier badges
- No `CircularProgress` spinner — use skeleton loaders
- No 3-equal-column card grids — use 2-column asymmetric or single-column list
- No `text-transform: uppercase` on headings or button labels
- No `"Reignite"` anywhere in the UI — app name is **Capability Tracker**
- No marketing copy or hero sections in the app shell
- No `border-radius: 20px` pill buttons — use `10px` radius
- No `F9A826` amber CTA color — replaced with Moss `#3D7A5F`
- No `11999E` teal — replaced with Ink + Moss palette
