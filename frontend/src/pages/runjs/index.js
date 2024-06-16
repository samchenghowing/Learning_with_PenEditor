import React, { useEffect, useCallback, useRef, useState } from "react";
import { saveAs } from "file-saver";
import { initCodeEditor, createNode } from "./lib";

import init from "./init";
import "./bulma.min.css";
import "./index.less";

import logo from "./editor.png";

import AI_Dialog from './components/AI_Dialog'

// UI component
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';

import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import JavascriptIcon from '@mui/icons-material/Javascript';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import CodeIcon from '@mui/icons-material/Code';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';

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

	const onDownload = useCallback(() => {
		let lib = ``;
		staticRef.current.lib.map((item) => {
			lib += `<script src="${item}"></script>`;
		});
		let reset = ``;
		var html = `
				<!DOCTYPE html>
		<html lang="en">
			<head><style>${reset}</style><style>${staticRef.current.css.getValue()}</style></head>
			<body>${staticRef.current.html.getValue()}${lib}<script type="text/babel" data-presets="react">${staticRef.current.js.getValue()}</script></body>
		</html>`;

		var blob = new Blob([html], { type: "text/html; charset=utf-8" });
		saveAs(blob, `PenEditor-${new Date().getTime()}.html`);
	}, []);

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
		console.log(staticRef.current.isAuto);
		if (staticRef.current.isAuto) {
			onRun();
		}
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
			<div className="runjs__header">
				<div class="nav center" style={{ paddingLeft: 20, width: 240 }}>
					<AI_Dialog />
					<img style={{ height: 36 }} src={logo} alt="" />
					<div style={{ width: 40 }}></div>
					<Tooltip title="JS Editor">
						<IconButton>
							<div class={editorMode == "js" ? "tool-icon selected" : "tool-icon"} onClick={() => setEditorMode("js")}>
								<JavascriptIcon></JavascriptIcon>
							</div>
						</IconButton>
					</Tooltip>
					<Tooltip title="Html Editor">
						<IconButton>
							<div class={editorMode == "html" ? "tool-icon selected" : "tool-icon"} onClick={() => setEditorMode("html")}>
								<HtmlIcon></HtmlIcon>
							</div>
						</IconButton>
					</Tooltip>
					<Tooltip title="Css Editor">
						<IconButton>
							<div class={editorMode == "css" ? "tool-icon selected" : "tool-icon"} name="css" onClick={() => setEditorMode("css")}>
								<CssIcon></CssIcon>
							</div>
						</IconButton>
					</Tooltip>
				</div>
				<div class="tool center" style={{ flex: 1 }}>
					<input
						onKeyDown={(e) => {
							if (e.keyCode == 13) {
								staticRef.current.lib.push(e.target.value);
								e.target.value = "";
							}
						}}
						placeholder="cdn js"
						type="text"
						style={{ width: 400 }}
					/>
					<label class="checkbox">
						<input
							checked={autoRun}
							onChange={(e) => {
								staticRef.current.isAuto = e.currentTarget.checked;
								setAutoRun(e.currentTarget.checked);
							}}
							type="checkbox"
							style={{ marginRight: 5 }}
						/>
						Auto Run
					</label>
				</div>
				<div class="menu" style={{ flex: 1 }}>
					{/* <a data-tooltip-id="menu-tooltip" data-tooltip-content="Save as html file" data-tooltip-place="top">
						<div class="tool-icon" onClick={onDownload}>
							<SaveAsIcon></SaveAsIcon>
						</div>
					</a>
					<a data-tooltip-id="menu-tooltip" data-tooltip-content="Format code" data-tooltip-place="top">
						<div
							class="tool-icon"
							onClick={() => {
								onFormat("js");
								onFormat("html");
								onFormat("css");
							}}>
							<CodeIcon></CodeIcon>
						</div>
					</a>
					<a data-tooltip-id="menu-tooltip" data-tooltip-content="Run code" data-tooltip-place="top">
						<div class="tool-icon" onClick={onRun}>
							<PlayArrowIcon></PlayArrowIcon>
						</div>
					</a>
					<Tooltipold id="menu-tooltip" style={{ zIndex: 401 }} /> */}
				</div>
			</div>

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
