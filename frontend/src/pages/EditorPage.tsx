import * as React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

// import AppBar from './components/AppBar'

// TODO:
// material UI Layout
// import Grid from '@mui/material/Unstable_Grid2';
// https://stackoverflow.com/questions/5379120/get-the-highlighted-selected-text

export default () => {
	const [editorMode, setEditorMode] = React.useState("js");
	const [autoRun, setAutoRun] = React.useState(false);

	const [value, setValue] = React.useState("console.log('hello world!');");

	const onChange = React.useCallback((val, viewUpdate) => {
		console.log('val:', val);
		setValue(val);

		let iframe = document.getElementById("preview");
		// iframe.contentWindow.location.reload(true);
	}, []);

	let staticRef = React.useRef({
		isAuto: false,
		js: null,
		css: null,
		html: null,
	});

	const onLoad = React.useCallback(() => {
		// let iframe = document.getElementById("preview")
		// var preview;

		// if (iframe.contentDocument) preview = iframe.contentDocument;
		// else if (iframe.contentWindow) preview = iframe.contentWindow.document;
		// else preview = iframe.document;

		// preview.open();
		// preview.write(value);
		// preview.close();
	}, []);


	return (
		<div>
			{/* <AppBar /> */}

			<CodeMirror value={value} height="200px" extensions={[javascript({ jsx: true })]} onChange={onChange} />

			<div>
				<iframe onLoad={onLoad} id="preview" src="./static/view.html" seamless width="100%" height="100%"></iframe>
			</div>

		</div>
	);
};
