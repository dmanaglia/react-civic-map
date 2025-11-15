import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import importPlugin from 'eslint-plugin-import';
import prettierConfig from 'eslint-config-prettier';
import { defineConfig, globalIgnores } from 'eslint/config';

export default defineConfig([
	globalIgnores(['dist']),

	{
		files: ['**/*.{ts,tsx}'],

		extends: [
			js.configs.recommended,
			tseslint.configs.recommended,
			reactHooks.configs.flat.recommended,
			reactRefresh.configs.vite,

			// ⭐ Prettier LAST — disables conflicting ESLint style rules
			prettierConfig,
		],

		plugins: {
			import: importPlugin,
		},

		rules: {
			'import/order': [
				'warn',
				{
					alphabetize: { order: 'asc', caseInsensitive: true },
					groups: ['builtin', 'external', 'internal', 'parent', 'sibling', 'index'],
				},
			],
			// Enforce camelCase for variables and properties
			'@typescript-eslint/naming-convention': [
				'error',
				{
					selector: 'variable',
					format: ['camelCase'],
					leadingUnderscore: 'allow',
				},
				{
					selector: 'typeLike',
					format: ['PascalCase'],
				},
				{
					selector: 'function',
					format: ['camelCase'],
				},
				{
					selector: 'variable',
					types: ['function'],
					format: ['PascalCase'], // Allows React component functions
					modifiers: ['exported'], // optional, only applies to exported components
				},
			],
		},

		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
	},
]);
