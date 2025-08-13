import { logMessage } from '../utils';
import { getResourceData } from '../data/resourceData.js';

/**
 * Creates a financial detail row element.
 * @param {string} label The text label for the row (e.g., "In 3 hours").
 * @param {number} goldChange The gold change value to display.
 * @returns {HTMLTableRowElement} The created table row element.
 */
function createFinancesDetailRow(label, goldChange) {
  const row = document.createElement('tr');
  row.className = 'result finances-detail';

  const goldValue = goldChange.toLocaleString();

  // Using a template literal for cleaner HTML
  row.innerHTML = `
    <td class="left reason">
      <img src="//gf2.geo.gfsrv.net/cdnd4/a09dc31d7a1f1ec2f83bd61fdcf898.png" alt="Sum">
      ${label}
    </td>
    <td class="costs"></td>
    <td class="left bar"></td>
    <td class="nowrap hidden bold">${goldValue}</td>
  `;

  return row;
}

/**
 * Injects financial detail rows into the finances table.
 */
export function injectFinancesDetail() {
  if (document.querySelector('.finances-detail')) return;

  // Get necessary data and elements
  const resourceData = getResourceData();
  const goldChangePerHour = resourceData.gold.change;
  const injectLocations = document.querySelectorAll('#finances .upkeepReductionTable .result');
  const injectLocation = injectLocations[injectLocations.length - 1];

  // Check for prerequisites and avoid duplicates
  if (!injectLocation) return;

  // Calculate future gold changes
  const goldChange3Hours = goldChangePerHour * 3;
  const goldChange1Day = goldChangePerHour * 24;

  // Create and inject the new rows
  const detailElement3Hours = createFinancesDetailRow('In 3 hours', goldChange3Hours);
  const detailElement1Day = createFinancesDetailRow('In 1 day', goldChange1Day);

  const parent = injectLocation.parentNode;

  // Insert the rows after the last existing 'result' row
  parent.insertBefore(detailElement1Day, injectLocation.nextSibling);
  parent.insertBefore(detailElement3Hours, injectLocation.nextSibling);

  logMessage('Finances detail injected successfully.');
}
