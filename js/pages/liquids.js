/**
 * pages/liquids.js
 * "My Liquids" page: log e-liquids, rate them 1-5, mark whether
 * you'd buy again, and track how much is left in the bottle.
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { LIQUID_CATALOG } from "../data/catalog.js";
import { getLiquids, addLiquidLog, updateLiquidLog, removeLiquidLog, rateLiquid } from "../data/store.js";

let selectedRating = 0;

async function render() {
  await initPage("liquids");
  renderRatingChips();
  populateCatalogSelect();
  wireForm();
  await renderList();
}

function renderRatingChips() {
  const wrap = document.getElementById("rating-chips");
  wrap.innerHTML = [1, 2, 3, 4, 5]
    .map((n) => `<button type="button" class="chip js-rating" data-value="${n}">${"★".repeat(n)}</button>`)
    .join("");
  wrap.addEventListener("click", (event) => {
    const chip = event.target.closest(".js-rating");
    if (!chip) return;
    selectedRating = Number(chip.dataset.value);
    wrap.querySelectorAll(".chip").forEach((c) => c.classList.toggle("selected", Number(c.dataset.value) <= selectedRating));
  });
}

function populateCatalogSelect() {
  const select = document.getElementById("liquid-catalog-select");
  select.innerHTML =
    `<option value="">-- Custom liquid --</option>` +
    LIQUID_CATALOG.map((item) => `<option value="${item.id}">${item.brand} ${item.name}</option>`).join("");

  select.addEventListener("change", () => {
    const item = LIQUID_CATALOG.find((l) => l.id === select.value);
    if (!item) return;
    document.getElementById("liquid-name").value = item.name;
    document.getElementById("liquid-brand").value = item.brand;
    document.getElementById("liquid-category").value = item.flavourCategory;
  });
}

function wireForm() {
  const panel = document.getElementById("add-liquid-panel");
  document.getElementById("add-liquid-btn").addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });
  document.getElementById("cancel-add-liquid").addEventListener("click", () => {
    panel.style.display = "none";
  });

  document.getElementById("add-liquid-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    const catalogId = form.get("catalogId") || null;
    const catalogItem = LIQUID_CATALOG.find((l) => l.id === catalogId);

    const entry = await addLiquidLog({
      catalogId,
      name: form.get("name"),
      brand: form.get("brand"),
      flavourCategory: form.get("flavourCategory"),
      flavourTags: catalogItem ? catalogItem.tags : [form.get("flavourCategory")],
      nicotineMg: Number(form.get("nicotineMg")),
      wouldBuyAgain: form.get("wouldBuyAgain") === "on",
      notes: form.get("notes") || "",
    });

    if (catalogId && selectedRating > 0) {
      await rateLiquid(catalogId, { rating: selectedRating, wouldBuyAgain: entry.wouldBuyAgain });
    }

    showToast("Liquid logged");
    event.target.reset();
    selectedRating = 0;
    panel.style.display = "none";
    await renderList();
  });
}

async function renderList() {
  const liquids = [...(await getLiquids())].sort((a, b) => new Date(b.loggedAt) - new Date(a.loggedAt));

  document.getElementById("liquids-list").innerHTML = liquids.length
    ? liquids.map(renderLiquidRow).join("")
    : `<p class="empty-state">Nothing logged yet. Try something and log it here.</p>`;

  document.querySelectorAll(".js-remove-liquid").forEach((btn) =>
    btn.addEventListener("click", async () => {
      await removeLiquidLog(btn.dataset.id);
      showToast("Removed");
      await renderList();
    })
  );

  document.querySelectorAll(".js-remaining").forEach((input) =>
    input.addEventListener("change", async () => {
      await updateLiquidLog(input.dataset.id, { remainingPercent: Number(input.value) });
      showToast("Updated");
    })
  );
}

function renderLiquidRow(entry) {
  return `
    <div class="row-item">
      <div class="row-main">
        <span class="row-title">${entry.name}</span>
        <span class="row-sub">${entry.brand || ""} · ${entry.nicotineMg}mg · ${entry.flavourCategory || ""}</span>
      </div>
      <div style="display:flex; align-items:center; gap:16px;">
        <div style="text-align:right;">
          <div class="text-success" style="font-size:12px;">${entry.remainingPercent}% Remaining</div>
          <input type="range" class="js-remaining" min="0" max="100" value="${entry.remainingPercent}" data-id="${entry.id}" style="width:100px;" />
        </div>
        <span class="badge ${entry.wouldBuyAgain ? "badge-success" : "badge-neutral"}">${entry.wouldBuyAgain ? "Would buy again" : "Not sure"}</span>
        <button class="btn btn-secondary btn-sm js-remove-liquid" data-id="${entry.id}">Remove</button>
      </div>
    </div>`;
}

render();
