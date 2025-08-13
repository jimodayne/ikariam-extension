import { MAP_BUILDING_LABELS } from '../constants/index.js';
import { displayBuildingLevel } from '../dom/displayBuildingLevel.js';
import { logMessage } from '../utils/index.js';

export function getAllBuildingInfoInTown() {
  logMessage('Getting all building info in town...');
  const buildings = [];
  const buildingNodes = document.querySelectorAll('#locations .building');

  buildingNodes.forEach((node) => {
    const classList = node.className.split(' ');
    if (classList.includes('buildingGround')) {
      // Skip ground buildings
      return;
    }

    const positionMatch = node.id.match(/position(\d+)/);
    const position = positionMatch ? parseInt(positionMatch[1], 10) : null;

    const levelClass = classList.find((cls) => cls.startsWith('level'));
    const level = levelClass ? parseInt(levelClass.replace('level', '')) : 0;

    let type = null;

    const isUnderConstruction = classList.includes('constructionSite');

    if (isUnderConstruction) {
      // Get from <a> title or href
      const link = node.querySelector('a');
      if (link) {
        const titleMatch = link.getAttribute('title')?.match(/^(.+?) \(\d+\)$/);
        const hrefMatch = link.getAttribute('href')?.match(/view=([^&]+)/);

        if (titleMatch) {
          type = normalizeBuildingName(titleMatch[1]); // e.g. "Trading Port" -> "port"
        } else if (hrefMatch) {
          type = hrefMatch[1]; // e.g. "port"
        }
      }
    } else {
      // Normal case
      type = classList.find((cls) => cls !== 'building' && !cls.startsWith('position') && !cls.startsWith('level'));
    }

    displayBuildingLevel(node, level);

    buildings.push({
      position,
      type,
      level,
      isUnderConstruction,
    });
  });

  return buildings;
}

export function normalizeBuildingName(name) {
  return MAP_BUILDING_LABELS[name] || name.toLowerCase().replace(/\s+/g, '');
}
