// src/components/UsMap/LeafletUsMap.tsx
import 'leaflet/dist/leaflet.css';
import type { FeatureCollection } from 'geojson';
import React from 'react';
import { MapContainer, TileLayer } from 'react-leaflet';
import type { District, State } from '../../../models/MapProps';
import type { AddressOfficials } from '../../../models/OfficialProps';
import { useTooltip } from '../utils/useTooltip';
import { useDrawStatesLeaflet } from './useDrawStatesLeaflet';
import { useLeafletD3Overlay } from './useLeafletD3Overlay';
// You'll create similar hooks for districts and officials

interface LeafletUsMapProps {
	officialList: AddressOfficials | null;
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: string;
	sidebarType: 'summary' | 'address';
	state: State | null;
	district: District | null;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

// Inner component that uses the map context
// eslint-disable-next-line @typescript-eslint/naming-convention
const MapContent: React.FC<Omit<LeafletUsMapProps, 'children'>> = ({
	nationalMap,
	districtMap,
	officialList,
	type,
	sidebarType,
	setState,
	setDistrict,
}) => {
	const { showTooltip, hideTooltip } = useTooltip();
	const { map, gStatesRef, gDistrictRef, gOfficialsRef } = useLeafletD3Overlay();

	// Draw states
	useDrawStatesLeaflet({
		map,
		gStatesRef,
		nationalMap,
		setState,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	// TODO: Add useDrawDistrictsLeaflet and useDrawOfficialsLeaflet similarly

	return null;
};

export const LeafletUsMap: React.FC<LeafletUsMapProps> = (props) => {
	const { state, district } = props;

	return (
		<div className="relative w-full h-full border-4 border-double">
			<MapContainer
				center={[39.8283, -98.5795]} // Center of US
				zoom={4}
				style={{ height: '600px', width: '100%' }}
				zoomControl={true}
			>
				{/* OpenStreetMap tile layer - free basemap with city names */}
				<TileLayer
					attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
				/>

				<MapContent {...props} />
			</MapContainer>
		</div>
	);
};

export default LeafletUsMap;
