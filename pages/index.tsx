import type { NextPage } from "next";
import * as esbuild from "esbuild-wasm";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
import fetchPlugin from "../plugins/fetch-plugin";
import unpkgPathPlugin from "../plugins/unpkg-path-plugin";

const Home: NextPage = function () {
	const ref = useRef<any>(null);
	const [input, setInput] = useState<string>("");
	const [code, setCode] = useState<string>("");

	const showTranspiledCode = async (e: any) => {
		e.preventDefault();
		if (!ref.current) return;
		const result = await ref.current.build({
			entryPoints: ["index.js"],
			bundle: true,
			write: false,
			plugins: [unpkgPathPlugin(), fetchPlugin(input)],
			define: {
				"process.env.NODE_ENV": '"production"',
				global: "window",
			},
		});

		setCode(result.outputFiles[0].text);
	};

	const startService = async () => {
		ref.current = await esbuild.startService({
			worker: true,
			wasmURL: "https://unpkg.com/esbuild-wasm@0.8.27/esbuild.wasm",
		});
	};

	useEffect(() => {
		startService();
	}, []);

	return (
		<Layout title="Home">
			<form onSubmit={showTranspiledCode}>
				<textarea
					name="code"
					id="code"
					cols={30}
					rows={3}
					value={input}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
				/>
				<button type="submit">Submit</button>
			</form>
			<pre>{code}</pre>
		</Layout>
	);
};

export default Home;
