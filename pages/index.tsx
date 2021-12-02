import type { NextPage } from "next";
import * as esbuild from "esbuild-wasm";
import { ChangeEvent, useEffect, useRef, useState } from "react";
import Layout from "../components/Layout";
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
			plugins: [unpkgPathPlugin()],
			define: {
				"process.env.NODE_ENV": JSON.stringify("production"),
				global: "window",
			},
		});

		setCode(result.outputFiles[0].text);
	};

	const startService = async () => {
		ref.current = await esbuild.startService({
			worker: true,
			wasmURL: "/esbuild.wasm",
		});
	};

	useEffect(() => {
		startService();
	}, []);

	return (
		<Layout title="Home">
			<form>
				<textarea
					name="code"
					id="code"
					cols={30}
					rows={3}
					value={input}
					onChange={(e: ChangeEvent<HTMLTextAreaElement>) => setInput(e.target.value)}
				/>
				<button type="button" onClick={showTranspiledCode}>
					Submit
				</button>
			</form>
			<pre>{code}</pre>
		</Layout>
	);
};

export default Home;
