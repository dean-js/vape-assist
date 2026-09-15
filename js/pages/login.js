/**
 * pages/login.js
 * Local-only sign-up/sign-in. Creates an "account" (name + email) in
 * localStorage via store.js - see the big comment on saveAccount() in
 * store.js for why this isn't real authentication yet, and README.md
 * for the plan to replace it with real Google OAuth + a backend.
 */

import { showToast } from "../components/toast.js";
import { getAccount, saveAccount } from "../data/store.js";

async function init() {
  // Already "signed in" - skip straight past this page.
  const existing = await getAccount();
  if (existing) {
    window.location.href = "index.html";
    return;
  }

  document.getElementById("login-form").addEventListener("submit", handleEmailSubmit);
  document.getElementById("google-btn").addEventListener("click", handleGoogleClick);
}

async function handleEmailSubmit(event) {
  event.preventDefault();
  const name = document.getElementById("login-name").value.trim();
  const email = document.getElementById("login-email").value.trim();

  if (!name || !email) return;

  await saveAccount({ name, email, provider: "email" });
  showToast(`Welcome, ${name}!`);
  window.location.href = "index.html";
}

function handleGoogleClick() {
  showToast("Google sign-in needs a backend to verify it safely - coming later. Use email for now.");
}

init();
