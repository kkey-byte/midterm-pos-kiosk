# Runbook

## Open the project

1. Enter the midtern-pos-kiosk repository directory.
2. Open index.html in a modern browser.
3. Confirm that Touchscreen POS Kiosk appears inside the styled container.
4. Open browser developer tools and check for initial console errors.
5. Inspect the application container and confirm data-initialized="true".
6. Confirm all six catalog products and their approved prices appear, with an empty current-order area and disabled Continue control.
7. Check product button focus and touch size. Activating products does not add items yet; this stage provides display only.

No installation, npm command, build step, backend, or database is required.

## Troubleshooting

| Symptom | Check |
| --- | --- |
| Page cannot open | Confirm index.html exists and local file access is permitted by the browser |
| Styling is missing | Confirm style.css is adjacent to index.html and its link is correct |
| Initialization marker is missing | Confirm script.js is adjacent to index.html, loads with defer, and the container has id="app"; inspect the console |
| Previous transaction disappeared | In-memory state is intentionally discarded on reload |

## Verification limitations

The automated browser tool rejected the local file URL during foundation verification. Rendering, JavaScript loading in a browser, and initial console errors have not been verified. Source references and JavaScript syntax were checked.

## Planned demonstration

Once implemented, demonstrate Item Selection → Order Summary → Payment Method → Payment Processing → Payment Successful → Receipt → New Transaction → Item Selection. Use simulated payments only and record actual outcomes in TEST_PLAN_RESULTS.md.
