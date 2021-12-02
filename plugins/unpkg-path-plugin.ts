import * as esbuild from "esbuild-wasm";
import axios from "axios";

const unpkgPathPlugin = () => ({
	name: "unpkg-path-plugin",
	// eslint-disable-next-line no-undef
	setup(build: esbuild.PluginBuild) {
		build.onResolve({ filter: /.*/ }, async (args: any) => {
			console.log("onResole", args);
			if (args.path === "index.js") {
				return { path: args.path, namespace: "a" };
			}
			if (args.path.includes("./") || args.path.includes("../")) {
				return { namespace: "a", path: new URL(args.path, `${args.importer}/`).href };
			}
			return { path: `https://unpkg.com/${args.path}`, namespace: "a" };
		});
		build.onLoad({ filter: /.*/ }, async (args: any) => {
			console.log("onLoad", args);
			if (args.path === "index.js") {
				return {
					loader: "jsx",
					contents: `
              import react, {useState} from "react";
              import axios from "axios";

            `,
				};
			}
			const { data, request } = await axios.get(args.path);
			return {
				loader: "jsx",
				contents: `${data}`,
			};
		});
	},
});
export default unpkgPathPlugin;
