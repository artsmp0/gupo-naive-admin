/* eslint-env node */
require('@rushstack/eslint-patch/modern-module-resolution')

module.exports = {
  root: true,
  'extends': [
    'plugin:vue/vue3-essential',
    'eslint:recommended',
    '@vue/eslint-config-typescript',
    '@vue/eslint-config-prettier/skip-formatting',
    "@unocss"
  ],
  parserOptions: {
    ecmaVersion: 'latest'
  },
  "ignorePatterns": ["index.html", "public/**/*"],
  rules:{
    'vue/multi-word-component-names': 'off',
    'vue/component-name-in-template-casing': [
      'error',
      'PascalCase',
      {
          registeredComponentsOnly: false,
          ignores: [],
      },
  ],
  'vue/attributes-order': ['error'],
  'vue/component-tags-order': [
      'error',
      {
          order: ['script', 'template', 'style'],
      },
  ],
  'vue/attribute-hyphenation': ['error', 'always'],
  '@typescript-eslint/no-explicit-any': 'error',
  '@typescript-eslint/consistent-type-imports': 'error',
  }
}
