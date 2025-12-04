import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react';
import type { District, State } from '../../../models/MapProps';

interface UseDrawStatesLeafletProps {
	nationalMap: FeatureCollection | null;
	leafletMap: L.Map | null;
	setState: (stateId: State | null) => void;
	setDistrict: (district: District | null) => void;
}

export const useDrawStatesLeaflet = ({
	nationalMap,
	leafletMap,
	setState,
	setDistrict,
}: UseDrawStatesLeafletProps) => {
	useEffect(() => {
		if (!nationalMap || !leafletMap) return;

		const geojsonLayer = L.geoJson(nationalMap, {
			style: () => ({
				color: '#ffffff',
				weight: 2,
				fillColor: '#93c5fd',
				fillOpacity: 0.3,
			}),
			onEachFeature: (feature, layer) => {
				layer.on({
					mouseover: (e) => {
						e.target.setStyle({
							weight: 3,
							fillOpacity: 0.5,
						});
					},
					mouseout: () => {
						geojsonLayer.resetStyle(layer);
					},
					click: (e) => {
						const props = feature.properties;
						const bounds = e.target.getBounds();

						// Set state
						setState({
							NAME: props?.NAME,
							STATEFP: props?.STATEFP,
							USPS: props?.STUSPS,
							bounds: [
								[0, 0],
								[900, 800],
							],
						});
						setDistrict(null);

						// Zoom/pan map to selected state
						leafletMap.fitBounds(bounds);
					},
				});
			},
		}).addTo(leafletMap);

		return () => {
			geojsonLayer.remove();
		};
	}, [nationalMap, leafletMap, setState, setDistrict]);
};
