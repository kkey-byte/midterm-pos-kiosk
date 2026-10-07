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
  ['app', 'product-grid', 'cart-items', 'cart-total', 'empty-order',
    'item-selection', 'order-summary', 'payment-method', 'summary-items', 'summary-total',
    'selection-continue', 'summary-back', 'summary-continue', 'payment-back',
    'navigation-message', 'screen-label', 'payment-cash', 'payment-qr', 'payment-card',
    'payment-selection-status', 'payment-process', 'payment-processing', 'payment-successful',
    'cash-payment-form', 'cash-total', 'amount-paid', 'cash-error', 'cash-back',
    'cash-paid-result', 'cash-change-result', 'payment-method-result', 'processing-title',
    'cash-processing-panel', 'qr-processing-panel', 'qr-total', 'qr-error', 'qr-confirm',
    'card-processing-panel', 'card-total', 'card-status', 'card-error', 'card-process'].map((id) => [id, element('div')])
);
const timers = [];
const context = vm.createContext({
  setTimeout(callback, delay) { timers.push({ callback, delay }); },
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

run('cart.clear(); renderCart()');
assert.equal(nodes['selection-continue'].disabled, true);
tap('coffee'); tap('coffee'); tap('sandwich');
total(140);
assert.equal(nodes['selection-continue'].disabled, false);
const originalCart = run('cart');
nodes['selection-continue'].listeners.click();
assert.equal(run('currentScreen'), 'order-summary');
assert.equal(nodes['item-selection'].hidden, true);
assert.equal(nodes['order-summary'].hidden, false);
const expectedSummary = [
  ['Coffee', 'Unit price: ₱45.00', 'Qty: 2', 'Subtotal: ₱90.00'],
  ['Sandwich', 'Unit price: ₱50.00', 'Qty: 1', 'Subtotal: ₱50.00']
];
assert.equal(nodes['summary-items'].children.length, 2);
nodes['summary-items'].children.forEach((item, index) => {
  assert.deepEqual(item.children.map((child) => child.textContent), expectedSummary[index]);
});
assert.equal(nodes['summary-total'].textContent, '₱140.00');
assert.equal(run('cart'), originalCart);
console.log('PASS: Summary exactly matches Coffee ×2 (₱45 unit, ₱90 subtotal), Sandwich ×1 (₱50 unit/subtotal), total ₱140; same cart object.');
nodes['summary-back'].listeners.click();
assert.equal(run('currentScreen'), 'item-selection');
assert.equal(nodes['item-selection'].hidden, false);
assert.equal(nodes['order-summary'].hidden, true);
row('Coffee', 2, 90); row('Sandwich', 1, 50); total(140);
assert.equal(run('cart'), originalCart);
console.log('PASS: BACK preserves both items, quantities, subtotals, total, and authoritative cart object.');
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
assert.equal(run('currentScreen'), 'payment-method');
assert.equal(nodes['payment-method'].hidden, false);
total(140);
nodes['payment-back'].listeners.click();
assert.equal(run('currentScreen'), 'order-summary');
console.log('PASS: CONTINUE TO PAYMENT opens Payment Method; return to summary preserves cart.');
run("cart.clear(); navigateTo('order-summary')");
assert.equal(run('currentScreen'), 'item-selection');
assert.ok(nodes['navigation-message'].textContent.includes('Please choose'));
total(0);
for (const invalid of ["cart.set('unknown', 1)", "cart.set('coffee', -1)", "cart.set('coffee', 0)", "cart.set('coffee', 1.5)", "cart.set('coffee', NaN)"]) {
  run(`cart.clear(); ${invalid}; navigateTo('order-summary')`);
  assert.equal(run('currentScreen'), 'item-selection');
  assert.equal(run('cart.size'), 0);
  assert.equal(nodes['selection-continue'].disabled, true);
  assert.ok(nodes['navigation-message'].textContent.includes('Please choose'));
  total(0);
}
console.log('PASS: Empty and invalid carts return safely to Item Selection with friendly feedback and no exceptions.');

tap('coffee'); tap('coffee'); tap('sandwich');
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
const paymentCart = run('cart');
for (const [id, label] of [['cash', 'Cash'], ['qr', 'QR Payment'], ['card', 'Credit/Debit Card']]) {
  nodes[`payment-${id}`].listeners.click();
  assert.equal(run('applicationState.selectedPaymentMethod'), id);
  assert.equal(nodes['payment-selection-status'].textContent, `Selected: ${label} (simulated).`);
  for (const other of ['cash', 'qr', 'card']) {
    assert.equal(nodes[`payment-${other}`]['aria-pressed'], String(other === id));
  }
  assert.equal(run('currentScreen'), 'payment-method');
  nodes['payment-back'].listeners.click();
  assert.equal(run('currentScreen'), 'order-summary');
  assert.equal(run('cart'), paymentCart);
  row('Coffee', 2, 90); row('Sandwich', 1, 50); total(140);
  assert.equal(nodes['summary-total'].textContent, '₱140.00');
  nodes['summary-continue'].listeners.click();
  assert.equal(run('applicationState.selectedPaymentMethod'), id);
  assert.equal(nodes[`payment-${id}`]['aria-pressed'], 'true');
  console.log(`PASS: ${label} selected in application state, exclusive aria-pressed, Back preserves Coffee ×2 + Sandwich ×1 = ₱140; selection persists on return.`);
}
run("selectPaymentMethod('invalid')");
assert.equal(run('applicationState.selectedPaymentMethod'), 'card');
assert.deepEqual(Array.from(run('Object.keys(applicationState)')), ['selectedPaymentMethod', 'paymentResult', 'cardProcessing']);
console.log('PASS: Invalid method ignored; state stores only the method identifier, no payment credentials; no transaction completed.');
run("cart.set('unknown', 1); selectPaymentMethod('cash')");
assert.equal(run('currentScreen'), 'item-selection');
assert.equal(run("cart.has('unknown')"), false);
assert.equal(run('applicationState.selectedPaymentMethod'), null);
total(140);
console.log('PASS: Invalid cart during method selection returns safely with valid items preserved and method reset.');

function enterCashProcessing() {
  run("navigateTo('item-selection')");
  nodes['selection-continue'].listeners.click();
  nodes['summary-continue'].listeners.click();
  nodes['payment-cash'].listeners.click();
  assert.equal(nodes['payment-process'].disabled, false);
  nodes['payment-process'].listeners.click();
  assert.equal(run('currentScreen'), 'payment-processing');
  assert.equal(nodes['cash-total'].textContent, '₱140.00');
}
function pay(value) {
  nodes['amount-paid'].value = value;
  let prevented = false;
  nodes['cash-payment-form'].listeners.submit({ preventDefault() { prevented = true; } });
  assert.equal(prevented, true);
}
enterCashProcessing();
run("navigateTo('payment-successful')");
assert.equal(run('currentScreen'), 'payment-processing');
for (const value of ['100', '', '   ', 'abc', '-1', 'Infinity', '-Infinity', 'NaN', '1e309', '200.001', '9007199254740992']) {
  pay(value);
  assert.equal(run('currentScreen'), 'payment-processing');
  assert.equal(run('applicationState.paymentResult'), null);
  assert.equal(nodes['payment-successful'].hidden, true);
  assert.ok(nodes['cash-error'].textContent.length > 0);
  assert.equal(run("'transaction' in applicationState || 'receipt' in applicationState"), false);
  total(140);
  console.log(`PASS: Amount ${JSON.stringify(value)} rejected with message; stays processing; no success, transaction, receipt, or payment result.`);
}
pay('200');
assert.equal(run('currentScreen'), 'payment-successful');
assert.equal(run('applicationState.paymentResult.amountPaid'), 200);
assert.equal(run('applicationState.paymentResult.change'), 60);
assert.equal(nodes['cash-change-result'].textContent, '₱60.00');
assert.equal(nodes['cash-error'].textContent, '');
const acceptedPayment = run('applicationState.paymentResult');
pay('500');
assert.equal(run('applicationState.paymentResult'), acceptedPayment);
console.log('PASS: Total ₱140, paid ₱200 → change ₱60; repeated submission after success ignored.');
enterCashProcessing();
pay('140');
assert.equal(run('currentScreen'), 'payment-successful');
assert.equal(run('applicationState.paymentResult.change'), 0);
assert.equal(nodes['cash-change-result'].textContent, '₱0.00');
console.log('PASS: Total ₱140, paid ₱140 → change ₱0.');
enterCashProcessing();
pay('200.10');
assert.equal(run('applicationState.paymentResult.change'), 60.1);
assert.equal(nodes['cash-change-result'].textContent, '₱60.10');
console.log('PASS: Decimal cash ₱200.10 → change ₱60.10 using integer cents.');

run("navigateTo('item-selection')");
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
nodes['payment-qr'].listeners.click();
assert.equal(nodes['payment-process'].disabled, false);
nodes['payment-process'].listeners.click();
assert.equal(run('currentScreen'), 'payment-processing');
assert.equal(nodes['qr-total'].textContent, '₱140.00');
assert.equal(nodes['qr-processing-panel'].hidden, false);
assert.equal(nodes['cash-processing-panel'].hidden, true);
assert.equal(run('applicationState.paymentResult'), null);
nodes['cash-back'].listeners.click();
assert.equal(run('currentScreen'), 'payment-method');
total(140);
nodes['payment-process'].listeners.click();
nodes['qr-confirm'].listeners.click();
assert.equal(run('currentScreen'), 'payment-successful');
assert.equal(run('applicationState.paymentResult.total'), 140);
assert.equal(run('applicationState.paymentResult.amountPaid'), 140);
assert.equal(run('applicationState.paymentResult.change'), 0);
assert.equal(run('applicationState.paymentResult.paymentMethod'), 'QR Payment');
assert.equal(nodes['cash-paid-result'].textContent, '₱140.00');
assert.equal(nodes['cash-change-result'].textContent, '₱0.00');
assert.equal(nodes['payment-method-result'].textContent, 'QR Payment');
const qrResult = run('applicationState.paymentResult');
nodes['qr-confirm'].listeners.click();
assert.equal(run('applicationState.paymentResult'), qrResult);
total(140);
console.log('PASS: QR due ₱140; Confirm Payment → paid ₱140, change ₱0, method QR Payment; Back preserves cart and repeated confirmation is ignored.');
run("navigateTo('item-selection')");
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
nodes['payment-qr'].listeners.click();
nodes['payment-process'].listeners.click();
run('cart.clear()');
nodes['qr-confirm'].listeners.click();
assert.equal(run('currentScreen'), 'payment-processing');
assert.equal(run('applicationState.paymentResult'), null);
assert.ok(nodes['qr-error'].textContent.length > 0);
assert.equal(nodes['payment-successful'].hidden, true);
console.log('PASS: Invalid/empty QR order stays processing with feedback and no successful payment result.');

run("navigateTo('item-selection')");
tap('coffee'); tap('coffee'); tap('sandwich');
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
nodes['payment-card'].listeners.click();
assert.equal(nodes['payment-process'].disabled, false);
nodes['payment-process'].listeners.click();
assert.equal(nodes['card-total'].textContent, '₱140.00');
assert.equal(nodes['card-processing-panel'].hidden, false);
assert.equal(nodes['cash-processing-panel'].hidden, true);
assert.equal(nodes['qr-processing-panel'].hidden, true);
nodes['card-process'].listeners.click();
assert.equal(run('applicationState.cardProcessing'), true);
assert.equal(run('currentScreen'), 'payment-processing');
assert.equal(run('applicationState.paymentResult'), null);
assert.equal(nodes['payment-successful'].hidden, true);
assert.ok(nodes['card-status'].textContent.includes('Processing'));
assert.equal(nodes['card-process'].disabled, true);
assert.equal(nodes['cash-back'].disabled, true);
assert.equal(nodes['card-processing-panel']['aria-busy'], 'true');
for (let count = 0; count < 5; count++) nodes['card-process'].listeners.click();
nodes['cash-back'].listeners.click();
assert.equal(run('currentScreen'), 'payment-processing');
assert.equal(timers.length, 1);
assert.equal(timers[0].delay, 1500);
console.log('PASS: Card displays due ₱140; Processing state visible, Process/Back disabled; six activations schedule only one 1500ms callback.');
timers.shift().callback();
assert.equal(run('applicationState.cardProcessing'), false);
assert.equal(run('currentScreen'), 'payment-successful');
assert.equal(run('applicationState.paymentResult.amountPaid'), 140);
assert.equal(run('applicationState.paymentResult.change'), 0);
assert.equal(run('applicationState.paymentResult.paymentMethod'), 'Credit/Debit Card');
assert.equal(nodes['cash-paid-result'].textContent, '₱140.00');
assert.equal(nodes['cash-change-result'].textContent, '₱0.00');
assert.equal(nodes['payment-method-result'].textContent, 'Credit/Debit Card');
const cardResult = run('applicationState.paymentResult');
nodes['card-process'].listeners.click();
assert.equal(timers.length, 0);
assert.equal(run('applicationState.paymentResult'), cardResult);
total(140);
console.log('PASS: Controlled timer completion → paid ₱140, change ₱0, method Credit/Debit Card; post-success processing ignored; cart preserved.');
run("navigateTo('item-selection')");
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
nodes['payment-card'].listeners.click();
nodes['payment-process'].listeners.click();
nodes['card-process'].listeners.click();
run('cart.clear()');
timers.shift().callback();
assert.equal(run('currentScreen'), 'payment-processing');
assert.equal(run('applicationState.paymentResult'), null);
assert.equal(run('applicationState.cardProcessing'), false);
assert.ok(nodes['card-error'].textContent.length > 0);
assert.equal(nodes['card-process'].disabled, false);
nodes['card-process'].listeners.click();
assert.equal(timers.length, 0);
assert.equal(nodes['payment-successful'].hidden, true);
console.log('PASS: Changed/invalid order during card delay produces feedback with no success; lock released; invalid resubmission schedules no timer.');

run("navigateTo('item-selection')");
tap('coffee'); tap('coffee'); tap('sandwich');
const backCart = run('cart');
for (const method of ['cash', 'qr', 'card']) {
  nodes['selection-continue'].listeners.click();
  nodes['summary-continue'].listeners.click();
  nodes[`payment-${method}`].listeners.click();
  nodes['payment-process'].listeners.click();
  nodes['cash-back'].listeners.click();
  assert.equal(run('currentScreen'), 'payment-method');
  nodes['payment-back'].listeners.click();
  assert.equal(run('currentScreen'), 'order-summary');
  assert.equal(nodes['summary-total'].textContent, '₱140.00');
  nodes['summary-back'].listeners.click();
  assert.equal(run('currentScreen'), 'item-selection');
  assert.equal(run('cart'), backCart);
  row('Coffee', 2, 90); row('Sandwich', 1, 50); total(140);
  console.log(`PASS: ${method} processing Back → method Back → summary Back preserves Coffee ×2, Sandwich ×1, and ₱140 total.`);
}
const pageSource = fs.readFileSync(path.join(__dirname, '..', 'index.html'), 'utf8');
assert.ok(pageSource.includes('QR PLACEHOLDER'));
assert.ok(pageSource.includes('SIMULATION ONLY · NOT SCANNABLE'));
assert.ok(pageSource.includes('supported payment application'));
assert.ok(pageSource.includes('Please tap, insert, or swipe your card.'));
assert.ok(pageSource.includes('>Confirm Payment</button>'));
assert.ok(pageSource.includes('>Process Payment</button>'));
assert.equal((pageSource.match(/<input\b/g) || []).length, 1);
assert.ok(pageSource.includes('id="amount-paid"'));
console.log('PASS: HTML source includes QR placeholder/instructions, card instruction, and confirmation controls; only Amount Paid input exists. Browser rendering not tested.');
