require('@rushstack/eslint-patch/modern-module-resolution')
module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/typescript/recommended',
    '@vue/prettier',
    // '@vue/prettier/@typescript-eslint',
    '@vue/eslint-config-prettier',
    'plugin:prettier/recommended',
    'prettier',
    './.eslintrc-auto-import.json'
  ],
  plugins: ['prettier'],
  parserOptions: {
    ecmaVersion: 2020,
    ecmaFeatures: {
      jsx: true // 开启jsx模板支持
    }
  },
  rules: {
    '@typescript-eslint/ban-ts-comment': 'off',
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    '@typescript-eslint/no-var-requires': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    'vue/multi-word-component-names': 'off',
    'vue/valid-v-slot': [
      'error',
      {
        allowModifiers: true
      }
    ],
    '@typescript-eslint/no-non-null-assertion': 'off',
    'no-irregular-whitespace': 'off',
    'vue/no-mutating-props': 'off'
  }
}
