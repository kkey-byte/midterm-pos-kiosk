## Summary

Add Order Summary and navigation using the existing authoritative cart Map and shared subtotal/total functions. Continue opens the summary; BACK returns to Item Selection with all order values preserved. CONTINUE TO PAYMENT opens a placeholder only.

## Requirements implemented

- Show the same products, quantities, unit prices, subtotals, and total.
- Preserve cart identity and contents through summary and Back navigation.
- Provide large BACK and CONTINUE TO PAYMENT native buttons.
- Disable Item Selection Continue for an empty or invalid cart.
- Guard direct entry into summary/payment; return to Item Selection with friendly feedback for empty/invalid carts.
- No payment selection, processing, success, or receipt behavior.

## Files changed

- index.html: screen sections, summary controls, feedback, and payment placeholder.
- style.css: enabled Continue styling and large navigation controls.
- script.js: cart validation, summary rendering, and navigation state; no duplicate cart.
- tests/cart.test.cjs: summary, Back, placeholder navigation, and defensive-entry tests.
- docs/: task status, architecture, current scope, development log, testing results, GitHub evidence, and this PR description.

## Testing performed

- node --check script.js: PASS.
- node tests/cart.test.cjs: PASS; executes actual application script and registered click handlers in a simulated DOM.
- git diff --check: PASS.
- Reviewed Git diff, state ownership, calculations, and feature scope.

## Observed results

- Coffee ×2: unit ₱45.00, subtotal ₱90.00; Sandwich ×1: unit ₱50.00, subtotal ₱50.00; total ₱140.00.
- Summary displays those exact values; BACK retains both items, quantities, subtotals, total, and the identical cart object.
- CONTINUE TO PAYMENT opens the placeholder; return to summary preserves the order.
- Empty cart, unknown product, negative/zero/fractional/NaN quantities safely return to selection with feedback.
- Existing cart regression scenario also passes: ₱175 → ₱220 → ₱175 → ₱140.
- Actual browser rendering, focus, touchscreen/click interaction, and browser console checks have not been performed. Simulated DOM results do not establish browser results.

Order Summary remains IN PROGRESS pending browser verification. Do not merge until the PR has been reviewed.
