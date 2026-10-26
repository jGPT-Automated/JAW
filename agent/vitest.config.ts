import { defineConfig } from 'vitest/config';

// Explicit config so vitest does not walk up and load the JAW Hub web app's config.
export default defineConfig({
  root: import.meta.dirname,
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
