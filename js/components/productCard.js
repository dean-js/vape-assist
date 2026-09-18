/**
 * productCard.js
 * Renders one hardware or liquid catalogue item as a card, used on
 * the Discover, Wishlist and "recommended for you" sections.
 */

import { renderProductIcon } from "./productIcon.js";

/**
 * @param {object} props
 * @param {object} props.item - a catalogue item (see catalog.js)
 * @param {object} [props.bestPrice] - { name, price, inStock, url } or null
 * @param {boolean} [props.wishlisted]
 * @param {boolean} [props.showWishlistButton]
 */
export function renderProductCard({ item, bestPrice, wishlisted = false, showWishlistButton = true }) {
  const priceLabel = bestPrice
    ? `£${bestPrice.price.toFixed(2)} <span class="text-muted" style="font-weight:400;font-size:11px;">at ${bestPrice.name}</span>`
    : `<span class="text-muted">Out of stock everywhere</span>`;

  // Coils and built-in-coil pods can come in a few resistances - show the
  // options right on the card so you know what you'd be choosing between
  // before you ever open the "Add Hardware" form.
  const ohmLine = item.ohmOptions?.length
    ? `<div class="product-meta">Available in: ${item.ohmOptions.map((o) => `${o}Ω`).join(", ")}</div>`
    : "";

  return `
    <div class="product-card" data-catalog-id="${item.id}">
      ${renderProductIcon(item)}
      ${item.isNew ? `<span class="badge badge-info" style="align-self:flex-start;">NEW</span>` : ""}
      <div class="product-name">${item.name}</div>
      <div class="product-meta">${item.brand}${item.flavourCategory ? " · " + item.flavourCategory : ""}</div>
      ${ohmLine}
      <div class="product-meta">
        <span class="stars">${"★".repeat(Math.round(item.communityRating))}${"☆".repeat(5 - Math.round(item.communityRating))}</span>
        <span class="text-muted">${item.communityRating.toFixed(1)} (${item.communityReviewCount})</span>
      </div>
      <div class="product-price">${priceLabel}</div>
      <div class="product-actions">
        ${
          showWishlistButton
            ? `<button class="btn ${wishlisted ? "btn-secondary" : "btn-primary"} btn-sm js-wishlist-toggle" data-catalog-id="${item.id}">
                 ${wishlisted ? "Remove from wishlist" : "+ Wishlist"}
               </button>`
            : ""
        }
      </div>
    </div>`;
}
