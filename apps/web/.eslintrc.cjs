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
        paths: [
          {
            name: '@pytholit/ui',
            message:
              'Use @pytholit/ui/ui, @pytholit/ui/blocks, or @pytholit/ui/system instead of the root compatibility barrel.',
          },
          {
            name: '@pytholit/ui/ui',
            importNames: [
              'Template',
              'HubResource',
              'Feature',
              'PricingPlan',
              'ProjectStatus',
              'DeploymentStatus',
              'DeployJobStatus',
            ],
            message:
              'App and server domain types must be owned by apps/web shared types or contracts, not by the UI package.',
          },
          {
            name: '@pytholit/ui/blocks',
            importNames: ['DashboardTab'],
            message:
              'Type app constants locally and pass them structurally into DashboardTabs instead of importing block prop types.',
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
