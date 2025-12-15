import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import type { District, MapType, State } from '../../../models/MapProps';
import type { AddressOfficials } from '../../../models/OfficialProps';
import { useDrawDistrictsLeaflet } from '../DistrictLayer/useDrawDistrictsLeaflet';
import { useDrawOfficialsLeaflet } from '../OfficialLayer/useDrawOfficialsLeaflet';
import { useDrawStatesLeaflet } from '../StateLayer/useDrawStatesLeaflet';
import 'leaflet/dist/leaflet.css';

interface LeafletMapModeProps {
	officialList: AddressOfficials | null;
	districtMap: FeatureCollection | null;
	nationalMap: FeatureCollection | null;
	type: MapType;
	sidebarType: 'summary' | 'address';
	state: State | null;
	district: District | null;
	setState: (stateId: State | null) => void;
	setDistrict: (feature: District | null) => void;
}

export const LeafletMap: React.FC<LeafletMapModeProps> = ({
	officialList,
	nationalMap,
	districtMap,
	type,
	district,
	sidebarType,
	setState,
	setDistrict,
}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const [map, setMap] = useState<L.Map | null>(null);

	useEffect(() => {
		if (!mapContainerRef.current) return;

		const leafletMap = L.map(mapContainerRef.current, {
			center: [39.8283, -98.5795],
			zoom: 4,
			dragging: true,
			doubleClickZoom: false,
			scrollWheelZoom: true,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);
		setMap(leafletMap);

		return () => {
			leafletMap.remove();
		};
	}, []);

	useDrawStatesLeaflet({
		nationalMap,
		leafletMap: map,
		setState,
		setDistrict,
	});
	useDrawDistrictsLeaflet({
		districtMap,
		leafletMap: map,
		type,
		district,
		sidebarType,
		setDistrict,
	});
	useDrawOfficialsLeaflet({ officialList, leafletMap: map, sidebarType });

	return (
		<div ref={mapContainerRef} className="relative w-full h-full" style={{ height: '600px' }} />
	);
};
