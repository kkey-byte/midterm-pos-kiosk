# Acceptance Traceability

The original T01–T13 planning IDs below map requirements to stages; the instructor mapping later in this file records actual results. Neither table certifies full browser acceptance.

| Requirement | Stage | Acceptance evidence | Test |
| --- | --- | --- | --- |
| R01 | S0, S9 | Source inspection confirms approved stack and no dependencies | T01 |
| R02 | S2, S9 | Catalog is hard-coded; state is in memory and resets on reload | T02 |
| R03 | S9 | Source and browser network inspection show no backend or real payment service | T03 |
| R04 | S2 | Selecting an item updates the order correctly | T04 |
| R05 | S3 | Quantities, removal, totals, and empty-order guard work | T05 |
| R06 | S4 | Processing cannot start without a selected simulated method | T06 |
| R07 | S5 | Processing is visible and repeated activation completes only once | T07 |
| R08 | S6 | Success appears after simulated processing completes | T08 |
| R09 | S7 | Receipt matches the completed transaction snapshot | T09 |
| R10 | S8 | New Transaction clears state and returns to Item Selection | T10 |
| R11 | S2–S9 | Full sequence is followed; invalid transitions are rejected | T11 |
| R12 | S9 | Touch, narrow-screen, and keyboard checks pass | T12 |
| R13 | S0, S9 | Initial console is clear and invalid inputs receive useful feedback | T13 |

Record actual results and evidence in TEST_PLAN_RESULTS.md. Update this mapping when approved requirements change.

## Instructor checklist mapping — 2026-10-07

Instructor IDs below are separate from the original T01–T13 planning IDs. Evidence is the Instructor acceptance pass in TEST_PLAN_RESULTS.md; PASS scope is actual script and simulated DOM, not a real browser.

| Instructor test | Requirements / stages | Actual evidence | Status |
| --- | --- | --- | --- |
| 1 Startup/products | R01, R02, R04, R12; S0/S2/S9 | Initialization/six names/prices/native controls passed; browser/touch pending | NOT VERIFIED |
| 2 Cart total ₱175 | R04/R05; S2C | Rendered items and total matched | PASS |
| 3 Coffee quantity changes | R05; S2C | ₱135/₱220 then ₱175 | PASS |
| 4 Remove Soft Drink | R05; S2C | Row removed, ₱140 | PASS |
| 5 Summary | R05/R11; S3 | Item/unit/quantity/subtotal/total matched | PASS |
| 6 Back preserves order | R11; S3/S4/S5 | Same Map and ₱140 through all Back chains | PASS |
| 7 Method visibility | R06/R12; S4/S9 | HTML/handlers passed; actual browser visibility pending | NOT VERIFIED |
| 8 Insufficient cash | R06/R08/R09/R13; S5/S6/S7 | Rejected; no result/snapshot/success/receipt navigation | PASS |
| 9 Exact/overpaid cash | R08; S5/S6 | ₱140/change zero; ₱200/change ₱60 | PASS |
| 10 Confirmation | R08/R11; S6 | Amount/method/reference/control verified | PASS |
| 11 Receipt | R09; S7 | All snapshot values matched | PASS |
| 12 QR | R06/R08/R09; S4–S7 | ₱140 paid, zero change; receipt/reset passed | PASS |
| 13 Card | R07/R08/R09; S5–S7 | Lock/control timer; ₱140 paid, zero change; receipt/reset passed | PASS |
| 14 New Transaction | R10/R11; S8 | State and hidden DOM cleared; next transaction passed | PASS |
| 15 References | R08/R09; S6/S7 | Two distinct references; invalid completion creates none | PASS |
| Browser console | R13; S0/S9 | Console not inspected | NOT VERIFIED |

Overall acceptance is incomplete until the real-browser checks pass. No failed executable assertion was observed in this pass.
