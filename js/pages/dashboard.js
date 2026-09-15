/**
 * pages/dashboard.js
 * Controller for index.html. "Controller" just means: this file
 * fetches the data the page needs and injects rendered HTML into
 * the placeholders that index.html already has (#stat-cards,
 * #setup-row, etc). All the actual markup-building lives in
 * js/components/*.js so it can be reused elsewhere.
 */

import { initPage, renderOnboardingBanner, wireWishlistButtons } from "../components/shared.js";
import { renderStatCard } from "../components/statCard.js";
import { renderCoilRing } from "../components/coilRing.js";
import { renderProductCard } from "../components/productCard.js";
import {
  getHardware,
  getLiquids,
  getWishlist,
  getPersonalRatings,
  isWishlisted,
  daysSince,
} from "../data/store.js";
import { findCatalogItem, cheapestRetailer } from "../data/catalog.js";
import { buildTagWeights, recommendLiquids, recommendHardware, getCoilStatuses, withBestPrice } from "../recommendations.js";

/** Rough UK average cost per cigarette, used only to estimate "money saved". Tweak freely. */
const EST_COST_PER_CIGARETTE = 0.6;
const CIGARETTES_PER_DAY_MIDPOINT = { "1-5": 3, "6-15": 10, "16-25": 20, "25+": 30 };

async function render() {
  const profile = await initPage("dashboard");
  document.getElementById("onboarding-banner").innerHTML = renderOnboardingBanner(profile);
  setGreeting();

  const [hardware, liquids, wishlist, personalRatings] = await Promise.all([
    getHardware(),
    getLiquids(),
    getWishlist(),
    getPersonalRatings(),
  ]);

  renderStatCards(profile, hardware, liquids);
  await renderSetupRow(hardware, liquids, wishlist);
  await renderRecommendations(profile, hardware, liquids, wishlist, personalRatings);
  await renderDeals(wishlist);

  wireWishlistButtons(() => render());
}

function setGreeting() {
  const hour = new Date().getHours();
  const label = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
  document.getElementById("greeting").textContent = `${label} 👋`;
}

function renderStatCards(profile, hardware, liquids) {
  const startDate = profile?.startDate || profile?.updatedAt;
  const daysTracked = startDate ? daysSince(startDate) : 0;

  const moneySaved = profile
    ? (CIGARETTES_PER_DAY_MIDPOINT[profile.cigarettesPerDay] || 10) * EST_COST_PER_CIGARETTE * daysTracked
    : 0;

  const favouriteCategory = getFavouriteFlavourCategory(profile, liquids);

  const cards = [
    renderStatCard({
      icon: "🌿",
      label: "Smoke Free",
      value: profile ? `${daysTracked} Days` : "—",
      sub: profile ? "Since you completed onboarding" : "Complete the quiz to start tracking",
    }),
    renderStatCard({
      icon: "💰",
      label: "Money Saved (est.)",
      value: profile ? `£${moneySaved.toFixed(2)}` : "—",
      sub: "vs. your reported smoking habit",
    }),
    renderStatCard({
      icon: "📦",
      label: "Items Logged",
      value: hardware.length + liquids.length,
      sub: `${hardware.length} hardware · ${liquids.length} liquids`,
    }),
    renderStatCard({
      icon: "❤️",
      label: "Favourite Category",
      value: favouriteCategory || "Not enough data",
      sub: "Based on what you log and rate",
    }),
  ];
  document.getElementById("stat-cards").innerHTML = cards.join("");
}

function getFavouriteFlavourCategory(profile, liquids) {
  const counts = {};
  liquids.forEach((liq) => {
    if (liq.flavourCategory) counts[liq.flavourCategory] = (counts[liq.flavourCategory] || 0) + 1;
  });
  const fromLogs = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0];
  if (fromLogs) return capitalise(fromLogs);
  return profile?.flavourPreferences?.[0] ? capitalise(profile.flavourPreferences[0]) : null;
}

function capitalise(word) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

async function renderSetupRow(hardware, liquids, wishlist) {
  const el = document.getElementById("setup-row");

  const currentDevice = hardware.find((h) => h.type === "device" && h.inUse);
  const currentPod = hardware.find((h) => h.type === "pod" && h.inUse);
  const currentLiquid = [...liquids].sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt))[0];
  const coilStatuses = getCoilStatuses(hardware);
  const primaryCoil = coilStatuses[0];

  el.innerHTML = `
    <div class="panel">
      <div class="section-header"><h2>Current Setup</h2><a href="hardware.html">Edit</a></div>
      ${renderSetupRowItem("Device", currentDevice?.name, currentDevice?.brand)}
      ${renderSetupRowItem("Pod / Tank", currentPod?.name, currentPod?.brand)}
      ${renderSetupRowItem("Liquid", currentLiquid?.name, currentLiquid ? `${currentLiquid.remainingPercent}% remaining` : null)}
      ${!currentDevice && !currentLiquid ? `<p class="empty-state">Nothing logged yet. <a href="hardware.html" style="color:var(--color-accent-soft);">Log your hardware</a> to get started.</p>` : ""}
    </div>

    <div class="panel">
      <div class="section-header"><h2>Coil Tracker</h2>${primaryCoil ? `<span class="badge badge-${statusToBadge(primaryCoil.status)}">${primaryCoil.status.toUpperCase()}</span>` : ""}</div>
      ${
        primaryCoil
          ? `
        <div style="display:flex;align-items:center;gap:16px;">
          ${renderCoilRing({ percentUsed: primaryCoil.percentUsed, daysUsed: primaryCoil.daysUsed, status: primaryCoil.status })}
          <div>
            <div class="row-title">${primaryCoil.name}</div>
            <div class="row-sub">Avg life: ${primaryCoil.avgLife} days</div>
            <div class="row-sub">${primaryCoil.daysRemaining > 0 ? `${primaryCoil.daysRemaining} days left (est.)` : "Overdue for a swap"}</div>
          </div>
        </div>
        <a href="hardware.html" class="btn btn-primary btn-full" style="margin-top:16px;">+ Replace Coil</a>`
          : `<p class="empty-state">No coil logged yet.</p>`
      }
    </div>

    <div class="panel">
      <div class="section-header"><h2>Wishlist</h2><a href="wishlist.html">View All</a></div>
      ${
        wishlist.length
          ? `<ul class="row-list">${wishlist
              .slice(0, 3)
              .map((entry) => {
                const item = findCatalogItem(entry.catalogId);
                if (!item) return "";
                const best = cheapestRetailer(item);
                return `<li class="row-item"><div class="row-main"><span class="row-title">${item.name}</span><span class="row-sub">${item.brand}</span></div><span class="row-title">${best ? "£" + best.price.toFixed(2) : "N/A"}</span></li>`;
              })
              .join("")}</ul>`
          : `<p class="empty-state">Nothing saved yet. <a href="discover.html" style="color:var(--color-accent-soft);">Browse products</a>.</p>`
      }
    </div>`;
}

function renderSetupRowItem(label, name, sub) {
  return `
    <div class="row-item">
      <div class="row-main">
        <span class="row-sub">${label}</span>
        <span class="row-title">${name || "Not set"}</span>
      </div>
      <span class="row-sub">${sub || ""}</span>
    </div>`;
}

function statusToBadge(status) {
  if (status === "overdue") return "danger";
  if (status === "warning") return "warning";
  return "success";
}

async function renderRecommendations(profile, hardware, liquids, wishlist, personalRatings) {
  const tagWeights = buildTagWeights(profile, hardware, liquids, wishlist, personalRatings, findCatalogItem);
  const loggedLiquidIds = liquids.map((l) => l.catalogId).filter(Boolean);
  const loggedHardwareIds = hardware.map((h) => h.catalogId).filter(Boolean);

  const liquidPicks = recommendLiquids(tagWeights, loggedLiquidIds, 3);
  const hardwarePicks = recommendHardware(tagWeights, loggedHardwareIds, 1);
  const picks = [...liquidPicks, ...hardwarePicks].slice(0, 3);

  const wishlistIds = wishlist.map((w) => w.catalogId);
  const cardsHtml = await Promise.all(
    picks.map(async (item) => {
      const best = cheapestRetailer(item);
      const wishlisted = wishlistIds.includes(item.id);
      return renderProductCard({ item, bestPrice: best, wishlisted, showWishlistButton: true });
    })
  );

  document.getElementById("discover-cards").innerHTML =
    cardsHtml.join("") || `<p class="empty-state">Log some hardware or liquids so we can learn your taste.</p>`;
}

async function renderDeals(wishlist) {
  const items = wishlist.length
    ? wishlist.map((w) => findCatalogItem(w.catalogId)).filter(Boolean)
    : [...(await import("../data/catalog.js")).LIQUID_CATALOG].sort((a, b) => b.popularity - a.popularity).slice(0, 3);

  const withPrices = withBestPrice(items);

  document.getElementById("deals-list").innerHTML =
    withPrices
      .map(
        ({ item, bestPrice }) => `
      <div class="row-item">
        <div class="row-main">
          <span class="row-title">${item.name}</span>
          <span class="row-sub">${bestPrice ? bestPrice.name : "Currently out of stock"}</span>
        </div>
        <span class="row-title">${bestPrice ? "£" + bestPrice.price.toFixed(2) : "—"}</span>
      </div>`
      )
      .join("") || `<p class="empty-state">Add items to your wishlist to track their prices here.</p>`;
}

render();
