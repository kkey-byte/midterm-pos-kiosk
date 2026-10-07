'use strict';

const products = [
  { id: 'coffee', name: 'Coffee', price: 45 },
  { id: 'sandwich', name: 'Sandwich', price: 50 },
  { id: 'soft-drink', name: 'Soft Drink', price: 35 },
  { id: 'cookies', name: 'Cookies', price: 25 },
  { id: 'bottled-water', name: 'Bottled Water', price: 20 },
  { id: 'chocolate', name: 'Chocolate', price: 25 }
];

// The cart stores quantities only; names and prices always come from the catalog.
const cart = new Map();
let currentScreen = 'item-selection';
const applicationState = { selectedPaymentMethod: null, paymentResult: null, cardProcessing: false, completedTransaction: null };
const paymentMethods = [
  { id: 'cash', label: 'Cash', buttonId: 'payment-cash' },
  { id: 'qr', label: 'QR Payment', buttonId: 'payment-qr' },
  { id: 'card', label: 'Credit/Debit Card', buttonId: 'payment-card' }
];

function renderPaymentSelection() {
  const selected = paymentMethods.find((method) => method.id === applicationState.selectedPaymentMethod);
  paymentMethods.forEach((method) => {
    const button = document.getElementById(method.buttonId);
    if (button) button.setAttribute('aria-pressed', String(method.id === applicationState.selectedPaymentMethod));
  });
  const status = document.getElementById('payment-selection-status');
  if (status) status.textContent = selected ? `Selected: ${selected.label} (simulated).` : 'No payment method selected.';
  const process = document.getElementById('payment-process');
  if (process) {
    process.disabled = !paymentMethods.some((method) => method.id === applicationState.selectedPaymentMethod);
    process.textContent = selected ? `CONTINUE WITH ${selected.label.toUpperCase()}` : 'CONTINUE';
  }
}

function completeSimulatedPayment(result) {
  if (currentScreen !== 'payment-processing' || applicationState.cardProcessing ||
      applicationState.paymentResult || !isCartValid() || !result) return;
  const method = paymentMethods.find((entry) => entry.id === applicationState.selectedPaymentMethod);
  const total = calculateTotal();
  if (!method || result.paymentMethod !== method.label || result.total !== total ||
      !Number.isFinite(result.amountPaid) || !Number.isFinite(result.change)) return;
  if (method.id === 'cash') {
    const validated = validateAmountPaid(String(result.amountPaid), total);
    if (validated.error || validated.change !== result.change) return;
  } else if (result.amountPaid !== total || result.change !== 0) return;

  const items = Array.from(cart, ([productId, quantity]) => {
    const product = products.find((entry) => entry.id === productId);
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

function renderPaymentSuccessful() {
  const transaction = applicationState.completedTransaction;
  if (!transaction || transaction.status !== 'completed') return;
  document.getElementById('success-total').textContent = formatPrice(transaction.total);
  document.getElementById('cash-paid-result').textContent = formatPrice(transaction.amountPaid);
  document.getElementById('cash-change-result').textContent = formatPrice(transaction.change);
  document.getElementById('payment-method-result').textContent = transaction.paymentMethod;
  document.getElementById('success-reference').textContent = transaction.reference;
}

function renderReceipt() {
  const transaction = applicationState.completedTransaction;
  if (!transaction || transaction.status !== 'completed') return;
  document.getElementById('receipt-reference').textContent = transaction.reference;
  const dateTime = document.getElementById('receipt-date-time');
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
  document.getElementById('receipt-items').replaceChildren(fragment);
  document.getElementById('receipt-total').textContent = formatPrice(transaction.total);
  document.getElementById('receipt-method').textContent = transaction.paymentMethod;
  document.getElementById('receipt-paid').textContent = formatPrice(transaction.amountPaid);
  document.getElementById('receipt-change').textContent = formatPrice(transaction.change);
  document.getElementById('receipt-status').textContent = 'Payment Successful';
}

function startNewTransaction() {
  if (currentScreen !== 'receipt' || applicationState.completedTransaction?.status !== 'completed') return;

  cart.clear();
  applicationState.selectedPaymentMethod = null;
  applicationState.paymentResult = null;
  applicationState.completedTransaction = null;
  setCardProcessing(false);
  renderCashProcessing();
  renderPaymentSelection();

  // Clear hidden screens too so no previous customer's values remain in the DOM.
  ['summary-items', 'receipt-items'].forEach((id) => {
    document.getElementById(id).replaceChildren(document.createDocumentFragment());
  });
  ['summary-total', 'qr-total', 'card-total'].forEach((id) => {
    document.getElementById(id).textContent = formatPrice(0);
  });
  ['qr-error', 'card-error', 'card-status', 'success-total', 'cash-paid-result',
    'cash-change-result', 'payment-method-result', 'success-reference', 'receipt-reference',
    'receipt-date-time', 'receipt-total', 'receipt-method', 'receipt-paid', 'receipt-change',
    'receipt-status'].forEach((id) => {
    document.getElementById(id).textContent = '';
  });
  document.getElementById('receipt-date-time').removeAttribute('datetime');
  document.getElementById('processing-title').textContent = 'Payment Processing';
  ['cash-processing-panel', 'qr-processing-panel', 'card-processing-panel'].forEach((id) => {
    document.getElementById(id).hidden = true;
  });
  navigateTo('item-selection');
}

function renderPaymentProcessing() {
  const method = applicationState.selectedPaymentMethod;
  document.getElementById('cash-processing-panel').hidden = method !== 'cash';
  document.getElementById('qr-processing-panel').hidden = method !== 'qr';
  document.getElementById('card-processing-panel').hidden = method !== 'card';
  const selected = paymentMethods.find((entry) => entry.id === method);
  document.getElementById('processing-title').textContent = `${selected.label} Payment Processing`;
  renderCashProcessing();
  document.getElementById('qr-total').textContent = formatPrice(calculateTotal());
  document.getElementById('qr-error').textContent = '';
  document.getElementById('card-total').textContent = formatPrice(calculateTotal());
  document.getElementById('card-error').textContent = '';
  document.getElementById('card-status').textContent = 'Ready to simulate payment.';
  setCardProcessing(false);
}

function setCardProcessing(processing) {
  applicationState.cardProcessing = processing;
  document.getElementById('card-processing-panel').setAttribute('aria-busy', String(processing));
  const button = document.getElementById('card-process');
  button.disabled = processing;
  button.textContent = processing ? 'Processing…' : 'Process Payment';
  document.getElementById('cash-back').disabled = processing;
}

function processCardPayment() {
  if (currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'card' ||
      applicationState.cardProcessing || applicationState.paymentResult) return;
  const error = document.getElementById('card-error');
  if (!isCartValid()) {
    error.textContent = 'Your order is invalid. Go back and review your products.';
    return;
  }
  const total = calculateTotal();
  const orderSignature = JSON.stringify(Array.from(cart));
  error.textContent = '';
  setCardProcessing(true);
  document.getElementById('card-status').textContent = 'Processing simulated card payment… Please wait.';

  setTimeout(() => {
    setCardProcessing(false);
    if (currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'card') return;
    if (!isCartValid() || JSON.stringify(Array.from(cart)) !== orderSignature) {
      document.getElementById('card-status').textContent = 'Payment was not completed.';
      error.textContent = 'Your order changed. Go back and review it before trying again.';
      return;
    }
    document.getElementById('card-status').textContent = 'Simulated card payment completed.';
    completeSimulatedPayment({ total, amountPaid: total, change: 0, paymentMethod: 'Credit/Debit Card' });
  }, 1500);
}

function confirmQRPayment() {
  if (currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'qr' || applicationState.paymentResult) return;
  if (!isCartValid()) {
    document.getElementById('qr-error').textContent = 'Your order is invalid. Go back and review your products.';
    return;
  }
  const total = calculateTotal();
  completeSimulatedPayment({ total, amountPaid: total, change: 0, paymentMethod: 'QR Payment' });
}

function validateAmountPaid(rawAmount, total) {
  const value = String(rawAmount ?? '').trim();
  if (!value) return { error: 'Please enter the amount paid.' };
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return { error: 'Enter a valid, finite numeric amount.' };
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

function renderCashProcessing() {
  applicationState.paymentResult = null;
  applicationState.completedTransaction = null;
  const total = document.getElementById('cash-total');
  if (total) total.textContent = formatPrice(calculateTotal());
  const input = document.getElementById('amount-paid');
  if (input) {
    input.value = '';
    input.setAttribute('aria-invalid', 'false');
  }
  const error = document.getElementById('cash-error');
  if (error) error.textContent = '';
}

function processCashPayment(event) {
  event.preventDefault();
  if (currentScreen !== 'payment-processing' || applicationState.selectedPaymentMethod !== 'cash' || applicationState.paymentResult) return;
  const input = document.getElementById('amount-paid');
  const error = document.getElementById('cash-error');
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

function selectPaymentMethod(methodId) {
  if (currentScreen !== 'payment-method' || !paymentMethods.some((method) => method.id === methodId)) return;
  if (!isCartValid()) {
    navigateTo('order-summary');
    return;
  }
  applicationState.selectedPaymentMethod = methodId;
  renderPaymentSelection();
}

function isValidCartEntry(productId, quantity) {
  const product = products.find((item) => item.id === productId);
  return Boolean(product) && Number.isSafeInteger(quantity) && quantity > 0 &&
    Number.isSafeInteger(product.price * quantity);
}

function isCartValid() {
  return cart.size > 0 && Array.from(cart).every(([id, quantity]) => isValidCartEntry(id, quantity)) &&
    Number.isSafeInteger(calculateTotal());
}

function renderOrderSummary() {
  const list = document.getElementById('summary-items');
  const total = document.getElementById('summary-total');
  if (!list || !total) return;
  const fragment = document.createDocumentFragment();
  cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
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

function navigateTo(screen) {
  if (applicationState.cardProcessing) return;
  const screens = ['item-selection', 'order-summary', 'payment-method', 'payment-processing', 'payment-successful', 'receipt'];
  if (!screens.includes(screen)) return;
  if (screen === 'receipt' && (currentScreen !== 'payment-successful' ||
      applicationState.completedTransaction?.status !== 'completed')) return;
  if (screen === 'payment-processing' && (currentScreen !== 'payment-method' || !paymentMethods.some((method) => method.id === applicationState.selectedPaymentMethod))) return;
  if (screen === 'payment-successful' && (currentScreen !== 'payment-processing' ||
      !applicationState.paymentResult || applicationState.completedTransaction?.status !== 'completed')) return;
  let message = '';
  if (!['item-selection', 'payment-successful', 'receipt'].includes(screen) && !isCartValid()) {
    applicationState.selectedPaymentMethod = null;
    applicationState.paymentResult = null;
    applicationState.completedTransaction = null;
    cart.forEach((quantity, id) => {
      if (!isValidCartEntry(id, quantity)) cart.delete(id);
    });
    if (!Number.isSafeInteger(calculateTotal())) cart.clear();
    screen = 'item-selection';
    message = 'Please choose your products again. Your order is empty or contains an invalid item.';
  }
  if (screen === 'payment-method' && !['order-summary', 'payment-processing'].includes(currentScreen)) return;
  if (screen === 'order-summary') renderOrderSummary();
  if (screen === 'item-selection') renderCart();
  if (screen === 'payment-method') renderPaymentSelection();
  if (screen === 'payment-processing') renderPaymentProcessing();
  if (screen === 'payment-successful') renderPaymentSuccessful();
  if (screen === 'receipt') renderReceipt();
  currentScreen = screen;
  screens.forEach((id) => {
    const section = document.getElementById(id);
    if (section) section.hidden = id !== screen;
  });
  const status = document.getElementById('navigation-message');
  if (status) status.textContent = message;
  const label = document.getElementById('screen-label');
  const titles = { 'item-selection': 'Item Selection', 'order-summary': 'Order Summary', 'payment-method': 'Payment Method', 'payment-processing': 'Payment Processing', 'payment-successful': 'Payment Successful', 'receipt': 'Receipt' };
  if (label) label.textContent = `IT415 · ${titles[screen]}`;
  const headings = { 'item-selection': 'app-title', 'order-summary': 'summary-title', 'payment-method': 'payment-title', 'payment-processing': 'processing-title', 'payment-successful': 'success-title', 'receipt': 'receipt-title' };
  const headingId = headings[screen];
  document.getElementById(headingId)?.focus?.();
}

function formatPrice(value) {
  return `₱${value.toFixed(2)}`;
}

function calculateSubtotal(productId) {
  const product = products.find((item) => item.id === productId);
  return product ? product.price * (cart.get(productId) || 0) : 0;
}

function calculateTotal() {
  return Array.from(cart.keys()).reduce((total, id) => total + calculateSubtotal(id), 0);
}

function addToCart(productId) {
  if (!products.some((product) => product.id === productId)) return;
  const quantity = cart.get(productId) || 0;
  if (!Number.isSafeInteger(quantity + 1)) return;
  cart.set(productId, quantity + 1);
  renderCart();
}

function increaseQuantity(productId) {
  if (cart.has(productId)) addToCart(productId);
}

function decreaseQuantity(productId) {
  const quantity = cart.get(productId);
  if (!quantity) return;
  if (quantity === 1) cart.delete(productId);
  else cart.set(productId, quantity - 1);
  renderCart();
}

function removeFromCart(productId) {
  cart.delete(productId);
  renderCart();
}

function createCartControl(label, text, action) {
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'cart-control';
  button.textContent = text;
  button.setAttribute('aria-label', label);
  button.addEventListener('click', action);
  return button;
}

function renderCart() {
  const list = document.getElementById('cart-items');
  const total = document.getElementById('cart-total');
  if (!list || !total) return;
  const fragment = document.createDocumentFragment();

  cart.forEach((quantity, productId) => {
    const product = products.find((item) => item.id === productId);
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
  const empty = document.getElementById('empty-order');
  if (empty) empty.hidden = cart.size > 0;
  const continueButton = document.getElementById('selection-continue');
  if (continueButton) continueButton.disabled = !isCartValid();
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

function initializeApplication() {
  const application = document.getElementById('app');

  if (!application) {
    return;
  }

  const productGrid = document.getElementById('product-grid');

  if (productGrid) {
    renderProducts(productGrid);
  }
  renderCart();

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
    document.getElementById(id)?.addEventListener('click', () => navigateTo(screen));
  });
  paymentMethods.forEach((method) => {
    document.getElementById(method.buttonId)?.addEventListener('click', () => selectPaymentMethod(method.id));
  });
  renderPaymentSelection();
  document.getElementById('cash-payment-form')?.addEventListener('submit', processCashPayment);
  document.getElementById('qr-confirm')?.addEventListener('click', confirmQRPayment);
  document.getElementById('card-process')?.addEventListener('click', processCardPayment);
  document.getElementById('new-transaction')?.addEventListener('click', startNewTransaction);

  application.dataset.initialized = 'true';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication, { once: true });
} else {
  initializeApplication();
}
