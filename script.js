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

  application.dataset.initialized = 'true';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication, { once: true });
} else {
  initializeApplication();
}
