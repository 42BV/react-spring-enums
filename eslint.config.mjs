import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import globals from 'globals';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,

  {
    files: ['**/*.{ts,tsx}'],
    ...reactPlugin.configs.flat.recommended,
    settings: {
      react: {
        version: 'detect'
      }
    }
  },

  {
    files: ['**/*.{ts,tsx}'],
    ...reactHooksPlugin.configs['flat/recommended']
  },

  {
    files: ['**/*.{ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2018,
      sourceType: 'module',
      globals: {
        ...globals.browser
      },
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      }
    },
    rules: {
      'indent': 'off',
      '@typescript-eslint/no-use-before-define': 'off',
      'react/prop-types': 'off'
    }
  },

  {
    ignores: ['lib/**', 'node_modules/**', '_site/**', 'coverage/**']
  }
);
