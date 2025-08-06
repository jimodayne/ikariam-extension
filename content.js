// Ikariam extension content script
console.log('Ikariam extension content script loaded');

const RESOURCE_LABELS = ['wood', 'wine', 'marble', 'sulfur', 'crystal'];

(function modifyGameInterface() {
  const resourceData = getResourceData();
  displayGoldPerHour();
  displayResourceChanges(resourceData);
  addQuickTransportButtons(resourceData);
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
