# Architecture

## Current foundation

- index.html: HTML5 document, application container, heading, stylesheet link, and deferred script.
- style.css: Basic reset, readable typography, and kiosk container styling.
- script.js: Six-product catalog, a single Map cart state, focused mutation functions, shared subtotal/total calculations, and product/cart rendering. Every successful mutation re-renders cart values. Names and prices come from the catalog rather than duplicated cart records.
- docs/: Project decisions, requirements, planning, and evidence records.

## Planned application design

Card simulation extends the existing processing section with a third panel. applicationState.cardProcessing is the synchronous lock: processCardPayment sets it before scheduling a 1500ms callback, and navigation is blocked while it is true. Process and Back controls are disabled and the panel exposes aria-busy. The callback rechecks cart validity and an order signature before calling shared completeSimulatedPayment. The signature is transient validation data, not a duplicate mutable cart. Changed/invalid orders release the lock and display feedback without a payment result.

QR processing extends the same payment-processing screen with mutually exclusive Cash/QR panels. renderPaymentProcessing resets the transient result and shows the selected method panel. confirmQRPayment validates screen/method/cart, then passes total, amountPaid = total, change = 0, and paymentMethod = QR Payment to completeSimulatedPayment. Cash now uses this same completion function. applicationState.paymentResult replaces the earlier cashPayment field so there is one authoritative accepted payment result. No external provider calls or QR data are used.

Cash processing is now implemented on feature-payment. renderCashProcessing resets transient cash result/input/error and reads calculateTotal. validateAmountPaid returns either an error or validated monetary values; decimal input allows at most two places and change is calculated in integer cents. processCashPayment handles form submission, retains processing on rejection, and assigns applicationState.cashPayment only after validation passes. Navigation requires Cash selection and permits Payment Successful only from processing with an accepted cash result. Success creates no transaction ledger or receipt. Earlier method-only statements describe the prior checkpoint.

Payment Method selection is implemented on feature-payment using applicationState.selectedPaymentMethod and an allowlisted method catalog. selectPaymentMethod updates only the method identifier, and renderPaymentSelection updates aria-pressed and visible status. Back reads the existing cart to regenerate summary. Order Summary UI was restored from feature-checkout, whose branch was not merged into main. Payment selection does not process or complete a transaction.

Implemented cart: addToCart, increaseQuantity, decreaseQuantity, and removeFromCart update the single cart Map. calculateSubtotal multiplies catalog unit price by current quantity; calculateTotal sums calculateSubtotal results. renderCart uses those same functions and formatPrice, avoiding duplicated calculations. Decreasing to zero removes the item. Catalog prices are currently exact whole-peso values. DOM labels use textContent and accessible native buttons with 56px minimum-size quantity controls.

The browser renders all screens and owns all transaction state. A hard-coded product catalog in JavaScript supplies product data. In-memory state will hold the current screen, selected items and quantities, selected simulated payment method, processing status, and completed transaction snapshot.

JavaScript will render the relevant screen from state and handle user events. Validate events and transitions before changing state. Derive totals from catalog prices and quantities; use integer minor currency units to avoid floating-point rounding errors. The currency and catalog content remain to be confirmed before implementation.

Payment processing is a local simulation. A completed transaction snapshot supplies the receipt. Starting a new transaction clears transaction-specific state and returns to Item Selection.

## Screen sequence

Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection

## Boundaries

No backend, database, persistent application storage, authentication, package dependencies, or real payment API. No card numbers or payment credentials are needed. Reloading loses the current transaction.

The planned design above has not yet been implemented.
