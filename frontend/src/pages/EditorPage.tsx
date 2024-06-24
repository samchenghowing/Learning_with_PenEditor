import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import getLPTheme from './getLPTheme';
import Grid from '@mui/material/Unstable_Grid2';
import Stack from '@mui/material/Stack';
import Alert from '@mui/material/Alert';
import AlertTitle from '@mui/material/AlertTitle';

import AppAppBar from './components/AppAppBar';
import AIChat from './components/editor/AIChat'
import EditorView from './components/editor/EditorView'

export default () => {
	const [mode, setMode] = React.useState<PaletteMode>('light');
	const LPtheme = createTheme(getLPTheme(mode));

	const [value, setValue] = React.useState("console.log('hello world!');");

	const toggleColorMode = () => {
		setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
	};

	return (
		<ThemeProvider theme={LPtheme}>
			<CssBaseline />
			<Stack sx={{ width: '100%' }} spacing={2}>
				{/* <AppAppBar mode={mode} toggleColorMode={toggleColorMode} /> */}
				<Alert severity="info">
					<AlertTitle>Current task</AlertTitle>
					Print hello world in javascript.
				</Alert>
				<Grid container spacing={2}>
					<Grid xs={4}>
						<AIChat />
					</Grid>
					<Grid xs={8}>
						<EditorView value={value} onChange={setValue} />
					</Grid>
					<Grid xs={12}>
						<iframe
							srcDoc={`<html><body><script>${value}</script></body></html>`}
							title="Preview"
							width="100%"
							height="400px"
							style={{ border: "1px solid #ccc" }}
						></iframe>
					</Grid>
				</Grid>
			</Stack>
		</ThemeProvider>
	);
};
