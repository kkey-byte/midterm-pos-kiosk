# Architecture

## Current foundation

- index.html: Semantic products section and current-order aside, a disabled Continue button, stylesheet link, and deferred script.
- style.css: Responsive product grid, 140px minimum-height product buttons, hover/active styling, and visible keyboard focus.
- script.js: Six-product hard-coded catalog rendered with native buttons and textContent, plus safe initialization. No cart or navigation handlers exist.
- docs/: Project decisions, requirements, planning, and evidence records.

## Planned application design

The browser renders all screens and owns all transaction state. A hard-coded product catalog in JavaScript supplies product data. In-memory state will hold the current screen, selected items and quantities, selected simulated payment method, processing status, and completed transaction snapshot.

JavaScript will render the relevant screen from state and handle user events. Validate events and transitions before changing state. Derive totals from catalog prices and quantities; use integer minor currency units to avoid floating-point rounding errors when calculations are implemented. The approved currency is PHP and the catalog is recorded in SOURCE_OF_TRUTH.md. Current catalog prices are whole-peso values used only for display.

Payment processing is a local simulation. A completed transaction snapshot supplies the receipt. Starting a new transaction clears transaction-specific state and returns to Item Selection.

## Screen sequence

Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection

## Boundaries

No backend, database, persistent application storage, authentication, package dependencies, or real payment API. No card numbers or payment credentials are needed. Reloading loses the current transaction.

The planned design above has not yet been implemented.
