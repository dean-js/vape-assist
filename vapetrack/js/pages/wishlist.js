/**
 * pages/wishlist.js
 * Lists every catalogue item the user has saved, with the cheapest
 * in-stock retailer for each. Removing an item uses the exact same
 * toggle button/logic as "adding" one from Discover, wired centrally
 * in components/shared.js.
 */

import { initPage, wireWishlistButtons } from "../components/shared.js";
import { renderProductCard } from "../components/productCard.js";
import { getWishlist } from "../data/store.js";
import { findCatalogItem, cheapestRetailer } from "../data/catalog.js";

async function render() {
  await initPage("wishlist");
  const wishlist = await getWishlist();

  const cardsHtml = wishlist
    .map((entry) => findCatalogItem(entry.catalogId))
    .filter(Boolean)
    .map((item) => renderProductCard({ item, bestPrice: cheapestRetailer(item), wishlisted: true }));

  document.getElementById("wishlist-cards").innerHTML =
    cardsHtml.join("") ||
    `<p class="empty-state">Your wishlist is empty. <a href="discover.html" style="color:var(--color-accent-soft);">Discover something new</a>.</p>`;

  wireWishlistButtons(() => render());
}

render();
