/**
 * pages/hardware.js
 * "My Hardware" page: log devices/pods/coils/accessories, see coil
 * age at a glance, retire and replace coils.
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { HARDWARE_CATALOG } from "../data/catalog.js";
import { getHardware, addHardwareItem, updateHardwareItem, removeHardwareItem, replaceCoil } from "../data/store.js";
import { getCoilStatuses } from "../recommendations.js";

async function render() {
  await initPage("hardware");
  await populateCatalogSelect();
  wireForm();
  await renderLists();
}

/** Types whose catalogue items may come with a fixed set of Ω choices (built-in-coil pods, coils). */
const OHM_AWARE_TYPES = ["pod", "coil"];

async function populateCatalogSelect() {
  const typeSelect = document.getElementById("hardware-type");
  const catalogSelect = document.getElementById("hardware-catalog-select");
  const resistanceSelect = document.getElementById("hardware-resistance-select");
  const resistanceInput = document.getElementById("hardware-resistance");

  function refreshOptions() {
    const type = typeSelect.value;
    const categoryMap = { device: "device", pod: "pod", tank: "tank", coil: "coil", accessory: "accessory" };
    const matches = HARDWARE_CATALOG.filter((item) => item.category === categoryMap[type]);
    catalogSelect.innerHTML =
      `<option value="">-- Custom item --</option>` +
      matches.map((item) => `<option value="${item.id}">${item.brand} ${item.name}</option>`).join("");

    document.getElementById("resistance-field").style.display = OHM_AWARE_TYPES.includes(type) ? "grid" : "none";
    document.getElementById("avg-life-field").style.display = type === "coil" ? "block" : "none";
    // Reset the Ω controls back to "type a number" whenever the type changes.
    resistanceSelect.style.display = "none";
    resistanceInput.style.display = "block";
    resistanceInput.value = "";
  }

  typeSelect.addEventListener("change", refreshOptions);
  catalogSelect.addEventListener("change", () => {
    const item = HARDWARE_CATALOG.find((h) => h.id === catalogSelect.value);
    if (!item) {
      resistanceSelect.style.display = "none";
      resistanceInput.style.display = "block";
      resistanceInput.value = "";
      return;
    }

    document.getElementById("hardware-name").value = item.name;
    document.getElementById("hardware-brand").value = item.brand;

    if (item.ohmOptions?.length) {
      // This product comes in known resistances (e.g. OXVA EZ Pods: 0.4/0.6/0.8Ω)
      // - offer a dropdown of exactly those instead of a free-typed number.
      resistanceSelect.innerHTML = item.ohmOptions.map((ohm) => `<option value="${ohm}">${ohm}Ω</option>`).join("");
      resistanceSelect.style.display = "block";
      resistanceInput.style.display = "none";
    } else {
      resistanceSelect.style.display = "none";
      resistanceInput.style.display = "block";
      resistanceInput.value = "";
    }

    if (item.category === "coil" || item.category === "pod") {
      document.getElementById("hardware-avg-life").value = item.avgLifeDays || 11;
    }
  });

  refreshOptions();
}

function wireForm() {
  const panel = document.getElementById("add-hardware-panel");
  document.getElementById("add-hardware-btn").addEventListener("click", () => {
    panel.style.display = panel.style.display === "none" ? "block" : "none";
  });
  document.getElementById("cancel-add-hardware").addEventListener("click", () => {
    panel.style.display = "none";
  });

  document.getElementById("add-hardware-form").addEventListener("submit", async (event) => {
    event.preventDefault();
    const form = new FormData(event.target);

    // Whichever Ω control is actually visible is the one the user filled in.
    const resistanceSelect = document.getElementById("hardware-resistance-select");
    const resistanceInput = document.getElementById("hardware-resistance");
    const resistanceValue =
      resistanceSelect.style.display !== "none" && resistanceSelect.value ? resistanceSelect.value : resistanceInput.value;

    await addHardwareItem({
      type: form.get("type"),
      catalogId: form.get("catalogId") || null,
      name: form.get("name"),
      brand: form.get("brand"),
      resistanceOhms: resistanceValue ? Number(resistanceValue) : undefined,
      avgLifeDays: form.get("type") === "coil" && form.get("avgLifeDays") ? Number(form.get("avgLifeDays")) : undefined,
      notes: form.get("notes") || "",
    });

    showToast("Hardware added");
    event.target.reset();
    panel.style.display = "none";
    await renderLists();
  });
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
