import { resolve as _resolve } from 'path';
import { defineConfig } from 'vitest/config';

const resolve = (p: string) => _resolve(__dirname, p);

export default defineConfig({
  resolve: {
    alias: {
      '~': resolve('.'),
      '@': resolve('.'),
    },
  },
  define: { __IS_HOME__: false, 'import.meta.vitest': false },
  test: {
    globals: true,
    silent: true,
    reporters: ['default'],
    environment: 'jsdom',
    exclude: [
      '.out',
      'node_modules',
      'docs',
      'env/**/*',
      'src/infrastructures/**/*',
      'src/__mocks__/**/*',
      'src/interfaces/**/*',
      'src/types/**/*',
    ],
    include: ['src/**/*.{js,ts}'],
    includeSource: ['src/**/*.{js,ts}'],
    coverage: {
      provider: 'istanbul',
      reportsDirectory: '.out/reports/coverage',
      exclude: [],
    },
  },
});
