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

/** "Dean Normington" -> "DN", for the little avatar circle. */
function initials(name) {
  return (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() || "")
    .join("");
}

/**
 * @param {string} activePageId - which NAV_ITEMS.id matches the current page
 * @param {object} [account] - { name, email } from store.js's getAccount()
 * @returns {string} HTML for the whole <aside class="sidebar">
 */
export function renderSidebar(activePageId, account) {
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
        <span>Vape Assist</span>
      </div>
      <nav class="sidebar-nav">
        <ul>${links}</ul>
      </nav>
      <div class="sidebar-footer">
        ${
          account
            ? `
          <div style="display:flex;align-items:center;gap:8px;padding:8px 4px;">
            <span class="badge badge-info" style="border-radius:999px;width:28px;height:28px;justify-content:center;">${initials(account.name)}</span>
            <span style="font-size:13px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;">${account.name}</span>
          </div>`
            : ""
        }
        <a href="profile.html" style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:13px;padding:8px 4px;">
          <span>⚙️</span><span>Settings</span>
        </a>
        <a href="#" id="sidebar-logout" style="display:flex;align-items:center;gap:8px;color:var(--text-secondary);font-size:13px;padding:8px 4px;">
          <span>🚪</span><span>Log out</span>
        </a>
      </div>
    </aside>`;
}

/** Mounts the sidebar into any element with id="sidebar-root". Call once per page. */
export function mountSidebar(activePageId, account) {
  const root = document.getElementById("sidebar-root");
  if (root) root.outerHTML = renderSidebar(activePageId, account);

  document.getElementById("sidebar-logout")?.addEventListener("click", async (event) => {
    event.preventDefault();
    const { clearAccount } = await import("../data/store.js");
    await clearAccount();
    window.location.href = "login.html";
  });
}
