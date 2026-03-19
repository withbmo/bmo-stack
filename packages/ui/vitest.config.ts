import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        setupFiles: ['./src/test/setup.ts'],
        include: ['src/**/*.test.{ts,tsx}'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'lcov'],
            include: ['src/components/**/*.{ts,tsx}'],
            exclude: ['src/**/*.stories.{ts,tsx}', 'src/test/**'],
        },
    },
});
