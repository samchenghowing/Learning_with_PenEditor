import * as React from 'react';
import CodeMirror from '@uiw/react-codemirror';
import { javascript } from '@codemirror/lang-javascript';

// Create a new component for the iframe
export default function EditorView({ value, onChange }: { value: string, onChange: (val: string) => void }) {
    const [editorMode, setEditorMode] = React.useState("js");
    const [autoRun, setAutoRun] = React.useState(false);

    return (
        <CodeMirror
            value={value}
            height="200px"
            extensions={[javascript({ jsx: true })]}
            onChange={onChange} />
    )
}