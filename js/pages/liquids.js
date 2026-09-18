/**
 * pages/liquids.js
 * "My Liquids" page: log e-liquids, rate them 1-5, mark whether
 * you'd buy again, track bottle size / how many you own, and how
 * much of the current one is left. Also supports editing an
 * existing entry rather than only add/remove.
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { LIQUID_CATALOG } from "../data/catalog.js";
import { getLiquids, addLiquidLog, updateLiquidLog, removeLiquidLog, rateLiquid, getPersonalRatings } from "../data/store.js";

let selectedRating = 0;
let editingId = null; // set while the form is editing an existing entry instead of adding a new one

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
    setRating(Number(chip.dataset.value));
  });
}

function setRating(value) {
  selectedRating = value;
  document
    .querySelectorAll("#rating-chips .chip")
    .forEach((c) => c.classList.toggle("selected", Number(c.dataset.value) <= selectedRating));
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
    if (item.bottleSizeMl) document.getElementById("liquid-bottle-size").value = item.bottleSizeMl;
  });
}

function wireForm() {
  const panel = document.getElementById("add-liquid-panel");
  document.getElementById("add-liquid-btn").addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });
  document.getElementById("cancel-add-liquid").addEventListener("click", () => {
    panel.style.display = "none";
    resetFormToAddMode();
  });

  document.getElementById("add-liquid-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);
    // The catalogue link is only meaningful when creating a new entry - the
    // dropdown is hidden (and untouched) while editing, so it's kept out of
    // the shared payload and never overwrites an existing entry's catalogId.
    const catalogId = editingId ? null : form.get("catalogId") || null;
    const catalogItem = LIQUID_CATALOG.find((l) => l.id === catalogId);

    const payload = {
      name: form.get("name"),
      brand: form.get("brand"),
      flavourCategory: form.get("flavourCategory"),
      flavourTags: catalogItem ? catalogItem.tags : [form.get("flavourCategory")],
      nicotineMg: Number(form.get("nicotineMg")),
      bottleSizeMl: form.get("bottleSizeMl") ? Number(form.get("bottleSizeMl")) : null,
      quantity: form.get("quantity") ? Number(form.get("quantity")) : 1,
      wouldBuyAgain: form.get("wouldBuyAgain") === "on",
      notes: form.get("notes") || "",
    };

    let savedCatalogId = catalogId;
    if (editingId) {
      const updated = await updateLiquidLog(editingId, payload);
      savedCatalogId = updated?.catalogId;
      showToast("Liquid updated");
    } else {
      await addLiquidLog({ catalogId, ...payload });
      showToast("Liquid logged");
    }

    if (savedCatalogId && selectedRating > 0) {
      await rateLiquid(savedCatalogId, { rating: selectedRating, wouldBuyAgain: payload.wouldBuyAgain });
    }

    panel.style.display = "none";
    resetFormToAddMode();
    await renderList();
  });
}

/** Fills the form with an existing entry's data and switches it into "edit" mode. */
async function openEditForm(entry) {
  editingId = entry.id;
  document.getElementById("liquid-panel-title").textContent = "Edit liquid";
  document.getElementById("liquid-submit-btn").textContent = "Save changes";
  document.getElementById("add-liquid-panel").style.display = "block";

  // The catalogue link stays fixed once logged - only the details below are editable.
  document.getElementById("liquid-catalog-field").style.display = "none";

  document.getElementById("liquid-name").value = entry.name || "";
  document.getElementById("liquid-brand").value = entry.brand || "";
  document.getElementById("liquid-category").value = entry.flavourCategory || "fruit";
  document.getElementById("liquid-nicotine").value = String(entry.nicotineMg ?? 0);
  document.getElementById("liquid-bottle-size").value = entry.bottleSizeMl || "";
  document.getElementById("liquid-quantity").value = entry.quantity ?? 1;
  document.getElementById("liquid-would-buy-again").checked = !!entry.wouldBuyAgain;
  document.getElementById("liquid-notes").value = entry.notes || "";

  let existingRating = 0;
  if (entry.catalogId) {
    const ratings = await getPersonalRatings();
    existingRating = ratings[entry.catalogId]?.rating || 0;
  }
  setRating(existingRating);
}

function resetFormToAddMode() {
  editingId = null;
  document.getElementById("liquid-panel-title").textContent = "Log a liquid";
  document.getElementById("liquid-submit-btn").textContent = "Save";
  document.getElementById("liquid-catalog-field").style.display = "block";
  document.getElementById("add-liquid-form").reset();
  setRating(0);
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

  document.querySelectorAll(".js-edit-liquid").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const liquids = await getLiquids();
      const entry = liquids.find((l) => l.id === btn.dataset.id);
      if (entry) await openEditForm(entry);
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
  const bottleInfo = entry.bottleSizeMl
    ? `${entry.bottleSizeMl}ml${entry.quantity > 1 ? ` × ${entry.quantity} bottles` : entry.quantity === 0 ? " · none left" : ""}`
    : "";

  return `
    <div class="row-item">
      <div class="row-main">
        <span class="row-title">${entry.name}</span>
        <span class="row-sub">${entry.brand || ""} · ${entry.nicotineMg}mg · ${entry.flavourCategory || ""}${bottleInfo ? " · " + bottleInfo : ""}</span>
      </div>
      <div style="display:flex; align-items:center; gap:16px; flex-wrap: wrap;">
        <div style="text-align:right;">
          <div class="text-success" style="font-size:12px;">${entry.remainingPercent}% Remaining</div>
          <input type="range" class="js-remaining" min="0" max="100" value="${entry.remainingPercent}" data-id="${entry.id}" style="width:100px;" />
        </div>
        <span class="badge ${entry.wouldBuyAgain ? "badge-success" : "badge-neutral"}">${entry.wouldBuyAgain ? "Would buy again" : "Not sure"}</span>
        <button class="btn btn-secondary btn-sm js-edit-liquid" data-id="${entry.id}">Edit</button>
        <button class="btn btn-secondary btn-sm js-remove-liquid" data-id="${entry.id}">Remove</button>
      </div>
    </div>`;
}

render();
