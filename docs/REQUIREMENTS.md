# Requirements

All functional requirements below are planned unless explicitly verified in TEST_PLAN_RESULTS.md.

| ID | Requirement |
| --- | --- |
| R01 | Use HTML5, CSS3, and Vanilla JavaScript only, without packages or frameworks |
| R02 | Use a hard-coded JavaScript product catalog and in-memory application state |
| R03 | Provide no backend, database, authentication, or real payment integration |
| R04 | Provide touchscreen Item Selection that adds catalog items to an order |
| R05 | Provide Order Summary with quantities, removal, and correct totals; prevent payment with an empty order |
| R06 | Require selection of a simulated payment method before processing |
| R07 | Provide Payment Processing with protection against repeated submission |
| R08 | Show Payment Successful after simulated processing completes |
| R09 | Show a receipt matching the completed order, total, and selected payment method |
| R10 | Start New Transaction by clearing transaction state and returning to Item Selection |
| R11 | Preserve the required screen sequence and reject invalid transitions |
| R12 | Use readable text, clear labels, and touch-friendly controls; support keyboard interaction |
| R13 | Handle invalid inputs and application errors with understandable feedback and no uncaught initial console errors |

## Required sequence

Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection

## Operational constraints

Open index.html in a modern browser with its adjacent style.css and script.js. No installation, build, network service, or persistent storage is required. Reloading the page discards in-memory transaction state.
