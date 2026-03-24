/**
 * Monorepo ESLint config
 *
 * Notes:
 * - Most packages run `eslint src/` from their package directory; this root config is discovered via directory traversal.
 * - Next.js rules are configured in `apps/web/.eslintrc.cjs` to avoid requiring Next's ESLint config
 *   to be resolvable from every workspace package.
 */
module.exports = {
  root: true,
  ignorePatterns: [
    '**/node_modules/**',
    '**/dist/**',
    '**/.next/**',
    '**/coverage/**',
    '**/src/generated/**', // Prisma client output
  ],
  env: {
    es2022: true,
    node: true,
  },
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'unused-imports', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
  rules: {
    // This codebase currently uses `any` in a few boundary areas (contracts, controllers, config blobs).
    // Keep lint actionable by not failing on explicit `any`.
    '@typescript-eslint/no-explicit-any': 'off',

    // Allow intentionally-unused variables when prefixed with `_`.
    '@typescript-eslint/no-unused-vars': [
      'error',
      {
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
        caughtErrorsIgnorePattern: '^_',
      },
    ],
    'unused-imports/no-unused-imports': 'error',
    'unused-imports/no-unused-vars': [
      'warn',
      {
        vars: 'all',
        varsIgnorePattern: '^_',
        args: 'after-used',
        argsIgnorePattern: '^_',
      },
    ],
    'simple-import-sort/imports': 'warn',
    'simple-import-sort/exports': 'warn',
    'no-restricted-imports': [
      'error',
      {
        patterns: [
          {
            group: ['**/packages/**/dist/**', 'packages/**/dist/**'],
            message:
              'Do not import from workspace package dist output. Use the package entrypoint (for example @pytholit/<package>) instead.',
          },
        ],
      },
    ],
  },
};
