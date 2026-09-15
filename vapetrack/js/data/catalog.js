/**
 * catalog.js
 * ---------------------------------------------------------------
 * Sample "discoverable" hardware and e-liquid catalogue, standing
 * in for a real product database.
 *
 * IMPORTANT - read this before you connect real retailers:
 * The retailer names and prices below are PLACEHOLDER / FICTIONAL
 * data invented for this prototype (MistVault, CloudHaus UK, etc.
 * are not real shops). UK vape retailers don't generally offer a
 * public price/stock API, so a real version of this feature would
 * need either (a) retailers who offer an affiliate/product feed,
 * or (b) your own scraper that respects each site's robots.txt and
 * terms of service. Swap the `retailers` array on each item below
 * for real data once you have a real source - nothing else in the
 * app needs to change, because pages only ever read this shape
 * through the functions in recommendations.js / store.js.
 * ---------------------------------------------------------------
 */

export const HARDWARE_CATALOG = [
  {
    id: "hw-oxva-xlim-pro2",
    category: "device",
    subtype: "pod-system",
    name: "OXVA Xlim Pro 2",
    brand: "OXVA",
    tags: ["pod-system", "beginner-friendly", "mtl", "adjustable-airflow"],
    communityRating: 4.6,
    communityReviewCount: 312,
    isNew: false,
    popularity: 91,
    retailers: [
      { name: "MistVault", price: 24.99, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 26.5, inStock: true, url: "#" },
      { name: "VaporLane", price: 23.99, inStock: false, url: "#" },
    ],
  },
  {
    id: "hw-oxva-xlim-tank",
    category: "pod",
    subtype: "top-fill",
    name: "OXVA Xlim Top Fill Pod (2ml)",
    brand: "OXVA",
    compatibleWith: ["hw-oxva-xlim-pro2"],
    tags: ["pod-system", "top-fill"],
    communityRating: 4.4,
    communityReviewCount: 118,
    isNew: false,
    popularity: 70,
    retailers: [
      { name: "MistVault", price: 6.99, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 7.49, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-oxva-coil-mesh08",
    category: "coil",
    subtype: "mesh",
    name: "OXVA 0.8Ω Mesh Coil",
    brand: "OXVA",
    resistanceOhms: 0.8,
    avgLifeDays: 11,
    compatibleWith: ["hw-oxva-xlim-pro2"],
    tags: ["mesh", "mtl"],
    communityRating: 4.3,
    communityReviewCount: 401,
    isNew: false,
    popularity: 88,
    retailers: [
      { name: "MistVault", price: 8.99, inStock: true, url: "#" },
      { name: "VapeStreet", price: 8.49, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 9.25, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-oxva-nexlim",
    category: "device",
    subtype: "pod-kit",
    name: "OXVA NeXLIM",
    brand: "OXVA",
    tags: ["pod-system", "compact", "mtl"],
    communityRating: 4.5,
    communityReviewCount: 64,
    isNew: true,
    popularity: 58,
    retailers: [
      { name: "MistVault", price: 29.99, inStock: true, url: "#" },
      { name: "VaporLane", price: 28.99, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-hayati-pro-ultra",
    category: "device",
    subtype: "disposable-style",
    name: "Hayati Pro Ultra 15000",
    brand: "Hayati",
    tags: ["disposable-style", "high-puff-count", "fruit-focused"],
    communityRating: 4.1,
    communityReviewCount: 205,
    isNew: false,
    popularity: 76,
    retailers: [
      { name: "VapeStreet", price: 12.99, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 13.49, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-riot-squad-coil-mesh06",
    category: "coil",
    subtype: "mesh",
    name: "Riot Squad 0.6Ω Mesh Coil",
    brand: "Riot Squad",
    resistanceOhms: 0.6,
    avgLifeDays: 9,
    compatibleWith: ["hw-oxva-xlim-pro2", "hw-oxva-nexlim"],
    tags: ["mesh", "sub-ohm-lite"],
    communityRating: 4.0,
    communityReviewCount: 87,
    isNew: false,
    popularity: 41,
    retailers: [
      { name: "VaporLane", price: 9.49, inStock: true, url: "#" },
    ],
  },
];

export const LIQUID_CATALOG = [
  {
    id: "liq-bar-juice-blue-sour-rasp",
    name: "Blue Sour Raspberry",
    brand: "Bar Juice",
    flavourCategory: "fruit",
    tags: ["fruit", "sour", "raspberry", "cold"],
    nicotineOptions: [0, 3, 6, 10, 20],
    vgPg: "50/50",
    communityRating: 4.8,
    communityReviewCount: 540,
    isNew: false,
    popularity: 95,
    retailers: [
      { name: "ZAP! Shop", price: 2.99, inStock: true, url: "#" },
      { name: "VapeClubbers", price: 3.0, inStock: true, url: "#", bundleNote: "3 for £10" },
      { name: "MistVault", price: 2.49, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-elfliq-watermelon-ice",
    name: "Watermelon Ice",
    brand: "Elfliq",
    flavourCategory: "fruit",
    tags: ["fruit", "menthol", "watermelon", "cold"],
    nicotineOptions: [10, 20],
    vgPg: "50/50",
    communityRating: 4.2,
    communityReviewCount: 268,
    isNew: false,
    popularity: 74,
    retailers: [
      { name: "CloudHaus UK", price: 3.49, inStock: true, url: "#" },
      { name: "ZAP! Shop", price: 3.29, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-riot-squad-mango-peach",
    name: "Mango Peach",
    brand: "Riot Squad",
    flavourCategory: "fruit",
    tags: ["fruit", "mango", "peach"],
    nicotineOptions: [3, 6, 10, 20],
    vgPg: "70/30",
    communityRating: 3.6,
    communityReviewCount: 92,
    isNew: false,
    popularity: 38,
    retailers: [
      { name: "MistVault", price: 2.99, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-drifter-bar-berry-fusion",
    name: "Berry Fusion",
    brand: "Drifter Bar",
    flavourCategory: "fruit",
    tags: ["fruit", "berry", "mixed-berry"],
    nicotineOptions: [10, 20],
    vgPg: "50/50",
    communityRating: 4.6,
    communityReviewCount: 128,
    isNew: true,
    popularity: 66,
    retailers: [
      { name: "VapeClubbers", price: 2.99, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-hayati-pro-max-lemon-lime",
    name: "Lemon Lime",
    brand: "Hayati Pro Max",
    flavourCategory: "fruit",
    tags: ["fruit", "citrus", "sharp"],
    nicotineOptions: [10, 20],
    vgPg: "50/50",
    communityRating: 4.7,
    communityReviewCount: 96,
    isNew: true,
    popularity: 60,
    retailers: [
      { name: "CloudHaus UK", price: 3.49, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-dinner-lady-pineapple-ice",
    name: "Pineapple Ice",
    brand: "Dinner Lady",
    flavourCategory: "fruit",
    tags: ["fruit", "menthol", "pineapple", "cold"],
    nicotineOptions: [3, 6, 10, 20],
    vgPg: "50/50",
    communityRating: 4.5,
    communityReviewCount: 211,
    isNew: false,
    popularity: 82,
    retailers: [
      { name: "MistVault", price: 2.99, inStock: true, url: "#" },
      { name: "ZAP! Shop", price: 2.79, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-classic-tobacco-gold",
    name: "Classic Gold Tobacco",
    brand: "Vapeway",
    flavourCategory: "tobacco",
    tags: ["tobacco", "classic", "smooth"],
    nicotineOptions: [3, 6, 10, 20],
    vgPg: "50/50",
    communityRating: 4.0,
    communityReviewCount: 143,
    isNew: false,
    popularity: 47,
    retailers: [
      { name: "VaporLane", price: 3.49, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-menthol-arctic-blast",
    name: "Arctic Blast Menthol",
    brand: "Vapeway",
    flavourCategory: "menthol",
    tags: ["menthol", "cold", "sharp"],
    nicotineOptions: [3, 6, 10, 20],
    vgPg: "50/50",
    communityRating: 4.1,
    communityReviewCount: 77,
    isNew: false,
    popularity: 44,
    retailers: [
      { name: "VapeStreet", price: 3.19, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-custard-cream-dessert",
    name: "Custard Cream",
    brand: "Sweet Tooth",
    flavourCategory: "dessert",
    tags: ["dessert", "custard", "sweet"],
    nicotineOptions: [0, 3, 6],
    vgPg: "70/30",
    communityRating: 4.4,
    communityReviewCount: 59,
    isNew: false,
    popularity: 33,
    retailers: [
      { name: "CloudHaus UK", price: 3.99, inStock: true, url: "#" },
    ],
  },
  {
    id: "liq-cola-ice-drinks",
    name: "Cola Ice",
    brand: "Fizzy Co",
    flavourCategory: "drinks",
    tags: ["drinks", "cola", "cold"],
    nicotineOptions: [3, 6, 10, 20],
    vgPg: "50/50",
    communityRating: 4.3,
    communityReviewCount: 101,
    isNew: false,
    popularity: 55,
    retailers: [
      { name: "ZAP! Shop", price: 2.99, inStock: true, url: "#" },
    ],
  },
];

/** All hardware + liquid catalog items, useful when a lookup doesn't care about type. */
export function getAllCatalogItems() {
  return [...HARDWARE_CATALOG, ...LIQUID_CATALOG];
}

export function findCatalogItem(catalogId) {
  return getAllCatalogItems().find((item) => item.id === catalogId) || null;
}

/** Cheapest in-stock retailer for a catalog item, or null if none in stock. */
export function cheapestRetailer(item) {
  const inStock = (item.retailers || []).filter((r) => r.inStock);
  if (inStock.length === 0) return null;
  return inStock.reduce((best, r) => (r.price < best.price ? r : best), inStock[0]);
}
