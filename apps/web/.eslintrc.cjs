module.exports = {
  root: true,
  ignorePatterns: ['next-env.d.ts'],
  extends: ['../../.eslintrc.cjs', 'next', 'next/core-web-vitals'],
  rules: {
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
  overrides: [
    {
      files: ['src/shared/types/projects.ts', 'src/shared/types/deployments.ts'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "TSInterfaceDeclaration[id.name='Project']",
            message:
              'Use ProjectViewModel for web-local UI shapes; reserve Project for @pytholit/contracts API contracts.',
          },
          {
            selector: "TSInterfaceDeclaration[id.name='DeployJob']",
            message:
              'Use DeployJobViewModel for web-local UI shapes; reserve DeployJob for @pytholit/contracts API contracts.',
          },
          {
            selector: "TSTypeAliasDeclaration[id.name='ProjectLifecycleState']",
            message:
              'Derive lifecycle state from contract types instead of redefining local unions.',
          },
        ],
      },
    },
  ],
};
