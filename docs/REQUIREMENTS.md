# Requirements

## Implemented requirements and verification scope
Functional requirements are implemented in the current feature-validation checkout. Source/simulated DOM checks passed as mapped in ACCEPTANCE_TRACEABILITY.md. Browser startup, visibility/touch/keyboard/console and network inspection remain unverified where applicable; full instructor acceptance is incomplete.

| ID | Requirement |
| --- | --- |
| R01 | Application uses HTML5, CSS3, Vanilla JavaScript only; no packages/frameworks |
| R02 | Hard-coded six-product JavaScript catalog and one in-memory applicationState with cart Map |
| R03 | No backend/database/authentication/real payment integration or credentials |
| R04 | Six native touch-sized product controls add catalog items to the cart |
| R05 | Cart quantity controls/removal and correct subtotal/total; read-only Order Summary matches cart; empty/invalid cart cannot proceed |
| R06 | Select Cash, QR Payment, or Credit/Debit Card before simulated processing |
| R07 | Validate Cash; explicitly confirm QR; Card shows processing with repeat/navigation protection |
| R08 | Only valid completed simulated payment shows success and creates unique reference/frozen snapshot |
| R09 | Receipt displays snapshot heading, reference/dateTime, items/quantities/unit prices/subtotals, total/method/paid/change/status |
| R10 | New Transaction clears order/payment/snapshot/errors/previous rendered data; returns to empty Item Selection |
| R11 | Required navigation sequence, preserved Back state, guarded transitions and safe invalid-state recovery |
| R12 | Readable labels, touch-sized native controls, focus styling and responsive layout; real touch/keyboard/browser checks required |
| R13 | Understandable validation feedback without raw errors; initial/flow browser console checks required |

## Catalog
Coffee ₱45; Sandwich ₱50; Soft Drink ₱35; Cookies ₱25; Bottled Water ₱20; Chocolate ₱25. Display two decimals; quantity zero removes a cart row. Subtotal=price×quantity; total=sum(subtotals). Cash paid-total gives change using integer cents; QR/Card paid=total/change=0.

## Flow
Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection.

## Runtime
No installation/build/backend or persistent storage. Use a modern browser supporting crypto.randomUUID in a secure context such as localhost. Local-file support depends on browser policy/API support. Reload discards state. Existing Node built-ins are used only by optional tests. No real payment or credential collection is permitted.
