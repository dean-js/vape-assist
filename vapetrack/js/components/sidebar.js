/**
 * sidebar.js
 * ---------------------------------------------------------------
 * A "component" in this project is just a function that takes some
 * data in and returns an HTML string. There's no framework doing
 * this for us (no React here) - we build the string ourselves and
 * the page hands it to `element.innerHTML`. It's the same mental
 * model as a React component (props in, markup out), just written
 * by hand, which is why this project is a good stepping stone
 * toward React later.
 * ---------------------------------------------------------------
 */

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard", href: "index.html", icon: "🏠" },
  { id: "hardware", label: "My Hardware", href: "hardware.html", icon: "🔧" },
  { id: "liquids", label: "My Liquids", href: "liquids.html", icon: "💧" },
  { id: "wishlist", label: "Wishlist", href: "wishlist.html", icon: "❤️" },
  { id: "discover", label: "Discover", href: "discover.html", icon: "🔍" },
  { id: "profile", label: "Profile", href: "profile.html", icon: "👤" },
];

/**
 * @param {string} activePageId - which NAV_ITEMS.id matches the current page
 * @returns {string} HTML for the whole <aside class="sidebar">
 */
export function renderSidebar(activePageId) {
  const links = NAV_ITEMS.map(
    (item) => `
      <li>
        <a href="${item.href}" class="${item.id === activePageId ? "active" : ""}">
          <span>${item.icon}</span>
          <span>${item.label}</span>
        </a>
      </li>`
  ).join("");

  return `
    <aside class="sidebar">
      <div class="sidebar-brand">
        <span class="logo">◆</span>
        <span>VapeTrack</span>
      </div>
      <nav class="sidebar-nav">
        <ul>${links}</ul>
      </nav>
      <div class="sidebar-footer">
        <a href="profile.html" style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:13px;padding:8px 4px;">
          <span>⚙️</span><span>Settings</span>
        </a>
      </div>
    </aside>`;
}

/** Mounts the sidebar into any element with id="sidebar-root". Call once per page. */
export function mountSidebar(activePageId) {
  const root = document.getElementById("sidebar-root");
  if (root) root.outerHTML = renderSidebar(activePageId);
}
