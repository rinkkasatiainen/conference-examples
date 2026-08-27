# Getting started - Step 7

Run these steps once **before** the [Step 7 README](./README.md) (Connections and onward).

## 1) Branch

Work on a branch so feedback and history stay easy to follow.

## 2) Serve from the `frontend/` folder


From `frontend/`:

```bash
npx http-server -o .
```

Open [`index.html`](./index.html) and open step-7

## Use real Backend API for the calls

The app’s default base URL is `http://localhost:3001` (see [`lib/api/backend-api.js`](./lib/api/backend-api.js)).

From `frontend/step-7-be/`:

```bash
npm install
npm start
```

---

[Continue to Step 7 →](./README.md)
