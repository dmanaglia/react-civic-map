import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import React, { useEffect, useRef, useState } from 'react';
import type { District, MapType, State } from '../../../models/MapProps';
import type { AddressOfficials } from '../../../models/OfficialProps';
import { useDrawDistrictsLeaflet } from '../DistrictLayer/useDrawDistrictsLeaflet';
import { useDrawOfficialsLeaflet } from '../OfficialLayer/useDrawOfficialsLeaflet';
import { useDrawStatesLeaflet } from '../StateLayer/useDrawStatesLeaflet';
import { useTooltip } from '../utils/useTooltip';
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
	setState,
	setDistrict,
}) => {
	const mapContainerRef = useRef<HTMLDivElement>(null);
	const gStatesRef = useRef<SVGGElement>(null);
	const gDistrictRef = useRef<SVGGElement>(null);
	const gOfficialsRef = useRef<SVGGElement>(null);
	const [map, setMap] = useState<L.Map | null>(null);

	const { showTooltip, hideTooltip } = useTooltip();

	// Initialize Leaflet map
	useEffect(() => {
		if (!mapContainerRef.current) return;

		// ⭐ prevent double map creation
		if ((mapContainerRef.current as any)._leaflet_id) return;

		const leafletMap = L.map(mapContainerRef.current, {
			center: [39.8283, -98.5795],
			zoom: 4,
		});

		L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(leafletMap);

		setMap(leafletMap);

		return () => leafletMap.remove();
	}, []);

	// Draw map layers
	useDrawStatesLeaflet({
		gStatesRef,
		nationalMap,
		leafletMap: map,
		setState,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	useDrawDistrictsLeaflet({
		gDistrictRef,
		districtMap,
		leafletMap: map,
		type,
		setDistrict,
		showTooltip,
		hideTooltip,
	});

	useDrawOfficialsLeaflet({
		gOfficialsRef,
		officialList,
		leafletMap: map,
		showTooltip,
		hideTooltip,
	});

	return (
		<div className="relative w-full h-full">
			<div ref={mapContainerRef} className="absolute inset-0 z-0" style={{ height: '600px' }} />
			<svg
				className="absolute inset-0 z-10"
				style={{ pointerEvents: 'none', width: '100%', height: '600px' }}
			>
				<g ref={gStatesRef} style={{ pointerEvents: 'auto' }} />
				<g ref={gDistrictRef} style={{ pointerEvents: 'auto' }} />
				<g ref={gOfficialsRef} style={{ pointerEvents: 'auto' }} />
			</svg>
		</div>
	);
};
