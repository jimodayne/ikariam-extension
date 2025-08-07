import { formatHoursToDisplay } from '../utils/index.js';

export function injectTownHallDetail() {
  const townhallElement = document.getElementById('townHall');
  if (!townhallElement) return;

  const existingDetail = document.querySelector('.townhall-detail');
  if (existingDetail) return; // Avoid duplicate detail injection

  const maxInhabitantsElement = document.getElementById('js_TownHallMaxInhabitants');
  const maxInhabitants = maxInhabitantsElement ? parseInt(maxInhabitantsElement.textContent, 10) : 0;
  const currentInhabitantsElement = document.getElementById('js_TownHallOccupiedSpace');
  const currentInhabitants = currentInhabitantsElement ? parseInt(currentInhabitantsElement.textContent, 10) : 0;

  const currentGrowthValue = document.getElementById('js_TownHallPopulationGrowthValue');
  const currentGrowth = currentGrowthValue ? parseFloat(currentGrowthValue.textContent) : 0;

  const estimateTimeToMaxInhabitants = currentGrowth > 0 ? (maxInhabitants - currentInhabitants) / currentGrowth : 0;

  const estimateTimeDisplay = formatHoursToDisplay(estimateTimeToMaxInhabitants);

  console.log('estimateTimeDisplay:', estimateTimeDisplay);
  const detailElement = document.createElement('li');
  detailElement.className = 'townhall-detail';
  detailElement.textContent = `ETA: ${estimateTimeDisplay}`;

  const jsTownHallPopulationGrowth = document.getElementById('js_TownHallPopulationGrowth');
  if (jsTownHallPopulationGrowth) {
    jsTownHallPopulationGrowth.insertAdjacentElement('afterend', detailElement);
  }
}
