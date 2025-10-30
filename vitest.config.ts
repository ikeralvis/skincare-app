import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './tests/setup.ts',
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html', 'lcov'],
      exclude: [
        'node_modules/',
        'tests/',
        'dist/',
        '**/*.config.*',
        '**/types/**',
        'src/data/**'
      ],
      include: ['src/**/*.ts', 'src/utils/**/*.ts']
    },
    include: ['tests/unit/**/*.test.ts'],
    exclude: ['node_modules', 'dist']
  }
});
