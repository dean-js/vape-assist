# Vape Assist — Brand Kit

A quick reference for the name, look and voice of the app, so anything new added to it (a page, a marketing screenshot, an app store listing) stays consistent with what's already here. Everything below is pulled from what's actually implemented in `css/variables.css` and the shared components — this file documents the system, it doesn't invent a new one.

---

## Name

**Vape Assist** (two words, both capitalised). Not "VapeAssist," "Vapeassist," or "vape assist" in running prose outside of URLs/package names.

- Package / repo / dev-server identifiers use the kebab-case form: `vape-assist`.
- Internal `localStorage` keys keep their existing `vt_*` prefix (from the previous "VapeTrack" name) — that's an implementation detail no user ever sees, so it wasn't worth a data migration to rename.

**Tagline:** "Track your switch from smoking to vaping."

**One-line description:** A dashboard for people switching from smoking to vaping — track your hardware and e-liquids, watch your coil age, and get simple recommendations for what to try next.

## Mission / tone

Vape Assist is a harm-reduction tool, not a lifestyle or cloud-chasing brand. The tone throughout the UI is:

- **Encouraging, not preachy.** "Smoke Free" and "Money Saved" are framed as wins, not guilt trips.
- **Plain and specific.** Copy says "11 days left (est.)" not "your journey continues." Numbers and estimates are always labelled as estimates.
- **Honest about being a prototype.** Placeholder data (retailer prices, "Continue with Google") says so in-line rather than pretending to be finished. Keep that habit — don't dress up a stub as a real feature.

**Do:** short sentences, active voice, real units (days, £, mg, Ω).
**Don't:** hype language ("revolutionary," "the ultimate vape tracker"), guilt-based messaging, or emoji outside the existing icon set below.

## Logo

A two-tone diamond mark — the left half in the accent purple, the right half in the lighter accent-soft purple, evoking a vapour droplet:

```html
<svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
  <path d="M12 1.5L21 12L12 22.5L3 12L12 1.5Z" fill="var(--color-accent)" />
  <path d="M12 1.5L21 12L12 22.5V1.5Z" fill="var(--color-accent-soft)" />
</svg>
```

Used inline (not as an image file) so it always tracks the CSS colour variables below. Rendered at 22–24px next to the wordmark "Vape Assist" in `font-weight: 700`. See `js/components/sidebar.js` and `login.html` for the reference implementation. Don't recolour it per-page — it's always the two accent purples, on a dark background.

## Colour palette

Defined once in `css/variables.css`; everything in the app should reference these tokens rather than hard-coding hex values.

| Token | Hex | Use |
|---|---|---|
| `--color-accent` | `#8b5cf6` | Primary brand purple — logo, active nav, primary buttons |
| `--color-accent-soft` | `#a78bfa` | Lighter purple — hover states, links, logo highlight |
| `--color-success` | `#34d399` | Smoke-free streak, in-stock, "OK" coil status |
| `--color-warning` | `#fbbf24` | Coil getting old, low liquid |
| `--color-danger` | `#f87171` | Coil overdue, out of stock, destructive actions |
| `--color-info` | `#38bdf8` | Informational badges (e.g. "NEW") |
| `--bg-page` | `#0f1117` | Page background |
| `--bg-panel` | `#171a23` | Card / panel background |
| `--bg-panel-alt` | `#1d212c` | Product card background, form inputs |
| `--bg-hover` | `#232837` | Hover background |
| `--border-color` | `#2a2f3d` | All borders |
| `--text-primary` | `#f4f4f6` | Body text |
| `--text-secondary` | `#9ca3af` | Labels, captions |
| `--text-muted` | `#6b7280` | Placeholder text, disabled states |

Vape Assist is dark-theme only for now — there's no light theme to keep in sync, so don't introduce colours outside this table without adding them here first.

## Typography

- **Font stack:** `"Segoe UI", system-ui, -apple-system, Roboto, Helvetica, Arial, sans-serif` (`--font-family`) — no custom webfont, keeps load time at zero.
- **Base size:** 15px body text, 1.5 line-height.
- **Headings:** `h1` 22px/600 (page titles), `h2` 16px/600 (section headers). No `h3+` scale is defined yet — reuse `h2` sizing with a wrapping panel instead of inventing a smaller heading size.
- **Stat values:** 24px/700 (`.stat-value`) — kept bounded so long text (e.g. "Not enough data") doesn't blow out card height; numbers and short labels both need to fit here.

## Spacing & shape

- Spacing scale is multiples of 4px: `--space-1` (4px) through `--space-8` (32px). Always use a token, never a raw pixel value, so the rhythm stays consistent.
- Corner radius: `--radius-sm` 8px (inputs, small badges), `--radius-md` 12px (product cards), `--radius-lg` 16px (panels, stat cards).

## Iconography

No icon font or SVG icon library — the app uses plain emoji for nav and stat-card icons (🏠 🔧 💧 ❤️ 🔍 👤, 🌿 💰 📦) and hand-drawn inline SVG line art for product thumbnails (`js/components/productIcon.js`). Keep new icons in whichever of those two systems fits: emoji for nav/stat labels, inline `currentColor` SVG for product/category art. Don't mix in a third icon source (e.g. a Unicode symbol font or an external icon library) — it won't match the existing weight or scale.

## Voice examples

| Instead of… | Vape Assist says… |
|---|---|
| "Congratulations, warrior! 🎉" | "Smoke Free — 14 Days" |
| "AI-powered recommendations" | "Rule-based, no AI — scores catalogue items by how many tags they share with your quiz answers" |
| "This feature is coming soon!" | "Not wired up yet - needs a backend to verify Google sign-in safely" |
| "Are you sure?!" | "This clears your account, every device, liquid, wishlist item and quiz answer you've logged. Continue?" |

---

*This is a living document — if you add a new colour, font size or icon convention to the app, add it here too rather than letting the two drift apart.*
