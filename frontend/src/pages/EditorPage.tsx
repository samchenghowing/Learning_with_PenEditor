import * as React from 'react';
import { PaletteMode } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import AppAppBar from './components/AppAppBar';
import getLPTheme from './getLPTheme';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Unstable_Grid2';

import AIChat from './components/editor/AIChat'
import EditorView from './components/editor/EditorView'

export default () => {
	const [mode, setMode] = React.useState<PaletteMode>('light');
	const LPtheme = createTheme(getLPTheme(mode));

	const toggleColorMode = () => {
		setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
	};

	return (
		<ThemeProvider theme={LPtheme}>
			<CssBaseline />
			<AppAppBar mode={mode} toggleColorMode={toggleColorMode} />
			<Box sx={{ flexGrow: 1 }}>
				<Grid container spacing={2}>
					<Grid xs={4}>
						<AIChat />
					</Grid>
					<Grid xs={8}>
						<EditorView />
					</Grid>
				</Grid>
			</Box>
		</ThemeProvider>
	);
};
