# Tips

[← Back to README - 3) Concrete practice](./README.md#3-concrete-practice)

## Installing the packages

```bash
npm init -y
npm install --save-dev @web/test-runner chai
npm install --save-dev @web/dev-server-import-maps
```

Notice that `@web/test-runner-playwright` is **not** in the list. Read on to find out why.

## The `package.json` test scripts

Add these scripts to `package.json`:

```json
{
  "scripts": {
    "test": "web-test-runner \"test/**/*.test.js\" --node-resolve --config test/web-test-runner.config.mjs",
    "test:watch": "web-test-runner \"test/**/*.test.js\" --node-resolve --watch",
    "test:manual": "web-test-runner \"test/**/*.test.js\" --node-resolve --config test/web-test-runner.config.mjs --manual",
    "test:specific": "web-test-runner --files=test/**/*${PATTERN:-${npm_config_pattern:-*}}*.test.js --node-resolve --config test/web-test-runner.config.mjs"
  }
}
```

| Script                  | What it does                                                                    |
|-------------------------|---------------------------------------------------------------------------------|
| `npm test`              | Run the full suite once and exit                                                |
| `npm run test:watch`    | Re-run on every file save                                                       |
| `npm run test:manual`   | Open the WTR debug UI in the browser                                            |
| `npm run test:specific` | Run only files matching a pattern, e.g. `PATTERN=cfb-tag npm run test:specific` |

The `--node-resolve` flag lets the runner resolve bare `import` specifiers (like `chai`) from `node_modules`.

## The config file

Create the config at `test/web-test-runner.config.mjs` - it lives **inside** `test/`, which is why scripts pass
`--config test/web-test-runner.config.mjs`.

```js
import { importMapsPlugin } from '@web/dev-server-import-maps'

const testImportMappings = {
  // Add module remaps here, per test folder
}

const plugins = [
  importMapsPlugin({
    inject: {
      importMap: {
        imports: testImportMappings,
      },
    },
  }),
]

export default {
  plugins,
  nodeResolve: true,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 3000,
    },
  },
  files: ['test/**/*.test.js'],
}
```

## Why `importMapsPlugin`?

An **import map** remaps module specifiers at load time without touching source files. In tests you can swap a real
dependency for a fake:

```js
const testImportMappings = {
  '/src/api/client.js': '/test/fakes/api-client.fake.js',
}
```

This is a browser-native alternative to Jest's `jest.mock()`.

## Why no Playwright launcher?

With no `browsers` array, WTR uses its **built-in Chrome launcher** (CDP). Playwright adds ~170 MB binaries per browser
and is optional when you only need Chromium on a dev machine.

## Your first test

Create `test/example/smoke.test.js`. Run it and see it fail first:

```js
import { expect } from 'chai'

describe('smoke', () => {
  it('true is true', () => {
    expect(true).to.be.false
  })
})
```

## Running the tests

```bash
npm test
npm run test:watch
npm run test:manual
PATTERN=cfb-tag npm run test:specific
```

Expected output when green:

```
Chrome: |██████████████████████████| 1/1 test files | 1 passed, 0 failed
```
