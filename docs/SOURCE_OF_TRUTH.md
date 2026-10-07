# Source of Truth

## Approved project decisions
Touchscreen Point of Sale (POS) Kiosk System for IT415. Application stack: HTML5 + CSS3 + Vanilla JavaScript only. Hard-coded JavaScript catalog; in-memory state; no backend/database/authentication/real payment provider. No frameworks, npm packages, CSS frameworks, or TypeScript.

## Actual implementation
Six products: Coffee ₱45, Sandwich ₱50, Soft Drink ₱35, Cookies ₱25, Bottled Water ₱20, Chocolate ₱25.
Cart supports adding, increasing/decreasing quantities, removal, derived subtotals and total. Zero quantity removes the item. Summary reads the same cart; Back preserves selected items. Payment methods are Cash, QR Payment, Credit/Debit Card.

Cash is validated before calculating change in integer cents. QR is a non-scannable placeholder plus confirmation. Card has a scheduled 1500ms local processing delay and duplicate/navigation lock. QR/Card paid=total and change=0. Payments are simulations.

Valid completion creates a frozen snapshot with reference, dateTime, items, total, paymentMethod, amountPaid, change, status. Copied item records are frozen; references use crypto.randomUUID with POS prefix; dateTime is ISO. Confirmation and receipt read the snapshot. View Receipt and NEW TRANSACTION are enabled. Reset clears order/payment/snapshot/errors and hidden receipt/confirmation output; no ledger is retained.

## Flow
Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection.

## State and execution
applicationState owns cart, currentScreen, selectedPaymentMethod, paymentResult, cardProcessing, completedTransaction. No duplicate cart. Catalog prices are whole pesos; display uses two decimals. Reload discards state. Browser requires JavaScript and crypto.randomUUID in a supported secure context (such as localhost).

## Verified scope
Actual script, registered handlers, simulated DOM output, controlled card timer, syntax/source and Git whitespace checks passed. Instructor tests 1/7 and console remain NOT VERIFIED for real-browser startup/visibility/touch/console. Full acceptance remains incomplete. TEST_PLAN_RESULTS.md is the evidence record.

## Change control
Keep requirements, traceability, architecture, task status and test evidence aligned with actual behavior. DONE records its verification scope; it does not waive pending browser integration. No application behavior changes were made during documentation finalization.
