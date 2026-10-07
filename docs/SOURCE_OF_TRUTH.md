# Source of Truth

## Project

Touchscreen Point of Sale (POS) Kiosk System for the IT415 Practical Examination.

## Approved decisions

| Area | Decision |
| --- | --- |
| Technology | HTML5 + CSS3 + Vanilla JavaScript only |
| Data | Hard-coded product catalog in JavaScript |
| State | In-memory JavaScript application state |
| Backend | None |
| Database | None |
| Payment | Simulated only |

No React, Vue, Angular, TypeScript, Node frameworks, npm packages, CSS frameworks, backend services, authentication, or real payment APIs.

## Required transaction flow

Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection

## Current scope and status

On feature-checkout, Continue now opens an Order Summary generated from the same cart and calculation functions. BACK preserves all order values. CONTINUE TO PAYMENT opens a placeholder only. Empty/invalid-cart entry returns to Item Selection with friendly feedback. This supersedes the prior cart-stage statement that Continue remains disabled: it is now disabled only when the cart is empty or invalid. Payment processing and receipts remain unimplemented.

On feature-cart, the application renders six JavaScript catalog products and supports adding items, increasing/decreasing quantities, explicit removal, subtotals, and a transaction total. One Map is the authoritative cart state, storing product IDs and positive integer quantities. Catalog prices are whole PHP pesos. At quantity zero the item is removed. Continue stays disabled; Order Summary, payment, and receipt behavior are not implemented. Browser verification remains outstanding.

Approved catalog: Coffee ₱45.00; Sandwich ₱50.00; Soft Drink ₱35.00; Cookies ₱25.00; Bottled Water ₱20.00; Chocolate ₱25.00.

Planned behavior in other documents must not be interpreted as implemented behavior. See TEST_PLAN_RESULTS.md for actual cart verification.

## Change control

Record approved decision changes here, update affected requirements and traceability, and record the work and evidence in AI_DEVELOPMENT_LOG.md and TEST_PLAN_RESULTS.md. Mark implementation tasks DONE only after implementation and actual verification.
