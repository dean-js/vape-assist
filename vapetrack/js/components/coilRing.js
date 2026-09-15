/**
 * coilRing.js
 * The circular "days used" progress ring on the dashboard's Coil
 * Tracker card, drawn with inline SVG (no image/library needed).
 */

const RADIUS = 36;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

/**
 * @param {object} props
 * @param {number} props.percentUsed - 0-100
 * @param {number} props.daysUsed
 * @param {"ok"|"warning"|"overdue"} props.status
 */
export function renderCoilRing({ percentUsed, daysUsed, status }) {
  const offset = CIRCUMFERENCE * (1 - Math.min(percentUsed, 100) / 100);
  const color =
    status === "overdue" ? "var(--color-danger)" : status === "warning" ? "var(--color-warning)" : "var(--color-success)";

  return `
    <div class="progress-ring-wrap">
      <svg width="88" height="88" viewBox="0 0 88 88">
        <circle class="progress-ring-track" cx="44" cy="44" r="${RADIUS}" />
        <circle
          class="progress-ring-value"
          cx="44" cy="44" r="${RADIUS}"
          stroke="${color}"
          stroke-dasharray="${CIRCUMFERENCE}"
          stroke-dashoffset="${offset}"
        />
      </svg>
      <div class="progress-ring-label">
        <span class="num">${daysUsed}</span>
        <span class="unit">Days Used</span>
      </div>
    </div>`;
}
