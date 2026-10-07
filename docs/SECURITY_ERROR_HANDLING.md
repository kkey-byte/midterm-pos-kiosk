# Security and Error Handling

## Boundaries
This is an in-memory local IT415 simulation, not a real payment system. No backend, database, authentication, persistent ledger or payment provider. No card number, expiration, CVV, PIN, QR credentials or tokens are requested/stored/transmitted. Browser JavaScript may be altered; references are identifiers for simulation, not proof of payment. Reload loses data.

## Implemented checks
Catalog IDs and positive safe-integer quantities are validated. Quantity zero removes an item; corrupt negative entries are removed when decreased. Empty/invalid carts cannot advance; invalid entries recover safely before Item Selection renders. Unknown target screens are ignored; corrupted current screen recovers with readable feedback. Back preserves the order.

Cash rejects blank, text, negative, nonfinite, insufficient, more-than-two-decimal, and unsafe-cent values. Change uses integer cents. Completion revalidates screen/cart/method/total/paid/change. Repeated completion is ignored. Invalid payment cannot produce accepted result/reference/receipt.

Card locks processing/navigation before its timer, then validates the order signature before completion; changed orders receive feedback and unlock controls. QR requires explicit simulated confirmation. Success and receipt require a completed snapshot.

## Rendering and customer feedback
Dynamic values use textContent/native DOM construction, not user-controlled HTML injection. App source contains no eval/dynamic Function/innerHTML/outerHTML/insertAdjacentHTML or provider/network/storage APIs. Errors give actions such as entering numbers or reviewing products; raw exception/stack text and input markup are not displayed.

## Reset
NEW TRANSACTION is accepted from a completed receipt and clears state, cart, input, validation/processing, references/time attributes, item rows and amounts in hidden confirmation/receipt sections. Old receipt cannot be reopened after clearing. No history is retained.

## Evidence and limitations
Simulated DOM tests passed invalid cash, cart/screen recovery, duplicate completion, references/receipt guards, reset leakage and subsequent transaction. A common secret-pattern scan excluding .git and tests found no matching common keys/private keys/credential assignments; it is a bounded scan, not proof against every format. Browser error/console/touch and elapsed timing remain unverified. See TEST_PLAN_RESULTS.md.
