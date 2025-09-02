import antfu from '@antfu/eslint-config'

export default antfu({
  ignores: ['build', '**/build/**', 'dist', '**/dist/**'],
})
