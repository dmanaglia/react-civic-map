import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { MapContainer } from './components/MapContainer/MapContainer';
import './index.css';

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<MapContainer />
	</StrictMode>,
);
