'use strict';

// 1. Product Data
const products = [
  { id: 'coffee', name: 'Coffee', price: 45 },
  { id: 'sandwich', name: 'Sandwich', price: 50 },
  { id: 'soft-drink', name: 'Soft Drink', price: 35 },
  { id: 'cookies', name: 'Cookies', price: 25 },
  { id: 'bottled-water', name: 'Bottled Water', price: 20 },
  { id: 'chocolate', name: 'Chocolate', price: 25 }
];

// 2. Application State
const applicationState = {
  cart: new Map(),
  currentScreen: 'item-selection',
  selectedPaymentMethod: null,
  paymentResult: null,
  cardProcessing: false,
  completedTransaction: null
};
const paymentMethods = [
  { id: 'cash', label: 'Cash', buttonId: 'payment-cash' },
  { id: 'qr', label: 'QR Payment', buttonId: 'payment-qr' },
  { id: 'card', label: 'Credit/Debit Card', buttonId: 'payment-card' }
];

// 3. DOM References
const domReferences = Object.create(null);

// 4. Utility Functions
function getElement(id) {
  if (!domReferences[id]) domReferences[id] = document.getElementById(id);
  return domReferences[id];
}

function getProduct(productId) {
  return products.find((product) => product.id === productId);
}

function formatPrice(value) {
  return `₱${value.toFixed(2)}`;
}

// 5. Cart Operations
function addToCart(productId) {
  if (!products.some((product) => product.id === productId)) return;
  const quantity = applicationState.cart.get(productId) || 0;
  if (!Number.isSafeInteger(quantity + 1)) return;
  applicationState.cart.set(productId, quantity + 1);
  renderCart();
}

function increaseQuantity(productId) {
  if (applicationState.cart.has(productId)) addToCart(productId);
}

function decreaseQuantity(productId) {
  const quantity = applicationState.cart.get(productId);
  if (applicationState.cart.has(productId) && !isValidCartEntry(productId, quantity)) {
    applicationState.cart.delete(productId);
    renderCart();
    return;
  }
  if (!quantity) return;
  if (quantity === 1) applicationState.cart.delete(productId);
  else applicationState.cart.set(productId, quantity - 1);
  renderCart();
}

function removeFromCart(productId) {
  applicationState.cart.delete(productId);
  renderCart();
}

function isValidCartEntry(productId, quantity) {
  const product = getProduct(productId);
  return Boolean(product) && Number.isSafeInteger(quantity) && quantity > 0 &&
    Number.isSafeInteger(product.price * quantity);
}

function isCartValid() {
  return applicationState.cart.size > 0 && Array.from(applicationState.cart).every(([id, quantity]) => isValidCartEntry(id, quantity)) &&
    Number.isSafeInteger(calculateTotal());
}

// 6. Calculations
function calculateSubtotal(productId) {
  const product = getProduct(productId);
  return product ? product.price * (applicationState.cart.get(productId) || 0) : 0;
}

function calculateTotal() {
  return Array.from(applicationState.cart.keys()).reduce((total, id) => total + calculateSubtotal(id), 0);
}

// 7. Rendering
function createCartControl(label, text, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cart-control';
  button.textContent = text;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', action);
  return button;
}

function renderProducts(container) {
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'product-card';
    button.dataset.productId = product.id;
    button.addEventListener('click', () => addToCart(product.id));

    const name = document.createElement('span');
    name.className = 'product-name';
    name.textContent = product.name;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = formatPrice(product.price);

    button.append(name, price);
    fragment.append(button);
  });

  container.replaceChildren(fragment);
}

function renderCart() {
  const list = getElement('cart-items');
  const total = getElement('cart-total');
  if (!list || !total) return;
  const fragment = document.createDocumentFragment();

  applicationState.cart.forEach((quantity, productId) => {
    const product = getProduct(productId);
    const row = document.createElement('li');
    row.className = 'cart-item';
    const name = document.createElement('h3');
    name.textContent = product.name;
    const unitPrice = document.createElement('p');
    unitPrice.textContent = `Unit price: ${formatPrice(product.price)}`;
    const subtotal = document.createElement('p');
    subtotal.className = 'cart-subtotal';
    subtotal.textContent = `Subtotal: ${formatPrice(calculateSubtotal(productId))}`;
    const controls = document.createElement('div');
    controls.className = 'quantity-controls';
    const quantityLabel = document.createElement('span');
    quantityLabel.textContent = `Qty: ${quantity}`;
    controls.append(
      createCartControl(`Decrease ${product.name} quantity`, '−', () => decreaseQuantity(productId)),
      quantityLabel,
      createCartControl(`Increase ${product.name} quantity`, '+', () => increaseQuantity(productId))
    );
    const remove = createCartControl(`Remove ${product.name}`, 'Remove', () => removeFromCart(productId));
    remove.classList.add('remove-button');
    row.append(name, unitPrice, controls, subtotal, remove);
    fragment.append(row);
  });

  list.replaceChildren(fragment);
  total.textContent = formatPrice(calculateTotal());
  const empty = getElement('empty-order');
  if (empty) empty.hidden = applicationState.cart.size > 0;
  const continueButton = getElement('selection-continue');
  if (continueButton) continueButton.disabled = !isCartValid();
}

function renderOrderSummary() {
  const list = getElement('summary-items');
  const total = getElement('summary-total');
  if (!list || !total) return;
  const fragment = document.createDocumentFragment();
  applicationState.cart.forEach((quantity, productId) => {
    const product = getProduct(productId);
    const row = document.createElement('li');
    row.className = 'cart-item';
    const name = document.createElement('h3');
    name.textContent = product.name;
    const unitPrice = document.createElement('p');
    unitPrice.textContent = `Unit price: ${formatPrice(product.price)}`;
    const quantityLabel = document.createElement('p');
    quantityLabel.textContent = `Qty: ${quantity}`;
    const subtotal = document.createElement('p');
    subtotal.textContent = `Subtotal: ${formatPrice(calculateSubtotal(productId))}`;
    row.append(name, unitPrice, quantityLabel, subtotal);
    fragment.append(row);
  });
  list.replaceChildren(fragment);
  total.textContent = formatPrice(calculateTotal());
}

function renderPaymentSelection() {
  const selected = paymentMethods.find((method) => method.id === applicationState.selectedPaymentMethod);
  paymentMethods.forEach((method) => {
    const button = getElement(method.buttonId);
    if (button) button.setAttribute('aria-pressed', String(method.id === applicationState.selectedPaymentMethod));
  });
  const status = getElement('payment-selection-status');
  if (status) status.textContent = selected ? `Selected: ${selected.label} (simulated).` : 'No payment method selected.';
  const process = getElement('payment-process');
  if (process) {
    process.disabled = !paymentMethods.some((method) => method.id === applicationState.selectedPaymentMethod);
    process.textContent = selected ? `CONTINUE WITH ${selected.label.toUpperCase()}` : 'CONTINUE';
  }
}

function renderCashProcessing() {
  const total = getElement('cash-total');
  if (total) total.textContent = formatPrice(calculateTotal());
  const input = getElement('amount-paid');
  if (input) {
    input.value = '';
    input.setAttribute('aria-invalid', 'false');
  }
  const error = getElement('cash-error');
  if (error) error.textContent = '';
}

function renderPaymentProcessing() {
  clearCompletedPayment();
  const method = applicationState.selectedPaymentMethod;
  getElement('cash-processing-panel').hidden = method !== 'cash';
  getElement('qr-processing-panel').hidden = method !== 'qr';
  getElement('card-processing-panel').hidden = method !== 'card';
  const selected = paymentMethods.find((entry) => entry.id === method);
  getElement('processing-title').textContent = `${selected.label} Payment Processing`;
  renderCashProcessing();
  getElement('qr-total').textContent = formatPrice(calculateTotal());
  getElement('qr-error').textContent = '';
  getElement('card-total').textContent = formatPrice(calculateTotal());
  getElement('card-error').textContent = '';
  getElement('card-status').textContent = 'Ready to simulate payment.';
  setCardProcessing(false);
}

function renderPaymentSuccessful() {
  const transaction = applicationState.completedTransaction;
  if (!transaction || transaction.status !== 'completed') return;
  getElement('success-total').textContent = formatPrice(transaction.total);
  getElement('cash-paid-result').textContent = formatPrice(transaction.amountPaid);
  getElement('cash-change-result').textContent = formatPrice(transaction.change);
  getElement('payment-method-result').textContent = transaction.paymentMethod;
  getElement('success-reference').textContent = transaction.reference;
}

// 8. Navigation
function selectPaymentMethod(methodId) {
  if (applicationState.currentScreen !== 'payment-method' || !paymentMethods.some((method) => method.id === methodId)) return;
  if (!isCartValid()) {
    navigateTo('order-summary');
    return;
  }
  applicationState.selectedPaymentMethod = methodId;
  renderPaymentSelection();
}

function navigateTo(screen) {
  if (applicationState.cardProcessing) return;
  const screens = ['item-selection', 'order-summary', 'payment-method', 'payment-processing', 'payment-successful', 'receipt'];
  const recoveringScreen = !screens.includes(applicationState.currentScreen);
  if (recoveringScreen) screen = 'item-selection';
  if (!screens.includes(screen)) return;
  if (screen === 'receipt' && (applicationState.currentScreen !== 'payment-successful' ||
      applicationState.completedTransaction?.status !== 'completed')) return;
  if (screen === 'payment-processing' && (applicationState.currentScreen !== 'payment-method' || !paymentMethods.some((method) => method.id === applicationState.selectedPaymentMethod))) return;
  if (screen === 'payment-successful' && (applicationState.currentScreen !== 'payment-processing' ||
      !applicationState.paymentResult || applicationState.completedTransaction?.status !== 'completed')) return;
  let message = recoveringScreen ? 'Please choose your products again to continue.' : '';
  const invalidEntry = Array.from(applicationState.cart).some(([id, quantity]) => !isValidCartEntry(id, quantity));
  if ((screen === 'item-selection' && invalidEntry) ||
      (!['item-selection', 'payment-successful', 'receipt'].includes(screen) && !isCartValid())) {
    applicationState.selectedPaymentMethod = null;
    applicationState.paymentResult = null;
    applicationState.completedTransaction = null;
    applicationState.cart.forEach((quantity, id) => {
      if (!isValidCartEntry(id, quantity)) applicationState.cart.delete(id);
    });
    if (!Number.isSafeInteger(calculateTotal())) applicationState.cart.clear();
    screen = 'item-selection';
    message = 'Please choose your products again. Your order is empty or contains an invalid item.';
  }
  if (screen === 'payment-method' && !['order-summary', 'payment-processing'].includes(applicationState.currentScreen)) return;
  if (screen === 'order-summary') renderOrderSummary();
  if (screen === 'item-selection') renderCart();
  if (screen === 'payment-method') renderPaymentSelection();
  if (screen === 'payment-processing') renderPaymentProcessing();
  if (screen === 'payment-successful') renderPaymentSuccessful();
  if (screen === 'receipt') renderReceipt();
  applicationState.currentScreen = screen;
  screens.forEach((id) => {
    const section = getElement(id);
    if (section) section.hidden = id !== screen;
  });
  const status = getElement('navigation-message');
  if (status) status.textContent = message;
  const label = getElement('screen-label');
  const titles = { 'item-selection': 'Item Selection', 'order-summary': 'Order Summary', 'payment-method': 'Payment Method', 'payment-processing': 'Payment Processing', 'payment-successful': 'Payment Successful', 'receipt': 'Receipt' };
  if (label) label.textContent = `IT415 · ${titles[screen]}`;
  const headings = { 'item-selection': 'app-title', 'order-summary': 'summary-title', 'payment-method': 'payment-title', 'payment-processing': 'processing-title', 'payment-successful': 'success-title', 'receipt': 'receipt-title' };
  const headingId = headings[screen];
  getElement(headingId)?.focus?.();
}

// 9. Payment Validation
function validateAmountPaid(rawAmount, total) {
  const value = String(rawAmount ?? '').trim();
  if (!value) return { error: 'Please enter the amount paid.' };
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return { error: 'Please enter a valid amount using numbers, such as 200.00.' };
  if (numeric < 0) return { error: 'Amount paid cannot be negative.' };
  if (!/^\d+(?:\.\d{1,2})?$/.test(value)) return { error: 'Enter a numeric amount with up to two decimal places.' };
  const [whole, fraction = ''] = value.split('.');
  const paidCents = Number(whole) * 100 + Number(fraction.padEnd(2, '0'));
  const totalCents = total * 100;
  if (!Number.isSafeInteger(paidCents) || !Number.isSafeInteger(totalCents)) {
    return { error: 'This amount is too large. Please enter a smaller amount.' };
  }
  if (paidCents < totalCents) return { error: `Insufficient amount. Please pay at least ${formatPrice(total)}.` };
  return { amountPaid: paidCents / 100, change: (paidCents - totalCents) / 100, total };
}

// 10. Payment Processing
const CARD_PROCESSING_DELAY_MS = 1500;

function setCardProcessing(processing) {
  applicationState.cardProcessing = processing;
  getElement('card-processing-panel').setAttribute('aria-busy', String(processing));
  const button = getElement('card-process');
  button.disabled = processing;
  button.textContent = processing ? 'Processing…' : 'Process Payment';
  getElement('cash-back').disabled = processing;
}

function processCashPayment(event) {
  event.preventDefault();
  if (applicationState.currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'cash' || applicationState.paymentResult) return;
  const input = getElement('amount-paid');
  const error = getElement('cash-error');
  if (!input || !error) return;
  // Invalid attempts never create a payment result or navigate to success.
  if (!isCartValid()) {
    error.textContent = 'Your order is invalid. Go back and review your products.';
    return;
  }
  const result = validateAmountPaid(input.value, calculateTotal());
  if (result.error) {
    input.setAttribute('aria-invalid', 'true');
    error.textContent = result.error;
    return;
  }
  input.setAttribute('aria-invalid', 'false');
  error.textContent = '';
  completeSimulatedPayment({ ...result, paymentMethod: 'Cash' });
}

function confirmQRPayment() {
  if (applicationState.currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'qr' || applicationState.paymentResult) return;
  if (!isCartValid()) {
    getElement('qr-error').textContent = 'Your order is invalid. Go back and review your products.';
    return;
  }
  const total = calculateTotal();
  completeSimulatedPayment({ total, amountPaid: total, change: 0, paymentMethod: 'QR Payment' });
}

function processCardPayment() {
  if (applicationState.currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'card' ||
      applicationState.cardProcessing || applicationState.paymentResult) return;
  const error = getElement('card-error');
  if (!isCartValid()) {
    error.textContent = 'Your order is invalid. Go back and review your products.';
    return;
  }
  const total = calculateTotal();
  const orderSignature = JSON.stringify(Array.from(applicationState.cart));
  error.textContent = '';
  setCardProcessing(true);
  getElement('card-status').textContent = 'Processing simulated card payment… Please wait.';

  setTimeout(() => {
    setCardProcessing(false);
    if (applicationState.currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'card') return;
    if (!isCartValid() || JSON.stringify(Array.from(applicationState.cart)) !== orderSignature) {
      getElement('card-status').textContent = 'Payment was not completed.';
      error.textContent = 'Your order changed. Go back and review it before trying again.';
      return;
    }
    getElement('card-status').textContent = 'Simulated card payment completed.';
    completeSimulatedPayment({ total, amountPaid: total, change: 0, paymentMethod: 'Credit/Debit Card' });
  }, CARD_PROCESSING_DELAY_MS);
}

// 11. Transaction Logic
function clearCompletedPayment() {
  applicationState.paymentResult = null;
  applicationState.completedTransaction = null;
}

function completeSimulatedPayment(result) {
  if (applicationState.currentScreen !== 'payment-processing' || applicationState.cardProcessing ||
      applicationState.paymentResult || !isCartValid() || !result) return;
  const method = paymentMethods.find((entry) => entry.id === applicationState.selectedPaymentMethod);
  const total = calculateTotal();
  if (!method || result.paymentMethod !== method.label || result.total !== total ||
      !Number.isFinite(result.amountPaid) || !Number.isFinite(result.change)) return;
  if (method.id === 'cash') {
    const validated = validateAmountPaid(String(result.amountPaid), total);
    if (validated.error || validated.change !== result.change) return;
  } else if (result.amountPaid !== total || result.change !== 0) return;

  const items = Array.from(applicationState.cart, ([productId, quantity]) => {
    const product = getProduct(productId);
    return Object.freeze({ productId, name: product.name, unitPrice: product.price, quantity, subtotal: calculateSubtotal(productId) });
  });
  // Copy values and freeze every level; later cart changes cannot alter the record.
  const snapshot = Object.freeze({
    reference: `POS-${crypto.randomUUID()}`,
    dateTime: new Date().toISOString(),
    items: Object.freeze(items),
    total,
    paymentMethod: method.label,
    amountPaid: result.amountPaid,
    change: result.change,
    status: 'completed'
  });
  applicationState.completedTransaction = snapshot;
  applicationState.paymentResult = Object.freeze({ ...result });
  navigateTo('payment-successful');
}

// 12. Receipt Rendering
function renderReceipt() {
  const transaction = applicationState.completedTransaction;
  if (!transaction || transaction.status !== 'completed') return;
  getElement('receipt-reference').textContent = transaction.reference;
  const dateTime = getElement('receipt-date-time');
  dateTime.textContent = transaction.dateTime;
  dateTime.setAttribute('datetime', transaction.dateTime);
  const fragment = document.createDocumentFragment();
  transaction.items.forEach((item) => {
    const row = document.createElement('li');
    row.classList.add('cart-item');
    [item.name, `Quantity: ${item.quantity}`, `Unit Price: ${formatPrice(item.unitPrice)}`,
      `Subtotal: ${formatPrice(item.subtotal)}`].forEach((value) => {
      const detail = document.createElement('p');
      detail.textContent = value;
      row.append(detail);
    });
    fragment.append(row);
  });
  getElement('receipt-items').replaceChildren(fragment);
  getElement('receipt-total').textContent = formatPrice(transaction.total);
  getElement('receipt-method').textContent = transaction.paymentMethod;
  getElement('receipt-paid').textContent = formatPrice(transaction.amountPaid);
  getElement('receipt-change').textContent = formatPrice(transaction.change);
  getElement('receipt-status').textContent = 'Payment Successful';
}

// 13. Reset Logic
function startNewTransaction() {
  if (applicationState.currentScreen !== 'receipt' || applicationState.completedTransaction?.status !== 'completed') return;

  applicationState.cart.clear();
  applicationState.selectedPaymentMethod = null;
  clearCompletedPayment();
  setCardProcessing(false);
  renderCashProcessing();
  renderPaymentSelection();

  // Clear hidden screens too so no previous customer's values remain in the DOM.
  ['summary-items', 'receipt-items'].forEach((id) => {
    getElement(id).replaceChildren(document.createDocumentFragment());
  });
  ['summary-total', 'qr-total', 'card-total'].forEach((id) => {
    getElement(id).textContent = formatPrice(0);
  });
  ['qr-error', 'card-error', 'card-status', 'success-total', 'cash-paid-result',
    'cash-change-result', 'payment-method-result', 'success-reference', 'receipt-reference',
    'receipt-date-time', 'receipt-total', 'receipt-method', 'receipt-paid', 'receipt-change',
    'receipt-status'].forEach((id) => {
    getElement(id).textContent = '';
  });
  getElement('receipt-date-time').removeAttribute('datetime');
  getElement('processing-title').textContent = 'Payment Processing';
  ['cash-processing-panel', 'qr-processing-panel', 'card-processing-panel'].forEach((id) => {
    getElement(id).hidden = true;
  });
  navigateTo('item-selection');
}

// 14. Event Listeners
function bindEventListeners() {
  const navigation = {
    'selection-continue': 'order-summary',
    'summary-back': 'item-selection',
    'summary-continue': 'payment-method',
    'payment-back': 'order-summary',
    'payment-process': 'payment-processing',
    'cash-back': 'payment-method',
    'view-receipt': 'receipt'
  };
  Object.entries(navigation).forEach(([id, screen]) => {
    getElement(id)?.addEventListener('click', () => navigateTo(screen));
  });
  paymentMethods.forEach((method) => {
    getElement(method.buttonId)?.addEventListener('click', () => selectPaymentMethod(method.id));
  });
  getElement('cash-payment-form')?.addEventListener('submit', processCashPayment);
  getElement('qr-confirm')?.addEventListener('click', confirmQRPayment);
  getElement('card-process')?.addEventListener('click', processCardPayment);
  getElement('new-transaction')?.addEventListener('click', startNewTransaction);
}

// 15. Initialization
function initializeApplication() {
  const application = getElement('app');

  if (!application) {
    return;
  }

  const productGrid = getElement('product-grid');

  if (productGrid) {
    renderProducts(productGrid);
  }
  renderCart();

  renderPaymentSelection();
  bindEventListeners();

  application.dataset.initialized = 'true';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication, { once: true });
} else {
  initializeApplication();
}
