import { parseFloatUtils } from '../utils/index.js';
import { RESOURCE_LABELS } from '../constants/index.js';

export function getResourceData() {
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
