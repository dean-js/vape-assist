/**
 * toast.js
 * A tiny notification popup (e.g. "Added to wishlist"). Every page
 * includes a `<div id="toast-root"></div>` near the end of <body>
 * (see shared.js) for this to render into.
 */

export function showToast(message, timeoutMs = 2200) {
  const root = document.getElementById("toast-root");
  if (!root) return;

  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  root.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, timeoutMs);
}
