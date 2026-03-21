module.exports = {
  root: true,
  ignorePatterns: ['next-env.d.ts'],
  extends: ['../../.eslintrc.cjs', 'next', 'next/core-web-vitals'],
  rules: {
    'no-restricted-imports': [
      'error',
      {
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
};
