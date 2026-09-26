# Vape Assist

A dashboard app for people switching from smoking to vaping: track your hardware and e-liquids, log what you like and don't, keep an eye on coil age, and get rule-based recommendations for what to try next, including UK retailer price comparisons.

**Status:** early prototype (v0.3.0). Frontend only, no backend yet. All data is stored locally in your browser.

See [BRANDING.md](BRANDING.md) for the name, logo, colour palette and voice guidelines.

---

## Current features

**Accounts**
Local placeholder sign-up (name + email, stored in this browser only). A "Continue with Google" button is present but not wired up yet, see [Roadmap](#roadmap).

**Onboarding quiz**
A short quiz on smoking history, nicotine preference, flavour interests, device type and budget, used to seed your first recommendations.

**Dashboard**
Smoke-free days, estimated money saved, current device/pod/liquid at a glance, a live coil-age progress ring, wishlist preview, personalised recommendations, and a best-deals list.

**Profile**
Account details, quiz answers, and smoke-free date tracking - fix the start date if it's wrong or reset the counter to today after a slip, without wiping your other data. Also where you retake the quiz or reset everything.

**My Hardware**
Log devices, pods, coils and accessories. Coils show days used vs. average life, colour-coded (ok / warning / overdue), with one-click "replace" that retires the old coil and logs a fresh one.

**My Liquids**
Log e-liquids you've tried, rate them 1-5, mark "would buy again," and track how much is left in the bottle.

**Wishlist**
Save products you want to try, with the cheapest known in-stock retailer shown against each.

**Discover**
Browse the catalogue with For You / Top Rated / New In tabs, plus a "coils that fit your devices" section driven by what you've actually logged.

**Recommendation engine**
Rule-based, no AI: scores catalogue items by how many tags they share with your quiz answers and what you've logged/rated highly. See `js/recommendations.js`.

**Known simplifications:** retailer prices in `js/data/catalog.js` are fictional placeholders (no UK vape retailer offers a public price API yet), community ratings are seeded numbers rather than real multi-user reviews, and "money saved" is a rough estimate from your quiz answers rather than real purchase data.

---

## Updates

### v0.3.0
- Renamed the app from VapeTrack to **Vape Assist** everywhere (titles, sidebar, login, README) and added a proper brand kit ([BRANDING.md](BRANDING.md)) with a real two-tone SVG logo mark replacing the old text-glyph diamond
- Added smoke-free date editing and a "reset counter to today" button on the Profile page, so you can fix an incorrect start date or restart the count after a slip without wiping your whole account
- Fixed the mobile layout: the sidebar now actually collapses into a compact top bar with a dropdown menu below ~860px width, instead of stacking a full-height nav above the page content
- Fixed the hardware/liquid catalogue dropdowns showing duplicated brand names (e.g. "OXVA OXVA Xlim SQ Pro")
- Fixed stat cards with longer text values (e.g. "Favourite Category: Not enough data") blowing out of proportion with the rest of the row
- Fixed empty-state messages (Wishlist, Discover) rendering squashed into a single grid column instead of centred
- Cleaned up the dashboard's "Current Setup" card so it doesn't show three redundant "Not set" rows alongside the "nothing logged yet" message

### v0.2.0
- Added local placeholder accounts (`login.html`): name + email sign-up, gates the whole app, "Continue with Google" UI in place ahead of real OAuth
- Sidebar now shows the signed-in user's initials/name and a log out link
- Dashboard greeting is personalised with the account's first name
- Profile page shows account details alongside quiz answers
- Fixed a project structure issue where files were nested one level too deep after the initial GitHub upload

### v0.1.0
- Initial prototype: dashboard, onboarding quiz, hardware/liquid logging, wishlist, discover with recommendations, profile/reset

---

## Project structure

```
vape-assist/
├── login.html            Sign up / sign in (placeholder auth)
├── index.html             Dashboard (home page)
├── onboarding.html         Onboarding quiz
├── hardware.html           My Hardware
├── liquids.html            My Liquids
├── wishlist.html            Wishlist
├── discover.html            Browse + recommendations + retailer prices
├── profile.html              Account + quiz answers + reset data
├── css/
│   ├── variables.css         Colours, spacing, fonts
│   ├── base.css              Page skeleton (sidebar + content grid)
│   └── components.css        Cards, badges, buttons, forms, progress ring
└── js/
    ├── data/
    │   ├── store.js             localStorage data layer (read this first)
    │   ├── catalog.js            Sample hardware/liquid "database"
    │   └── quiz-questions.js     Onboarding quiz definition
    ├── recommendations.js        Rule-based recommendation engine
    ├── components/                Reusable render functions (sidebar, cards, etc.)
    └── pages/                     One controller file per HTML page
```

## Running it locally

The JS is split into ES modules, so open it through a local server, not by double-clicking the HTML file:

```bash
npm start
# or: python3 -m http.server 5173
```

Then open the printed `localhost` address. In VS Code, the Live Server extension does the same thing with auto-refresh on save, right-click `index.html` → "Open with Live Server."

---

## Roadmap

**Real authentication (Google + email)**
The current sign-up is a local placeholder (see the comment on `saveAccount()` in `js/data/store.js`), no password, nothing sent anywhere. Real Google sign-in needs a backend to verify the token Google issues, so it's planned alongside the backend below rather than before it. Real email sign-up would add password hashing and a proper session, also backend work.

**Backend + database**
Planned as Node.js + Express, with SQLite to start (Postgres later if this goes further). The frontend is already written to make this an additive change rather than a rewrite:

1. Build API routes mirroring the functions already in `js/data/store.js` (`GET/POST /api/hardware`, `/api/liquids`, `/api/wishlist`, `/api/account`, etc.), backed by real tables instead of localStorage.
2. Edit the *inside* of each `store.js` function to call `fetch('/api/...')` instead of `localStorage`. Every function already returns a Promise and every caller already `await`s it, so nothing in `js/pages/` or `js/components/` needs to change.
3. Add real sessions/auth so data is tied to an actual account, not "whoever has this browser open."
4. Move `js/data/catalog.js` into the database too, and replace the placeholder `retailers` data with a real source (an affiliate product feed, or a scraper that respects each retailer's terms of service).
5. Once ratings come from real different users, "community rating" becomes a genuine aggregate computed by the backend instead of a fixed seeded number.

**Other ideas not yet scheduled**
- Split "Community" and "Deals & Retailers" into their own nav pages instead of folding them into Discover
- Push notifications / reminders for overdue coils
- Puff-count tracking if a compatible device ever exposes that data
