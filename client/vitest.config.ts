import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [react()],
	test: {
		globals: true,
		environment: 'jsdom',
		coverage: {
			provider: 'v8',
			reporter: ['text', 'html'],
			reportsDirectory: './coverage',
		},
		setupFiles: './src/setupTests.ts',
	},
});
