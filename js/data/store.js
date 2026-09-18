/**
 * store.js
 * ---------------------------------------------------------------
 * This is the app's ONLY data access layer. Every page talks to
 * data through the functions exported here - nothing in js/pages
 * or js/components ever touches localStorage directly.
 *
 * WHY IT MATTERS FOR LATER:
 * Every function below returns a Promise (using `async`), even
 * though right now it just reads/writes localStorage, which is
 * instant. That's on purpose. If you outgrow localStorage and add
 * a real backend + database, you only change the INSIDE of these
 * functions to use `fetch('/api/...')` instead. Every page.js file
 * that calls `await getHardware()` keeps working unchanged, because
 * it was always written as if the data might come over a network.
 *
 * This is the same shape a real API client module would take.
 * ---------------------------------------------------------------
 */

const KEYS = {
  account: "vt_account",
  profile: "vt_profile",
  hardware: "vt_hardware",
  liquids: "vt_liquids",
  wishlist: "vt_wishlist",
  recentlyViewed: "vt_recently_viewed",
  personalRatings: "vt_personal_ratings",
};

/** Read JSON from localStorage, with a fallback if nothing is stored yet. */
function readKey(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    return raw ? JSON.parse(raw) : fallback;
  } catch (err) {
    console.warn(`[store] Could not read ${key}, using fallback.`, err);
    return fallback;
  }
}

/** Write a JS value to localStorage as JSON. */
function writeKey(key, value) {
  localStorage.setItem(key, JSON.stringify(value));
}

/** Small helper so ids look like "hw_1699999999999_412" - unique enough for a local app. */
function makeId(prefix) {
  return `${prefix}_${Date.now()}_${Math.floor(Math.random() * 1000)}`;
}

/* =========================== Account =========================== */
/**
 * The "account" is separate from the quiz "profile" below: account =
 * who's signed in (name, email, how they signed up), profile = their
 * smoking/vaping preferences from the quiz. Splitting them keeps the
 * eventual real-auth swap contained to just these functions.
 *
 * IMPORTANT: this is a LOCAL-ONLY placeholder, not real authentication.
 * There's no password, no server checking anything, and "Continue with
 * Google" doesn't talk to Google - it's UI groundwork for real OAuth
 * once a backend exists to verify tokens safely. See the "Accounts"
 * section in README.md for the real-auth plan.
 */

export async function getAccount() {
  return readKey(KEYS.account, null);
}

export async function saveAccount({ name, email, provider = "email" }) {
  const account = { name, email, provider, createdAt: new Date().toISOString() };
  writeKey(KEYS.account, account);
  return account;
}

export async function clearAccount() {
  localStorage.removeItem(KEYS.account);
}

/* =========================== Profile =========================== */

export async function getProfile() {
  return readKey(KEYS.profile, null);
}

export async function saveProfile(profile) {
  const toSave = { ...profile, completedQuiz: true, updatedAt: new Date().toISOString() };
  writeKey(KEYS.profile, toSave);
  return toSave;
}

/* =========================== Hardware =========================== */
/**
 * A hardware entry looks like:
 * {
 *   id, catalogId, type: "device" | "pod" | "coil" | "accessory",
 *   name, brand, inUse, installedDate, avgLifeDays, resistanceOhms, notes
 * }
 */

export async function getHardware() {
  return readKey(KEYS.hardware, []);
}

export async function addHardwareItem(item) {
  const all = await getHardware();
  const entry = { id: makeId("hw"), installedDate: new Date().toISOString(), inUse: true, ...item };
  all.push(entry);
  writeKey(KEYS.hardware, all);
  return entry;
}

export async function updateHardwareItem(id, changes) {
  const all = await getHardware();
  const next = all.map((item) => (item.id === id ? { ...item, ...changes } : item));
  writeKey(KEYS.hardware, next);
  return next.find((item) => item.id === id);
}

export async function removeHardwareItem(id) {
  const all = await getHardware();
  writeKey(KEYS.hardware, all.filter((item) => item.id !== id));
}

/** Replacing a coil = mark the old one retired, log a fresh one installed today. */
export async function replaceCoil({ deviceId, name, brand, avgLifeDays, resistanceOhms, catalogId }) {
  const all = await getHardware();
  const updated = all.map((item) =>
    item.type === "coil" && item.deviceId === deviceId && item.inUse
      ? { ...item, inUse: false, retiredDate: new Date().toISOString() }
      : item
  );
  const fresh = {
    id: makeId("hw"),
    type: "coil",
    deviceId,
    name,
    brand,
    catalogId,
    avgLifeDays: avgLifeDays || 11,
    resistanceOhms,
    installedDate: new Date().toISOString(),
    inUse: true,
  };
  updated.push(fresh);
  writeKey(KEYS.hardware, updated);
  return fresh;
}

/** Days since a coil (or any dated item) was installed. */
export function daysSince(dateString) {
  const installed = new Date(dateString).getTime();
  const now = Date.now();
  return Math.max(0, Math.floor((now - installed) / (1000 * 60 * 60 * 24)));
}

/* =========================== Liquids =========================== */
/**
 * A liquid log entry looks like:
 * {
 *   id, catalogId, name, brand, flavourTags, nicotineMg, vgPg,
 *   bottleSizeMl, quantity, remainingPercent, wouldBuyAgain, notes, loggedAt
 * }
 * bottleSizeMl is the size of ONE bottle (e.g. 10 for a typical nic salt,
 * 50 for a shortfill). quantity is how many of that bottle you currently
 * have. remainingPercent tracks how much of the bottle you're currently
 * using is left, same as before.
 */

export async function getLiquids() {
  return readKey(KEYS.liquids, []);
}

export async function addLiquidLog(entry) {
  const all = await getLiquids();
  const toSave = {
    id: makeId("liq"),
    loggedAt: new Date().toISOString(),
    remainingPercent: 100,
    quantity: 1,
    bottleSizeMl: null,
    ...entry,
  };
  all.push(toSave);
  writeKey(KEYS.liquids, all);
  return toSave;
}

export async function updateLiquidLog(id, changes) {
  const all = await getLiquids();
  const next = all.map((item) => (item.id === id ? { ...item, ...changes } : item));
  writeKey(KEYS.liquids, next);
  return next.find((item) => item.id === id);
}

export async function removeLiquidLog(id) {
  const all = await getLiquids();
  writeKey(KEYS.liquids, all.filter((item) => item.id !== id));
}

/** Personal 1-5 rating + "would buy again" for a catalog liquid, keyed by catalogId. */
export async function rateLiquid(catalogId, { rating, wouldBuyAgain }) {
  const all = readKey(KEYS.personalRatings, {});
  all[catalogId] = { rating, wouldBuyAgain, ratedAt: new Date().toISOString() };
  writeKey(KEYS.personalRatings, all);
  return all[catalogId];
}

export async function getPersonalRatings() {
  return readKey(KEYS.personalRatings, {});
}

/* =========================== Wishlist =========================== */

export async function getWishlist() {
  return readKey(KEYS.wishlist, []);
}

export async function addToWishlist(catalogId, kind) {
  const all = await getWishlist();
  if (all.some((item) => item.catalogId === catalogId)) return all;
  const next = [...all, { catalogId, kind, addedAt: new Date().toISOString() }];
  writeKey(KEYS.wishlist, next);
  return next;
}

export async function removeFromWishlist(catalogId) {
  const all = await getWishlist();
  const next = all.filter((item) => item.catalogId !== catalogId);
  writeKey(KEYS.wishlist, next);
  return next;
}

export async function isWishlisted(catalogId) {
  const all = await getWishlist();
  return all.some((item) => item.catalogId === catalogId);
}

/* ====================== Recently viewed ====================== */

export async function recordView(catalogId) {
  const all = readKey(KEYS.recentlyViewed, []);
  const next = [{ catalogId, viewedAt: new Date().toISOString() }, ...all.filter((v) => v.catalogId !== catalogId)].slice(0, 8);
  writeKey(KEYS.recentlyViewed, next);
  return next;
}

export async function getRecentlyViewed() {
  return readKey(KEYS.recentlyViewed, []);
}

/* ====================== Reset (for testing) ====================== */

/** Wipes all app data. Handy while you're learning/testing, wired up on the Profile page. */
export async function resetAllData() {
  Object.values(KEYS).forEach((key) => localStorage.removeItem(key));
}
