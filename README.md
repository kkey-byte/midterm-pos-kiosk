# Touchscreen Point of Sale (POS) Kiosk System

## Purpose
An IT415 Practical Examination kiosk demonstration for selecting products, reviewing an order, simulating payment, viewing a receipt, and starting another transaction.

## Technologies
HTML5, CSS3, and Vanilla JavaScript only. No packages, frameworks, build step, backend, database, authentication, or real payment API. The optional test harness uses existing Node built-in modules; Node is not an application dependency.

## Features
Six product buttons; cart quantity controls and removal; subtotals and total; summary and Back navigation; Cash/QR/Card simulations; validated confirmation; immutable transaction snapshot; digital receipt; complete New Transaction reset.

## Transaction Flow
Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection.

## How to Run
Keep index.html, style.css, and script.js together. Use a modern browser with JavaScript and crypto.randomUUID support. Use a secure context such as localhost; an existing static preview tool can serve this folder without installing project dependencies. A local file can be opened if the browser permits it and supports the required API in that context. No backend payment service is involved. See docs/RUNBOOK.md for steps and verification limitations.

## Project Structure
- index.html: semantic screens and controls.
- style.css: responsive kiosk layout, typography, touch-sized controls and focus styling.
- script.js: catalog, state, calculations, rendering, navigation, simulated payments, snapshot, receipt, reset.
- tests/cart.test.cjs: simulated DOM regression tests using Node built-ins.
- docs/: decisions, requirements, architecture, runbook, security, development log, tests, traceability, and Git evidence. PR descriptions are preparation artifacts, not proof of PR creation.

## Product Data Approach
The catalog is hard-coded in script.js: Coffee ₱45, Sandwich ₱50, Soft Drink ₱35, Cookies ₱25, Bottled Water ₱20, Chocolate ₱25. Prices display with two decimals. No data service is used.

## State Management
One applicationState owns the cart Map, currentScreen, selectedPaymentMethod, paymentResult, cardProcessing, and completedTransaction. Cart stores product IDs and quantities; names/prices come from the catalog. Totals are derived. All data is in memory and lost on reload.

## Payment Simulation
Cash accepts an amount and calculates change using integer cents. QR uses a clearly labelled non-scannable placeholder and Confirm Payment. Card shows instructions and a scheduled 1500ms processing delay with repeat/navigation protection. QR/Card set paid equal to total and change to zero. Valid completion creates a POS-prefixed UUID reference and ISO timestamp; a deeply frozen copied snapshot supplies confirmation and receipt.

## Validation
Empty/invalid carts cannot advance. Quantity zero removes the item; controls cannot decrement below zero. Cash rejects blank, text, negative, nonfinite, insufficient, overprecision, and unsafe amounts. Invalid state recovers with understandable feedback. Back preserves the order. New Transaction clears state and hidden previous payment/receipt output.

## Security Boundaries
Simulation only: no card number, expiration, CVV, PIN, QR credentials, tokens, or secrets are needed. Dynamic content uses textContent/native DOM construction; application source has no eval or HTML injection APIs. Client-side checks are not a real payment security boundary. No persistence or transaction ledger exists.

## Testing
Run with an existing Node runtime:
```powershell
node --check script.js
node tests/cart.test.cjs
git diff --check
```
Recorded tests execute actual JavaScript/handlers in simulated DOM, with a controlled card timer. Calculation, cash, QR/Card, navigation, confirmation, snapshot/reference, receipt, reset and subsequent-transaction checks passed. Instructor tests 1/7 and browser console remain NOT VERIFIED for browser/touch/visibility aspects. Full instructor acceptance is incomplete. See docs/TEST_PLAN_RESULTS.md and docs/ACCEPTANCE_TRACEABILITY.md.

## Git/GitHub Workflow
Use the existing kkey-byte/midtern-pos-kiosk repository. Develop on feature branches from updated main, review diff and real tests, use Conventional Commits, push, and prepare a PR into main. Merge after review. docs/GITHUB_EVIDENCE.md records actual hashes and distinguishes local/cached remote evidence from live GitHub operations.

## AI-Assisted Development
Codex assisted staged implementation, test execution, conflict resolution, validation, refactoring, and documentation under user instructions. Human review and real-browser demonstration remain required. docs/AI_DEVELOPMENT_LOG.md records actual work and limitations; no invented interactions or test evidence.
