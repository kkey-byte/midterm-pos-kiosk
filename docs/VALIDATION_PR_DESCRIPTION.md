# Summary

Recover safely from invalid cart/screen state and prevent corrupted quantities. Preserve integrated receipt/snapshot/reset functionality. Replace technical numeric feedback with a customer-facing example.

# Requirements implemented

- Invalid catalog entries are removed before Item Selection renders; corrupted negative quantities are removed when decreased.
- Invalid current screen recovers to Item Selection with understandable feedback.
- Existing completion validation and receipt snapshot guards remain intact.
- Validation task DONE for simulated DOM and source verification; browser integration remains pending.

# Files changed

- script.js: cart/screen recovery, quantity guard, numeric feedback.
- tests/cart.test.cjs: invalid-state/payment and security/message assertions.
- docs/: task status, actual test results, security notes, evidence, and PR description.

# Testing performed

- node --check script.js: PASS.
- node tests/cart.test.cjs: PASS using actual script/handlers in simulated DOM and controlled card timer.
- git diff --check: PASS; conflict-marker scan found none.
- Source inspection: no eval, dynamic Function, HTML injection APIs, provider/network/storage APIs, or payment credential fields. Common secret-pattern scan found no matches.

# Observed results

- Cart totals ₱175 → ₱220 → ₱175 → ₱140; removal/zero/empty guards passed.
- Cash blank/text/negative/nonfinite/insufficient rejected; exact ₱140/change ₱0 and paid ₱200/change ₱60 accepted.
- QR/Card, duplicate processing and all-method Back preservation passed.
- Invalid completion created no reference; two completed references differed; receipt matched snapshot; reset cleared old state/output and subsequent Cookies/QR transaction worked.
- Fault tests reproduced invalid product rendering and corrupted negative quantity defects; fixes pass.
- Real-browser console/rendering/touch/elapsed timing were not tested.

Base main; compare feature-validation. Do not merge before review.
