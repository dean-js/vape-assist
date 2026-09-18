/**
 * pages/hardware.js
 * "My Hardware" page: log devices/pods/coils/accessories, see coil
 * age at a glance, retire and replace coils, and edit an entry's
 * details after the fact instead of only add/remove.
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { HARDWARE_CATALOG } from "../data/catalog.js";
import { getHardware, addHardwareItem, updateHardwareItem, removeHardwareItem, replaceCoil } from "../data/store.js";
import { getCoilStatuses } from "../recommendations.js";

/** Types whose catalogue items may come with a fixed set of Ω choices (built-in-coil pods, coils). */
const OHM_AWARE_TYPES = ["pod", "coil"];

let editingId = null; // set while the form is editing an existing entry instead of adding a new one

async function render() {
  await initPage("hardware");
  wireTypeAndCatalogSelects();
  wireForm();
  await renderLists();
}

/** Rebuilds the catalogue dropdown to match the current Type selection, and shows/hides the Ω + avg-life fields. */
function refreshCatalogOptionsForType() {
  const type = document.getElementById("hardware-type").value;
  const catalogSelect = document.getElementById("hardware-catalog-select");
  const categoryMap = { device: "device", pod: "pod", tank: "tank", coil: "coil", accessory: "accessory" };
  const matches = HARDWARE_CATALOG.filter((item) => item.category === categoryMap[type]);

  catalogSelect.innerHTML =
    `<option value="">-- Custom item --</option>` +
    matches.map((item) => `<option value="${item.id}">${item.brand} ${item.name}</option>`).join("");

  document.getElementById("resistance-field").style.display = OHM_AWARE_TYPES.includes(type) ? "grid" : "none";
  document.getElementById("avg-life-field").style.display = type === "coil" ? "block" : "none";
  setResistanceMode(null); // back to "type a number" until a catalogue item is chosen
}

/** Switches the Ω control between a dropdown (known variants) and a free-typed number. */
function setResistanceMode(catalogItem, currentValue) {
  const resistanceSelect = document.getElementById("hardware-resistance-select");
  const resistanceInput = document.getElementById("hardware-resistance");

  if (catalogItem?.ohmOptions?.length) {
    resistanceSelect.innerHTML = catalogItem.ohmOptions.map((ohm) => `<option value="${ohm}">${ohm}Ω</option>`).join("");
    if (currentValue) resistanceSelect.value = currentValue;
    resistanceSelect.style.display = "block";
    resistanceInput.style.display = "none";
  } else {
    resistanceSelect.style.display = "none";
    resistanceInput.style.display = "block";
    resistanceInput.value = currentValue || "";
  }
}

function wireTypeAndCatalogSelects() {
  const typeSelect = document.getElementById("hardware-type");
  const catalogSelect = document.getElementById("hardware-catalog-select");

  typeSelect.addEventListener("change", refreshCatalogOptionsForType);
  catalogSelect.addEventListener("change", () => {
    const item = HARDWARE_CATALOG.find((h) => h.id === catalogSelect.value);
    if (!item) {
      setResistanceMode(null);
      return;
    }

    document.getElementById("hardware-name").value = item.name;
    document.getElementById("hardware-brand").value = item.brand;
    setResistanceMode(item);

    if (item.category === "coil" || item.category === "pod") {
      document.getElementById("hardware-avg-life").value = item.avgLifeDays || 11;
    }
  });

  refreshCatalogOptionsForType();
}

function wireForm() {
  const panel = document.getElementById("add-hardware-panel");
  document.getElementById("add-hardware-btn").addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });
  document.getElementById("cancel-add-hardware").addEventListener("click", () => {
    panel.style.display = "none";
    resetFormToAddMode();
  });

  document.getElementById("add-hardware-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    // Whichever Ω control is actually visible is the one the user filled in.
    const resistanceSelect = document.getElementById("hardware-resistance-select");
    const resistanceInput = document.getElementById("hardware-resistance");
    const resistanceValue =
      resistanceSelect.style.display !== "none" && resistanceSelect.value ? resistanceSelect.value : resistanceInput.value;
    const avgLifeVisible = document.getElementById("avg-life-field").style.display !== "none";

    const payload = {
      name: form.get("name"),
      brand: form.get("brand"),
      resistanceOhms: resistanceValue ? Number(resistanceValue) : undefined,
      avgLifeDays: avgLifeVisible && form.get("avgLifeDays") ? Number(form.get("avgLifeDays")) : undefined,
      notes: form.get("notes") || "",
    };

    if (editingId) {
      await updateHardwareItem(editingId, payload);
      showToast("Hardware updated");
    } else {
      await addHardwareItem({ type: form.get("type"), catalogId: form.get("catalogId") || null, ...payload });
      showToast("Hardware added");
    }

    panel.style.display = "none";
    resetFormToAddMode();
    await renderLists();
  });
}

/** Fills the form with an existing entry's data and switches it into "edit" mode. */
function openEditForm(item) {
  editingId = item.id;
  document.getElementById("hardware-panel-title").textContent = "Edit hardware";
  document.getElementById("hardware-submit-btn").textContent = "Save changes";
  document.getElementById("add-hardware-panel").style.display = "block";

  // Type and catalogue link stay fixed once logged - only the details below are editable.
  document.getElementById("hardware-type").value = item.type;
  document.getElementById("hardware-type").disabled = true;
  document.getElementById("hardware-catalog-field").style.display = "none";

  document.getElementById("hardware-name").value = item.name || "";
  document.getElementById("hardware-brand").value = item.brand || "";
  document.getElementById("hardware-notes").value = item.notes || "";

  const showResistance = OHM_AWARE_TYPES.includes(item.type);
  document.getElementById("resistance-field").style.display = showResistance ? "grid" : "none";
  document.getElementById("avg-life-field").style.display = item.type === "coil" ? "block" : "none";
  document.getElementById("hardware-avg-life").value = item.avgLifeDays || 11;

  const catalogItem = HARDWARE_CATALOG.find((h) => h.id === item.catalogId);
  setResistanceMode(catalogItem, item.resistanceOhms);
}

function resetFormToAddMode() {
  editingId = null;
  document.getElementById("hardware-panel-title").textContent = "Add hardware";
  document.getElementById("hardware-submit-btn").textContent = "Save";
  document.getElementById("hardware-type").disabled = false;
  document.getElementById("hardware-catalog-field").style.display = "block";
  document.getElementById("add-hardware-form").reset();
  refreshCatalogOptionsForType();
}

async function renderLists() {
  const hardware = await getHardware();

  const devices = hardware.filter((h) => h.type === "device" || h.type === "pod" || h.type === "tank");
  const coils = hardware.filter((h) => h.type === "coil");
  const accessories = hardware.filter((h) => h.type === "accessory");
  const coilStatuses = getCoilStatuses(hardware);

  document.getElementById("devices-list").innerHTML = devices.length
    ? devices.map((item) => renderRow(item)).join("")
    : `<p class="empty-state">No devices or pods logged yet.</p>`;

  document.getElementById("coils-list").innerHTML = coils.length
    ? coils
        .map((item) => {
          const status = coilStatuses.find((c) => c.id === item.id);
          return renderCoilRow(item, status);
        })
        .join("")
    : `<p class="empty-state">No coils logged yet.</p>`;

  document.getElementById("accessories-list").innerHTML = accessories.length
    ? accessories.map((item) => renderRow(item)).join("")
    : `<p class="empty-state">No accessories logged yet.</p>`;

  wireRowActions();
}

function renderRow(item) {
  return `
    <div class="row-item">
      <div class="row-main">
        <span class="row-title">${item.name}${item.resistanceOhms ? ` (${item.resistanceOhms}Ω)` : ""}</span>
        <span class="row-sub">${item.brand || ""} ${item.inUse ? "" : "· retired"}</span>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        ${item.inUse ? `<span class="badge badge-success">In Use</span>` : ""}
        <button class="btn btn-secondary btn-sm js-edit" data-id="${item.id}">Edit</button>
        <button class="btn btn-secondary btn-sm js-remove" data-id="${item.id}">Remove</button>
      </div>
    </div>`;
}

function renderCoilRow(item, status) {
  const badge = !status ? "" : status.status === "overdue" ? "danger" : status.status === "warning" ? "warning" : "success";
  return `
    <div class="row-item">
      <div class="row-main">
        <span class="row-title">${item.name} ${item.resistanceOhms ? `(${item.resistanceOhms}Ω)` : ""}</span>
        <span class="row-sub">${item.inUse && status ? `${status.daysUsed} / ${status.avgLife} days` : item.inUse ? "In use" : "Retired"}</span>
      </div>
      <div style="display:flex; gap:8px; align-items:center;">
        ${item.inUse && status ? `<span class="badge badge-${badge}">${status.status.toUpperCase()}</span>` : ""}
        ${item.inUse ? `<button class="btn btn-primary btn-sm js-replace" data-id="${item.id}">Replace</button>` : ""}
        <button class="btn btn-secondary btn-sm js-edit" data-id="${item.id}">Edit</button>
        <button class="btn btn-secondary btn-sm js-remove" data-id="${item.id}">Remove</button>
      </div>
    </div>`;
}

function wireRowActions() {
  document.querySelectorAll(".js-remove").forEach((btn) =>
    btn.addEventListener("click", async () => {
      await removeHardwareItem(btn.dataset.id);
      showToast("Removed");
      await renderLists();
    })
  );

  document.querySelectorAll(".js-edit").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const hardware = await getHardware();
      const item = hardware.find((h) => h.id === btn.dataset.id);
      if (item) openEditForm(item);
    })
  );

  document.querySelectorAll(".js-replace").forEach((btn) =>
    btn.addEventListener("click", async () => {
      const hardware = await getHardware();
      const coil = hardware.find((h) => h.id === btn.dataset.id);
      if (!coil) return;
      await replaceCoil({
        deviceId: coil.deviceId,
        name: coil.name,
        brand: coil.brand,
        avgLifeDays: coil.avgLifeDays,
        resistanceOhms: coil.resistanceOhms,
        catalogId: coil.catalogId,
      });
      showToast("Logged a fresh coil - old one retired");
      await renderLists();
    })
  );
}

render();
