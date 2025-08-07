import { formatNumberToDisplay } from '../utils/index.js';
import { RESOURCE_LABELS } from '../constants/index.js';

export function displayResourceChanges(resourceData) {
  RESOURCE_LABELS.forEach((resource) => {
    const menuElement = document.getElementById(`resources_${resource}`);
    if (!menuElement) return;

    const { change, consumption } = resourceData[resource];

    let productionElement = menuElement.querySelector(`#${resource}_per_hour`);
    const productionDisplay = `+${formatNumberToDisplay(change)}`;
    if (change !== 0) {
      if (!productionElement) {
        productionElement = createDisplayElement(`${resource}_per_hour`, productionDisplay, 'resource_per_hour');
        menuElement.appendChild(productionElement);
      } else {
        productionElement.textContent = productionDisplay;
      }
    } else if (productionElement) {
      productionElement.remove();
    }

    if (resource === 'wine') {
      let consumptionDisplay = menuElement.querySelector(`#${resource}_consumption_per_hour`);
      if (consumption > 0) {
        const duration = getWineDurationDisplay(resourceData[resource].amount, consumption);
        if (!consumptionDisplay) {
          consumptionDisplay = createDisplayElement(
            `${resource}_consumption_per_hour`,
            `-${formatNumberToDisplay(consumption)} (${duration})`,
            'resource_per_hour red'
          );
          menuElement.appendChild(consumptionDisplay);
        } else {
          consumptionDisplay.textContent = `-${formatNumberToDisplay(consumption)} (${duration})`;
        }
      } else if (consumptionDisplay) {
        consumptionDisplay.remove();
      }
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

export function displayGoldPerHour(resourceData) {
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
