/**
 * productIcon.js
 * ---------------------------------------------------------------
 * Small inline-SVG icons for the catalogue, so each product card
 * shows something that actually matches what kind of item it is
 * (a pod system doesn't get shown with a box-mod icon, etc.) These
 * are generic line-art placeholders, not real product photography.
 *
 * To swap in real photos later: give a catalogue item (in
 * data/catalog.js) an `image: "images/xlim-sq-pro.jpg"` field
 * pointing at a picture you have the rights to use, drop the file
 * in an `images/` folder next to index.html, and change
 * renderProductIcon below to return `<img src="${item.image}" ... />`
 * when `item.image` is set, falling back to these icons otherwise.
 * ---------------------------------------------------------------
 */

const ICONS = {
  // Pod-system device: rounded body, small mouthpiece
  "pod-system": `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="16" y="6" width="6" height="8" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="10" y="13" width="28" height="29" rx="8" stroke="currentColor" stroke-width="2.5"/>
      <rect x="16" y="21" width="16" height="13" rx="3" stroke="currentColor" stroke-width="2"/>
    </svg>`,
  // Box mod device: chunkier body, fire button
  mod: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="12" y="8" width="5" height="7" rx="1.5" fill="currentColor" opacity="0.9"/>
      <rect x="8" y="14" width="32" height="28" rx="5" stroke="currentColor" stroke-width="2.5"/>
      <circle cx="24" cy="24" r="4" stroke="currentColor" stroke-width="2"/>
      <rect x="14" y="33" width="20" height="4" rx="2" fill="currentColor" opacity="0.6"/>
    </svg>`,
  // Sub-ohm tank: cylinder body, drip tip
  tank: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="20" y="6" width="8" height="6" rx="2" fill="currentColor" opacity="0.9"/>
      <rect x="16" y="12" width="16" height="6" rx="2" stroke="currentColor" stroke-width="2"/>
      <rect x="13" y="18" width="22" height="24" rx="4" stroke="currentColor" stroke-width="2.5"/>
      <rect x="17" y="22" width="14" height="16" rx="2" opacity="0.25" fill="currentColor"/>
    </svg>`,
  // Pod (refill or built-in-coil): teardrop cartridge
  pod: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M24 6c6 8 11 15 11 22a11 11 0 1 1-22 0c0-7 5-14 11-22Z" stroke="currentColor" stroke-width="2.5"/>
      <path d="M24 16v20" stroke="currentColor" stroke-width="2" opacity="0.5"/>
    </svg>`,
  // Coil: spiral
  coil: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M8 24c0-6 4-10 8-10s6 4 6 8-3 7-6 7-5-3-5-6 2.5-5 5-5 4.5 2 4.5 4.5" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="4" y1="24" x2="10" y2="24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
      <line x1="28" y1="24" x2="44" y2="24" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"/>
    </svg>`,
  // Fallback: generic accessory / bottle
  accessory: `
    <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
      <rect x="17" y="8" width="14" height="8" rx="2" stroke="currentColor" stroke-width="2"/>
      <path d="M17 16v6c0 1-2 3-2 8v6a4 4 0 0 0 4 4h10a4 4 0 0 0 4-4v-6c0-5-2-7-2-8v-6" stroke="currentColor" stroke-width="2.5"/>
    </svg>`,
};

/**
 * @param {object} item - a catalogue item from data/catalog.js
 * @returns {string} HTML for a small SVG icon matching the item's kind
 */
export function renderProductIcon(item) {
  const key = item.category === "device" ? item.subtype : item.category;
  const svg = ICONS[key] || ICONS.accessory;
  return `<div class="product-thumb" aria-hidden="true">${svg}</div>`;
}
