import React, { useRef, useState } from "react";
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

import "./bulma.min.css";
import "./index.less";

import AppBar from './components/AppBar'

// TODO:
// material UI Layout
// import Grid from '@mui/material/Unstable_Grid2';
// https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text

export default () => {
	const [editorMode, setEditorMode] = useState("js");
	const [autoRun, setAutoRun] = useState(false);

	const [value, setValue] = React.useState("console.log('hello world!');");
	const onChange = React.useCallback((val, viewUpdate) => {
		console.log('val:', val);
		setValue(val);
	}, []);

	let staticRef = useRef({
		isAuto: false,
		js: null,
		css: null,
		html: null,
		lib: ["https://unpkg.com/babel-standalone/babel.min.js", "https://unpkg.com/react/umd/react.development.js", "https://unpkg.com/react-dom/umd/react-dom.development.js"],
	});

	return (
		<div className="runjs">
			<AppBar
				ref={staticRef}
				setEditorMode={setEditorMode}
				setAutoRun={setAutoRun}
				editorMode={editorMode}
				autoRun={autoRun}
			/>

			<CodeMirror value={value} height="200px" extensions={[javascript({ jsx: true })]} onChange={onChange} />
		</div>
	);
};
