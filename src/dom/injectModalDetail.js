import { injectTransportDetail } from './transport.js';
import { injectTownHallDetail } from './townhall.js';
import { injectFinancesDetail } from './finances.js';
import { getResourceData } from '../data/resourceData.js';

export function injectModalDetail() {
  const observer = new MutationObserver(() => {
    const modalElement = document.querySelector('.mainContentBox.contentBox01h.toggleMenu');
    const sidebarElement = document.querySelector('#sidebar');

    if (modalElement) injectDetail(modalElement);
    if (sidebarElement) expandBuildingDetail(sidebarElement);
  });
  const container = document.querySelector('#container');
  observer.observe(container, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
}

function injectDetail(modal) {
  switch (modal.id) {
    case 'transport':
      injectTransportDetail(modal);
      break;
    case 'townHall':
      injectTownHallDetail(modal);
      break;
    case 'finances':
      injectFinancesDetail(modal); // Uncomment when finances detail is implemented
      break;
    default:
      break;
  }
}

export function expandBuildingDetail(container) {
  if (!container) return;

  const alreadyExists = container.querySelector('.missing-resource');
  if (alreadyExists) return;

  const missingNodes = container.querySelectorAll('#buildingUpgrade .resources li.bold.red');
  if (!missingNodes.length) return;

  const currentResources = getResourceData();

  missingNodes.forEach((node) => {
    const parsed = mapTextUpgradeToResource(node.textContent);
    if (!parsed) return;

    const available = currentResources[parsed.type]?.amount || 0;
    const missing = parsed.amount - available;

    if (missing > 0) {
      const marker = document.createElement('span');
      marker.className = 'missing-resource';
      marker.textContent = `-${missing}`;
      node.appendChild(marker);
    }
  });
}

function mapTextUpgradeToResource(text) {
  const match = text.match(/^(.+?):\s*([\d,]+)/);
  if (!match) return null;

  const [_, label, valueStr] = match;
  const value = parseInt(valueStr.replace(/,/g, ''), 10);

  const nameMap = {
    'building material': 'wood',
    marble: 'marble',
    sulfur: 'sulfur',
    crystal: 'crystal',
    wine: 'wine',
  };

  const key = nameMap[label.trim().toLowerCase()];
  if (!key) return null;

  return { type: key, amount: value };
}
