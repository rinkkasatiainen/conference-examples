// Contract test against the real IndexedDB - no import map, so the step-7 store
// wrapper resolves to the real step-4 IndexedDB implementation.
export default {
  nodeResolve: true,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 5000,
    },
  },
  files: ['test/session-store.contract.test.js'],
}
