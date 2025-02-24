import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig({
	build: {
		target: "esnext",
	},
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
	plugins: [react(), nodePolyfills()],
	resolve: {
		alias: {
			"@": path.resolve(__dirname, "./src"),
		},
	},
});
