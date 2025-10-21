import { formatHoursToDisplay, parseFloatUtils } from '../utils/index.js';

export function injectTownHallDetail() {
  const townhallElement = document.getElementById('townHall');
  if (!townhallElement) return;

  const existingDetail = document.querySelector('.townhall-detail');
  if (existingDetail) return; // Avoid duplicate detail injection

  const maxInhabitantsElement = document.getElementById('js_TownHallMaxInhabitants');

  const maxInhabitantsText = maxInhabitantsElement ? maxInhabitantsElement.textContent : '0'; // '1,136'
  const maxInhabitants = parseFloatUtils(maxInhabitantsText);

  console.log('maxInhabitants', maxInhabitants);

  const currentInhabitantsElement = document.getElementById('js_TownHallOccupiedSpace');
  const currentInhabitantsText = currentInhabitantsElement ? currentInhabitantsElement.textContent : '0';
  const currentInhabitants = parseFloatUtils(currentInhabitantsText);

  console.log('currentInhabitants', currentInhabitants);

  const currentGrowthValue = document.getElementById('js_TownHallPopulationGrowthValue');
  const currentGrowth = currentGrowthValue ? parseFloat(currentGrowthValue.textContent) : 0;

  const estimateTimeToMaxInhabitants = currentGrowth > 0 ? (maxInhabitants - currentInhabitants) / currentGrowth : 0;

  const estimateTimeDisplay = formatHoursToDisplay(estimateTimeToMaxInhabitants);

  const detailElement = document.createElement('li');
  detailElement.className = 'townhall-detail';
  detailElement.textContent = `ETA: ${estimateTimeDisplay}`;

  const jsTownHallPopulationGrowth = document.getElementById('js_TownHallPopulationGrowth');
  if (jsTownHallPopulationGrowth) {
    jsTownHallPopulationGrowth.insertAdjacentElement('afterend', detailElement);
  }
}
