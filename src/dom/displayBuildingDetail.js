import { injectTransportDetail } from './transport.js';
import { getCurrentTownId } from '../data/worldData.js';
import { injectTownHallDetail } from './townhall.js';

export function displayBuildingDetail() {
  const observer = new MutationObserver(() => {
    const modalElement = document.querySelector('.mainContentBox.contentBox01h.toggleMenu');
    if (!modalElement) return;
    injectDetail(modalElement);
  });

  observer.observe(document.body, { childList: true, subtree: true });
}

function injectDetail(modal) {
  switch (modal.id) {
    case 'transport':
      injectTransportDetail(modal);
      break;
    case 'townHall':
      injectTownHallDetail(modal); // Uncomment if you have a function for town hall
      break;
    default:
      break;
  }
}
