export function displayBuildingLevel(element, level) {
  let overlayElement = element.querySelector('.building-level-overlay');
  if (!overlayElement) {
    overlayElement = document.createElement('div');
    overlayElement.className = 'building-level-overlay';
    element.appendChild(overlayElement);
  }
  overlayElement.textContent = level;
}
