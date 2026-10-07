// Run with the existing Node runtime: node tests/cart.test.cjs
// This verifies application logic and rendered output using a simulated DOM.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');

function element(tag) {
  return {
    tag, dataset: {}, children: [], listeners: {}, hidden: false,
    classList: { add() {} },
    setAttribute(name, value) { this[name] = value; },
    addEventListener(event, callback) { this.listeners[event] = callback; },
    append(...children) { this.children.push(...children); },
    replaceChildren(fragment) { this.children = [...fragment.children]; }
  };
}

const nodes = Object.fromEntries(
  ['app', 'product-grid', 'cart-items', 'cart-total', 'empty-order'].map((id) => [id, element('div')])
);
const context = vm.createContext({
  document: {
    readyState: 'complete',
    getElementById(id) { return nodes[id] || null; },
    createElement: element,
    createDocumentFragment() { return element('fragment'); }
  }
});
vm.runInContext(fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8'), context);

function run(code) { return vm.runInContext(code, context); }
function tap(id) {
  nodes['product-grid'].children.find((button) => button.dataset.productId === id).listeners.click();
}
function control(name, label) {
  const row = nodes['cart-items'].children.find((item) => item.children[0].textContent === name);
  const controls = row.children.flatMap((child) => [child, ...child.children]);
  controls.find((button) => button['aria-label'] === label).listeners.click();
}
function total(expected) {
  assert.equal(run('calculateTotal()'), expected);
  assert.equal(nodes['cart-total'].textContent, `₱${expected.toFixed(2)}`);
}
function row(name, quantity, subtotal) {
  const item = nodes['cart-items'].children.find((item) => item.children[0].textContent === name);
  assert.ok(item);
  assert.equal(item.children[2].children[1].textContent, `Qty: ${quantity}`);
  assert.equal(item.children[3].textContent, `Subtotal: ₱${subtotal.toFixed(2)}`);
}

assert.equal(nodes['product-grid'].children.length, 6);
total(0);
tap('coffee'); tap('coffee'); tap('sandwich'); tap('soft-drink');
assert.equal(nodes['cart-items'].children.length, 3);
row('Coffee', 2, 90); row('Sandwich', 1, 50); row('Soft Drink', 1, 35); total(175);
assert.equal(nodes['empty-order'].hidden, true);
console.log('PASS: Coffee ×2 = ₱90, Sandwich ×1 = ₱50, Soft Drink ×1 = ₱35; total ₱175.');
control('Coffee', 'Increase Coffee quantity');
row('Coffee', 3, 135); total(220);
console.log('PASS: Coffee 2 → 3; subtotal ₱135; total ₱220.');
control('Coffee', 'Decrease Coffee quantity');
row('Coffee', 2, 90); total(175);
console.log('PASS: Coffee 3 → 2; total ₱175.');
control('Soft Drink', 'Remove Soft Drink');
total(140); assert.equal(nodes['cart-items'].children.length, 2);
console.log('PASS: Remove Soft Drink; total ₱140.');
control('Coffee', 'Decrease Coffee quantity');
control('Coffee', 'Decrease Coffee quantity');
for (let count = 0; count < 5; count++) run("decreaseQuantity('coffee')");
assert.equal(run("cart.has('coffee')"), false); total(50);
run("removeFromCart('sandwich')"); total(0);
assert.equal(nodes['empty-order'].hidden, false);
run("addToCart('invalid'); increaseQuantity('invalid'); decreaseQuantity('invalid')");
total(0); assert.equal(run('cart.size'), 0);
assert.equal(run("calculateSubtotal('invalid')"), 0);
tap('coffee'); row('Coffee', 1, 45); total(45);
console.log('PASS: Quantity reaching zero removes the row; repeated decreases cannot produce negative quantities; empty total, invalid IDs, and re-addition verified.');
