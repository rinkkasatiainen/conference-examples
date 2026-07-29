// Shared MSW worker for the T-7 loader tests.
//
// MSW intercepts requests at the NETWORK boundary through a real Service Worker -
// the component makes a genuine `fetch`, and MSW answers it. No `window.fetch`
// monkey-patching. This is the same tool the app uses at its entry
// (see step-7/mocks/), so tests and app mock the network the same way.
//
// Each test declares only the handler(s) it needs via `worker.use(...)`, and
// `worker.resetHandlers()` in afterEach clears them.
import { setupWorker } from 'msw/browser'

export { http, HttpResponse, delay } from 'msw'

export const worker = setupWorker()

// The backend-api seam defaults to this base URL (see step-7/lib/api/backend-api.js).
export const API = 'http://localhost:3001'
