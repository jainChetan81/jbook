import * as esbuild from "esbuild-wasm";

const unpkgPathPlugin = () => ({
	name: "unpkg-path-plugin",
	// eslint-disable-next-line no-undef
	setup(build: esbuild.PluginBuild) {
		build.onResolve({ filter: /.*/ }, async (args: any) => ({ path: args.path, namespace: "a" }));
		build.onLoad({ filter: /.*/ }, async (args: any) => {
			if (args.path === "index.js") {
				return {
					loader: "jsx",
					contents: `
              import message from 'tiny-test-pkg';
              console.log(message);
            `,
				};
			}
		});
	},
});
export default unpkgPathPlugin;
