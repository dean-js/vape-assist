/**
 * pages/profile.js
 * Read-only summary of the saved profile, plus a way to retake the
 * quiz or wipe local data entirely (useful while you're learning
 * and want to test the "brand new user" experience repeatedly).
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { getAccount, clearAccount, getProfile, saveProfile, resetAllData, daysSince } from "../data/store.js";

async function render() {
  await initPage("profile");
  const account = await getAccount();
  const profile = await getProfile();

  document.getElementById("account-summary").innerHTML = renderAccount(account);
  document.getElementById("profile-summary").innerHTML = profile ? renderProfile(profile) : renderNoProfile();
  document.getElementById("tracking-panel").innerHTML = profile ? renderTracking(profile) : "";

  document.getElementById("logout-btn").addEventListener("click", async () => {
    await clearAccount();
    window.location.href = "login.html";
  });

  document.getElementById("reset-data-btn").addEventListener("click", async () => {
    const confirmed = window.confirm("This clears your account, every device, liquid, wishlist item and quiz answer you've logged. Continue?");
    if (!confirmed) return;
    await resetAllData();
    showToast("All data cleared");
    window.location.href = "login.html";
  });

  wireTrackingForm(profile);
}

/** YYYY-MM-DD for a <input type="date">, from a profile's ISO startDate. */
function toDateInputValue(isoString) {
  return (isoString || new Date().toISOString()).slice(0, 10);
}

function renderTracking(profile) {
  return `
    <h2 style="margin-bottom:4px;">Smoke-free tracking</h2>
    <p class="text-secondary" style="font-size:13px;margin-bottom:16px;">
      Your "Smoke Free" count on the dashboard is based on this date. Fix it if it's wrong, or reset it if you had a slip and want to start the count again.
    </p>
    <form id="tracking-form" style="display:flex; gap:12px; align-items:flex-end; flex-wrap:wrap;">
      <div class="field" style="margin:0;">
        <label for="tracking-start-date">Smoke-free since</label>
        <input type="date" id="tracking-start-date" max="${toDateInputValue(new Date().toISOString())}" value="${toDateInputValue(profile.startDate)}" />
      </div>
      <button type="submit" class="btn btn-primary">Save date</button>
      <button type="button" class="btn btn-secondary" id="reset-counter-btn">Reset counter to today</button>
    </form>`;
}

function wireTrackingForm(profile) {
  document.getElementById("tracking-form")?.addEventListener("submit", async (event) => {
    event.preventDefault();
    const value = document.getElementById("tracking-start-date").value;
    if (!value) return;
    const startDate = new Date(`${value}T00:00:00`).toISOString();
    await saveProfile({ ...profile, startDate });
    showToast("Smoke-free date updated");
    render();
  });

  document.getElementById("reset-counter-btn")?.addEventListener("click", async () => {
    const confirmed = window.confirm("Reset your smoke-free counter to start again from today?");
    if (!confirmed) return;
    await saveProfile({ ...profile, startDate: new Date().toISOString() });
    showToast("Counter reset - starting from today");
    render();
  });
}

function renderAccount(account) {
  if (!account) return "";
  return `
    <h2 style="margin-bottom:16px;">Account</h2>
    <div class="row-list">
      ${row("Name", account.name)}
      ${row("Email", account.email)}
      ${row("Signed up with", account.provider === "google" ? "Google" : "Email")}
    </div>`;
}

function renderProfile(profile) {
  return `
    <h2 style="margin-bottom:16px;">Your answers</h2>
    <div class="row-list">
      ${row("Cigarettes per day", profile.cigarettesPerDay)}
      ${row("Nicotine strength", profile.nicotineStrength !== null ? `${profile.nicotineStrength}mg` : "-")}
      ${row("Flavour preferences", (profile.flavourPreferences || []).join(", ") || "-")}
      ${row("Device type", profile.deviceType)}
      ${row("Budget", profile.budget)}
      ${row("Tracking since", profile.startDate ? `${daysSince(profile.startDate)} days ago` : "-")}
    </div>`;
}

function renderNoProfile() {
  return `<p class="empty-state">You haven't completed the quiz yet. <a href="onboarding.html" style="color:var(--color-accent-soft);">Take it now</a>.</p>`;
}

function row(label, value) {
  return `<div class="row-item"><span class="row-sub">${label}</span><span class="row-title">${value || "-"}</span></div>`;
}

render();
