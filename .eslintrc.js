module.exports = {
  env: {
    es2021: true,
    node: true,
  },
  extends: [
    'airbnb-base',
    'airbnb-typescript/base',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  ignorePatterns: ['packages/*/node_modules/**/*', 'packages/*/target/**/*'],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
    project: [
      'packages/loc-logic-sdk/tsconfig.json',
      'packages/logic/tsconfig.json',
      'packages/runtime/tsconfig.eslint.json',
      'packages/tests/tsconfig.json',
    ],
  },
  plugins: ['@typescript-eslint'],
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],

    '@typescript-eslint/no-shadow': 'off',
    'no-shadow': 'off',

    '@typescript-eslint/no-namespace': 'off',
    'no-namespace': 'off',

    '@typescript-eslint/no-use-before-define': 'warn',
    '@typescript-eslint/triple-slash-reference': 'warn',

    'class-methods-use-this': 'off',
    'max-classes-per-file': 'off',
    'no-restricted-syntax': [
      'error',
      {
        selector: 'BinaryExpression[operator=instanceof][right.name=Array]',
        message: '`instanceof Array` is disallowed. Prefer `Array.isArray()`',
      },
    ],
    'no-plusplus': ['error', { allowForLoopAfterthoughts: true }],
  },
};
