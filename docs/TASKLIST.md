# Task List

Allowed statuses: **TODO**, **IN PROGRESS**, **BLOCKED**, **DONE**.

- TODO: Work has not started.
- IN PROGRESS: Work has started but implementation or verification is incomplete.
- BLOCKED: A concrete dependency prevents completion; record the blocker.
- DONE: Required behavior is implemented and verified, with evidence recorded.

The stages below are the development sequence derived from the approved flow. No implementation stage is complete yet.

| ID | Stage | Task | Status | Completion evidence / dependency |
| --- | --- | --- | --- | --- |
| S0 | Repository and project foundation | Inspect repository and create the HTML/CSS/JavaScript foundation | IN PROGRESS | Files created; browser load, styling, initialization, and console verification outstanding |
| S1 | Documentation foundation | Establish the ten project documents and check their consistency | IN PROGRESS | Documentation created; review against examination criteria remains open |
| S2 | Item Selection | Implement the hard-coded product catalog and touchscreen item selection | TODO | Verify selection updates in-memory order state |
| S3 | Order Summary | Implement quantities, removal, totals, and summary navigation | TODO | Verify order calculations and prevent advancing with an empty order |
| S4 | Payment Method | Implement simulated payment method selection | TODO | Verify a method is required before processing |
| S5 | Payment Processing | Implement simulated processing and duplicate-submission protection | TODO | Verify processing state and one completion per transaction |
| S6 | Payment Successful | Implement the success screen | TODO | Verify it appears only after successful simulated processing |
| S7 | Receipt | Implement receipt display from the completed transaction | TODO | Verify receipt items, totals, and payment method match the transaction |
| S8 | New Transaction | Reset transaction state and return to Item Selection | TODO | Verify no previous order or payment state remains |
| S9 | Integration and quality verification | Verify the entire flow, touch usability, error handling, and console | TODO | Execute TEST_PLAN_RESULTS.md cases and record actual results |
| S10 | GitHub and examination evidence | Record verified commits, repository evidence, and demonstration results | TODO | Record actual links and evidence; commit or push only when authorized |

Do not mark any task DONE solely because code or documentation exists. Record implementation and verification evidence first.
