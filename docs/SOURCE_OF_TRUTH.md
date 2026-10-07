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

The application displays six JavaScript-rendered product buttons, an empty current-order area, and a disabled Continue control. No cart actions, calculations, navigation, or transaction behavior are implemented. Browser verification remains outstanding.

Approved catalog (PHP): Coffee ₱45.00; Sandwich ₱50.00; Soft Drink ₱35.00; Cookies ₱25.00; Bottled Water ₱20.00; Chocolate ₱25.00.

The current Item Selection scope is display only. Product buttons accept native focus and activation but have no cart handlers. Continue is disabled until progression is implemented in a later stage.

Planned behavior in other documents must not be interpreted as implemented behavior.

## Change control

Record approved decision changes here, update affected requirements and traceability, and record the work and evidence in AI_DEVELOPMENT_LOG.md and TEST_PLAN_RESULTS.md. Mark implementation tasks DONE only after implementation and actual verification.
