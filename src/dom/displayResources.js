function displayResourceChanges(resourceData) {
  RESOURCE_LABELS.forEach((resource) => {
    const menuElement = document.getElementById(`resources_${resource}`);
    if (!menuElement) return;

    const { change, consumption } = resourceData[resource];

    let productionElement = menuElement.querySelector(`#${resource}_per_hour`);
    const productionDisplay = `+${formatNumberToDisplay(change)}`;
    if (change !== 0) {
      if (!productionElement) {
        productionElement = createDisplayElement(`${resource}_per_hour`, productionDisplay, 'resource_per_hour');
        menuElement.appendChild(productionElement);
      } else {
        productionElement.textContent = productionDisplay;
      }
    } else if (productionElement) {
      productionElement.remove();
    }

    if (resource === 'wine') {
      let consumptionDisplay = menuElement.querySelector(`#${resource}_consumption_per_hour`);
      if (consumption > 0) {
        const duration = getWineDurationDisplay(resourceData[resource].amount, consumption);
        if (!consumptionDisplay) {
          consumptionDisplay = createDisplayElement(
            `${resource}_consumption_per_hour`,
            `-${formatNumberToDisplay(consumption)} (${duration})`,
            'resource_per_hour red'
          );
          menuElement.appendChild(consumptionDisplay);
        } else {
          consumptionDisplay.textContent = `-${formatNumberToDisplay(consumption)} (${duration})`;
        }
      } else if (consumptionDisplay) {
        consumptionDisplay.remove();
      }
    }
  });
}
