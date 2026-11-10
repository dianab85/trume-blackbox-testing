# black-box tests

Playwright tests against the deployed configurator. They cover style selection, the five-value limit, reordering, clearing, search, and palette selection on desktop and mobile Chromium. 

## Setup

Requires Node.js 20 or newer and npm.

```sh
npm install
npx playwright install chromium
npm test
```

On Linux, Playwright may also require system browser dependencies. An administrator can install them with `npx playwright install-deps chromium`; this may request a sudo password.

To test a different deployment than the default target while keeping those query parameters:

```sh
BASE_URL=https://example.com npm test
```

Run `npm run test:ui` for interactive debugging, or `npm run report` to view the last HTML report. Screenshots and traces are retained on failure. These tests rely on the deployment and its data being available;
