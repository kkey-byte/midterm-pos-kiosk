# GitHub Evidence

## Final Git/GitHub audit — 2026-10-07

Inspected git status, git branch -a, git log --oneline --decorate --graph --all, commit file lists, origin/main..HEAD, and origin URLs. git fetch origin succeeded with exit 0. Public GitHub REST API returned all five repository PRs; current PR evidence below supersedes earlier unverified-status notes.

### Development history

| Stage | Actual commit/evidence | Audit finding |
| --- | --- | --- |
| Initialization | ee8015f and foundation documentation 57e8b34 | HTML/CSS/JS/README/ten docs committed |
| Products | 8ef5aa6 on feature-products and origin/feature-products | Product UI commit changes application and relevant docs; PR #1 open |
| Cart | 19ef538, evidence 397b64c; merge 175bf65 | Application, tests and docs; PR #2 merged |
| Checkout | d011199, evidence 255c043 on local/remote feature-checkout | Summary/Back application and tests/docs; PR #3 open draft; its UI was restored into payment dependency rather than its original commits merged |
| Payment | 2d55d6d, evidence 5912d05; merge 6782605 | Cash/QR/Card application, tests/docs; PR #4 merged |
| Receipt/reset | a26f786, evidence f6c642a; merge 639bee0 | Confirmation/snapshot/receipt/reset application and tests/docs; PR #5 merged |
| Validation | 32fd371, evidence 76f7fa3 | Real quantity/state recovery guards and feedback/tests; pushed, not in main; no PR exists |
| Genuine bug fixes | Validation stage reproduced invalid-product render error, corrupt negative quantity, invalid shared completion | Corrections recorded during validation; receipt integration already supplied shared completion validation. No separate fix: commit or dedicated bug-fix PR. Later investigation found no genuine defect and created no artificial fix |
| Refactor | 183f868 | Application structure/state/lookup/event cleanup plus adjusted tests/architecture; pushed, not in main |
| Testing | tests/cart.test.cjs appears in cart/checkout/payment/receipt/validation/refactor commits; TEST_PLAN_RESULTS.md records actual checks | Genuine versioned tests; no standalone test commit required/claimed. Instructor browser acceptance remains incomplete |
| Documentation | Foundation and feature evidence commits plus current synchronized README/ten docs | Existing committed history meaningful; final documentation changes are still uncommitted |

Commit subjects were checked against actual changed-file lists and reviewed source/test changes from prior stages, not merely accepted by title. All six feature branches exist locally and remotely with actual distinct development commits and graph ancestry. Git does not prove how a branch was originally created or who performed every editing step; no such unsupported provenance is claimed.

### Live PR evidence

Public API query: https://api.github.com/repos/kkey-byte/midtern-pos-kiosk/pulls?state=all&per_page=30.

| PR | Head → base | Verified status | Merge timestamp (UTC) |
| --- | --- | --- | --- |
| [#1](https://github.com/kkey-byte/midtern-pos-kiosk/pull/1) | feature-products → main | Open, not draft, not merged | None |
| [#2](https://github.com/kkey-byte/midtern-pos-kiosk/pull/2) | feature-cart → main | Closed, merged | 2026-10-07T10:07:26Z |
| [#3](https://github.com/kkey-byte/midtern-pos-kiosk/pull/3) | feature-checkout → main | Open draft, not merged | None |
| [#4](https://github.com/kkey-byte/midtern-pos-kiosk/pull/4) | feature-payment → main | Closed, merged | 2026-10-07T10:50:49Z |
| [#5](https://github.com/kkey-byte/midtern-pos-kiosk/pull/5) | feature-receipt → main | Closed, merged | 2026-10-07T11:28:34Z |

No feature-validation PR returned in the complete five-PR listing. PR existence/merge metadata does not establish reviewer approval or completed browser tests; those were not audited through review records.

### Working tree and missing evidence

- Current branch feature-validation; HEAD and freshly fetched origin/feature-validation both 183f86890fdd685d1d803c2d6c21df27adb5c75e. No committed changes ahead/behind its remote.
- main/origin/main both 639bee0b2d188b56719dbc83ebc109733187bd5e. feature-validation has three commits beyond main: 32fd371, 76f7fa3, 183f868.
- Working tree is NOT clean: README.md and all ten foundation docs are modified and unstaged. This audit updates only GITHUB_EVIDENCE.md; existing documentation changes are preserved.
- Missing final documentation commit/push, validation/refactor PR and reviewed merge into main, disposition of open product/checkout PRs, and real-browser startup/touch/visibility/console acceptance evidence.
- Product/summary functionality is present through later integrated feature work, but that does not turn PR #1/#3 into merged PRs or make their original commits ancestors of main.
- Retained validation stash appears in --all graph as backup, not a feature-delivery commit.
- No history rewrite, fabricated fix/test commit, commit, push, PR mutation or merge performed during this audit. No automated green CI or reviewer approval claimed.

## Repository and observed refs — 2026-10-07
Existing repository: [kkey-byte/midtern-pos-kiosk](https://github.com/kkey-byte/midtern-pos-kiosk). Origin: https://github.com/kkey-byte/midtern-pos-kiosk.git.
Local checkout: C:\Users\Asus\midterm-pos-kioskk\midtern-pos-kiosk.
Current branch: feature-validation.

Local HEAD and cached origin/feature-validation both point to 183f86890fdd685d1d803c2d6c21df27adb5c75e. Local main and cached origin/main point to 639bee0b2d188b56719dbc83ebc109733187bd5e. These are actual local Git observations, not a fresh live GitHub check or evidence of a validation PR/merge. Documentation changes are uncommitted.

## Actual commits visible in history
| Hash | Subject |
| --- | --- |
| ee8015f0ceb46e8048c95ae054dbfcdd021878e1 | chore: initialize touchscreen POS kiosk project |
| 57e8b344fbbcb6d20a48265b48a0024359046716 | docs: record foundation commit and push evidence |
| 19ef5380e41e501fa3526a54fce3aaa430949432 | feat(cart): add quantity controls and order calculations |
| 397b64c861f26c9fc596a1d5c72d3cfc5fe2b86a | docs: record cart feature commit and push evidence |
| 175bf659f16f0237dbfe0adaa8ca438538830c2c | Merge pull request #2 from kkey-byte/feature-cart |
| 2d55d6d9c38e017c448c25fe1e085ed5d833dc9d | feat(payment): implement cash QR and card payment flows |
| 5912d052df8fb0c76e2de8b841f524eda26f60ef | docs: record payment verification and commit evidence |
| 67826054e5e458d879b8800672c208c0c14ede2b | Merge pull request #4 from kkey-byte/feature-payment |
| a26f786798f088043eb44098b5920f02642f801d | feat(receipt): add transaction confirmation receipt and reset |
| f6c642ae3856c30857222c0653bc057ddc7b86d0 | docs: record receipt verification and PR evidence |
| 639bee0b2d188b56719dbc83ebc109733187bd5e | Merge pull request #5 from kkey-byte/feature-receipt |
| 32fd371535e7fbdd5891734194d50efff4678ffe | feat(validation): enforce payment and quantity validation |
| 76f7fa336efa134e703e54edcad216e214e8016b | docs: record validation review and PR evidence |
| 183f86890fdd685d1d803c2d6c21df27adb5c75e | refactor: centralize order and transaction logic |

feature-products local ref is 8ef5aa692b3f92c42691257a6813825069f31040; feature-checkout is 255c0433a3ca3609e3a302167727a15a2429ee7a. Do not infer their PR merge status from branch existence.

## Recorded operations
Foundation and cart pushes succeeded during earlier work. Assistant payment/receipt/validation push attempts failed to obtain credentials noninteractively; those failure reports remain historical facts. Later user activity brought branch refs and merged receipt history into the checkout. Current matching cached origin/feature-validation establishes synchronization with the last known remote state; no new successful push is claimed during documentation finalization.

PR #2/#4/#5 merges are visible in local Git history. User screenshots previously showed receipt PR #5. A validation PR is not verified. docs/CART_PR_DESCRIPTION.md, PAYMENT_PR_DESCRIPTION.md, RECEIPT_PR_DESCRIPTION.md, VALIDATION_PR_DESCRIPTION.md are prepared historical descriptions, not proof of live PR status. No validation merge or deployment is claimed.

## Verification and remaining evidence
Actual simulated DOM transaction tests, syntax and whitespace checks passed; instructor browser startup/visibility/touch/console remain NOT VERIFIED. TEST_PLAN_RESULTS.md contains exact scenarios/results. No browser screenshots, full acceptance certification, new commit, push, PR or merge were created in this documentation stage.
