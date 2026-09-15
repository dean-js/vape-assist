/**
 * pages/profile.js
 * Read-only summary of the saved profile, plus a way to retake the
 * quiz or wipe local data entirely (useful while you're learning
 * and want to test the "brand new user" experience repeatedly).
 */

import { initPage } from "../components/shared.js";
import { showToast } from "../components/toast.js";
import { getAccount, clearAccount, getProfile, resetAllData, daysSince } from "../data/store.js";

async function render() {
  await initPage("profile");
  const account = await getAccount();
  const profile = await getProfile();

  document.getElementById("account-summary").innerHTML = renderAccount(account);
  document.getElementById("profile-summary").innerHTML = profile ? renderProfile(profile) : renderNoProfile();

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
