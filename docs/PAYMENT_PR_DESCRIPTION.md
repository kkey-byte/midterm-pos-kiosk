## Summary

Implement simulated Cash, QR Payment, and Credit/Debit Card flows using the authoritative cart and one shared paymentResult. Cash validates amount paid and calculates change in integer cents. QR confirms the total with zero change. Card shows Processing and prevents repeated activation before local simulated completion.

## Requirements implemented

- Large method-selection controls and Back navigation preserving the order.
- Cash rejects blank, non-numeric, negative, non-finite, insufficient, overprecision, and unsafe amounts.
- QR shows amount due, a labelled non-scannable simulation placeholder, scan instruction, and Confirm Payment.
- Card shows amount due, “Please tap, insert, or swipe your card.”, Process Payment, and a 1500ms simulated processing state.
- Shared success output shows payment method, amount paid, and change.
- No real providers, card/QR credentials, transaction ledger, or receipt generation.

## Files changed

- index.html, style.css, script.js: payment UI, state, validation, and guarded processing.
- tests/cart.test.cjs: payment, navigation, and regression coverage using built-in Node modules only.
- docs/: task status, source of truth, architecture, security/error handling, development log, actual test results, GitHub evidence, and this description.

Order Summary UI/tests were restored from feature-checkout because that branch was not in main when payment development began. This PR includes that dependency; review the complete diff against main.

## Testing performed

- node --check script.js: PASS.
- node tests/cart.test.cjs: PASS; actual application script and registered handlers executed in a simulated DOM.
- Card timer tested through a controlled callback queue, not actual elapsed waiting.
- git diff --check: PASS.
- HTML source assertions for QR placeholder, card instructions, required buttons, and absence of credential inputs.

## Observed results

| Flow | Actual result |
| --- | --- |
| Cash ₱140 total / ₱100 paid | Rejected; no success/result/transaction/receipt |
| Cash ₱140 paid | Accepted; change ₱0 |
| Cash ₱200 paid | Accepted; change ₱60 |
| QR ₱140 total | Paid ₱140; change ₱0; QR Payment |
| Card ₱140 total | Processing lock; six activations schedule one 1500ms callback; completion paid ₱140/change ₱0/Credit/Debit Card |
| Every method Back chain | Coffee ×2 and Sandwich ×1 preserved; same cart; total ₱140 |
| Invalid/changed orders and repeated completion | Guarded without duplicate successful results |

Existing cart/summary regressions also passed. No application defect was found in the focused review. Payment is marked DONE for verified logic/source output. Real browser rendering, touch/click/focus, console, and elapsed timing checks remain unperformed and pending integration verification. Keep this PR unmerged until reviewed.
