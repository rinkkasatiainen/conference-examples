import {eslintConfig} from '@rinkkasatiainen/eslint-config.js'

export default [
  {
    ...eslintConfig,
  },
  {
    rules:
      {
        'mocha/consistent-spacing-between-blocks': 'off',
        // 'mocha/no-pending-tests': 'off',
        'max-classes-per-file': 'off'
      }
  }
]

