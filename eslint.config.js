import js from '@eslint/js';
import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import astroPlugin from 'eslint-plugin-astro';

export default [
  js.configs.recommended,
  {
    ignores: [
      'dist/**',
      'node_modules/**',
      '.astro/**',
      '.netlify/**',
      'coverage/**',
      'playwright-report/**',
      'test-results/**',
      'public/**',
      '**/*.config.js',
      '**/*.config.ts',
      '**/*.config.mjs',
    ],
  },
  {
    files: ['**/*.ts', '**/*.tsx'],
    languageOptions: {
      parser: tsParser,
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module',
      },
      globals: {
        console: 'readonly',
        NodeListOf: 'readonly',
        window: 'readonly',
        document: 'readonly',
        performance: 'readonly',
        sessionStorage: 'readonly',
        global: 'readonly',
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin,
    },
    rules: {
      '@typescript-eslint/no-unused-vars': ['warn', { 
        argsIgnorePattern: '^_',
        varsIgnorePattern: '^_',
      }],
      '@typescript-eslint/no-explicit-any': 'off',
      'no-console': 'off',
      'no-undef': 'off',
      'no-unused-vars': 'off',
      'no-empty': 'warn',
    },
  },
  {
    files: ['tests/**/*.ts'],
    languageOptions: {
      globals: {
        console: 'readonly',
        performance: 'readonly',
        sessionStorage: 'readonly',
        window: 'readonly',
        global: 'readonly',
      },
    },
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': 'off',
      'no-undef': 'off',
    },
  },
  ...astroPlugin.configs.recommended,
];
