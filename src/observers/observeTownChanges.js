import { getCurrentTownId } from '../data/worldData.js';
import { getResourceData } from '../data/resourceData.js';
import { displayResourceChanges } from '../dom/displayResources.js';
import { getAllBuildingInfoInTown } from '../data/buildingData.js';

export function observeTownChanges() {
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
}
