// Ikariam extension content script
// console.log('[] - Ikariam extension content script loaded');

import { getResourceData } from './data/resourceData.js';
import { getAllBuildingInfoInTown } from './data/buildingData.js';
import { displayResourceChanges } from './dom/displayResources.js';
import { observeTownChanges } from './observers/observeTownChanges.js';
import { injectModalDetail } from './dom/injectModalDetail.js';
import { logMessage } from './utils/index.js';

// Initialize the game interface modifications

(function modifyGameInterface() {
  const resourceData = getResourceData();
  getAllBuildingInfoInTown();
  displayResourceChanges(resourceData);
  injectModalDetail();
  observeTownChanges();
})();
