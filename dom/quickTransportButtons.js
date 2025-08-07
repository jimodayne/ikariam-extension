function addQuickTransportButtons(resourceData) {
  const transportModalElement = document.getElementById('transport');
  if (transportModalElement) {
    injectQuickButtons(transportModalElement, resourceData);
  }
  // Run once in case the modal is already open when script loads
  // if (existingModal && !existingModal.dataset.quickButtonsInjected) {
  //   injectQuickButtons(existingModal, resourceData);
  // }
  const observer = new MutationObserver(() => {
    const modal = document.getElementById('transport');
    const quickButtonsElement = document.querySelector('.quick-buttons');
    if (modal && !quickButtonsElement) {
      const freshResourceData = getResourceData();
      console.log('Get freshResourceData', freshResourceData);
      injectQuickButtons(modal, freshResourceData);
    }
  });
  observer.observe(document.body, { childList: true, subtree: true });
}
