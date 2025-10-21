import { formatNumberToDisplay } from '../utils/index.js';
import { RESOURCE_LABELS } from '../constants/index.js';

export function displayResourceChanges(resourceData) {
  injectResourceChanges(resourceData);
  injectGoldPerHour(resourceData);
}

export function injectResourceChanges(resourceData) {
  RESOURCE_LABELS.forEach((label) => {
    let resource = label === 'crystal' ? 'glass' : label;
    const menuElement = document.getElementById(`resources_${resource}`);
    if (!menuElement) return;

    const { production, consumption } = resourceData[label];
    const change = production - consumption;
    let changeElement = menuElement.querySelector(`#${resource}_per_hour`);

    if (change === 0) {
      // console.log('Element removed:', resource);
      changeElement?.remove();
      return;
    }

    const duration = getWineDurationDisplay(resourceData[label].amount, consumption);
    const productionDisplay =
      change > 0 ? `+${formatNumberToDisplay(change)}` : `${formatNumberToDisplay(change)} (${duration})`;
    const changeClassName = change > 0 ? 'resource_per_hour' : 'resource_per_hour red';

    if (!changeElement) {
      changeElement = createDisplayElement(`${resource}_per_hour`, productionDisplay, changeClassName);
      menuElement.appendChild(changeElement);
    } else {
      changeElement.textContent = productionDisplay;
      changeElement.className = changeClassName;
    }
  });
}

export function getWineDurationDisplay(wineAmount, wineConsumptionPerHour) {
  if (wineConsumptionPerHour === 0) return '∞';

  const totalHours = wineAmount / wineConsumptionPerHour;
  const days = Math.floor(totalHours / 24);

  // If more than 30 days, show in months
  if (days >= 365) {
    return `${Math.floor(days / 365)}y`;
  }

  if (days >= 30) {
    return `${Math.floor(days / 30)}m`;
  }

  const remainderHours = totalHours % 24;
  const roundedDays = remainderHours > 12 ? days + 1 : days;
  return `${roundedDays}d`;
}

export function injectGoldPerHour(resourceData) {
  const goldChange = resourceData.gold.change;
  const isNegative = goldChange < 0;

  const goldChangeElementClass = isNegative ? 'gold_per_hour red' : 'gold_per_hour';

  let goldDisplay = document.getElementById('gold_per_hour');
  if (!goldDisplay) {
    goldDisplay = createDisplayElement(
      'gold_per_hour',
      `${isNegative ? '-' : '+'}${formatNumberToDisplay(Math.abs(goldChange))}`,
      goldChangeElementClass
    );
    const goldMenu = document.getElementById('js_GlobalMenu_gold');
    // Add next to js_GlobalMenu_gold, not inside it
    if (goldMenu) {
      goldMenu.insertAdjacentElement('afterend', goldDisplay);
    }
  } else {
    goldDisplay.textContent = `${isNegative ? '-' : '+'}${formatNumberToDisplay(Math.abs(goldChange))}`;
    goldDisplay.className = goldChangeElementClass;
  }
}

export function createDisplayElement(id, textContent, className) {
  const span = document.createElement('span');
  span.id = id;
  span.textContent = textContent;
  span.className = className;
  return span;
}
