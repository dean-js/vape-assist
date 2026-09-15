# VapeTrack

A dashboard app to help someone transitioning from smoking to vaping: track your hardware and liquids, log likes/dislikes, keep an eye on coil age, and get simple rule-based recommendations for what to try next - including UK retailer price comparisons.

This is a **v1 prototype**: plain HTML/CSS/JavaScript, no build tools, no backend. All your data lives in your browser's `localStorage`. Section 5 below explains exactly how to grow this into something with a real backend and database later, without a rewrite.

## Why plain HTML/CSS/JS, written like components

You're learning HTML and CSS, so the whole app is just that - no React, no build step, nothing to install to get it running. But the JavaScript is deliberately organised the way a React app would be, as a bridge toward that later:

- Every file in `js/components/` is a function that takes some data in and returns an HTML string - the same "props in, markup out" idea as a React component, just written by hand.
- Every file in `js/pages/` is a "controller" for one HTML page: it fetches data and fills in the blanks that page's HTML already has.
- `js/data/store.js` is the *only* place that touches `localStorage`. Every page goes through it. That one rule is what makes it possible to swap in a real backend later (see below) by editing a single file.

Read the comment at the top of `js/data/store.js` first - it explains this in more detail.

## Running it locally

Because the JavaScript is split into ES modules (`import`/`export`), you can't just double-click `index.html` - browsers block module imports when a page is opened directly from disk (`file://`). You need a tiny local web server. Two easy options:

**Option A - Node (recommended, matches package.json):**
```bash
npm start
```
This runs `npx serve .` and prints a local address, usually `http://localhost:5173`. Open that in your browser.

**Option B - Python (if you don't want to touch Node):**
```bash
python3 -m http.server 5173
```
Then open `http://localhost:5173`.

Either way, always load the app through `http://localhost:...`, not `file://`.

## Project structure

```
vapetrack/
├── index.html          Dashboard (home page)
├── onboarding.html      Sign-up quiz
├── hardware.html        My Hardware (devices, pods, coils, accessories)
├── liquids.html         My Liquids (log, rate, review)
├── wishlist.html         Wishlist
├── discover.html         Browse + recommendations + retailer prices
├── profile.html           Quiz answers + reset data
├── css/
│   ├── variables.css      Colours, spacing, fonts - change the look here
│   ├── base.css           Page skeleton (sidebar + content grid)
│   └── components.css     Cards, badges, buttons, forms, progress ring
└── js/
    ├── data/
    │   ├── store.js          localStorage data layer (read this first)
    │   ├── catalog.js         Sample hardware/liquid "database"
    │   └── quiz-questions.js  Onboarding quiz definition
    ├── recommendations.js     Rule-based recommendation engine
    ├── components/            Reusable render functions (sidebar, cards, etc.)
    └── pages/                 One controller file per HTML page
```

## How this maps to the original feature list

| Feature | Where it lives |
|---|---|
| Accounts & onboarding | `onboarding.html` + `js/pages/onboarding.js`, data in `js/data/quiz-questions.js` |
| Hardware database | `hardware.html` - log devices/pods/coils/accessories, coil age tracking |
| Liquid database | `liquids.html` - log, rate 1-5, "would buy again", remaining % |
| Dashboard | `index.html` - current setup, coil tracker, wishlist preview, recommendations, deals |
| Wishlist | `wishlist.html` |
| Community ratings | Seeded per-item in `js/data/catalog.js` (`communityRating`, `communityReviewCount`); your own rating is stored separately via `rateLiquid()` in `store.js` |
| Retail integration | `retailers` array on each catalogue item; **sample/placeholder prices only**, see the warning at the top of `catalog.js` |
| Rule-based recommendations | `js/recommendations.js` - scores catalogue items by tag overlap with your quiz answers + logged/rated items |

Note: the original spec's "Community" and "Deals & Retailers" as separate nav sections, plus account settings, are folded into Discover/Profile for this v1 to keep the page count manageable - splitting them out later is just adding another HTML page + page.js file following the same pattern as the others.

## Known simplifications in this prototype

- **Retailer prices are fictional placeholders.** UK vape retailers don't generally expose a public price/stock API, so real integration would need either an affiliate product feed from specific retailers, or your own scraper (and you'd need to check each site's terms of service / robots.txt before doing that).
- **"Community ratings" are seeded numbers**, not real reviews from real other users - there's no multi-user backend yet, so this is one person's app.
- **"Money saved" and "smoke free days"** are rough estimates from your quiz answers (average UK cost-per-cigarette × days since you completed onboarding), not real purchase data.

## Growing this into a real (multi-user, backend-powered) app

Everything above is written so this is an additive change, not a rewrite:

1. Build a small backend (Node + Express is a natural next step since you're already in JavaScript) with routes like `GET /api/hardware`, `POST /api/liquids`, etc., backed by a real database (SQLite is the easiest to start with, Postgres if you want it production-ready).
2. Open `js/data/store.js` and change the *inside* of each function from `localStorage.getItem(...)` to `fetch('/api/...')`. Because every function already returns a Promise and every page already calls them with `await`, nothing in `js/pages/` or `js/components/` needs to change.
3. Add real authentication (sign up/log in) so hardware, liquids and ratings are tied to a real account instead of "whoever is using this browser".
4. Replace the placeholder `retailers` data in `catalog.js` with a real source (affiliate feed or your own scraper), and consider moving the whole catalogue into the database too so it can be updated without editing code.
5. Once ratings come from real different people, "community rating" becomes a genuine aggregate (average of all users' ratings for that item) computed by the backend instead of a fixed seeded number.

## Next steps if you're using this to learn

- Start by reading `js/data/store.js` and `js/data/catalog.js` end to end - almost everything else in the app is built on top of those two files.
- Try adding a new stat card to the dashboard, or a new quiz question, before touching the recommendation engine - it's a smaller, self-contained change to practice with.
- The `js/components/` functions are a good place to see the "props in, HTML out" pattern before you try the real thing in React.
