import * as React from 'react';

import { saveAs } from "file-saver"
import logo from "./editor.png";

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import IconButton from '@mui/material/IconButton';
import ButtonGroup from '@mui/material/ButtonGroup';
import HtmlIcon from '@mui/icons-material/Html';
import CssIcon from '@mui/icons-material/Css';
import JavascriptIcon from '@mui/icons-material/Javascript';
import SaveAsIcon from '@mui/icons-material/SaveAs';
import Switch from '@mui/material/Switch';

import AI_Dialog from "./AI_Dialog"


const PrimaryAppBar = React.forwardRef(function PrimaryAppBar({
    setEditorMode,
    setAutoRun,
    editorMode,
    autoRun
}, ref) {

    const onDownload = React.useCallback(() => {
        let lib = ``;
        ref.current.lib.map((item) => {
            lib += `<script src="${item}"></script>`;
        });
        let reset = ``;
        var html = `
				<!DOCTYPE html>
		<html lang="en">
			<head><style>${reset}</style><style>${ref.current.css.getValue()}</style></head>
			<body>${ref.current.html.getValue()}${lib}<script type="text/babel" data-presets="react">${ref.current.js.getValue()}</script></body>
		</html>`;

        var blob = new Blob([html], { type: "text/html; charset=utf-8" });
        saveAs(blob, `PenEditor-${new Date().getTime()}.html`);
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        sx={{ mr: 2 }}
                    >
                        <img style={{ height: 36 }} src={logo} alt="menu" />
                    </IconButton>

                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Pen Editor
                    </Typography>

                    <AI_Dialog />

                    <ButtonGroup aria-label="Basic button group">
                        <Tooltip title="JS Editor">
                            <IconButton color={editorMode == "js" ? "inherit" : "default"} onClick={() => setEditorMode("js")}>
                                <JavascriptIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Html Editor">
                            <IconButton color={editorMode == "html" ? "inherit" : "default"} onClick={() => setEditorMode("html")}>
                                <HtmlIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Css Editor">
                            <IconButton color={editorMode == "css" ? "inherit" : "default"} onClick={() => setEditorMode("css")}>
                                <CssIcon />
                            </IconButton>
                        </Tooltip>
                    </ButtonGroup>

                    <Switch
                        checked={autoRun}
                        onChange={(e) => {
                            ref.current.isAuto = e.currentTarget.checked;
                            setAutoRun(e.currentTarget.checked);
                        }} />

                    <Tooltip title="Save as html file">
                        <IconButton onClick={onDownload}>
                            <SaveAsIcon></SaveAsIcon>
                        </IconButton>
                    </Tooltip>

                </Toolbar>
            </AppBar>
        </Box>
    );
});

export default PrimaryAppBar;