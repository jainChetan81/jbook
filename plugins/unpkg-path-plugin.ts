import { PluginBuild } from "esbuild-wasm";

const unpkgPathPlugin = () => ({
	name: "unpkg-path-plugin",
	setup(build: PluginBuild) {
		// Handle root entry file of 'index.js'
		build.onResolve({ filter: /(^index\.js$)/ }, () => ({ path: "index.js", namespace: "a" }));

		// Handle relative paths in a module
		build.onResolve({ filter: /^\.+\// }, (args: any) => ({
			namespace: "a",
			path: new URL(args.path, `https://unpkg.com${args.resolveDir}/`).href,
		}));

		// Handle main file of a module
		build.onResolve({ filter: /.*/ }, async (args: any) => ({
			namespace: "a",
			path: `https://unpkg.com/${args.path}`,
		}));
	},
});
export default unpkgPathPlugin;
