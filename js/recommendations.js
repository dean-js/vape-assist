/**
 * recommendations.js
 * ---------------------------------------------------------------
 * A simple RULE-BASED recommendation engine (no AI/ML - just
 * scoring by matching tags, which is easy to read and to debug).
 *
 * The core idea:
 *   1. Build a "tag weight" map for the user: which tags (fruit,
 *      menthol, mtl, pod-system, etc.) they seem to like, and how
 *      strongly. Quiz answers count a little; things they've
 *      actually logged and rated highly count a lot more.
 *   2. Score every catalogue item by how many of its tags overlap
 *      with the user's tag weights, nudged by the item's community
 *      rating and popularity.
 *   3. Sort and return the top N.
 *
 * If nothing has been logged yet, the quiz answers alone still
 * produce a usable tag profile - so a brand new user still sees
 * sensible suggestions on day one.
 * ---------------------------------------------------------------
 */

import { HARDWARE_CATALOG, LIQUID_CATALOG, cheapestRetailer } from "./data/catalog.js";
import { daysSince } from "./data/store.js";

/* ---------------------- Tag profile building ---------------------- */

/**
 * Combines quiz answers + logged hardware/liquids + wishlist into one
 * "how much does this user seem to like each tag" map.
 * Quiz answers = weight 1. A logged/owned item = weight 2 per tag.
 * A liquid the user rated 4-5 stars = an extra weight 3 per tag.
 */
export function buildTagWeights(profile, hardware, liquids, wishlist, personalRatings, catalogLookup) {
  const weights = {};
  const bump = (tags, amount) => {
    (tags || []).forEach((tag) => {
      weights[tag] = (weights[tag] || 0) + amount;
    });
  };

  if (profile) {
    bump(profile.flavourPreferences, 1);
    bump(profile.deviceTypeTags, 1);
  }

  hardware.forEach((item) => bump(item.tags, 2));
  liquids.forEach((item) => {
    bump(item.flavourTags, 2);
    const rating = personalRatings?.[item.catalogId]?.rating;
    if (rating && rating >= 4) bump(item.flavourTags, 3);
  });

  wishlist.forEach((entry) => {
    const catalogItem = catalogLookup(entry.catalogId);
    if (catalogItem) bump(catalogItem.tags, 1);
  });

  return weights;
}

/** How well does one catalogue item's tags match the user's tag weights? */
function scoreItem(item, tagWeights) {
  const tagScore = (item.tags || []).reduce((sum, tag) => sum + (tagWeights[tag] || 0), 0);
  const ratingBoost = (item.communityRating || 0) * 2;
  const popularityBoost = (item.popularity || 0) * 0.05;
  return tagScore * 4 + ratingBoost + popularityBoost;
}

/* ---------------------- Public recommendation functions ---------------------- */

/**
 * Recommend liquids the user hasn't already logged, ranked by tag match.
 * @param {object} tagWeights - from buildTagWeights()
 * @param {string[]} excludeCatalogIds - liquids already logged/tried
 * @param {number} limit
 */
export function recommendLiquids(tagWeights, excludeCatalogIds = [], limit = 6) {
  return LIQUID_CATALOG
    .filter((item) => !excludeCatalogIds.includes(item.id))
    .map((item) => ({ item, score: scoreItem(item, tagWeights) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * Recommend hardware (devices/coils/accessories) not already owned.
 */
export function recommendHardware(tagWeights, excludeCatalogIds = [], limit = 6) {
  return HARDWARE_CATALOG
    .filter((item) => !excludeCatalogIds.includes(item.id))
    .map((item) => ({ item, score: scoreItem(item, tagWeights) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map((entry) => entry.item);
}

/**
 * The consumables that fit a specific device the user owns: standalone
 * replacement coils (mod/tank setups like the GeekVape L200) AND
 * built-in-coil pods (pod systems like the Xlim SQ Pro / XROS, where
 * "changing the coil" means buying a new pod in a given Ω). Sorted by
 * community rating. Used for the "coils & pods for your devices"
 * section on Discover.
 */
export function recommendCoilsForDevice(deviceCatalogId, limit = 3) {
  return HARDWARE_CATALOG
    .filter((item) => (item.category === "coil" || item.category === "pod") && (item.compatibleWith || []).includes(deviceCatalogId))
    .sort((a, b) => b.communityRating - a.communityRating)
    .slice(0, limit);
}

/* ---------------------- Coil tracker status ---------------------- */

/**
 * Turns the raw hardware log into a friendly "coil health" summary
 * for every coil currently in use: days used, % of average life used,
 * and a status the UI can colour-code.
 */
export function getCoilStatuses(hardware) {
  return hardware
    .filter((item) => item.type === "coil" && item.inUse)
    .map((coil) => {
      const daysUsed = daysSince(coil.installedDate);
      const avgLife = coil.avgLifeDays || 11;
      const percentUsed = Math.min(100, Math.round((daysUsed / avgLife) * 100));
      const daysRemaining = Math.max(0, avgLife - daysUsed);
      let status = "ok";
      if (percentUsed >= 100) status = "overdue";
      else if (percentUsed >= 75) status = "warning";
      return { ...coil, daysUsed, avgLife, percentUsed, daysRemaining, status };
    });
}

/* ---------------------- Deals / price helpers ---------------------- */

/**
 * For a list of catalogue items, returns each one paired with its
 * cheapest in-stock retailer - what the "Best Deals For You" and
 * wishlist price-drop sections are built from.
 */
export function withBestPrice(items) {
  return items.map((item) => ({ item, bestPrice: cheapestRetailer(item) }));
}
