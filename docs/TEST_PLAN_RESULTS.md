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

### Order Summary and navigation — 2026-10-07

Executed `node --check script.js`, `node tests/cart.test.cjs`, and `git diff --check` successfully. The expanded test executes the actual script in a simulated DOM and invokes registered Continue, BACK, and CONTINUE TO PAYMENT handlers. Existing cart regression checks also passed.

| Check | Observed result | Outcome |
| --- | --- | --- |
| Coffee ×2, Sandwich ×1 in Item Selection | Coffee subtotal ₱90.00, Sandwich subtotal ₱50.00, total ₱140.00 | PASS |
| Continue to summary | Two rows: Coffee, unit ₱45.00, quantity 2, subtotal ₱90.00; Sandwich, unit ₱50.00, quantity 1, subtotal ₱50.00; total ₱140.00 | PASS |
| Shared state | Identical authoritative cart object before and after navigation; no duplicate cart | PASS |
| BACK | Item Selection visible; Coffee ×2 and Sandwich ×1 preserved; total ₱140.00 | PASS |
| CONTINUE TO PAYMENT | Payment Method placeholder visible; order unchanged; returning to summary works | PASS |
| Empty summary entry | Returned to Item Selection with friendly message; Continue disabled; total ₱0.00 | PASS |
| Unknown product, negative, zero, fractional, or NaN quantity | Invalid entry removed; safely returned to Item Selection with message and no exceptions | PASS |
| Browser rendering, focus, actual clicks/touch, and console | Not performed; simulated DOM checks do not establish browser results | NOT VERIFIED |

Decreasing a normal cart to zero removes the row. Defensive summary validation removes invalid entries while preserving valid ones; an unsafe aggregate total resets the cart. Summary and payment navigation never copy or replace the authoritative cart Map. Payment controls/processing remain unimplemented.

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
