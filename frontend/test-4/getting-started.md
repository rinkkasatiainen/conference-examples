# Getting started - Test step T-4

**Before** [T-4 README](./README.md).

**Build companion:** [Step 4](../step-4/getting-started.md) · **Previous test:** [T-3](../test-3/getting-started.md)

---

```bash
cd frontend/test-4
npm install
npm test
```

This step may run **multiple** scripts:

```bash
npm run test:store:fake   # fast, fake IDB
npm run test:store:real   # contract vs real IndexedDB
```

Use `npm run test:manual` to inspect IndexedDB in DevTools when debugging.

---

[Continue to T-4 README →](./README.md)
