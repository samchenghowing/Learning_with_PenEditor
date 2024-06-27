import * as React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

interface EditorViewProps {
    value : string;
    onChange : (mode: string) => void;
}

export default function EditorView(props: EditorViewProps) {
    const [editorMode, setEditorMode] = React.useState("js");
    const [autoRun, setAutoRun] = React.useState(false);

    return (
        <CodeMirror
            value={props.value}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            onChange={props.onChange} />
    )
}