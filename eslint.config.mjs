import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['build', '**/build/**', 'dist', '**/dist/**'],
  stylistic: {
    indent: 2,
    quotes: 'single',
  },
  typescript: true,
  markdown: true,
  rules: {
    'node/prefer-global/process': 'off',
    'array-bracket-spacing': 'off',
    'unused-imports/no-unused-vars': 'warn',
    'unused-imports/no-unused-imports': 'warn',
    'one-var': 'off',
    'no-console': 'off',
    'jsdoc/check-param-names': 'off',
    'curly': ['warn', 'multi-or-nest'],
    'antfu/if-newline': 'off',
    'antfu/curly': 'off',
    'antfu/consistent-list-newline': 'off',
    'brace-style': 'off',
    'style/no-tabs': 'warn',
    'style/max-len': ['off', { code: 100, tabWidth: 2 }],
  },
})
