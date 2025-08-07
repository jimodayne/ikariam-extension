export function injectTransportDetail() {
  const transportModalElement = document.querySelector('#transport_c #transport');
  const quickButtonsElement = document.querySelector('.quick-buttons');

  if (transportModalElement && !quickButtonsElement) {
    injectQuickButtons(transportModalElement);
  }
}

function injectQuickButtons(modal) {
  const resourceRows = modal.querySelectorAll('.resourceAssign li');

  resourceRows.forEach((row) => {
    const input = row.querySelector('input.textfield');
    const existingWrapper = row.querySelector('.quick-buttons');
    if (!input) return;

    // Always remove old buttons
    if (existingWrapper) {
      existingWrapper.remove();
    }

    const resourceName = input.id.replace('textfield_', '');
    const wrapper = createQuickButtonWrapper(input, resourceName);

    input.insertAdjacentElement('afterend', wrapper);
  });

  modal.dataset.quickButtonsInjected = 'true';
}

function createQuickButtonWrapper(input) {
  const wrapper = document.createElement('div');
  wrapper.className = 'quick-buttons';

  const BUTTONS = { '-': -500, '+': 500, '+1K': 1000, '+10K': 10000 };

  Object.entries(BUTTONS).forEach(([label, amount]) => {
    const button = createQuickButton(label, amount, input);
    wrapper.appendChild(button);
  });

  return wrapper;
}

function createQuickButton(label, amount, input) {
  const button = document.createElement('button');
  button.textContent = label;
  button.type = 'button';
  button.className = 'button action_bubble';
  button.style.marginLeft = '2px';
  button.style.padding = '2px 6px';
  button.style.fontSize = '11px';

  button.onclick = () => {
    const currentValue = parseFloat(input.value) || 0;
    const newValue = Math.max(currentValue + amount, 0);
    input.value = newValue;
    input.focus();
    input.blur();
  };

  return button;
}
