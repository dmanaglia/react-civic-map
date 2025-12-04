import type { FeatureCollection } from 'geojson';
import L from 'leaflet';
import { useEffect } from 'react';
import type { District, MapType } from '../../../models/MapProps';
// import getDistrictClass from '../utils/getDistrictClass';

interface UseDrawDistrictsLeafletProps {
	districtMap: FeatureCollection | null;
	leafletMap: L.Map | null;
	type: MapType;
	setDistrict: (district: District | null) => void;
}

export const useDrawDistrictsLeaflet = ({
	districtMap,
	leafletMap,
	type,
	setDistrict,
}: UseDrawDistrictsLeafletProps) => {
	useEffect(() => {
		if (!districtMap || !leafletMap) return;

		const geojsonLayer = L.geoJson(districtMap, {
			style: () => ({
				color: '#2563eb',
				weight: 1,
				fillOpacity: 0.2,
			}),
			onEachFeature: (feature, layer) => {
				layer.on({
					mouseover: (e) => {
						e.target.setStyle({ weight: 2, fillOpacity: 0.4 });
					},
					mouseout: () => {
						geojsonLayer.resetStyle(layer);
					},
					click: (e) => {
						const props = feature.properties;
						const bounds = e.target.getBounds();

						setDistrict({
							NAME: props?.NAMELSAD,
							ID: type === 'cd' ? props?.CD119FP : props?.NAME,
							TYPE: type,
							bounds: [
								[0, 0],
								[900, 800],
							],
						});

						// Zoom/pan map to selected district
						leafletMap.fitBounds(bounds);
					},
				});
			},
		}).addTo(leafletMap);

		return () => {
			geojsonLayer.remove();
		};
	}, [districtMap, leafletMap, type, setDistrict]);
};
