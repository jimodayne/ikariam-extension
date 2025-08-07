// Ikariam extension content script
console.log('Ikariam extension content script loaded');

// Define type for resource data
/**
 * @typedef {Object} ResourceData
 * @property {number} amount - Current amount of the resource
 * @property {number} change - Change in the resource amount (per hour)
 * @property {number} [consumption] - Consumption rate of the resource (only for wine)
 */

// Create a mock resource data
const mockResourceData = {
  gold: { amount: 1000, change: -5050 },
  wood: { amount: 500, change: 245000, consumption: 0 },
  wine: { amount: 3000000, change: -1000, consumption: 5 },
  marble: { amount: 200, change: 185, consumption: 0 },
  sulfur: { amount: 150, change: 1880, consumption: 0 },
  crystal: { amount: 1000000, change: 555555, consumption: 0 },
};

const RESOURCE_LABELS = ['wood', 'wine', 'marble', 'sulfur', 'crystal'];

// Main function to modify the game interface
(function modifyGameInterface() {
  const resourceData = getResourceData();
  const buildingData = getAllBuildingInfoInTown();
  // Uncomment the line below to use mock data for testing
  // const resourceData = mockResourceData; // Use mock data for testing

  displayGoldPerHour(resourceData);
  displayResourceChanges(resourceData);
  addQuickTransportButtons(resourceData);

  // Observe town changes when modal is open (no URL change)
  const locationsContainer = document.getElementById('locations');
  if (locationsContainer) {
    let previousTownId = getCurrentTownId();
    let debounceTimeout = null;

    const observer = new MutationObserver(() => {
      clearTimeout(debounceTimeout);
      debounceTimeout = setTimeout(() => {
        const currentTownId = getCurrentTownId();
        if (!currentTownId || currentTownId === previousTownId) return;

        previousTownId = currentTownId;
        const updatedResourceData = getResourceData();
        displayResourceChanges(updatedResourceData);
        getAllBuildingInfoInTown();
        console.log('Town changed, updated resource data');
      }, 300); // debounce delay
    });

    observer.observe(locationsContainer, { childList: true, subtree: true });
  }
})();

function getResourceData() {
  const resourceData = {};

  // Get gold per hour and current gold
  const goldElement = document.getElementById('js_GlobalMenu_gold');
  const goldAmount = goldElement ? parseFloatUtils(goldElement.textContent) : 0;
  const goldChangeElement = document.getElementById('js_GlobalMenu_gold_Calculation');
  const goldChange = goldChangeElement ? parseFloatUtils(goldChangeElement.textContent) : 0;
  resourceData.gold = { amount: goldAmount, change: goldChange };

  // Get resource amounts, changes, and consumption
  RESOURCE_LABELS.forEach((resource) => {
    const amountElement = document.getElementById(`js_GlobalMenu_${resource}`);
    const changeElement =
      resource === 'wood'
        ? document.getElementById('js_GlobalMenu_resourceProduction')
        : document.getElementById(`js_GlobalMenu_production_${resource}`);
    const consumptionElement = resource === 'wine' ? document.getElementById('js_GlobalMenu_WineConsumption') : null;

    const parseNumber = (el) => (el ? parseFloat(el.textContent.replace(/,/g, '').trim()) || 0 : 0);

    resourceData[resource] = {
      amount: parseNumber(amountElement),
      change: parseNumber(changeElement),
      consumption: parseNumber(consumptionElement),
    };
  });

  console.log('Full resource data:', resourceData);
  return resourceData;
}

function displayGoldPerHour(resourceData) {
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

function displayResourceChanges(resourceData) {
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

function createDisplayElement(id, textContent, className) {
  const span = document.createElement('span');
  span.id = id;
  span.textContent = textContent;
  span.className = className;
  return span;
}

function getWineDurationDisplay(wineAmount, wineConsumptionPerHour) {
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
function addQuickTransportButtons(resourceData) {
  // Run once in case the modal is already open when script loads
  const existingModal = document.getElementById('transport');
  if (existingModal && !existingModal.dataset.quickButtonsInjected) {
    injectQuickButtons(existingModal, resourceData);
  }

  const observer = new MutationObserver(() => {
    const modal = document.getElementById('transport');
    if (modal && !modal.dataset.quickButtonsInjected) {
      injectQuickButtons(modal, resourceData);
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function injectQuickButtons(modal, resourceData) {
  const resourceRows = modal.querySelectorAll('.resourceAssign li');

  resourceRows.forEach((row) => {
    const input = row.querySelector('input.textfield');
    if (!input || row.querySelector('.quick-buttons')) return;

    const resourceName = input.id.replace('textfield_', '');
    const wrapper = createQuickButtonWrapper(input, resourceName, resourceData);

    input.insertAdjacentElement('afterend', wrapper);
  });

  modal.dataset.quickButtonsInjected = 'true';
}

function createQuickButtonWrapper(input, resourceName, resourceData) {
  const wrapper = document.createElement('div');
  wrapper.className = 'quick-buttons';

  const BUTTONS = { '-': -500, '+': 500, '+1K': 1000, '+10K': 10000 };

  Object.entries(BUTTONS).forEach(([label, amount]) => {
    const button = createQuickButton(label, amount, input, resourceName, resourceData);
    wrapper.appendChild(button);
  });

  return wrapper;
}

function createQuickButton(label, amount, input, resourceName, resourceData) {
  const button = document.createElement('button');
  button.textContent = label;
  button.type = 'button';
  button.className = 'button action_bubble';
  button.style.marginLeft = '2px';
  button.style.padding = '2px 6px';
  button.style.fontSize = '11px';

  button.onclick = () => {
    const currentValue = parseFloat(input.value) || 0;
    const maxValue = resourceData[resourceName].amount;
    const newValue = Math.min(Math.max(currentValue + amount, 0), maxValue);
    input.value = newValue;
    input.focus();
    input.blur();
  };

  return button;
}

function parseFloatUtils(text) {
  return parseFloat(text.replace(/,/g, '').trim()) || 0;
}

function formatNumberToDisplay(value) {
  // For example 245000 becomes 245K
  const absValue = Math.abs(value);
  if (absValue >= 1e6) {
    return `${(Math.sign(value) * Math.round(absValue / 1e5)) / 10}M`;
  }
  if (absValue >= 1e3) {
    return `${(Math.sign(value) * Math.round(absValue / 1e2)) / 10}K`;
  }
  return value.toString();
}

function getAllBuildingInfoInTown() {
  const buildings = [];
  const buildingNodes = document.querySelectorAll('#locations .building');

  buildingNodes.forEach((node) => {
    const classList = node.className.split(' ');
    if (classList.includes('buildingGround')) {
      // Skip ground buildings
      return;
    }

    const positionMatch = node.id.match(/position(\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1], 10) : null;

    const levelClass = classList.find((cls) => cls.startsWith('level'));
    const level = levelClass ? parseInt(levelClass.replace('level', '')) : 0;

    let type = null;

    const isUnderConstruction = classList.includes('constructionSite');

    if (isUnderConstruction) {
      // Get from <a> title or href
      const link = node.querySelector('a');
      if (link) {
        const titleMatch = link.getAttribute('title')?.match(/^(.+?) \(\d+\)$/);
        const hrefMatch = link.getAttribute('href')?.match(/view=([^&]+)/);

        if (titleMatch) {
          type = normalizeBuildingName(titleMatch[1]); // e.g. "Trading Port" -> "port"
        } else if (hrefMatch) {
          type = hrefMatch[1]; // e.g. "port"
        }
      }
    } else {
      // Normal case
      type = classList.find((cls) => cls !== 'building' && !cls.startsWith('position') && !cls.startsWith('level'));
    }

    let overlayElement = node.querySelector('.building-level-overlay');
    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.className = 'building-level-overlay';
      node.appendChild(overlayElement);
    }
    overlayElement.textContent = level;

    buildings.push({
      position,
      type,
      level,
      isUnderConstruction,
    });
  });

  console.log('All buildings in town:', buildings);
  return buildings;
}

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function normalizeBuildingName(name) {
  const map = {
    'Trading Port': 'port',
    Shipyard: 'shipyard',
    'Town Hall': 'townHall',
    Barracks: 'barracks',
    Academy: 'academy',
    Warehouse: 'warehouse',
    Tavern: 'tavern',
    Museum: 'museum',
    Palace: 'palace',
    Embassy: 'embassy',
    Workshop: 'workshop',
    Safehouse: 'safehouse',
    Carpenter: 'carpenter',
    "Architect's Office": 'architect',
    // Add more mappings as needed
  };

  return map[name] || name.toLowerCase().replace(/\s+/g, '');
}

function getCurrentTownId() {
  const currentCityAnchor = document.querySelector('#js_citySelectContainer .dropDownButton a');
  if (!currentCityAnchor) return null;

  const currentCityText = currentCityAnchor.textContent.trim();

  const listItems = document.querySelectorAll('#dropDown_js_citySelectContainer li');

  for (const li of listItems) {
    const liText = li.textContent.trim();
    if (liText === currentCityText) {
      return li.getAttribute('selectvalue');
    }
  }

  // Fallback: try matching by title instead of textContent
  for (const li of listItems) {
    const a = li.querySelector('a');
    if (a && a.title.trim() === currentCityAnchor.title.trim()) {
      return li.getAttribute('selectvalue');
    }
  }

  // Final fallback: try getting from URL
  const match = window.location.href.match(/cityId=(\d+)/);
  return match ? match[1] : null;
}
