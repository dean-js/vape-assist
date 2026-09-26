/**
 * shared.js
 * Small bits every page needs: mounting the sidebar, wiring up
 * "add to wishlist" buttons anywhere on the page (event delegation,
 * so it works even for cards rendered after the page loads), and
 * redirecting first-time visitors to the onboarding quiz.
 */

import { mountSidebar } from "./sidebar.js";
import { showToast } from "./toast.js";
import { getAccount, getProfile, addToWishlist, removeFromWishlist, isWishlisted } from "../data/store.js";

/**
 * Call once at the top of every page.js file (login.js is the one
 * exception - it can't require an account, since it's how you get one).
 *
 * Order matters: no account -> straight to login.html, account but no
 * quiz -> either redirected to onboarding.html (if requireOnboarding)
 * or shown the "take the quiz" banner instead.
 *
 * @param {string} activePageId - matches an id in sidebar.js's NAV_ITEMS
 * @param {object} [options]
 * @param {boolean} [options.requireOnboarding] - if true, redirect to
 *   onboarding.html when the user hasn't completed the quiz yet
 */
export async function initPage(activePageId, options = {}) {
  const account = await getAccount();
  if (!account) {
    window.location.href = "login.html";
    return null;
  }

  mountSidebar(activePageId, account);

  if (options.requireOnboarding) {
    const profile = await getProfile();
    if (!profile || !profile.completedQuiz) {
      window.location.href = "onboarding.html";
      return null;
    }
    return profile;
  }

  return getProfile();
}

/**
 * Delegated click handler for any ".js-wishlist-toggle" button on the
 * page, including ones added to the DOM after this runs. Pass a
 * function to call afterwards if you want the section to re-render.
 */
export function wireWishlistButtons(onChange) {
  document.body.addEventListener("click", async (event) => {
    const button = event.target.closest(".js-wishlist-toggle");
    if (!button) return;

    const catalogId = button.dataset.catalogId;
    const alreadyWishlisted = await isWishlisted(catalogId);

    if (alreadyWishlisted) {
      await removeFromWishlist(catalogId);
      showToast("Removed from wishlist");
    } else {
      await addToWishlist(catalogId, button.dataset.kind || "hardware");
      showToast("Added to wishlist");
    }

    if (onChange) onChange();
  });
}

/**
 * Label for a catalogue item in a <select> dropdown. Most hardware
 * names already start with the brand (e.g. "OXVA Xlim SQ Pro"), so
 * prefixing the brand again would read "OXVA OXVA Xlim SQ Pro" -
 * only prefix it when the name doesn't already include it.
 */
export function catalogOptionLabel(item) {
  const name = item.name || "";
  const brand = item.brand || "";
  return brand && !name.toLowerCase().startsWith(brand.toLowerCase()) ? `${brand} ${name}` : name;
}

/** Renders a "complete your quiz" banner for pages where onboarding is optional but encouraged. */
export function renderOnboardingBanner(profile) {
  if (profile && profile.completedQuiz) return "";
  return `
    <div class="banner">
      <div>
        <h3 style="margin-bottom:4px;">Get personalised recommendations</h3>
        <p class="text-secondary" style="font-size:13px;">Answer a short quiz about your smoking history and taste so Vape Assist can suggest a starter setup.</p>
      </div>
      <a href="onboarding.html" class="btn btn-primary">Take the quiz</a>
    </div>`;
}
