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

Latest Card scope on feature-payment: Credit/Debit Card processing displays amount due, “Please tap, insert, or swipe your card.”, simulation text, and Process Payment. It shows Processing for a scheduled 1500ms delay, disables repeated processing and Back navigation, then uses the shared paymentResult with amountPaid=total, change=0, paymentMethod=Credit/Debit Card. Invalid/changed orders cannot complete. No card details, provider connection, receipt, or transaction ledger exists. This supersedes earlier notes that card processing remains pending.

Latest QR scope on feature-payment: Cash and QR can proceed to processing. QR shows authoritative amount due, a clearly labelled non-scannable placeholder, scan instructions with an explicit simulation alternative, and Confirm Payment. Confirmation creates an in-memory paymentResult with amountPaid = total, change = 0, paymentMethod = QR Payment, then shows simulated success. Cash shares the same result field and completion function. No real provider, QR credentials, transaction ledger, or receipts exist; card processing remains pending. Earlier cash-only/method-only statements are historical checkpoints.

Latest feature-payment scope: Cash Payment Processing displays authoritative Total Amount, an Amount Paid input, Pay Now, and clear validation feedback. validateAmountPaid rejects blank, non-numeric, negative, non-finite, insufficient, overprecision, and unsafe amounts before calculating change in integer cents. Valid cash sets an in-memory cashPayment result (total, amountPaid, change) and shows a minimal Payment Successful view. Invalid cash remains processing and creates no payment result, transaction, or receipt. QR/card processing, transaction records, and receipts remain unimplemented. This supersedes earlier method-selection-only scope statements below.

On feature-payment, the restored Order Summary navigates to Payment Method with three simulated choices: Cash, QR Payment, Credit/Debit Card. applicationState.selectedPaymentMethod stores only cash, qr, card, or null. Back preserves the authoritative cart and selected method; re-entry restores the pressed choice. No real credentials, payment tokens, or transaction completion are collected or implemented. Browser verification remains pending.

On feature-cart, the application renders six JavaScript catalog products and supports adding items, increasing/decreasing quantities, explicit removal, subtotals, and a transaction total. One Map is the authoritative cart state, storing product IDs and positive integer quantities. Catalog prices are whole PHP pesos. At quantity zero the item is removed. Continue stays disabled; Order Summary, payment, and receipt behavior are not implemented. Browser verification remains outstanding.

Approved catalog: Coffee ₱45.00; Sandwich ₱50.00; Soft Drink ₱35.00; Cookies ₱25.00; Bottled Water ₱20.00; Chocolate ₱25.00.

Planned behavior in other documents must not be interpreted as implemented behavior. See TEST_PLAN_RESULTS.md for actual cart verification.

## Change control

Record approved decision changes here, update affected requirements and traceability, and record the work and evidence in AI_DEVELOPMENT_LOG.md and TEST_PLAN_RESULTS.md. Mark implementation tasks DONE only after implementation and actual verification.

## Payment Successful stage

Only a validated completed simulated payment creates a completed transaction snapshot and reference. Confirmation displays PAYMENT SUCCESSFUL, total, amount paid, method, change, reference, and a View Receipt control. Receipt viewing remains pending, so that control is disabled with an explanatory message. Snapshot items and payment values are copied and deeply frozen; later cart changes cannot alter them. Data remains in memory.

## Digital receipt stage

Receipt viewing is now implemented from the frozen completed transaction snapshot. It displays POS heading, reference, date/time, names, quantities, unit prices, subtotals, total, method, paid amount, change, and Payment Successful status. View Receipt is enabled. NEW TRANSACTION is displayed disabled; reset is pending. Simulated DOM verification passed; browser checks remain outstanding.

## New Transaction stage

NEW TRANSACTION is now enabled on the receipt. It clears the current order, payment state/input/errors, success output, completed snapshot, and previous receipt output before returning to Item Selection with an empty cart and ₱0.00 total. A subsequent Cookies/QR transaction and repeated reset were verified in simulated DOM. Browser integration remains pending.
