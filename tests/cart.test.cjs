// Run with the existing Node runtime: node tests/applicationState.cart.test.cjs
// This verifies application logic and rendered output using a simulated DOM.
const fs = require('node:fs');
const vm = require('node:vm');
const assert = require('node:assert/strict');
const path = require('node:path');
const { randomUUID } = require('node:crypto');
let referencesGenerated = 0;

function element(tag) {
  return {
    tag, dataset: {}, children: [], listeners: {}, hidden: false,
    classList: { add() {} },
    setAttribute(name, value) { this[name] = value; },
    removeAttribute(name) { delete this[name]; },
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
    'card-processing-panel', 'card-total', 'card-status', 'card-error', 'card-process',
    'success-total', 'success-reference', 'view-receipt', 'receipt', 'receipt-reference',
    'receipt-date-time', 'receipt-items', 'receipt-total', 'receipt-method', 'receipt-paid',
    'receipt-change', 'receipt-status', 'new-transaction'].map((id) => [id, element('div')])
);
const timers = [];
const context = vm.createContext({
  crypto: { randomUUID() { referencesGenerated++; return randomUUID(); } },
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
assert.equal(run("applicationState.cart.has('coffee')"), false); total(50);
run("removeFromCart('sandwich')"); total(0);
assert.equal(nodes['empty-order'].hidden, false);
run("addToCart('invalid'); increaseQuantity('invalid'); decreaseQuantity('invalid')");
total(0); assert.equal(run('applicationState.cart.size'), 0);
assert.equal(run("calculateSubtotal('invalid')"), 0);
tap('coffee'); row('Coffee', 1, 45); total(45);
console.log('PASS: Quantity reaching zero removes the row; repeated decreases cannot produce negative quantities; empty total, invalid IDs, and re-addition verified.');

run('applicationState.cart.clear(); renderCart()');
assert.equal(nodes['selection-continue'].disabled, true);
tap('coffee'); tap('coffee'); tap('sandwich');
total(140);
assert.equal(nodes['selection-continue'].disabled, false);
const originalCart = run('applicationState.cart');
nodes['selection-continue'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'order-summary');
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
assert.equal(run('applicationState.cart'), originalCart);
console.log('PASS: Summary exactly matches Coffee ×2 (₱45 unit, ₱90 subtotal), Sandwich ×1 (₱50 unit/subtotal), total ₱140; same cart object.');
nodes['summary-back'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'item-selection');
assert.equal(nodes['item-selection'].hidden, false);
assert.equal(nodes['order-summary'].hidden, true);
row('Coffee', 2, 90); row('Sandwich', 1, 50); total(140);
assert.equal(run('applicationState.cart'), originalCart);
console.log('PASS: BACK preserves both items, quantities, subtotals, total, and authoritative cart object.');
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'payment-method');
assert.equal(nodes['payment-method'].hidden, false);
total(140);
nodes['payment-back'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'order-summary');
console.log('PASS: CONTINUE TO PAYMENT opens Payment Method; return to summary preserves applicationState.cart.');
run("applicationState.cart.clear(); navigateTo('order-summary')");
assert.equal(run('applicationState.currentScreen'), 'item-selection');
assert.ok(nodes['navigation-message'].textContent.includes('Please choose'));
total(0);
for (const invalid of ["applicationState.cart.set('unknown', 1)", "applicationState.cart.set('coffee', -1)", "applicationState.cart.set('coffee', 0)", "applicationState.cart.set('coffee', 1.5)", "applicationState.cart.set('coffee', NaN)"]) {
  run(`applicationState.cart.clear(); ${invalid}; navigateTo('order-summary')`);
  assert.equal(run('applicationState.currentScreen'), 'item-selection');
  assert.equal(run('applicationState.cart.size'), 0);
  assert.equal(nodes['selection-continue'].disabled, true);
  assert.ok(nodes['navigation-message'].textContent.includes('Please choose'));
  total(0);
}
console.log('PASS: Empty and invalid carts return safely to Item Selection with friendly feedback and no exceptions.');

tap('coffee'); tap('coffee'); tap('sandwich');
nodes['selection-continue'].listeners.click();
nodes['summary-continue'].listeners.click();
const paymentCart = run('applicationState.cart');
for (const [id, label] of [['cash', 'Cash'], ['qr', 'QR Payment'], ['card', 'Credit/Debit Card']]) {
  nodes[`payment-${id}`].listeners.click();
  assert.equal(run('applicationState.selectedPaymentMethod'), id);
  assert.equal(nodes['payment-selection-status'].textContent, `Selected: ${label} (simulated).`);
  for (const other of ['cash', 'qr', 'card']) {
    assert.equal(nodes[`payment-${other}`]['aria-pressed'], String(other === id));
  }
  assert.equal(run('applicationState.currentScreen'), 'payment-method');
  nodes['payment-back'].listeners.click();
  assert.equal(run('applicationState.currentScreen'), 'order-summary');
  assert.equal(run('applicationState.cart'), paymentCart);
  row('Coffee', 2, 90); row('Sandwich', 1, 50); total(140);
  assert.equal(nodes['summary-total'].textContent, '₱140.00');
  nodes['summary-continue'].listeners.click();
  assert.equal(run('applicationState.selectedPaymentMethod'), id);
  assert.equal(nodes[`payment-${id}`]['aria-pressed'], 'true');
  console.log(`PASS: ${label} selected in application state, exclusive aria-pressed, Back preserves Coffee ×2 + Sandwich ×1 = ₱140; selection persists on return.`);
}
run("selectPaymentMethod('invalid')");
assert.equal(run('applicationState.selectedPaymentMethod'), 'card');
assert.deepEqual(Array.from(run('Object.keys(applicationState)')), ['cart', 'currentScreen', 'selectedPaymentMethod', 'paymentResult', 'cardProcessing', 'completedTransaction']);
console.log('PASS: Invalid method ignored; state stores only the method identifier, no payment credentials; no transaction completed.');
run("applicationState.cart.set('unknown', 1); selectPaymentMethod('cash')");
assert.equal(run('applicationState.currentScreen'), 'item-selection');
assert.equal(run("applicationState.cart.has('unknown')"), false);
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
  assert.equal(run('applicationState.currentScreen'), 'payment-processing');
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
assert.equal(run('applicationState.currentScreen'), 'payment-processing');
for (const value of ['100', '', '   ', 'abc', '-1', 'Infinity', '-Infinity', 'NaN', '1e309', '200.001', '9007199254740992']) {
  pay(value);
  assert.equal(run('applicationState.currentScreen'), 'payment-processing');
  assert.equal(run('applicationState.paymentResult'), null);
  assert.equal(nodes['payment-successful'].hidden, true);
  assert.ok(nodes['cash-error'].textContent.length > 0);
  assert.equal(run('applicationState.completedTransaction'), null);
  total(140);
  console.log(`PASS: Amount ${JSON.stringify(value)} rejected with message; stays processing; no success, transaction, receipt, or payment result.`);
}
pay('200');
assert.equal(run('applicationState.currentScreen'), 'payment-successful');
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
assert.equal(run('applicationState.currentScreen'), 'payment-successful');
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
assert.equal(run('applicationState.currentScreen'), 'payment-processing');
assert.equal(nodes['qr-total'].textContent, '₱140.00');
assert.equal(nodes['qr-processing-panel'].hidden, false);
assert.equal(nodes['cash-processing-panel'].hidden, true);
assert.equal(run('applicationState.paymentResult'), null);
nodes['cash-back'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'payment-method');
total(140);
nodes['payment-process'].listeners.click();
nodes['qr-confirm'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'payment-successful');
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
run('applicationState.cart.clear()');
nodes['qr-confirm'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'payment-processing');
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
assert.equal(run('applicationState.currentScreen'), 'payment-processing');
assert.equal(run('applicationState.paymentResult'), null);
assert.equal(nodes['payment-successful'].hidden, true);
assert.ok(nodes['card-status'].textContent.includes('Processing'));
assert.equal(nodes['card-process'].disabled, true);
assert.equal(nodes['cash-back'].disabled, true);
assert.equal(nodes['card-processing-panel']['aria-busy'], 'true');
for (let count = 0; count < 5; count++) nodes['card-process'].listeners.click();
nodes['cash-back'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'payment-processing');
assert.equal(timers.length, 1);
assert.equal(timers[0].delay, 1500);
console.log('PASS: Card displays due ₱140; Processing state visible, Process/Back disabled; six activations schedule only one 1500ms callback.');
timers.shift().callback();
assert.equal(run('applicationState.cardProcessing'), false);
assert.equal(run('applicationState.currentScreen'), 'payment-successful');
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
run('applicationState.cart.clear()');
timers.shift().callback();
assert.equal(run('applicationState.currentScreen'), 'payment-processing');
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
const backCart = run('applicationState.cart');
for (const method of ['cash', 'qr', 'card']) {
  nodes['selection-continue'].listeners.click();
  nodes['summary-continue'].listeners.click();
  nodes[`payment-${method}`].listeners.click();
  nodes['payment-process'].listeners.click();
  nodes['cash-back'].listeners.click();
  assert.equal(run('applicationState.currentScreen'), 'payment-method');
  nodes['payment-back'].listeners.click();
  assert.equal(run('applicationState.currentScreen'), 'order-summary');
  assert.equal(nodes['summary-total'].textContent, '₱140.00');
  nodes['summary-back'].listeners.click();
  assert.equal(run('applicationState.currentScreen'), 'item-selection');
  assert.equal(run('applicationState.cart'), backCart);
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

const referenceBaseline = referencesGenerated;
nodes['view-receipt'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'item-selection');
run("navigateTo('payment-successful')");
assert.equal(run('applicationState.currentScreen'), 'item-selection');
enterCashProcessing();
nodes['amount-paid'].value = '100';
nodes['cash-payment-form'].listeners.submit({ preventDefault() {} });
assert.equal(run('applicationState.completedTransaction'), null);
run("completeSimulatedPayment({ total: 140, amountPaid: 200, change: 999, paymentMethod: 'Cash' })");
assert.equal(run('applicationState.completedTransaction'), null);
assert.equal(referencesGenerated, referenceBaseline);
nodes['amount-paid'].value = '200';
nodes['cash-payment-form'].listeners.submit({ preventDefault() {} });
const firstTransaction = run('applicationState.completedTransaction');
assert.deepEqual(Object.keys(firstTransaction).sort(), ['reference', 'dateTime', 'items', 'total', 'paymentMethod', 'amountPaid', 'change', 'status'].sort());
assert.equal(firstTransaction.status, 'completed');
assert.equal(firstTransaction.total, 140);
assert.equal(firstTransaction.amountPaid, 200);
assert.equal(firstTransaction.change, 60);
assert.equal(firstTransaction.paymentMethod, 'Cash');
assert.ok(Number.isFinite(Date.parse(firstTransaction.dateTime)));
assert.ok(firstTransaction.reference.startsWith('POS-'));
assert.equal(firstTransaction.items[0].name, 'Coffee');
assert.equal(firstTransaction.items[0].quantity, 2);
assert.equal(firstTransaction.items[0].subtotal, 90);
assert.equal(firstTransaction.items[1].name, 'Sandwich');
assert.equal(firstTransaction.items[1].subtotal, 50);
assert.ok(Object.isFrozen(firstTransaction));
assert.ok(Object.isFrozen(firstTransaction.items));
assert.ok(firstTransaction.items.every(Object.isFrozen));
assert.throws(() => run("'use strict'; applicationState.completedTransaction.items[0].quantity = 99"), /read only/);
const firstSerialized = JSON.stringify(firstTransaction);
nodes['view-receipt'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'receipt');
assert.equal(nodes['receipt'].hidden, false);
assert.equal(nodes['payment-successful'].hidden, true);
assert.equal(nodes['receipt-reference'].textContent, firstTransaction.reference);
assert.equal(nodes['receipt-date-time'].textContent, firstTransaction.dateTime);
assert.equal(nodes['receipt-date-time'].datetime, firstTransaction.dateTime);
assert.equal(nodes['receipt-items'].children.length, firstTransaction.items.length);
firstTransaction.items.forEach((item, index) => {
  const details = nodes['receipt-items'].children[index].children.map((detail) => detail.textContent);
  assert.deepEqual(details, [item.name, `Quantity: ${item.quantity}`,
    `Unit Price: ₱${item.unitPrice.toFixed(2)}`, `Subtotal: ₱${item.subtotal.toFixed(2)}`]);
});
assert.equal(nodes['receipt-total'].textContent, '₱140.00');
assert.equal(nodes['receipt-method'].textContent, 'Cash');
assert.equal(nodes['receipt-paid'].textContent, '₱200.00');
assert.equal(nodes['receipt-change'].textContent, '₱60.00');
assert.equal(nodes['receipt-status'].textContent, 'Payment Successful');
assert.equal(typeof nodes['new-transaction'].listeners.click, 'function');
assert.ok(pageSource.includes('Touchscreen POS Kiosk — Digital Receipt'));
assert.ok(pageSource.includes('id="new-transaction" class="continue-button" type="button">NEW TRANSACTION'));
console.log('PASS: View Receipt displays snapshot reference/dateTime, Coffee ×2 at ₱45 = ₱90, Sandwich ×1 at ₱50 = ₱50, total ₱140, Cash paid ₱200, change ₱60, and Payment Successful.');
console.log('PASS: Receipt without completion blocked; NEW TRANSACTION is enabled in HTML and has a registered handler.');
run("addToCart('coffee'); applicationState.cart.clear(); renderPaymentSuccessful()");
run('renderReceipt()');
assert.equal(nodes['receipt-total'].textContent, '₱140.00');
assert.equal(nodes['receipt-items'].children[0].children[1].textContent, 'Quantity: 2');
assert.equal(nodes['receipt-change'].textContent, '₱60.00');
assert.equal(JSON.stringify(firstTransaction), firstSerialized);
assert.equal(nodes['success-total'].textContent, '₱140.00');
assert.equal(nodes['cash-paid-result'].textContent, '₱200.00');
assert.equal(nodes['cash-change-result'].textContent, '₱60.00');
assert.equal(nodes['success-reference'].textContent, firstTransaction.reference);
run("navigateTo('item-selection')");
tap('coffee'); tap('coffee'); tap('sandwich');
enterCashProcessing();
nodes['amount-paid'].value = '140';
nodes['cash-payment-form'].listeners.submit({ preventDefault() {} });
const secondTransaction = run('applicationState.completedTransaction');
assert.notEqual(secondTransaction.reference, firstTransaction.reference);
assert.equal(secondTransaction.change, 0);
assert.equal(JSON.stringify(firstTransaction), firstSerialized);
nodes['cash-payment-form'].listeners.submit({ preventDefault() {} });
assert.equal(referencesGenerated, referenceBaseline + 2);
assert.ok(pageSource.includes('PAYMENT SUCCESSFUL'));
assert.ok(pageSource.includes('>View Receipt</button>'));
console.log('PASS: Premature success, insufficient payment, and inconsistent change generate no reference; repeated completion generates no extra reference.');
console.log('PASS: Completed snapshot contains all eight required fields, is deeply frozen, and survives cart changes and a subsequent transaction unchanged.');
console.log(`PASS: Two completed transactions have different references: ${firstTransaction.reference} and ${secondTransaction.reference}.`);

nodes['view-receipt'].listeners.click();
assert.equal(nodes['receipt-reference'].textContent, secondTransaction.reference);
// Include stale feedback from other methods to verify reset clears hidden screens.
nodes['qr-error'].textContent = 'Previous QR error';
nodes['card-error'].textContent = 'Previous card error';
nodes['cash-error'].textContent = 'Previous cash error';
nodes['navigation-message'].textContent = 'Previous navigation message';
nodes['amount-paid'].setAttribute('aria-invalid', 'true');
nodes['new-transaction'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'item-selection');
assert.equal(run('applicationState.cart.size'), 0);
total(0);
assert.equal(run('applicationState.selectedPaymentMethod'), null);
assert.equal(run('applicationState.paymentResult'), null);
assert.equal(run('applicationState.completedTransaction'), null);
assert.equal(run('applicationState.cardProcessing'), false);
assert.equal(nodes['amount-paid'].value, '');
assert.equal(nodes['amount-paid']['aria-invalid'], 'false');
assert.equal(nodes['card-processing-panel']['aria-busy'], 'false');
assert.equal(nodes['card-process'].disabled, false);
assert.equal(nodes['cash-back'].disabled, false);
assert.equal(nodes['selection-continue'].disabled, true);
assert.equal(nodes['payment-process'].disabled, true);
assert.equal(nodes['empty-order'].hidden, false);
for (const id of ['cart-items', 'summary-items', 'receipt-items']) assert.equal(nodes[id].children.length, 0);
for (const id of ['cash-total', 'summary-total', 'qr-total', 'card-total']) assert.equal(nodes[id].textContent, '₱0.00');
for (const id of ['cash-error', 'qr-error', 'card-error', 'card-status', 'navigation-message',
  'success-total', 'cash-paid-result', 'cash-change-result', 'payment-method-result', 'success-reference',
  'receipt-reference', 'receipt-date-time', 'receipt-total', 'receipt-method', 'receipt-paid', 'receipt-change', 'receipt-status']) {
  assert.equal(nodes[id].textContent, '', `${id} must contain no previous data`);
}
assert.equal(nodes['receipt-date-time'].datetime, undefined);
for (const method of ['cash', 'qr', 'card']) assert.equal(nodes[`payment-${method}`]['aria-pressed'], 'false');
for (const id of ['order-summary', 'payment-method', 'payment-processing', 'payment-successful', 'receipt',
  'cash-processing-panel', 'qr-processing-panel', 'card-processing-panel']) assert.equal(nodes[id].hidden, true);
assert.equal(nodes['item-selection'].hidden, false);
nodes['view-receipt'].listeners.click();
nodes['new-transaction'].listeners.click();
assert.equal(run('applicationState.currentScreen'), 'item-selection');
assert.equal(run('applicationState.completedTransaction'), null);
assert.equal(timers.length, 0);
console.log('PASS: Receipt → NEW TRANSACTION clears cart/quantities, all totals, method, input, locks, validation, success, snapshot, and receipt DOM; Item Selection shows ₱0.00 with Continue disabled.');

tap('cookies');
nodes['selection-continue'].listeners.click();
assert.equal(nodes['summary-total'].textContent, '₱25.00');
nodes['summary-continue'].listeners.click();
nodes['payment-qr'].listeners.click();
nodes['payment-process'].listeners.click();
nodes['qr-confirm'].listeners.click();
nodes['view-receipt'].listeners.click();
const nextTransaction = run('applicationState.completedTransaction');
assert.equal(nextTransaction.items.length, 1);
assert.equal(nextTransaction.items[0].name, 'Cookies');
assert.equal(nextTransaction.items[0].quantity, 1);
assert.equal(nextTransaction.total, 25);
assert.equal(nextTransaction.paymentMethod, 'QR Payment');
assert.equal(nextTransaction.amountPaid, 25);
assert.equal(nextTransaction.change, 0);
assert.notEqual(nextTransaction.reference, secondTransaction.reference);
assert.equal(nodes['receipt-items'].children.length, 1);
assert.equal(nodes['receipt-items'].children[0].children[0].textContent, 'Cookies');
assert.equal(nodes['receipt-total'].textContent, '₱25.00');
assert.equal(nodes['receipt-method'].textContent, 'QR Payment');
assert.equal(nodes['receipt-paid'].textContent, '₱25.00');
assert.equal(nodes['receipt-change'].textContent, '₱0.00');
nodes['new-transaction'].listeners.click();
assert.equal(run('applicationState.cart.size'), 0);
assert.equal(run('applicationState.completedTransaction'), null);
assert.equal(nodes['receipt-items'].children.length, 0);
total(0);
console.log('PASS: After reset, Cookies ×1 → summary → QR confirmation → new receipt completes for ₱25 paid/₱0 change with a new reference; second reset also succeeds.');

run("applicationState.cart.set('unknown', 1)");
assert.doesNotThrow(() => run("navigateTo('item-selection')"));
assert.equal(run("applicationState.cart.has('unknown')"), false);
assert.ok(nodes['navigation-message'].textContent.length > 0);
run("applicationState.cart.clear(); applicationState.cart.set('coffee', -1); decreaseQuantity('coffee')");
assert.equal(run("applicationState.cart.has('coffee')"), false);
run("applicationState.cart.clear(); navigateTo('item-selection')");
tap('coffee'); tap('coffee'); tap('sandwich');
enterCashProcessing();
for (const result of [
  {total:140,amountPaid:100,change:-40,paymentMethod:'Cash'},
  {total:140,amountPaid:200,change:999,paymentMethod:'Cash'},
  {total:140,amountPaid:Infinity,change:0,paymentMethod:'Cash'},
  {total:140,amountPaid:140,change:0,paymentMethod:'unknown'}
]) {
  run(`completeSimulatedPayment(${JSON.stringify(result)})`);
  assert.equal(run('applicationState.currentScreen'), 'payment-processing');
  assert.equal(run('applicationState.paymentResult'), null);
}
run("navigateTo('item-selection'); applicationState.currentScreen = 'unknown'; navigateTo('unknown')");
assert.equal(run('applicationState.currentScreen'), 'item-selection');
assert.ok(nodes['navigation-message'].textContent.length > 0);
console.log('PASS: Corrupted cart and screen state recover with friendly feedback; negative corrupted quantities removed; inconsistent completion rejected.');

const scriptSource = fs.readFileSync(path.join(__dirname, '..', 'script.js'), 'utf8');
assert.equal(/\beval\s*\(|new\s+Function\s*\(|innerHTML|outerHTML|insertAdjacentHTML/.test(scriptSource), false);
assert.equal(/\bfetch\s*\(|XMLHttpRequest|WebSocket|localStorage|sessionStorage/.test(scriptSource), false);
assert.equal(/type=["']password/.test(pageSource), false);
for (const value of ['', 'hello', '-5', 'Infinity', 'NaN', '1e309', '100']) {
  const result = run(`validateAmountPaid(${JSON.stringify(value)}, 140)`);
  assert.equal(typeof result.error, 'string');
  assert.ok(result.error.length > 10);
  assert.equal(/TypeError|ReferenceError|SyntaxError|stack|evalmachine/.test(result.error), false);
}
const markupInput = run("validateAmountPaid('<img src=x onerror=alert(1)>', 140)");
assert.ok(markupInput.error);
assert.equal(markupInput.error.includes('<img'), false);
console.log('PASS: Source has no eval/dynamic Function/HTML injection/network/storage APIs; Amount Paid is the only input; invalid amounts receive readable messages with no raw error or input markup.');
