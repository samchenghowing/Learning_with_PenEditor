import React, { useEffect, useCallback, useRef, useState } from "react";

import init from "./init";

//code mirror 核心
import * as CodeMirror from "codemirror/lib/codemirror";
import "codemirror/lib/codemirror.css";

//主题
import "codemirror/theme/material.css";

//语法支持
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/htmlmixed/htmlmixed";
import "codemirror/mode/css/css";

//折叠
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/comment-fold";
import "codemirror/addon/fold/foldgutter.css";

//括号匹配
import "codemirror/addon/edit/matchbrackets";

//代码补全
import "codemirror/addon/hint/show-hint";
import "codemirror/addon/hint/javascript-hint";
import "codemirror/addon/hint/html-hint";
import "codemirror/addon/hint/css-hint";
import "codemirror/addon/hint/show-hint.css";

//快捷键方案
import "codemirror/keymap/sublime.js";

//emmet 插件
import emmet from "@emmetio/codemirror-plugin";

import "./bulma.min.css";
import "./index.less";

emmet(CodeMirror);

export default (params) => {
	let [mode, setMode] = useState("js");

	let staticRef = useRef({
		js: null,
		css: null,
		html: null,
	});
	useEffect(() => {
		let common = {
			lineWrapping: true,
			foldGutter: true,
			gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
			matchBrackets: true,
			smartIndent: true,
			extraKeys: {
				Tab: "emmetExpandAbbreviation",
				Esc: "emmetResetAbbreviation",
				Enter: "emmetInsertLineBreak",
				Ctrl: "autocomplete",
			},
			lineNumbers: true,
		};

		staticRef.current.js = CodeMirror.fromTextArea(document.getElementById("js"), {
			mode: "javascript", //编辑器语言
			theme: "material", //编辑器主题
			keymap: "sublime",
			...common,
		});
		staticRef.current.js.setOption("value", init.javascript);

		staticRef.current.html = CodeMirror.fromTextArea(document.getElementById("html"), {
			mode: "htmlmixed",
			theme: "material", //编辑器主题
			keymap: "sublime",
			...common,
		});
		staticRef.current.html.setOption("value", init.html);

		staticRef.current.css = CodeMirror.fromTextArea(document.getElementById("css"), {
			mode: "css", //编辑器语言
			theme: "material", //编辑器主题
			keymap: "sublime",
			...common,
		});
		staticRef.current.css.setOption("value", init.css);

		onRun();
	}, []);

	const change = useCallback((e) => {
		let name = e.target.name;
		setMode(name);
	}, []);

	const onRun = useCallback(() => {
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
		preview.open();
		preview.write(`${html}<script>${js}</script>`);
		preview.close();
		preview.head.innerHTML = `
			<link rel="stylesheet" href="./static/view.css">
			<style>${css}</style>
		`;
	}, []);

	return (
		<div className="runjs">
			<div className="runjs__header">
				<nav className="navbar" role="navigation" aria-label="main navigation">
					<div class="navbar-brand"></div>
					<div id="navbarBasicExample" class="navbar-menu">
						<div class="navbar-start">
							<a class={mode == "html" ? "navbar-item selected" : "navbar-item"} name="html" onClick={change}>
								Html
							</a>
							<a class={mode == "css" ? "navbar-item selected" : "navbar-item"} name="css" onClick={change}>
								Css
							</a>
							<a class={mode == "js" ? "navbar-item selected" : "navbar-item"} name="js" onClick={change}>
								Javascript
							</a>
						</div>
						<div class="navbar-end">
							<div class="navbar-item">
								<div class="buttons">
									<a class="button is-primary" onClick={onRun}>
										Run
									</a>
								</div>
							</div>
						</div>
					</div>
				</nav>
			</div>
			<div className="runjs__editor">
				<div id="html-wrap" style={{ visibility: mode == "html" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="html"></textarea>
				</div>
				<div id="css-wrap" style={{ visibility: mode == "css" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="css"></textarea>
				</div>
				<div id="js-wrap" style={{ visibility: mode == "js" ? "visible" : "hidden" }}>
					<textarea class="form-control" id="js"></textarea>
				</div>
			</div>
			<div className="runjs__preview">
				<iframe
					id="preview"
					src="./static/view.html"
					seamless
					width="100%"
					height="100%"></iframe>
			</div>
		</div>
	);
};