import { importMapsPlugin } from '@web/dev-server-import-maps'

const testImportMappings = {
  // The schema files import from 'chai' directly; remap to the browser-compatible build
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
