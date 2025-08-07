function getCurrentTownId() {
  const currentCityAnchor = document.querySelector('#js_citySelectContainer .dropDownButton a');
  if (!currentCityAnchor) return null;

  const currentCityText = currentCityAnchor.textContent.trim();

  const listItems = document.querySelectorAll('#dropDown_js_citySelectContainer li');

  for (const li of listItems) {
    const liText = li.textContent.trim();
    if (liText === currentCityText) {
      return li.getAttribute('selectvalue');
    }
  }

  // Fallback: try matching by title instead of textContent
  for (const li of listItems) {
    const a = li.querySelector('a');
    if (a && a.title.trim() === currentCityAnchor.title.trim()) {
      return li.getAttribute('selectvalue');
    }
  }

  // Final fallback: try getting from URL
  const match = window.location.href.match(/cityId=(\d+)/);
  return match ? match[1] : null;
}
