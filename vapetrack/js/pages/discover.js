/**
 * pages/discover.js
 * Browse the full catalogue, tabbed by "For You" (tag-matched),
 * "Top Rated" (community rating) and "New In" (isNew flag). Also
 * surfaces coils that fit whatever devices the user has logged,
 * since that's one of the most useful "hardware recommendation"
 * moments described in the brief.
 */

import { initPage, wireWishlistButtons } from "../components/shared.js";
import { renderProductCard } from "../components/productCard.js";
import { LIQUID_CATALOG, HARDWARE_CATALOG, cheapestRetailer } from "../data/catalog.js";
import { getHardware, getLiquids, getWishlist, getPersonalRatings } from "../data/store.js";
import { buildTagWeights, recommendLiquids, recommendHardware, recommendCoilsForDevice } from "../recommendations.js";
import { findCatalogItem } from "../data/catalog.js";

let liquidTab = "for-you";
let hardwareTab = "for-you";
let tagWeights = {};
let wishlistIds = [];

async function render() {
  const profile = await initPage("discover");
  const [hardware, liquids, wishlist, personalRatings] = await Promise.all([
    getHardware(),
    getLiquids(),
    getWishlist(),
    getPersonalRatings(),
  ]);

  tagWeights = buildTagWeights(profile, hardware, liquids, wishlist, personalRatings, findCatalogItem);
  wishlistIds = wishlist.map((w) => w.catalogId);

  renderCoilsForYourDevices(hardware);
  renderLiquidTab();
  renderHardwareTab();

  document.getElementById("liquid-tabs").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    liquidTab = chip.dataset.tab;
    setActiveTab("liquid-tabs", chip);
    renderLiquidTab();
  });

  document.getElementById("hardware-tabs").addEventListener("click", (event) => {
    const chip = event.target.closest(".chip");
    if (!chip) return;
    hardwareTab = chip.dataset.tab;
    setActiveTab("hardware-tabs", chip);
    renderHardwareTab();
  });

  wireWishlistButtons(() => render());
}

function setActiveTab(groupId, chip) {
  document.querySelectorAll(`#${groupId} .chip`).forEach((c) => c.classList.remove("selected"));
  chip.classList.add("selected");
}

function renderLiquidTab() {
  let items;
  if (liquidTab === "for-you") items = recommendLiquids(tagWeights, [], 9);
  else if (liquidTab === "top-rated") items = [...LIQUID_CATALOG].sort((a, b) => b.communityRating - a.communityRating).slice(0, 9);
  else items = [...LIQUID_CATALOG].filter((i) => i.isNew).concat([...LIQUID_CATALOG].sort((a, b) => b.popularity - a.popularity)).slice(0, 9);

  renderCards("liquid-cards", items);
}

function renderHardwareTab() {
  let items;
  if (hardwareTab === "for-you") items = recommendHardware(tagWeights, [], 9);
  else if (hardwareTab === "top-rated") items = [...HARDWARE_CATALOG].sort((a, b) => b.communityRating - a.communityRating).slice(0, 9);
  else items = [...HARDWARE_CATALOG].filter((i) => i.isNew).concat([...HARDWARE_CATALOG].sort((a, b) => b.popularity - a.popularity)).slice(0, 9);

  renderCards("hardware-cards", items);
}

function renderCards(elementId, items) {
  const unique = Array.from(new Map(items.map((i) => [i.id, i])).values());
  document.getElementById(elementId).innerHTML =
    unique.map((item) => renderProductCard({ item, bestPrice: cheapestRetailer(item), wishlisted: wishlistIds.includes(item.id) })).join("") ||
    `<p class="empty-state">Nothing to show here yet.</p>`;
}

function renderCoilsForYourDevices(hardware) {
  const devices = hardware.filter((h) => h.type === "device" && h.inUse && h.catalogId);
  if (!devices.length) return;

  const section = document.getElementById("coils-for-you-section");
  const coils = devices.flatMap((device) => recommendCoilsForDevice(device.catalogId, 3));
  const unique = Array.from(new Map(coils.map((c) => [c.id, c])).values());

  if (!unique.length) return;
  section.style.display = "block";
  document.getElementById("coils-for-you").innerHTML = unique
    .map((item) => renderProductCard({ item, bestPrice: cheapestRetailer(item), wishlisted: wishlistIds.includes(item.id) }))
    .join("");
}

render();
