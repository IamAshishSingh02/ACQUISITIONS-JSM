import js from '@eslint/js';

export default [
  js.configs.recommended,

  /* ✅ Base Config for All JS Files */
  {
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: {
        console: 'readonly',
        process: 'readonly',
        Buffer: 'readonly',
        __dirname: 'readonly',
        __filename: 'readonly',
        URL: 'readonly',

        setTimeout: 'readonly',
        clearTimeout: 'readonly',
        setInterval: 'readonly',
        clearInterval: 'readonly',
      },
    },

    rules: {
      indent: ['error', 2, { SwitchCase: 1 }],
      'linebreak-style': ['error', 'unix'],
      quotes: ['error', 'single'],
      semi: ['error', 'always'],

      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-console': 'off',

      'prefer-const': 'error',
      'no-var': 'error',

      'object-shorthand': 'error',
      'prefer-arrow-callback': 'error',
    },
  },

  /* ✅ Jest Testing Environment Support */
  {
    files: ['src/tests/**/*.js', 'tests/**/*.js'],

    languageOptions: {
      globals: {
        describe: 'readonly',
        test: 'readonly', // ✅ Added (you use test())
        it: 'readonly',
        expect: 'readonly',

        beforeEach: 'readonly',
        afterEach: 'readonly',
        beforeAll: 'readonly',
        afterAll: 'readonly',

        jest: 'readonly',
      },
    },
  },

  /* ✅ Ignore Common Build/Generated Folders */
  {
    ignores: ['node_modules/**', 'coverage/**', 'logs/**', 'drizzle/**'],
  },
];
