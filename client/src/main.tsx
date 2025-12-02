import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer } from './components/MapContainer/MapContainer';
import { PageHeader } from './components/Page/PageHeader';
import { SettingsProvider } from './context/SettingsContext';
import { MuiThemeWrapper } from './theme/MuiTheme';
import './theme/global.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<SettingsProvider>
			<MuiThemeWrapper>
				<PageHeader />
				<MapContainer />
			</MuiThemeWrapper>
		</SettingsProvider>
	</StrictMode>,
);
