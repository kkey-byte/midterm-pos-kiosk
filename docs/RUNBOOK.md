# Runbook

## Run
1. Open the repository folder containing index.html, style.css, script.js.
2. Use an existing static preview tool on localhost, or open index.html if your browser permits local-file access and crypto.randomUUID there. No project package installation/build/backend is required.
3. Use a modern browser with JavaScript and crypto.randomUUID support in a secure context.
4. Confirm six products and initial empty cart/₱0.00. Check developer tools Console for startup errors and app data-initialized="true".
5. Execute the instructor checklist in TEST_PLAN_RESULTS.md and record actual browser outcomes; existing simulated-DOM passes do not replace them.

## Demonstration
Add Coffee twice, Sandwich once, Soft Drink once: total ₱175. Increase Coffee: ₱220; decrease: ₱175. Remove Soft Drink: ₱140. Continue to Summary; Back preserves order. Return to payment, select Cash. Paid ₱100 rejects; paid ₱200 accepts/change ₱60. View Receipt; verify all values; NEW TRANSACTION clears the order. Repeat exact Cash ₱140/change zero, QR and Card paid=total/change zero, and verify different references for different completions. Card processing should prevent repeated activation/Back.

## Automated checks
With an existing Node runtime, run node --check script.js and node tests/cart.test.cjs. Run git diff --check. No packages required. The harness simulates DOM and timer; actual browser timing/console/touch are separate checks.

## Troubleshooting
- Missing styling/script: keep adjacent files and check load paths/Console.
- Reference creation unavailable: check crypto.randomUUID and browser secure context; use localhost with an existing preview tool.
- Continue disabled: select a valid item; empty/invalid cart is guarded.
- Cash rejected: enter sufficient numeric amount with at most two decimals.
- Card controls disabled: wait for simulated processing to complete.
- Lost transaction after reload: expected in-memory behavior.
- No real QR scan possible: placeholder is explicitly non-scannable; use Confirm Payment.

## Git workflow
Work in the nested midtern-pos-kiosk repository, inspect git status/diff, preserve uncommitted changes before switching, update main, create a feature branch, test and commit, push and prepare PR. Resolve conflicts preserving both features and guards. Do not merge before review. If Git cannot obtain credentials, authenticate in your own terminal; never place credentials in project files.

## Current limitations
Automated browser local-file navigation was rejected earlier. Actual browser startup, touch/visibility and Console remain unverified. No deployment, browser screenshots or full acceptance certification is claimed.
