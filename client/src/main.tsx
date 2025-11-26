import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer } from './components/MapContainer/MapContainer';
import { PageHeader } from './components/PageHeader';
import { MuiThemeWrapper } from './theme/muiTheme';
import { ThemeProvider } from './theme/ThemeContext';
import './theme/global.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<ThemeProvider>
			<MuiThemeWrapper>
				<PageHeader />
				<MapContainer />
			</MuiThemeWrapper>
		</ThemeProvider>
	</StrictMode>,
);
