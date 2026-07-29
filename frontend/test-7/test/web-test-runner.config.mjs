import { importMapsPlugin } from '@web/dev-server-import-maps'

const testImportMappings = {
  '../step-4/session-store.js': './test/helpers/fake-session-store-core.js',
  '/__wds-outside-root__/1/step-4/session-store.js': './test/helpers/fake-session-store-core.js',
  '../step-7/lib/store/session-store.js': './test/helpers/fake-session-store.js',
  '/__wds-outside-root__/1/step-7/lib/store/session-store.js': './test/helpers/fake-session-store.js',
  '../step-7/lib/store/schedule-store.js': './test/helpers/fake-schedule-store.js',
  '/__wds-outside-root__/1/step-7/lib/store/schedule-store.js': './test/helpers/fake-schedule-store.js',
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
