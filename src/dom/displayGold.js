function displayGoldPerHour(resourceData) {
  const goldChange = resourceData.gold.change;
  const isNegative = goldChange < 0;

  const goldChangeElementClass = isNegative ? 'gold_per_hour red' : 'gold_per_hour';

  let goldDisplay = document.getElementById('gold_per_hour');
  if (!goldDisplay) {
    goldDisplay = createDisplayElement(
      'gold_per_hour',
      `${isNegative ? '-' : '+'}${formatNumberToDisplay(Math.abs(goldChange))}`,
      goldChangeElementClass
    );
    const goldMenu = document.getElementById('js_GlobalMenu_gold');
    // Add next to js_GlobalMenu_gold, not inside it
    if (goldMenu) {
      goldMenu.insertAdjacentElement('afterend', goldDisplay);
    }
  } else {
    goldDisplay.textContent = `${isNegative ? '-' : '+'}${formatNumberToDisplay(Math.abs(goldChange))}`;
    goldDisplay.className = goldChangeElementClass;
  }
}
