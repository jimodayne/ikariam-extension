// Ikariam extension content script
console.log('Ikariam extension content script loaded');

import { getResourceData } from './data/resourceData.js';
import { getAllBuildingInfoInTown } from './data/buildingData.js';
import { displayGoldPerHour } from './dom/displayGold.js';
import { displayResourceChanges } from './dom/displayResources.js';
import { addQuickTransportButtons } from './dom/quickTransportButtons.js';
import { observeTownChanges } from './observers/observeTownChanges.js';

(function modifyGameInterface() {
  const resourceData = getResourceData();
  // getAllBuildingInfoInTown();
  // displayGoldPerHour(resourceData);
  // displayResourceChanges(resourceData);
  // addQuickTransportButtons(resourceData);
  // observeTownChanges();
})();

// Ikariam extension content script

// // Define type for resource data
// /**
//  * @typedef {Object} ResourceData
//  * @property {number} amount - Current amount of the resource
//  * @property {number} change - Change in the resource amount (per hour)
//  * @property {number} [consumption] - Consumption rate of the resource (only for wine)
//  */

// // Create a mock resource data
// const mockResourceData = {
//   gold: { amount: 1000, change: -5050 },
//   wood: { amount: 500, change: 245000, consumption: 0 },
//   wine: { amount: 3000000, change: -1000, consumption: 5 },
//   marble: { amount: 200, change: 185, consumption: 0 },
//   sulfur: { amount: 150, change: 1880, consumption: 0 },
//   crystal: { amount: 1000000, change: 555555, consumption: 0 },
// };

// // Main function to modify the game interface
// (function modifyGameInterface() {
//   const resourceData = getResourceData();
//   const buildingData = getAllBuildingInfoInTown();
//   // Uncomment the line below to use mock data for testing
//   // const resourceData = mockResourceData; // Use mock data for testing

//   displayGoldPerHour(resourceData);
//   displayResourceChanges(resourceData);
//   addQuickTransportButtons(resourceData);
// })();

// function getResourceData() {
//   const resourceData = {};

//   // Get gold per hour and current gold
//   const goldElement = document.getElementById('js_GlobalMenu_gold');
//   const goldAmount = goldElement ? parseFloatUtils(goldElement.textContent) : 0;
//   const goldChangeElement = document.getElementById('js_GlobalMenu_gold_Calculation');
//   const goldChange = goldChangeElement ? parseFloatUtils(goldChangeElement.textContent) : 0;
//   resourceData.gold = { amount: goldAmount, change: goldChange };

//   // Get resource amounts, changes, and consumption
//   RESOURCE_LABELS.forEach((resource) => {
//     const amountElement = document.getElementById(`js_GlobalMenu_${resource}`);
//     const changeElement =
//       resource === 'wood'
//         ? document.getElementById('js_GlobalMenu_resourceProduction')
//         : document.getElementById(`js_GlobalMenu_production_${resource}`);
//     const consumptionElement = resource === 'wine' ? document.getElementById('js_GlobalMenu_WineConsumption') : null;

//     const parseNumber = (el) => (el ? parseFloat(el.textContent.replace(/,/g, '').trim()) || 0 : 0);

//     resourceData[resource] = {
//       amount: parseNumber(amountElement),
//       change: parseNumber(changeElement),
//       consumption: parseNumber(consumptionElement),
//     };
//   });

//   console.log('Full resource data:', resourceData);
//   return resourceData;
// }

// function displayGoldPerHour(resourceData) {
//   const goldChange = resourceData.gold.change;
//   const isNegative = goldChange < 0;

//   const goldChangeElementClass = isNegative ? 'gold_per_hour red' : 'gold_per_hour';

//   let goldDisplay = document.getElementById('gold_per_hour');
//   if (!goldDisplay) {
//     goldDisplay = createDisplayElement(
//       'gold_per_hour',
//       `${isNegative ? '-' : '+'}${formatNumberToDisplay(Math.abs(goldChange))}`,
//       goldChangeElementClass
//     );
//     const goldMenu = document.getElementById('js_GlobalMenu_gold');
//     // Add next to js_GlobalMenu_gold, not inside it
//     if (goldMenu) {
//       goldMenu.insertAdjacentElement('afterend', goldDisplay);
//     }
//   } else {
//     goldDisplay.textContent = `${isNegative ? '-' : '+'}${formatNumberToDisplay(Math.abs(goldChange))}`;
//     goldDisplay.className = goldChangeElementClass;
//   }
// }

// function displayResourceChanges(resourceData) {
//   RESOURCE_LABELS.forEach((resource) => {
//     const menuElement = document.getElementById(`resources_${resource}`);
//     if (!menuElement) return;

//     const { change, consumption } = resourceData[resource];

//     let productionElement = menuElement.querySelector(`#${resource}_per_hour`);
//     const productionDisplay = `+${formatNumberToDisplay(change)}`;
//     if (change !== 0) {
//       if (!productionElement) {
//         productionElement = createDisplayElement(`${resource}_per_hour`, productionDisplay, 'resource_per_hour');
//         menuElement.appendChild(productionElement);
//       } else {
//         productionElement.textContent = productionDisplay;
//       }
//     } else if (productionElement) {
//       productionElement.remove();
//     }

//     if (resource === 'wine') {
//       let consumptionDisplay = menuElement.querySelector(`#${resource}_consumption_per_hour`);
//       if (consumption > 0) {
//         const duration = getWineDurationDisplay(resourceData[resource].amount, consumption);
//         if (!consumptionDisplay) {
//           consumptionDisplay = createDisplayElement(
//             `${resource}_consumption_per_hour`,
//             `-${formatNumberToDisplay(consumption)} (${duration})`,
//             'resource_per_hour red'
//           );
//           menuElement.appendChild(consumptionDisplay);
//         } else {
//           consumptionDisplay.textContent = `-${formatNumberToDisplay(consumption)} (${duration})`;
//         }
//       } else if (consumptionDisplay) {
//         consumptionDisplay.remove();
//       }
//     }
//   });
// }

// function createDisplayElement(id, textContent, className) {
//   const span = document.createElement('span');
//   span.id = id;
//   span.textContent = textContent;
//   span.className = className;
//   return span;
// }

// function getWineDurationDisplay(wineAmount, wineConsumptionPerHour) {
//   if (wineConsumptionPerHour === 0) return '∞';

//   const totalHours = wineAmount / wineConsumptionPerHour;
//   const days = Math.floor(totalHours / 24);

//   // If more than 30 days, show in months
//   if (days >= 365) {
//     return `${Math.floor(days / 365)}y`;
//   }

//   if (days >= 30) {
//     return `${Math.floor(days / 30)}m`;
//   }

//   const remainderHours = totalHours % 24;
//   const roundedDays = remainderHours > 12 ? days + 1 : days;
//   return `${roundedDays}d`;
// }
// function addQuickTransportButtons(resourceData) {
//   const transportModalElement = document.getElementById('transport');
//   if (transportModalElement) {
//     injectQuickButtons(transportModalElement, resourceData);
//   }
//   // Run once in case the modal is already open when script loads
//   // if (existingModal && !existingModal.dataset.quickButtonsInjected) {
//   //   injectQuickButtons(existingModal, resourceData);
//   // }
//   const observer = new MutationObserver(() => {
//     const modal = document.getElementById('transport');
//     const quickButtonsElement = document.querySelector('.quick-buttons');
//     if (modal && !quickButtonsElement) {
//       const freshResourceData = getResourceData();
//       console.log('Get freshResourceData', freshResourceData);
//       injectQuickButtons(modal, freshResourceData);
//     }
//   });
//   observer.observe(document.body, { childList: true, subtree: true });
// }

// function injectQuickButtons(modal, resourceData) {
//   console.log('Injecting quick buttons into transport modal');
//   const resourceRows = modal.querySelectorAll('.resourceAssign li');

//   resourceRows.forEach((row) => {
//     const input = row.querySelector('input.textfield');
//     const existingWrapper = row.querySelector('.quick-buttons');
//     if (!input) return;

//     // Always remove old buttons
//     if (existingWrapper) {
//       existingWrapper.remove();
//     }

//     const resourceName = input.id.replace('textfield_', '');
//     const wrapper = createQuickButtonWrapper(input, resourceName, resourceData);

//     input.insertAdjacentElement('afterend', wrapper);
//   });

//   modal.dataset.quickButtonsInjected = 'true';
// }

// function createQuickButtonWrapper(input) {
//   const wrapper = document.createElement('div');
//   wrapper.className = 'quick-buttons';

//   const BUTTONS = { '-': -500, '+': 500, '+1K': 1000, '+10K': 10000 };

//   Object.entries(BUTTONS).forEach(([label, amount]) => {
//     const button = createQuickButton(label, amount, input);
//     wrapper.appendChild(button);
//   });

//   return wrapper;
// }

// function createQuickButton(label, amount, input) {
//   const button = document.createElement('button');
//   button.textContent = label;
//   button.type = 'button';
//   button.className = 'button action_bubble';
//   button.style.marginLeft = '2px';
//   button.style.padding = '2px 6px';
//   button.style.fontSize = '11px';

//   button.onclick = () => {
//     const currentValue = parseFloat(input.value) || 0;
//     const newValue = Math.max(currentValue + amount, 0);
//     input.value = newValue;
//     input.focus();
//     input.blur();
//   };

//   return button;
// }

// function capitalize(str) {
//   return str.charAt(0).toUpperCase() + str.slice(1);
// }
