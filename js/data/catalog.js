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
  /* ---------------------------- Devices ---------------------------- */
  {
    id: "hw-oxva-xlim-sq-pro",
    category: "device",
    subtype: "pod-system",
    name: "OXVA Xlim SQ Pro",
    brand: "OXVA",
    tags: ["pod-system", "beginner-friendly", "mtl", "adjustable-airflow"],
    communityRating: 4.6,
    communityReviewCount: 340,
    isNew: true,
    popularity: 92,
    retailers: [
      { name: "MistVault", price: 26.99, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 28.5, inStock: true, url: "#" },
      { name: "VaporLane", price: 25.99, inStock: false, url: "#" },
    ],
  },
  {
    id: "hw-vaporesso-xros",
    category: "device",
    subtype: "pod-system",
    name: "Vaporesso XROS",
    brand: "Vaporesso",
    tags: ["pod-system", "beginner-friendly", "mtl", "compact"],
    communityRating: 4.5,
    communityReviewCount: 512,
    isNew: false,
    popularity: 89,
    retailers: [
      { name: "MistVault", price: 19.99, inStock: true, url: "#" },
      { name: "VapeStreet", price: 18.99, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 20.5, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-geekvape-l200",
    category: "device",
    subtype: "mod",
    name: "GeekVape L200 (Aegis Legend 2)",
    brand: "GeekVape",
    tags: ["mod", "sub-ohm", "high-wattage", "durable"],
    communityRating: 4.7,
    communityReviewCount: 276,
    isNew: false,
    popularity: 74,
    retailers: [
      { name: "VaporLane", price: 44.99, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 46.99, inStock: true, url: "#" },
    ],
  },

  /* ---------------------------- Tanks / Pods ---------------------------- */
  {
    id: "hw-hellbeast-tank",
    category: "tank",
    subtype: "sub-ohm-tank",
    name: "Hellbeast Tank",
    brand: "Hellvape",
    compatibleWith: ["hw-geekvape-l200"],
    tags: ["tank", "sub-ohm"],
    communityRating: 4.4,
    communityReviewCount: 98,
    isNew: false,
    popularity: 55,
    retailers: [
      { name: "VaporLane", price: 21.99, inStock: true, url: "#" },
      { name: "VapeStreet", price: 22.49, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-oxva-ez-pods",
    category: "pod",
    subtype: "built-in-coil",
    name: "OXVA EZ Pods",
    brand: "OXVA",
    compatibleWith: ["hw-oxva-xlim-sq-pro"],
    ohmOptions: [0.4, 0.6, 0.8],
    avgLifeDays: 10,
    tags: ["pod-system", "mtl", "built-in-coil"],
    communityRating: 4.4,
    communityReviewCount: 156,
    isNew: true,
    popularity: 67,
    retailers: [
      { name: "MistVault", price: 8.49, inStock: true, url: "#" },
      { name: "CloudHaus UK", price: 8.99, inStock: true, url: "#" },
    ],
  },
  {
    id: "hw-vaporesso-xros-pods",
    category: "pod",
    subtype: "built-in-coil",
    name: "Vaporesso XROS Pods",
    brand: "Vaporesso",
    compatibleWith: ["hw-vaporesso-xros"],
    ohmOptions: [0.4, 0.6, 1.0],
    avgLifeDays: 10,
    tags: ["pod-system", "mtl", "built-in-coil"],
    communityRating: 4.3,
    communityReviewCount: 203,
    isNew: false,
    popularity: 71,
    retailers: [
      { name: "MistVault", price: 7.99, inStock: true, url: "#" },
      { name: "VapeStreet", price: 7.49, inStock: true, url: "#" },
    ],
  },

  /* ---------------------------- Replacement coils ---------------------------- */
  {
    id: "hw-hellbeast-coil",
    category: "coil",
    subtype: "mesh",
    name: "Hellbeast Replacement Mesh Coil",
    brand: "Hellvape",
    compatibleWith: ["hw-geekvape-l200", "hw-hellbeast-tank"],
    ohmOptions: [0.15, 0.2, 0.3],
    avgLifeDays: 8,
    tags: ["mesh", "sub-ohm"],
    communityRating: 4.2,
    communityReviewCount: 74,
    isNew: false,
    popularity: 48,
    retailers: [
      { name: "VaporLane", price: 9.99, inStock: true, url: "#" },
      { name: "VapeStreet", price: 9.49, inStock: true, url: "#" },
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
