// Ikariam extension content script
console.log('Ikariam extension content script loaded');

const RESOURCE_LABELS = ['wood', 'wine', 'marble', 'sulfur', 'crystal'];

(function modifyGameInterface() {
  const resourceData = getResourceData();
  displayGoldPerHour();
  displayResourceChanges(resourceData);
})();

function getResourceData() {
  const resourceData = {};

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

function displayGoldPerHour() {
  const goldChangeElement = document.getElementById('js_GlobalMenu_gold_Calculation');
  if (!goldChangeElement) return;

  const goldChangeText = goldChangeElement.textContent.trim();
  if (!goldChangeText) return;

  const isNegative = goldChangeText.startsWith('-');
  const goldDisplay = createDisplayElement(
    'gold_per_hour',
    `${isNegative ? '' : '+'}${goldChangeText}`,
    isNegative ? 'gold_per_hour red' : 'gold_per_hour'
  );

  const goldMenu = document.getElementById('js_GlobalMenu_gold');
  if (goldMenu) goldMenu.appendChild(goldDisplay);
}

function displayResourceChanges(resourceData) {
  RESOURCE_LABELS.forEach((resource) => {
    const menuElement = document.getElementById(`resources_${resource}`);
    if (!menuElement) return;

    const { change, consumption } = resourceData[resource];

    // Display production (positive change)
    if (change > 0) {
      const productionDisplay = createDisplayElement(`${resource}_per_hour`, `+${change}`, 'resource_per_hour');
      menuElement.appendChild(productionDisplay);
    }

    // Display consumption (only for wine, negative value)
    if (resource === 'wine' && consumption > 0) {
      const duration = getWineDurationDisplay(resourceData[resource].amount, consumption);
      const consumptionDisplay = createDisplayElement(
        `${resource}_consumption_per_hour`,
        `-${consumption} (${duration})`,
        'resource_per_hour red'
      );
      menuElement.appendChild(consumptionDisplay);
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
  const remainderHours = totalHours % 24;

  const roundedDays = remainderHours > 12 ? days + 1 : days;
  return `${roundedDays}d`;
}
