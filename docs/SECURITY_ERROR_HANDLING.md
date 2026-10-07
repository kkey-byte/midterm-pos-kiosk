# Security and Error Handling

## Scope

Card payment is simulated by a local timer only. No card number, expiration, CVV, PIN, token, or provider request is used. A synchronous processing flag prevents repeated activation and navigation during the delay; the callback verifies the order before producing a shared payment result. An invalid/changed order receives feedback without success.

QR simulation uses only a textual non-scannable placeholder and explicit user confirmation. It requests no QR credentials, tokens, account identifiers, or application access, and connects to no payment service. Confirmation guards the active method, valid cart, and existing result; empty/invalid orders cannot produce success. Cash and QR share one in-memory paymentResult.

This is a local examination project with no backend, database, authentication, or real payment service. Payment is simulated only. Do not request, store, or transmit card details, credentials, or personal payment data.

## Planned safeguards

Implemented cash safeguards on feature-payment: input is trimmed and validated for numeric format, finite/non-negative value, two-decimal currency precision, safe integer cents, and sufficient funds before change calculation. Invalid submissions show a clear alert and remain processing with no result/transaction/receipt. Repeated submit after success is ignored. Cash totals come from the authoritative cart and shared calculation functions. Only simulated amounts and method identifiers are used; no payment credentials are collected.

- Render dynamic labels with textContent rather than injecting HTML.
- Validate product identifiers against the hard-coded catalog.
- Validate quantities as positive integers within an explicitly chosen limit.
- Derive prices from catalog data rather than editable UI values.
- Guard empty orders and missing payment method selections.
- Reject invalid screen transitions and duplicate processing submissions.
- Clear transaction state when starting a new transaction.
- Provide readable, actionable error messages without exposing internal details.
- Leave the user in a recoverable screen after a simulated failure; define that recovery behavior before implementing failure simulation.

These transaction safeguards are planned and unverified.

## Existing initialization behavior

Initialization safely returns when the application container is absent. JavaScript syntax validation passed. Browser error handling and console verification remain outstanding.

## Limits

Client-side controls can be altered by a user. This foundation is not suitable for processing real payments or protecting financial records. In-memory data is lost on reload.

## Confirmation guards

Completion rechecks the active processing screen, cart validity, selected method, total, finite paid/change values, and method-specific payment rules before creating a reference. Existing completed payment results prevent repeated completion. Success navigation requires a completed snapshot. No credentials or real payment provider are involved. References identify simulated transactions; they are not proof of real payment.

## Customer data reset

NEW TRANSACTION is accepted only from a completed receipt. It clears both application state and hidden rendered values, including previous references, timestamp attributes, receipt rows, and payment amounts/errors. Reset does not retain a transaction ledger. The receipt guard prevents reopening the cleared receipt.
