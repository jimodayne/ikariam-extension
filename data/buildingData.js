function getAllBuildingInfoInTown() {
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

    let overlayElement = node.querySelector('.building-level-overlay');
    if (!overlayElement) {
      overlayElement = document.createElement('div');
      overlayElement.className = 'building-level-overlay';
      node.appendChild(overlayElement);
    }
    overlayElement.textContent = level;

    buildings.push({
      position,
      type,
      level,
      isUnderConstruction,
    });
  });

  console.log('All buildings in town:', buildings);
  return buildings;
}

function normalizeBuildingName(name) {
  const map = {
    'Trading Port': 'port',
    Shipyard: 'shipyard',
    'Town Hall': 'townHall',
    Barracks: 'barracks',
    Academy: 'academy',
    Warehouse: 'warehouse',
    Tavern: 'tavern',
    Museum: 'museum',
    Palace: 'palace',
    Embassy: 'embassy',
    Workshop: 'workshop',
    Safehouse: 'safehouse',
    Carpenter: 'carpenter',
    "Architect's Office": 'architect',
    // Add more mappings as needed
  };

  return map[name] || name.toLowerCase().replace(/\s+/g, '');
}
