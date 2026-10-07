# Architecture

## Current foundation

- index.html: HTML5 document, application container, heading, stylesheet link, and deferred script.
- style.css: Basic reset, readable typography, and kiosk container styling.
- script.js: Six-product catalog, a single Map cart state, focused mutation functions, shared subtotal/total calculations, and product/cart rendering. Every successful mutation re-renders cart values. Names and prices come from the catalog rather than duplicated cart records.
- docs/: Project decisions, requirements, planning, and evidence records.

## Planned application design

Order Summary is now implemented on feature-checkout. currentScreen tracks only navigation; the existing cart Map remains authoritative. renderOrderSummary reads catalog data and existing calculateSubtotal/calculateTotal functions. navigateTo shows one screen at a time, validates cart entries before entering summary/payment, and returns safely to Item Selection with feedback when invalid. BACK preserves cart state. Payment Method is a placeholder with a return control, without payment selection or processing.

Implemented cart: addToCart, increaseQuantity, decreaseQuantity, and removeFromCart update the single cart Map. calculateSubtotal multiplies catalog unit price by current quantity; calculateTotal sums calculateSubtotal results. renderCart uses those same functions and formatPrice, avoiding duplicated calculations. Decreasing to zero removes the item. Catalog prices are currently exact whole-peso values. DOM labels use textContent and accessible native buttons with 56px minimum-size quantity controls.

The browser renders all screens and owns all transaction state. A hard-coded product catalog in JavaScript supplies product data. In-memory state will hold the current screen, selected items and quantities, selected simulated payment method, processing status, and completed transaction snapshot.

JavaScript will render the relevant screen from state and handle user events. Validate events and transitions before changing state. Derive totals from catalog prices and quantities; use integer minor currency units to avoid floating-point rounding errors. The currency and catalog content remain to be confirmed before implementation.

Payment processing is a local simulation. A completed transaction snapshot supplies the receipt. Starting a new transaction clears transaction-specific state and returns to Item Selection.

## Screen sequence

Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection

## Boundaries

No backend, database, persistent application storage, authentication, package dependencies, or real payment API. No card numbers or payment credentials are needed. Reloading loses the current transaction.

The planned design above has not yet been implemented.
