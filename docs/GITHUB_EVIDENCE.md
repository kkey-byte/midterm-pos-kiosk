# GitHub Evidence

## Confirmation / Receipt / Reset review — 2026-10-07

- Branch: feature-receipt; PR target: main. Foundation on main includes payment merge 6782605.
- Actual feature commit: a26f786798f088043eb44098b5920f02642f801d.
- Subject: feat(receipt): add transaction confirmation receipt and reset.
- Review confirmed scope is confirmation, immutable transaction snapshot, receipt, reset, related tests and documentation. Corresponding TASKLIST tasks are DONE for the recorded verification scope.
- node --check script.js, node tests/cart.test.cjs, and git diff --check passed. Tests execute actual handlers in simulated DOM; no browser/touch/console test is claimed.
- Exact receipt total ₱140, Cash paid ₱200, change ₱60 passed; invalid payment guards, two distinct references, cart-independent snapshots, complete reset, and subsequent Cookies/QR transaction passed.
- Push attempted: git push -u origin feature-receipt with credential.interactive=never. Exit 1: Cannot prompt because user interactivity has been disabled; unable to get password from user. Successful push is not claimed.
- PR description prepared in RECEIPT_PR_DESCRIPTION.md. GitHub CLI is unavailable and this branch push is blocked by credentials; no PR creation is claimed.
- After authenticating, push feature-receipt and open https://github.com/kkey-byte/midtern-pos-kiosk/compare/main...feature-receipt with base main and compare feature-receipt. Use the feature commit subject as title and the prepared description. Create a draft PR; do not merge.
- Feature hash evidence and PR description are recorded in a separate documentation commit so the actual feature hash can be preserved. No merge performed.

## Existing repository

[kkey-byte/midtern-pos-kiosk](https://github.com/kkey-byte/midtern-pos-kiosk)

Origin fetch and push URL: https://github.com/kkey-byte/midtern-pos-kiosk.git

Local repository: C:\Users\Asus\midterm-pos-kioskk\midtern-pos-kiosk

Current branch at inspection: main.

## Recorded local evidence

- Repository exists locally with a .git directory.
- Initial inspection reported no commits and no tracked project files.
- Reviewed git status, git diff, all foundation source files, and project documentation before committing. Since the files were initially untracked, the staged diff was inspected after staging.
- The foundation contains 14 files: index.html, style.css, script.js, README.md, and ten docs/ Markdown files. No POS functionality is implemented.
- JavaScript syntax validation and staged whitespace checks passed. Browser rendering and console checks remain unverified as recorded in TEST_PLAN_RESULTS.md.
- Foundation commit: ee8015f0ceb46e8048c95ae054dbfcdd021878e1.
- Commit subject: chore: initialize touchscreen POS kiosk project.
- [View foundation commit](https://github.com/kkey-byte/midtern-pos-kiosk/commit/ee8015f0ceb46e8048c95ae054dbfcdd021878e1).
- On 2026-10-07, git push -u origin main completed successfully with exit code 0, reporting a new main branch and tracking configuration for origin/main.
- The foundation commit exists locally. The working tree was clean after the foundation commit and push, before this evidence update.
- This evidence update is recorded in a separate documentation commit because the foundation commit cannot contain its own final hash.
- No new GitHub repository was created.

## Evidence to collect later

## Focused Payment review — 2026-10-07

- Branch: feature-payment; intended PR base: main.
- Local feature commit: 2d55d6d9c38e017c448c25fe1e085ed5d833dc9d.
- Subject: feat(payment): implement cash QR and card payment flows.
- Focused tests passed: Cash ₱100 rejected against ₱140, exact ₱140/change ₱0, ₱200/change ₱60; QR/Card paid=₱140 and change=₱0; every method Back chain preserves the authoritative order.
- Actual tests: node --check script.js, node tests/cart.test.cjs (simulated DOM/registered handlers and controlled card timer), source assertions, and Git whitespace checks. No real browser or elapsed timing result is claimed.
- Payment task is DONE for this verification scope. No genuine application defect was found in the focused test.
- Push attempted with saved credentials and failed: Cannot prompt because user interactivity has been disabled; unable to get password from user. No successful payment push is claimed.
- PR description prepared in PAYMENT_PR_DESCRIPTION.md. No payment PR was created. Authenticate Git, run git push -u origin feature-payment, then create a draft PR from feature-payment into main. No merge performed.
- This documentation follow-up records the actual feature hash; its own final hash is available in git log.

## Cart feature — 2026-10-07

- Branch: feature-cart, targeting main.
- Feature commit: 19ef5380e41e501fa3526a54fce3aaa430949432.
- Subject: feat(cart): add quantity controls and order calculations.
- [Feature commit](https://github.com/kkey-byte/midtern-pos-kiosk/commit/19ef5380e41e501fa3526a54fce3aaa430949432).
- git push -u origin feature-cart succeeded with exit code 0 and reported a new feature-cart branch, tracking origin/feature-cart.
- Review reran node --check script.js, node tests/cart.test.cjs, and Git whitespace checks successfully. Exact totals verified: ₱175 → ₱220 → ₱175 → ₱140. Tests invoke actual registered event handlers in a simulated DOM; real browser/touch/console checks remain unperformed.
- Cart Management is DONE for verified logic and simulated DOM output; browser integration remains pending.
- PR description is prepared in CART_PR_DESCRIPTION.md. GitHub CLI is unavailable; no cart PR creation is claimed.
- [Prepare cart PR](https://github.com/kkey-byte/midtern-pos-kiosk/compare/main...feature-cart).
- This branch includes the product UI restored from feature-products because PR #1 was not merged when feature-cart was created. No Order Summary/payment logic was added and no merge was performed.
- This evidence update is a separate documentation commit so it can record the actual feature hash and successful push.

| Evidence | Status |
| --- | --- |
| Authorized initialization commit and SHA | Recorded above |
| Authorized foundation push | Successful; Git push reported main -> main |
| GitHub browser file verification | Not performed; push evidence comes from Git |
| Implementation commits linked to stages | Pending |
| Completed transaction flow demonstration | Pending |
| Test results and screenshots | Pending |

Replace pending entries with actual commit links, dates, and evidence after the corresponding work is authorized and verified. Never invent commit identifiers or GitHub results.
