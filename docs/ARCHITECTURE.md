# Architecture

## Files and boundaries
index.html defines semantic screens and native controls. style.css defines kiosk layout, responsive rules, touch-sized buttons and focus feedback. script.js owns application logic. No backend, database, persistence, packages, authentication or real payment APIs.

## JavaScript organization
1. Product Data
2. Application State
3. DOM References
4. Utility Functions
5. Cart Operations
6. Calculations
7. Rendering
8. Navigation
9. Payment Validation
10. Payment Processing
11. Transaction Logic
12. Receipt Rendering
13. Reset Logic
14. Event Listeners
15. Initialization

applicationState contains the authoritative cart Map and current screen, method, accepted payment result, processing flag and completed snapshot. getElement lazily caches static elements and retries absent elements. Generated rows are not cached. getProduct centralizes catalog lookup. bindEventListeners separates registration from initializeApplication.

## Order calculations
Cart Map holds IDs and quantities only. Catalog supplies names and whole-peso prices. calculateSubtotal = catalog price × cart quantity; calculateTotal sums the shared subtotals. Renders reuse these functions and formatPrice. Summary does not clone the mutable cart.

## Navigation
navigateTo validates screen/method/cart/completion prerequisites, renders the target and toggles hidden sections, label and heading focus. Back preserves the cart. Invalid cart entries are sanitized before Item Selection rendering; corrupted current screen recovers with customer feedback. Confirmation/receipt render saved values independently of later cart edits.

## Payments
validateAmountPaid accepts numeric text with up to two decimals, finite/non-negative values, safe integer cents and sufficient funds. Cash change uses integer cents. QR uses explicit simulated confirmation. Card sets a synchronous flag, disables Process/Back and sets aria-busy before scheduling CARD_PROCESSING_DELAY_MS=1500. Callback validates captured order signature before completing. The signature is transient validation data, not another cart.

completeSimulatedPayment revalidates processing state, catalog/order, selected method, total and paid/change rules and prevents repeated completion. clearCompletedPayment centralizes accepted-result/snapshot clearing during processing setup and reset.

## Completed transaction and receipt
Snapshot fields: reference, dateTime, items, total, paymentMethod, amountPaid, change, status='completed'. Each item copies productId, name, unitPrice, quantity, subtotal. Snapshot, array and item records are frozen. Reference is POS- plus crypto.randomUUID; timestamp is ISO. Confirmation and renderReceipt use the snapshot, with textContent. Receipt time text and datetime attribute are identical.

## Reset
startNewTransaction requires a completed receipt, clears state and input/errors, releases processing controls, clears hidden summary/receipt rows and success/receipt fields (including datetime), then returns to Item Selection with total ₱0 and Continue disabled. No transaction history is retained.

## Verification
Regression and Cash/QR/Card-to-receipt/reset probes passed simulated DOM tests. Browser/touch/console and real elapsed delay checks remain pending. Existing Node is test tooling only.
