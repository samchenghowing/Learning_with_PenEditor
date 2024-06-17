import React, { useEffect, useCallback, useRef, useState } from "react";
import { initCodeEditor, createNode } from "./lib";

import init from "./init";
import "./bulma.min.css";
import "./index.less";

import AppBar from './components/AppBar'

// material UI Layout
// import Grid from '@mui/material/Unstable_Grid2';

export default () => {
	const [editorMode, setEditorMode] = useState("js");
	const [autoRun, setAutoRun] = useState(false);

	let staticRef = useRef({
		isAuto: false,
		js: null,
		css: null,
		html: null,
		lib: ["https://unpkg.com/babel-standalone/babel.min.js", "https://unpkg.com/react/umd/react.development.js", "https://unpkg.com/react-dom/umd/react-dom.development.js"],
	});

	const onFormat = useCallback((type) => {
		let editor = staticRef.current[type];
		editor.execCommand("selectAll");
		editor.autoFormatRange(editor.getCursor(true), editor.getCursor(false));
		editor.execCommand("goDocEnd");
	}, []);

	const onLoad = useCallback(() => {
		let iframe = document.getElementById("preview"),
			html = staticRef.current.html.getValue(),
			css = staticRef.current.css.getValue(),
			js = staticRef.current.js.getValue();
		var preview;
		if (iframe.contentDocument) {
			preview = iframe.contentDocument;
		} else if (iframe.contentWindow) {
			preview = iframe.contentWindow.document;
		} else {
			preview = iframe.document;
		}
		let lib = `<script src="static/console.js"></script>`;
		staticRef.current.lib.map((item) => {
			lib += `<script src="${item}"></script>`;
		});
		preview.open();
		preview.write(`${lib}${html}<script  type="text/babel" data-presets="react">${js}</script>`);
		preview.close();
		preview.head.innerHTML = `
			<link rel="stylesheet" href="./static/view.css">
			<style>${css}</style>
		`;
	}, []);

	const onRun = useCallback(() => {
		let iframe = document.getElementById("preview");
		iframe.contentWindow.location.reload(true);
	}, []);

	const onAutoRun = useCallback(() => {
		if (staticRef.current.isAuto) onRun();
	}, [autoRun]);

	useEffect(() => {
		if (staticRef.current.js == null && staticRef.current.html == null && staticRef.current.css == null) {
			staticRef.current.js = initCodeEditor(document.getElementById("js"), "javascript", init.javascript, onAutoRun);
			staticRef.current.html = initCodeEditor(document.getElementById("html"), "htmlmixed", init.html, onAutoRun);
			staticRef.current.css = initCodeEditor(document.getElementById("css"), "css", init.css, onAutoRun);
			onFormat("js");
			onFormat("css");
			onFormat("html");
			onRun();
		}

		function showMessage(data) {
			if (data.data && ["log", "error", "info", 'warn'].includes(data.data.type)) {
				let console = document.getElementById("console");
				console.appendChild(createNode(data.data.data));
				console.scrollTop = console.scrollHeight;
			}
		}
		window.addEventListener("message", showMessage);

		// https://stackoverflow.com/questions/71795406/react-useeffect-cleanup-for-event-listener
		return () => {
			window.removeEventListener("message", showMessage);
		}
	}, []);

	return (
		<div className="runjs">
			<AppBar
				ref={staticRef}
				setEditorMode={setEditorMode}
				setAutoRun={setAutoRun}
				editorMode={editorMode}
				autoRun={autoRun}
			/>

			<div className="runjs__editor">
				<div id="html-wrap" style={{ visibility: editorMode == "html" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="html"></textarea>
				</div>
				<div id="css-wrap" style={{ visibility: editorMode == "css" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="css"></textarea>
				</div>
				<div id="js-wrap" style={{ visibility: editorMode == "js" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="js"></textarea>
				</div>
			</div>

			<div className="runjs__preview">
				<iframe onLoad={onLoad} id="preview" src="./static/view.html" seamless width="100%" height="100%"></iframe>
			</div>

			<div className="runjs__console" id="console"></div>
		</div>
	);
};
