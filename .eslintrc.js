module.exports = {
  root: true,
  env: {
    browser: true,
    node: true,
    es2021: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  plugins: ['@typescript-eslint', 'import', 'unused-imports', 'jsx-a11y', 'prettier'],
  extends: [
    'next/core-web-vitals',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:jsx-a11y/recommended',
    'plugin:prettier/recommended',
  ],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // Console
    'no-console': ['error', { allow: ['warn', 'error'] }],

    // Prettier
    'prettier/prettier': 'warn',

    // TypeScript
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': [
      'warn',
      { args: 'after-used', ignoreRestSiblings: true, argsIgnorePattern: '^_' },
    ],

    // Unused Imports
    'unused-imports/no-unused-imports': 'warn',
    'unused-imports/no-unused-vars': 'off',

    // Import sorting
    'import/order': [
      'warn',
      {
        groups: ['type', 'builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
        pathGroups: [
          {
            pattern: '~/**',
            group: 'internal',
            position: 'after',
          },
        ],
        'newlines-between': 'always',
        alphabetize: { order: 'asc', caseInsensitive: true },
      },
    ],
  },
};
