import path from "node:path";
import { defineConfig } from "vite";
import { nodePolyfills } from "vite-plugin-node-polyfills";

export default defineConfig({
	build: {
		target: "esnext",
	},
	plugins: [nodePolyfills()],
	optimizeDeps: {
		esbuildOptions: {
			target: "esnext",
		},
	},
	resolve: {
		alias: {
			crypto: 'crypto-browserify',
			stream: 'stream-browserify',
		},
	},
});