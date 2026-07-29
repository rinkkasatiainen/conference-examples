# Getting started - Test step T-0

Welcome to the first test step! Have you read on [how the testing track works](../how-to-test.md)? If not, maybe do it
now... If yes, let's do it!

---

## 1) Branch

Make sure you are working on a branch where you also have the 'build challenges' done. This way you have things to test
on. You can also always create a new branch, but that's not necessary.

## 2) Install

To get stuff done, normal `npm install` (or use `yarn` or `pnpm` or whatever).

```bash
cd frontend/test-0
npm install
```

## 3) Run tests

Then run the test and see it fail! If you have a one failing test, [you are ready to go](./README.md)!

```bash
npm test              # expect failure first - fix smoke test
```

## 4) Done when

- [ ] you see a test failure, similar to this:
```
Chrome: |██████████████████████████████| 1/1 test files | 0 passed, 1 failed

Finished running tests in 1.1s with 1 failed tests.
```

---

[Continue to T-0 README →](./README.md)
