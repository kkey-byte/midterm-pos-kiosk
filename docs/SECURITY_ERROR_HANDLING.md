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

The audit evidence below distinguishes implemented checks from pending receipt/reset safeguards.

## Validation audit — 2026-10-07

Audited feature-validation based on main payment merge 6782605. Receipt, transaction references, completed snapshots, and New Transaction reset are absent here; their security and leakage checks remain pending integration of feature-receipt. Do not treat absence as a passing receipt/reset audit.

Actual script/handler tests in simulated DOM passed cart quantity/removal/calculation/empty guards, cash validation/change, QR/card guards, repeat processing prevention, and all-method Back preservation. Added fault tests reproduced and fixed unknown-product rendering exceptions, decrease of corrupted negative quantities, and acceptance of insufficient cash through the shared completion function. Completion now revalidates method, cart, total, finite paid/change, and method-specific rules. Invalid current screens recover to Item Selection with friendly feedback; unknown target screens are safely ignored when the current screen is valid.

Customer feedback uses explicit instructions (for example, enter a numeric amount such as 200.00 or pay at least the total); raw JavaScript exceptions/stack traces and input markup are not rendered. Dynamic values use textContent and native DOM construction. The actual script contains no eval, dynamic Function construction, innerHTML/outerHTML/insertAdjacentHTML, network payment API, or browser persistence API. Amount Paid is the only input; no payment credentials are requested. A common-pattern scan of repository files excluding .git and tests found no secrets; this is a bounded source review, not proof against every possible secret format.

Real-browser error/console/touch checks remain unperformed. Detailed actual results and pending dependencies are in TEST_PLAN_RESULTS.md.

## Existing initialization behavior

Initialization safely returns when the application container is absent. JavaScript syntax validation passed. Browser error handling and console verification remain outstanding.

## Limits

Client-side controls can be altered by a user. This foundation is not suitable for processing real payments or protecting financial records. In-memory data is lost on reload.

## Confirmation guards

Completion rechecks the active processing screen, cart validity, selected method, total, finite paid/change values, and method-specific payment rules before creating a reference. Existing completed payment results prevent repeated completion. Success navigation requires a completed snapshot. No credentials or real payment provider are involved. References identify simulated transactions; they are not proof of real payment.

## Customer data reset

NEW TRANSACTION is accepted only from a completed receipt. It clears both application state and hidden rendered values, including previous references, timestamp attributes, receipt rows, and payment amounts/errors. Reset does not retain a transaction ledger. The receipt guard prevents reopening the cleared receipt.

## Integrated audit result — 2026-10-07
Receipt is now integrated. Combined tests passed reference-after-valid-completion guards, receipt access guards, and previous-customer reset clearing including hidden DOM. Cart recovery preserves completed snapshot rendering on success/receipt screens. Earlier missing-feature notes are historical; browser checks remain pending.
