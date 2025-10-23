import { parseFloatUtils } from '../utils/index.js';

const injectBarbarianVillageDetail = () => {
  const shipElementId = 'barbarian_village_total_ships';
  // Check if existing the ship element and remove it
  const existingShipElement = document.getElementById(shipElementId);
  if (existingShipElement) {
    return;
    // existingShipElement.remove();
  }

  console.log('Injecting detail for modal: barbarianVillage');
  const woodElement = document.getElementById('js_islandBarbarianResourceresource');
  const wineElement = document.getElementById('js_islandBarbarianResourcetradegood1');
  const marbleElement = document.getElementById('js_islandBarbarianResourcetradegood2');
  const crystalElement = document.getElementById('js_islandBarbarianResourcetradegood3');
  const sulfurElement = document.getElementById('js_islandBarbarianResourcetradegood4');

  //  Try to get the sum of all resources in the barbarian village
  const woodAmount = woodElement ? parseFloatUtils(woodElement.textContent) : 0;
  const wineAmount = wineElement ? parseFloatUtils(wineElement.textContent) : 0;
  const marbleAmount = marbleElement ? parseFloatUtils(marbleElement.textContent) : 0;
  const crystalAmount = crystalElement ? parseFloatUtils(crystalElement.textContent) : 0;
  const sulfurAmount = sulfurElement ? parseFloatUtils(sulfurElement.textContent) : 0;
  const totalResources = woodAmount + wineAmount + marbleAmount + crystalAmount + sulfurAmount;

  // Create and inject total ship needed element
  const totalShip = totalResources > 0 ? Math.ceil(totalResources / 500) : 0;

  let shipElement = document.getElementById(shipElementId);
  if (!shipElement) {
    shipElement = document.createElement('div');
    shipElement.id = shipElementId;

    // Append the element after the class barbarianCityResources
    const parentElement = document.querySelector('.barbarianCityResources');
    console.log('parentElement', parentElement);
    if (parentElement) {
      parentElement.appendChild(shipElement);
    }
  }
  shipElement.textContent = `Total ships: ${totalShip}`;
};

export { injectBarbarianVillageDetail };
