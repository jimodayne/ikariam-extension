// Ikariam extension content script
// console.log('[] - Ikariam extension content script loaded');

import { getResourceData } from './data/resourceData.js';
import { getAllBuildingInfoInTown } from './data/buildingData.js';
import { displayResourceChanges, displayGoldPerHour } from './dom/displayResources.js';
import { addQuickTransportButtons } from './dom/quickTransportButtons.js';
import { observeTownChanges } from './observers/observeTownChanges.js';
import { logMessage } from './utils/index.js';

// Initialize the game interface modifications

(function modifyGameInterface() {
  const resourceData = getResourceData();
  logMessage('Resource data loaded', resourceData);
  getAllBuildingInfoInTown();
  displayGoldPerHour(resourceData);
  displayResourceChanges(resourceData);
  addQuickTransportButtons(resourceData);
  observeTownChanges();
})();
