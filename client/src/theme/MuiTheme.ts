import { createTheme, ThemeProvider } from '@mui/material/styles';
import { UseSettings } from '../context/SettingsContext';

export const MuiThemeWrapper = ({ children }: React.PropsWithChildren) => {
	const { isDarkMode } = UseSettings();

	const theme = createTheme({
		palette: {
			mode: isDarkMode ? 'dark' : 'light',
			primary: {
				main: isDarkMode ? '#60a5fa' : '#3b82f6',
			},
			secondary: {
				main: isDarkMode ? '#a78bfa' : '#8b5cf6',
			},
			background: {
				default: isDarkMode ? '#0f172a' : '#ffffff',
				paper: isDarkMode ? '#1e293b' : '#f8fafc',
			},
			text: {
				primary: isDarkMode ? '#f1f5f9' : '#0f172a',
				secondary: isDarkMode ? '#cbd5e1' : '#475569',
			},
		},
	});

	return ThemeProvider({ theme, children });
};
