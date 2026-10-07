## Summary

Implement Cart Management using one authoritative JavaScript Map state. Product taps add items or increase existing quantities; native +, −, and Remove buttons update the cart. Subtotals and transaction totals re-render after mutations using shared calculation functions.

## Requirements implemented

- Display product name, unit price, quantity, and subtotal.
- Provide large quantity controls and explicit removal.
- Remove items when quantity reaches zero; repeated decreases cannot make quantities negative.
- Calculate subtotal = unit price × quantity and total = sum of subtotals.
- Keep Continue disabled; no Order Summary, payment, or receipt logic.

## Files changed

- index.html: cart list, empty state, and live total.
- style.css: cart rows and large accessible controls, plus existing product-selection layout.
- script.js: catalog rendering, single cart state, focused cart functions, and shared calculations.
- tests/cart.test.cjs: repeatable simulated DOM tests using the existing Node runtime and built-in modules only.
- docs/: task status, source of truth, architecture, test results, development log, GitHub evidence, and this description.

This branch started from main before PR #1 was merged. It therefore also includes the existing six-product selection UI restored from feature-products. Review the complete main-to-feature-cart diff; no merge of PR #1 is claimed.

## Testing performed

- node --check script.js: passed.
- node tests/cart.test.cjs: passed, executing the actual application script and registered click handlers in a simulated DOM.
- git diff --check: passed.
- Reviewed source, state ownership, formulas, and feature scope.

## Observed results

| Action | Actual result |
| --- | --- |
| Coffee ×2, Sandwich ×1, Soft Drink ×1 | Subtotals ₱90, ₱50, ₱35; total ₱175 |
| Increase Coffee to 3 | Coffee subtotal ₱135; total ₱220 |
| Decrease Coffee to 2 | Total ₱175 |
| Remove Soft Drink | Total ₱140 |
| Decrease to zero, then repeat | Item removed; no negative quantity |
| Remove last item / re-add | Empty total ₱0, then Coffee quantity 1 and total ₱45 |
| Invalid product IDs | No cart changes |

Cart Management is marked DONE for the implemented logic and simulated DOM verification. Real browser rendering, keyboard focus, actual touchscreen/click interaction, and console checks have not been performed and remain pending integration verification. No packages were installed. Do not merge until review is complete.
