/**
 * statCard.js
 * A small reusable "stat" tile, like the Smoke Free / Money Saved
 * cards on the dashboard mockup.
 */

/**
 * @param {object} props
 * @param {string} props.icon
 * @param {string} props.label
 * @param {string|number} props.value
 * @param {string} [props.sub] - small caption under the value
 */
export function renderStatCard({ icon, label, value, sub }) {
  return `
    <div class="stat-card">
      <div class="stat-label"><span>${icon}</span><span>${label}</span></div>
      <div class="stat-value">${value}</div>
      ${sub ? `<div class="stat-sub">${sub}</div>` : ""}
    </div>`;
}
