# Test Plan and Results

## Recorded foundation checks

| Check | Actual result | Evidence |
| --- | --- | --- |
| Required foundation files and docs/ exist | PASS | Repository directory listing |
| HTML5 declaration, stylesheet link, deferred script, container, and heading | PASS for source inspection | index.html source checked |
| JavaScript syntax | PASS | node --check script.js exited with code 0; no packages installed |
| index.html loads in browser | NOT VERIFIED | Automated browser rejected local file URL |
| CSS renders correctly | NOT VERIFIED | Browser rendering unavailable |
| JavaScript loads and initializes in browser | NOT VERIFIED | Runtime initialization marker not inspected in browser |
| Initial browser console has no errors | NOT VERIFIED | Browser console not inspected |

## Planned acceptance tests

### Focused Payment release review — 2026-10-07

Reran `node --check script.js`, `node tests/cart.test.cjs`, and `git diff --check`: all passed. No genuine application defect was discovered during this focused review; only verification coverage and documentation were expanded.

- Cash: total ₱140; ₱100 rejected, ₱140 accepted/change ₱0, ₱200 accepted/change ₱60, and ₱200.10/change ₱60.10. Invalid inputs retained processing with feedback and no successful result.
- QR: active panel amount ₱140; confirmation records paid ₱140/change ₱0/method QR Payment. Source assertions checked the labelled non-scannable placeholder and scan instruction.
- Card: active panel amount ₱140; source asserts the required tap/insert/swipe instruction. Handler exposes Processing, disables repeat/back, schedules one 1500ms callback; controlled completion records paid ₱140/change ₱0/method Credit/Debit Card.
- Added full Back-chain checks for every method: processing → payment method → summary → Item Selection retains the same Map, Coffee ×2, Sandwich ×1, and total ₱140.
- Source assertions confirm the only input is Amount Paid; no credential fields exist.

Payment is DONE for implemented logic, simulated DOM output, and source verification. Real browser rendering/click/touch/focus/console and elapsed timer behavior were not tested and remain integration work. No receipt or transaction ledger was added.

### Simulated Credit/Debit Card — 2026-10-07

Executed `node --check script.js`, `node tests/cart.test.cjs`, and Git whitespace checks successfully. The test executes actual registered handlers in a simulated DOM. setTimeout is replaced by a controlled queue: the test verifies the scheduled delay is 1500ms and explicitly invokes the callback. Real elapsed timing, browser rendering, touch, focus, and console checks were not performed.

| Check | Observed result | Outcome |
| --- | --- | --- |
| Card processing screen | Card panel visible, Cash/QR hidden, amount due ₱140.00 | PASS |
| Process Payment | State cardProcessing=true, Processing message and button text, aria-busy=true, Process and Back disabled; result remains null | PASS |
| Six repeated activations | Exactly one 1500ms callback; Back handler cannot navigate while locked | PASS |
| Controlled callback completion | Payment Successful; amountPaid=140, change=0, paymentMethod=Credit/Debit Card | PASS |
| Success display | Paid ₱140.00, change ₱0.00, Credit/Debit Card; cart preserved | PASS |
| Process after success | No new callback/result | PASS |
| Cart changed during delay | Rejected with feedback, no result/success, processing lock released | PASS |
| Empty/invalid resubmission | Rejected without scheduling another callback | PASS |
| Earlier regression suite | Cart, summary, method selection, cash validation/change, and QR confirmation passed | PASS |
| Instructions/credentials | Source inspected: exact tap/insert/swipe instruction and explicit simulation text; no card number, expiration, CVV, PIN, or provider input/connection | PASS for source inspection |

No receipt or transaction ledger was implemented. Card processing uses the shared paymentResult and completion function.

### Simulated QR Payment — 2026-10-07

Executed `node --check script.js`, `node tests/cart.test.cjs`, and Git whitespace checks successfully. The simulated DOM test uses actual registered method, navigation, and Confirm Payment handlers. Actual browser, touch, and console checks were not performed.

| Check | Observed result | Outcome |
| --- | --- | --- |
| Select QR and continue | Processing shows QR panel; amount due ₱140.00; Cash panel hidden; no result before confirmation | PASS |
| Back before confirmation | Payment Method restored; cart still Coffee ×2 + Sandwich ×1, total ₱140.00 | PASS |
| Confirm Payment | Success state; amountPaid 140, change 0, paymentMethod QR Payment, total 140 | PASS |
| Success display | Paid ₱140.00; change ₱0.00; method QR Payment | PASS |
| Repeated confirmation | Same payment result object retained; no duplicate completion | PASS |
| Empty cart at confirmation | Processing retained with clear feedback; no result or success | PASS |
| Cash and earlier regressions | All existing cases passed, including cash ₱100 rejection, ₱200/change ₱60, exact ₱140/change ₱0 | PASS |
| Placeholder/instructions/provider boundary | Source inspected: clearly labelled non-scannable QR placeholder, supported-payment-application scan instruction with explicit simulation alternative, no provider connection or credential fields | PASS for source inspection |

Cash and QR now share applicationState.paymentResult and completeSimulatedPayment. Historical cashPayment references elsewhere describe the earlier checkpoint. Only in-memory simulated payment data is recorded; no receipt or transaction ledger is generated.

### Cash Payment processing — 2026-10-07

Executed `node --check script.js`, `node tests/cart.test.cjs`, and `git diff --check`; all passed. The test executes the actual application script in a simulated DOM and submits the registered cash form handler. These results do not establish actual browser/touch/console behavior.

| Total | Amount Paid | Observed result | Outcome |
| --- | --- | --- | --- |
| ₱140.00 | ₱100.00 | Rejected with insufficient-amount message; remains payment-processing; no success, payment result, transaction, or receipt | PASS |
| ₱140.00 | ₱200.00 | Accepted; Payment Successful shown; change ₱60.00 | PASS |
| ₱140.00 | ₱140.00 | Accepted; change ₱0.00 | PASS |
| ₱140.00 | ₱200.10 | Accepted; change ₱60.10 using integer cents | PASS |
| ₱140.00 | Blank/whitespace, abc, −1 | Rejected with clear feedback and no success/result/transaction/receipt | PASS |
| ₱140.00 | Infinity, −Infinity, NaN, 1e309 | Rejected as invalid/non-finite; remains processing | PASS |
| ₱140.00 | 200.001, 9007199254740992 | Rejected for precision or safe-integer range; remains processing | PASS |

Also verified premature success navigation is blocked, repeated submit after success cannot change the accepted result, and existing cart/summary/method selection checks still pass. No receipt, transaction record, identifier, payment API, or QR/card processing exists. Invalid attempts retain the order and allow correcting Amount Paid. Real browser checks remain NOT VERIFIED.

UI source inspected: Total Amount, labelled Amount Paid input with decimal keyboard hint, Pay Now, error alert, and Back are present. Success is a minimal cash acceptance view showing amount paid and change; it does not create a receipt or transaction record.

### Payment Method selection — 2026-10-07

Executed `node --check script.js`, `node tests/cart.test.cjs`, and Git whitespace checks successfully. Tests execute the actual application script and registered button handlers in a simulated DOM. This is not a browser test.

| Method / check | Observed result | Outcome |
| --- | --- | --- |
| Cash | State stores cash; Cash alone is pressed; visible status says Cash (simulated) | PASS |
| QR Payment | State stores qr; QR alone is pressed; visible status says QR Payment (simulated) | PASS |
| Credit/Debit Card | State stores card; Card alone is pressed; status says Credit/Debit Card (simulated) | PASS |
| Back after each selection | Returns to summary; same cart Map; Coffee ×2, Sandwich ×1, total ₱140 preserved | PASS |
| Re-enter Payment Method | Previous method remains selected and pressed | PASS |
| Invalid method | Ignored; previous choice preserved | PASS |
| Invalid cart during selection | Invalid entry removed; valid cart preserved; method cleared; safely returns to selection | PASS |
| Credentials / completion | Source inspected: only a method identifier is stored; no credential inputs, payment API, timer, or transaction completion | PASS for inspection |
| Cart and summary regressions | Existing checks passed, including ₱175 → ₱220 → ₱175 → ₱140 | PASS |
| Real browser, focus, touch, and console | Not performed | NOT VERIFIED |

Payment buttons have 120px minimum height, 24px padding, native keyboard semantics, visible focus styling, and aria-pressed selection. Size and styling were inspected in source, not rendered in a browser. Order Summary files were restored from feature-checkout because main did not yet contain that branch; no merge was performed.

### Cart Management — 2026-10-07

Executed `node --check script.js` and `node tests/cart.test.cjs`; both exited with code 0. The latter executes the actual application script with a simulated DOM and invokes registered product and cart button click handlers. It checks cart state and rendered quantity, subtotal, and total text. This is not a real browser or touchscreen test.

| Scenario | Actual result | Outcome |
| --- | --- | --- |
| Coffee ×2, Sandwich ×1, Soft Drink ×1 | Subtotals ₱90.00, ₱50.00, ₱35.00; total ₱175.00; three cart rows | PASS |
| Coffee quantity 2 → 3 | Coffee subtotal ₱135.00; total ₱220.00 | PASS |
| Coffee quantity 3 → 2 | Coffee subtotal ₱90.00; total ₱175.00 | PASS |
| Remove Soft Drink using its Remove handler | Row removed; total ₱140.00 | PASS |
| Decrease Coffee to zero then decrease five more times | Coffee absent; no negative quantity; remaining total ₱50.00 | PASS |
| Remove last item | Total ₱0.00; empty-order message restored | PASS |
| Invalid product identifiers | No cart changes; total remains ₱0.00 | PASS |
| Re-add removed Coffee | Quantity 1; subtotal and total ₱45.00 | PASS |
| Source syntax and Git whitespace | Both checks passed | PASS |
| Browser rendering, focus, touch, and console | Not executed; previous local file browser access restriction remains | NOT VERIFIED |

Product-selection UI files were restored from feature-products because that PR was not merged into main. Cart work does not merge that PR. Continue remains disabled; no Order Summary or payment behavior exists.

NOT RUN indicates no behavioral verification has occurred. A planned test is not a passing result.

| ID | Steps / expected outcome | Result |
| --- | --- | --- |
| T01 | Inspect source and dependencies; only HTML5, CSS3, and Vanilla JavaScript are used | NOT RUN |
| T02 | Inspect catalog and state; add items then reload; catalog is hard-coded and transaction state resets | NOT RUN |
| T03 | Inspect source and network activity; no backend, database, authentication, or real payment integration | NOT RUN |
| T04 | Select a catalog item repeatedly; order contains correct items and quantities | NOT RUN |
| T05 | Change quantities and remove items; totals are correct; empty order cannot proceed to payment | NOT RUN |
| T06 | Attempt processing without a method, then select one; guard and selection work | NOT RUN |
| T07 | Start simulated processing and activate repeatedly; processing appears and completes once | NOT RUN |
| T08 | Complete processing; success appears after completion and cannot appear prematurely | NOT RUN |
| T09 | Compare receipt with completed order; items, quantities, prices, total, and method match | NOT RUN |
| T10 | Start New Transaction; item selection returns with cleared order, method, processing, and receipt state | NOT RUN |
| T11 | Follow every required screen in sequence; invalid transitions do not corrupt state | NOT RUN |
| T12 | Test touchscreen-sized controls, narrow viewport, and keyboard navigation; labels and focus remain usable | NOT RUN |
| T13 | Open page with console visible and exercise invalid inputs; no uncaught initial errors and useful feedback | NOT RUN |

## Result recording

For each executed test, record date, browser/version, viewport or device, exact steps, expected and actual outcomes, PASS/FAIL, and screenshot or other evidence when available. Recheck affected tests after fixes. Do not mark a development task DONE until its required tests pass.

## Payment Successful confirmation — 2026-10-07

Executed `node tests/cart.test.cjs`: PASS, including existing cart, summary, cash, QR, and card regressions. The harness executes the actual script with simulated DOM controls and a controlled card timer; these are not browser tests.

- Premature success navigation, insufficient cash (₱100 against ₱140), and inconsistent change: no completed snapshot or new reference.
- Completed cash transaction: Coffee ×2, Sandwich ×1; total ₱140, paid ₱200, change ₱60. Confirmation fields matched.
- Snapshot has reference, dateTime, items, total, paymentMethod, amountPaid, change, status. ISO timestamp parses; snapshot, item array, and each item are frozen. Attempted item mutation rejected. Changing and clearing the cart preserved the saved snapshot and displayed ₱140 total.
- Second independent cash transaction: total/paid ₱140, change ₱0. References differed: `POS-6113c09b-482d-442d-9c31-10269ff70e11` and `POS-d556b48d-32bc-4d0b-a379-418d4d79f5c6`. Repeated submission created no extra reference. The harness seeded the second order; a user-facing New Transaction flow is not implemented.
- HTML source contains PAYMENT SUCCESSFUL and View Receipt. View Receipt is disabled pending the receipt stage. Actual browser appearance, console, and touch behavior remain unverified.

## Digital Receipt — 2026-10-07

Executed `node tests/cart.test.cjs`: PASS including payment/cart/summary regressions. Actual JavaScript runs in a simulated DOM; browser rendering, console, and touch interaction were not tested.

- View Receipt opens receipt and hides confirmation after valid payment. Access without a completed transaction is blocked.
- Receipt reference and displayed ISO date/time exactly match the snapshot; time element datetime attribute matches too.
- Coffee: quantity 2, unit price ₱45.00, subtotal ₱90.00. Sandwich: quantity 1, unit price ₱50.00, subtotal ₱50.00. Two rendered items match every saved item field.
- Total ₱140.00, payment method Cash, amount paid ₱200.00, change ₱60.00, status Payment Successful: all matched the completed transaction.
- Receipt stays unchanged after cart modification/clearing; it reads saved values, not new calculations from the live cart.
- HTML source includes the POS heading and large NEW TRANSACTION control using existing continue-button styling. Control is disabled and has no click/reset handler. Reset remains unimplemented.

## New Transaction — 2026-10-07

Executed `node tests/cart.test.cjs`: PASS, including prior cart, summary, payment, confirmation, and receipt regressions. Verification used the actual JavaScript and registered handlers in simulated DOM, not a real browser.

- Completed Coffee ×2 + Sandwich ×1 cash transaction (total/paid ₱140, change ₱0), opened receipt, then selected NEW TRANSACTION.
- Cart Map size 0; cart/summary/receipt rows empty; total ₱0.00. Continue disabled and empty-order message visible.
- Selected method, payment result, and completed snapshot null; amount-paid input empty with aria-invalid false. Method buttons unselected; payment Continue disabled.
- Card processing false, aria-busy false, processing controls unlocked, panels hidden, no pending timer. Cash/QR/card validation messages and navigation message empty, including deliberately seeded stale errors.
- Success amounts/method/reference and all receipt fields empty, including date/time datetime attribute. Only Item Selection visible. Previous receipt access and duplicate reset attempts ignored.
- Started another transaction through registered controls: Cookies ×1 → Summary ₱25 → QR Payment → Confirm → Receipt. New snapshot/receipt contained only Cookies ×1, total/paid ₱25, change ₱0, QR Payment, and a different reference. Selecting NEW TRANSACTION again returned to an empty ₱0.00 order with no snapshot or receipt rows.
- Browser display, console, and touchscreen behavior remain unverified.
