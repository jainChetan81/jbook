import { PluginBuild, OnLoadResult } from "esbuild-wasm";
import axios from "axios";
import localForage from "localforage";

const fileCache = localForage.createInstance({
	name: "filecache",
});

const fetchPlugin = (inputCode: string) => ({
	name: "fetch-plugin",
	setup(build: PluginBuild) {
		build.onLoad({ filter: /.*/ }, async (args: any) => {
			const cachedResult = await fileCache.getItem<OnLoadResult>(args.path);
			if (cachedResult) {
				return cachedResult;
			}
			return null;
		});
		build.onLoad({ filter: /(^index\.js$)/ }, async () => ({
			loader: "jsx",
			contents: inputCode,
		}));

		build.onLoad({ filter: /.css$/ }, async (args: any) => {
			const cachedResult = await fileCache.getItem<OnLoadResult>(args.path);

			if (cachedResult) {
				return cachedResult;
			}
			const { data, request } = await axios.get(args.path);

			const escaped: string = data.replace(/\n/g, "").replace(/"/g, '\\"').replace(/'/g, "\\'");
			const contents: string = `const style=document.createElement('style');
				style.innerText='${escaped}';
				document.head.appendChild(style);
			`;
			const result: OnLoadResult = {
				loader: "jsx",
				contents,
				resolveDir: new URL("./", request.responseURL).pathname,
			};
			await fileCache.setItem(args.path, result);

			return result;
		});

		build.onLoad({ filter: /.*/ }, async (args: any) => {
			const cachedResult = await fileCache.getItem<OnLoadResult>(args.path);

			if (cachedResult) {
				return cachedResult;
			}
			const { data, request } = await axios.get(args.path);

			const result: OnLoadResult = {
				loader: "jsx",
				contents: data,
				resolveDir: new URL("./", request.responseURL).pathname,
			};
			await fileCache.setItem(args.path, result);

			return result;
		});
	},
});
export default fetchPlugin;
