'use strict';

const products = [
  { id: 'coffee', name: 'Coffee', price: 45 },
  { id: 'sandwich', name: 'Sandwich', price: 50 },
  { id: 'soft-drink', name: 'Soft Drink', price: 35 },
  { id: 'cookies', name: 'Cookies', price: 25 },
  { id: 'bottled-water', name: 'Bottled Water', price: 20 },
  { id: 'chocolate', name: 'Chocolate', price: 25 }
];

function renderProducts(container) {
  const fragment = document.createDocumentFragment();

  products.forEach((product) => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'product-card';
    button.dataset.productId = product.id;

    const name = document.createElement('span');
    name.className = 'product-name';
    name.textContent = product.name;

    const price = document.createElement('span');
    price.className = 'product-price';
    price.textContent = `₱${product.price.toFixed(2)}`;

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

  application.dataset.initialized = 'true';
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initializeApplication, { once: true });
} else {
  initializeApplication();
}
