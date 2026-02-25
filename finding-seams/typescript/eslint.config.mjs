import {eslintConfig} from '@rinkkasatiainen/eslint-config.ts'

export default [
  {
    ...eslintConfig,
    languageOptions: {
      ...eslintConfig.languageOptions,
      globals: {
        ...eslintConfig.languageOptions.globals,
        mocha: true,
      }
    }
  },
  {
    rules:
      {
        'mocha/consistent-spacing-between-blocks': 'off',
        'mocha/no-pending-tests': 'off',
        'max-classes-per-file': 'off'
      }
  }
]

