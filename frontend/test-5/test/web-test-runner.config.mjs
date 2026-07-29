import { importMapsPlugin } from '@web/dev-server-import-maps'

const plugins = [
  importMapsPlugin({
    inject: {
      importMap: {
        imports: {},
      },
    },
  }),
]

export default {
  plugins,
  nodeResolve: true,
  // Serve from frontend/ so the test page can load the app's own stylesheet -
  // the tests already import components from ../../step-5.
  rootDir: '..',
  // The real design system, not a copy of it. Components that expect the page
  // to style their light DOM (cfb-flip-card's backdrop + placeholder) then look
  // in --manual mode exactly like they do in the app.
  testRunnerHtml: testFramework => `
    <html>
      <head>
        <link rel="stylesheet" href="/styles.css">
      </head>
      <body>
        <script type="module" src="${testFramework}"></script>
      </body>
    </html>
  `,
  browserStartTimeout: 60000,
  testFramework: {
    config: {
      timeout: 3000,
    },
  },
  files: ['test/**/*.test.js'],
}
