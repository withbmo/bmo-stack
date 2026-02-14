/**
 * NestJS API ESLint config
 * Extends the monorepo base config with NestJS-specific rules
 */
module.exports = {
  root: true,
  extends: ['../../.eslintrc.cjs'],
  rules: {
    // NestJS uses decorators extensively - allow empty interfaces for DTOs
    '@typescript-eslint/no-empty-interface': 'off',
    
    // NestJS controllers often have many public methods
    'max-lines': 'off',
  },
};
